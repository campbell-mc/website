// ============================================================================
// Governance Pack Distribution Saga
//
// Distributes approved governance packs to committee members.
// Uses saga pattern — email distribution cannot be recalled.
// ============================================================================

import { SagaTransaction } from "../saga";
import { db, donReviewItems } from "@chris/db";
import { eq } from "drizzle-orm";

interface DistributionParams {
  packId: string;
  facilityId: string;
  donDecisionId: string;
  recipients: string[]; // Email addresses
  packType: string;
  periodStart: string;
}

export async function distributePack(params: DistributionParams): Promise<void> {
  const saga = new SagaTransaction(`pack-distribution-${params.packId}`);

  // Step 1: Verify approved
  saga.addStep({
    name: "verify_approved",
    execute: async () => {
      const [item] = await db
        .select()
        .from(donReviewItems)
        .where(eq(donReviewItems.id, params.donDecisionId));

      if (!item || item.status !== "approved") {
        throw new Error(`Pack distribution blocked — DON approval required (status: ${item?.status ?? "not found"})`);
      }
      return { verified: true };
    },
    compensate: null,
  });

  // Step 2: Generate final PDF with approval timestamp
  let finalPdfPath = "";
  saga.addStep({
    name: "generate_final_pdf",
    execute: async () => {
      // In production: re-render PDF with approval timestamp via @react-pdf/renderer
      finalPdfPath = `packs/${params.facilityId}/${new Date().getFullYear()}/${params.packType}_${params.periodStart}_final.pdf`;
      console.log(`[Distribution] Final PDF generated: ${finalPdfPath}`);
      return { pdfPath: finalPdfPath };
    },
    compensate: async () => {
      // Delete the final PDF
      console.log(`[Distribution] Compensating: deleting PDF ${finalPdfPath}`);
    },
  });

  // Step 3: Send to recipients
  const sentTo: string[] = [];
  const failedRecipients: string[] = [];
  saga.addStep({
    name: "send_to_recipients",
    execute: async () => {
      for (const recipient of params.recipients) {
        try {
          // In production: send via Resend
          console.log(`[Distribution] Sending to ${recipient}`);
          sentTo.push(recipient);
        } catch {
          failedRecipients.push(recipient);
        }
      }

      if (failedRecipients.length > 0 && sentTo.length === 0) {
        throw new Error(`All email sends failed: ${failedRecipients.join(", ")}`);
      }

      return { sentTo, failedRecipients };
    },
    compensate: async () => {
      // Cannot recall emails — alert CEO with list
      if (sentTo.length > 0) {
        await db.insert(donReviewItems).values({
          facilityId: params.facilityId,
          itemType: "pack_approval",
          urgency: "urgent",
          summary: `Pack distribution partially failed. Emails sent to: ${sentTo.join(", ")}. Failed: ${failedRecipients.join(", ") || "none"}. Cannot recall sent emails.`,
          fullContext: { packId: params.packId, sentTo, failedRecipients },
          chrisRecommendation: "Review which recipients received the pack. Follow up with failed recipients manually.",
        });
      }
    },
  });

  // Step 4: Record distribution
  saga.addStep({
    name: "record_distribution",
    execute: async () => {
      // In production: INSERT governance_distribution_log
      console.log(`[Distribution] Recorded: ${params.packId} → ${sentTo.length} recipients`);
      return { recorded: true };
    },
    compensate: null,
  });

  // Step 5: Schedule next cycle reminder
  let reminderId: string | null = null;
  saga.addStep({
    name: "schedule_next_cycle_reminder",
    execute: async () => {
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 3); // Next quarter

      const [reminder] = await db.insert(donReviewItems).values({
        facilityId: params.facilityId,
        itemType: "pack_approval",
        urgency: "routine",
        summary: `Prepare ${params.packType} pack for next quarter.`,
        fullContext: { nextPackType: params.packType },
        chrisRecommendation: "Governance pack generation will begin automatically 2 weeks before the scheduled meeting date.",
        deadline: nextDate,
      }).returning({ id: donReviewItems.id });

      reminderId = reminder.id;
      return { reminderId };
    },
    compensate: async () => {
      if (reminderId) {
        await db
          .update(donReviewItems)
          .set({ status: "rejected", donNote: "Removed — distribution saga compensation" })
          .where(eq(donReviewItems.id, reminderId));
      }
    },
  });

  await saga.execute();

  if (saga.status !== "completed") {
    throw new Error(`Pack distribution failed: ${saga.error?.message ?? "unknown error"}`);
  }
}
