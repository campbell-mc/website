// ============================================================================
// SIRS Submission Saga
//
// Implements the saga pattern for SIRS report submission to ACQSC.
// An ACQSC submission CANNOT be undone — if later steps fail,
// the DON must be alerted immediately for manual verification.
//
// Steps:
//   1. Create internal record (update facility_incidents)
//   2. Submit to ACQSC portal (IRREVERSIBLE)
//   3. Record submission confirmation
//   4. Create follow-up task (30-day corrective action review)
//   5. Notify DON of completion
// ============================================================================

import { SagaTransaction } from "../saga";
import { db, facilityIncidents, donReviewItems } from "@chris/db";
import { eq } from "drizzle-orm";
import type { SIRSDraftReport } from "./classifier";

interface SubmissionParams {
  incidentId: string;
  facilityId: string;
  sirsCategory: 1 | 2;
  rationale: string;
  reportingDeadline: Date;
  donApprovedReport: SIRSDraftReport;
  donDecisionId: string;
  acqscEndpoint?: string; // Optional — if absent, logs for manual submission
}

export async function submitSIRSReport(
  params: SubmissionParams
): Promise<{ submissionId: string; sagaStatus: string }> {
  const saga = new SagaTransaction(`sirs-submission-${params.incidentId}`);
  let acqscSubmissionId = "";

  // Step 1: Create internal record
  saga.addStep({
    name: "create_internal_record",
    execute: async () => {
      await db
        .update(facilityIncidents)
        .set({
          sirsAssessed: true,
          sirsCategory: params.sirsCategory,
          sirsClassificationRationale: params.rationale,
          sirsReportingDeadline: params.reportingDeadline,
        })
        .where(eq(facilityIncidents.id, params.incidentId));

      return { incidentId: params.incidentId };
    },
    compensate: async () => {
      // Never delete — mark as failed
      await db
        .update(facilityIncidents)
        .set({
          sirsClassificationRationale: `${params.rationale} [SUBMISSION FAILED — REQUIRES MANUAL REVIEW]`,
        })
        .where(eq(facilityIncidents.id, params.incidentId));
    },
  });

  // Step 2: Submit to ACQSC portal (IRREVERSIBLE)
  saga.addStep({
    name: "submit_to_acqsc_portal",
    execute: async () => {
      if (params.acqscEndpoint) {
        // Real ACQSC API submission
        const response = await fetch(params.acqscEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: params.sirsCategory,
            report: params.donApprovedReport,
          }),
        });

        if (!response.ok) {
          throw new Error(`ACQSC submission failed: ${response.status}`);
        }

        const data = await response.json() as { submissionId: string };
        acqscSubmissionId = data.submissionId;
      } else {
        // No ACQSC API — log for manual submission
        acqscSubmissionId = `MANUAL-${Date.now()}`;
        console.log(
          `[SIRS] No ACQSC endpoint configured. Report logged for manual submission. Ref: ${acqscSubmissionId}`
        );
      }

      return { submissionId: acqscSubmissionId };
    },
    compensate: async () => {
      // CANNOT undo ACQSC submission — alert DON for manual verification
      await db.insert(donReviewItems).values({
        facilityId: params.facilityId,
        itemType: "sirs_classification",
        urgency: "immediate",
        summary: `CRITICAL: SIRS submitted (ref: ${acqscSubmissionId}) but internal recording failed. ACQSC reference: ${acqscSubmissionId}. Manual verification required.`,
        fullContext: {
          incidentId: params.incidentId,
          acqscSubmissionId,
          failureReason: "Post-submission step failed — submission was sent but internal records may be incomplete.",
          donDecisionId: params.donDecisionId,
        },
        chrisRecommendation: "Verify SIRS submission in ACQSC portal. Ensure internal records match. Do NOT resubmit.",
        deadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      });
    },
  });

  // Step 3: Record submission confirmation
  saga.addStep({
    name: "record_submission_confirmation",
    execute: async () => {
      await db
        .update(facilityIncidents)
        .set({
          sirsReportedAt: new Date(),
          sirsSubmissionId: acqscSubmissionId,
        })
        .where(eq(facilityIncidents.id, params.incidentId));

      return { recorded: true };
    },
    compensate: null, // Idempotent — safe to leave
  });

  // Step 4: Create follow-up task (30-day corrective action review)
  let followUpId: string | null = null;
  saga.addStep({
    name: "create_followup_task",
    execute: async () => {
      const [inserted] = await db
        .insert(donReviewItems)
        .values({
          facilityId: params.facilityId,
          itemType: "sirs_classification",
          urgency: "routine",
          summary: `30-day corrective action review for SIRS ${params.sirsCategory === 1 ? "Category 1" : "Category 2"} report (ref: ${acqscSubmissionId}).`,
          fullContext: {
            incidentId: params.incidentId,
            acqscSubmissionId,
            reviewType: "corrective_action_30day",
          },
          chrisRecommendation: "Review corrective actions taken since incident. Verify effectiveness. Document outcomes.",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })
        .returning({ id: donReviewItems.id });

      followUpId = inserted.id;
      return { followUpId };
    },
    compensate: async () => {
      // Remove the follow-up task if later steps fail
      if (followUpId) {
        await db
          .update(donReviewItems)
          .set({ status: "rejected", donNote: "Removed — SIRS saga compensation" })
          .where(eq(donReviewItems.id, followUpId));
      }
    },
  });

  // Step 5: Notify DON of completion
  saga.addStep({
    name: "notify_don_completion",
    execute: async () => {
      // In production: send via Resend email + push notification
      // For now: log completion
      console.log(
        `[SIRS] Submission complete. Incident: ${params.incidentId}, ACQSC ref: ${acqscSubmissionId}, Category: ${params.sirsCategory}`
      );
      return { notified: true };
    },
    compensate: null, // Notification is best-effort
  });

  // Execute the saga
  await saga.execute();

  return {
    submissionId: acqscSubmissionId,
    sagaStatus: saga.status,
  };
}
