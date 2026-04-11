// ============================================================================
// iMessage Execution Loop
//
// The complete alert-to-record pipeline. 7 phases:
//   1. Signal Detection (from MonitoringEngine)
//   2. Alert Construction (5-component format)
//   3. Delivery (LinqApp → iMessage, fallback SMS)
//   4. Response Handling (button or text)
//   5. Action Execution (based on tier from TrustEngine)
//   6. Canonical Record (evidence chain)
//   7. Loop Closure
//
// Dead hours: 11pm-5am local (IMMEDIATE overrides)
// Duplicate suppression: same type + facility + 4 hours
// No-response escalation: 50% of deadline (URGENT), 80% (IMMEDIATE)
// ============================================================================

import { db, alertLoops, evidenceRecords, donReviewItems } from "@chris/db";
import { eq, and, lt, isNull } from "drizzle-orm";
import { TrustEngine } from "../trust/index";
import type { MonitorSignal } from "../monitoring/index";
import type { ActionCategory, AlertStatus } from "@chris/db";

export interface ExecutionResult {
  alertId: string;
  delivered: boolean;
  deliveryMethod: string;
  responded: boolean;
  executed: boolean;
  evidenceRecordId: string | null;
}

export class ExecutionLoop {
  private trustEngine: TrustEngine;

  constructor() {
    this.trustEngine = new TrustEngine();
  }

  /**
   * Phase 2+3: Construct and deliver an alert from a monitor signal.
   */
  async deliverAlert(signal: MonitorSignal): Promise<string> {
    // Dead hours check (11pm - 5am facility local time)
    const hour = new Date().getHours();
    const isDead = hour >= 23 || hour < 5;

    if (isDead && signal.urgency !== "immediate") {
      // Queue for 6am delivery
      const [alert] = await db
        .update(alertLoops)
        .set({
          status: "open",
          deliveryMethod: "queued_6am",
        })
        .where(
          and(
            eq(alertLoops.facilityId, signal.facilityId),
            eq(alertLoops.alertType, signal.type),
            eq(alertLoops.status, "open"),
            isNull(alertLoops.deliveredAt)
          )
        )
        .returning({ id: alertLoops.id });

      return alert?.id ?? "";
    }

    // Deliver immediately
    const deliveryMethod = await this.sendAlert(signal);

    // Update alert loop with delivery confirmation
    const [alert] = await db
      .update(alertLoops)
      .set({
        deliveredAt: new Date(),
        deliveryMethod,
        deliveryConfirmed: true,
      })
      .where(
        and(
          eq(alertLoops.facilityId, signal.facilityId),
          eq(alertLoops.alertType, signal.type),
          eq(alertLoops.status, "open"),
          isNull(alertLoops.deliveredAt)
        )
      )
      .returning({ id: alertLoops.id });

    return alert?.id ?? "";
  }

  /**
   * Phase 4: Handle a response to an alert.
   */
  async handleResponse(
    alertId: string,
    responseType: "button" | "text",
    responseContent: string
  ): Promise<void> {
    const [alert] = await db
      .select()
      .from(alertLoops)
      .where(eq(alertLoops.id, alertId));

    if (!alert || alert.status === "resolved") return;

    await db
      .update(alertLoops)
      .set({
        status: "responded",
        respondedAt: new Date(),
        responseType,
        responseContent,
      })
      .where(eq(alertLoops.id, alertId));

    // Route based on response
    if (responseType === "button") {
      switch (responseContent) {
        case "confirm_done":
          await this.executeAction(alertId, "chris", { confirmed: true });
          break;
        case "open_queue":
          // Alert stays open until queue item resolved
          break;
        case "escalate":
          await this.escalateAlert(alertId);
          break;
        case "show_data":
          // Trigger data follow-up (routed to CHRIS Coach in production)
          break;
      }
    } else {
      // Text response — route to CHRIS Coach conversation engine
      // Context: alertId, facility, signal, leader profile
      // For now, log the response
      console.log(`[Execution] Text response on alert ${alertId}: ${responseContent}`);
    }
  }

  /**
   * Phase 5: Execute the action and create evidence record.
   */
  async executeAction(
    alertId: string,
    executedBy: string,
    result: Record<string, unknown>
  ): Promise<string> {
    const [alert] = await db
      .select()
      .from(alertLoops)
      .where(eq(alertLoops.id, alertId));

    if (!alert) throw new Error(`Alert ${alertId} not found`);

    // Update alert loop
    await db
      .update(alertLoops)
      .set({
        status: "executing",
        executedAt: new Date(),
        executedBy,
        executionResult: result,
      })
      .where(eq(alertLoops.id, alertId));

    // Phase 6: Create evidence record
    const [evidence] = await db
      .insert(evidenceRecords)
      .values({
        facilityId: alert.facilityId,
        recordType: "action",
        actionCategory: alert.alertType,
        triggeredAt: alert.createdAt!,
        deliveredAt: alert.deliveredAt,
        reviewedAt: alert.respondedAt,
        executedAt: new Date(),
        triggeredBy: "chris",
        executedBy,
        signalData: { signalLabel: alert.signalLabel, specificFact: alert.specificFact },
        recommendation: alert.recommendedAction,
        decision: "approve",
        outcome: JSON.stringify(result),
      })
      .returning({ id: evidenceRecords.id });

    // Phase 7: Close the loop
    await db
      .update(alertLoops)
      .set({
        status: "resolved",
        resolvedAt: new Date(),
        evidenceRecordId: evidence.id,
      })
      .where(eq(alertLoops.id, alertId));

    return evidence.id;
  }

  /**
   * Escalate an alert to the next tier.
   */
  async escalateAlert(alertId: string): Promise<string> {
    const [alert] = await db
      .select()
      .from(alertLoops)
      .where(eq(alertLoops.id, alertId));

    if (!alert) throw new Error(`Alert ${alertId} not found`);

    const escalationMap: Record<string, string> = {
      team_leader: "don",
      don: "facility_gm",
      facility_gm: "ceo",
      ceo: "operator", // Campbell/Ivan
    };

    const nextTier = escalationMap[alert.recipientRole] ?? "ceo";

    // Create escalation alert
    const [escalated] = await db
      .insert(alertLoops)
      .values({
        facilityId: alert.facilityId,
        alertType: alert.alertType,
        urgency: "immediate", // Escalations are always immediate
        status: "open",
        recipientRole: nextTier,
        signalLabel: `ESCALATED: ${alert.signalLabel}`,
        specificFact: alert.specificFact,
        consequenceOfInaction: alert.consequenceOfInaction,
        recommendedAction: `Escalated from ${alert.recipientRole}. ${alert.recommendedAction}`,
        parentAlertId: alert.id,
      })
      .returning({ id: alertLoops.id });

    // Mark original as escalated
    await db
      .update(alertLoops)
      .set({
        status: "escalated",
        escalatedAt: new Date(),
        escalatedTo: nextTier,
      })
      .where(eq(alertLoops.id, alertId));

    return escalated.id;
  }

  /**
   * Check for no-response alerts and escalate.
   * Run every 30 minutes.
   */
  async checkNoResponses(): Promise<number> {
    const now = new Date();
    let escalated = 0;

    const openAlerts = await db
      .select()
      .from(alertLoops)
      .where(
        and(
          eq(alertLoops.status, "open"),
          isNull(alertLoops.respondedAt)
        )
      );

    for (const alert of openAlerts) {
      if (!alert.deliveredAt) continue;

      const deliveredAt = new Date(alert.deliveredAt);
      const hoursSinceDelivery = (now.getTime() - deliveredAt.getTime()) / 3_600_000;

      // IMMEDIATE: escalate at 80% of 4-hour action window (3.2h)
      if (alert.urgency === "immediate" && hoursSinceDelivery >= 3.2) {
        await this.escalateAlert(alert.id);
        escalated++;
      }
      // URGENT: reminder at 50% of 24-hour window (12h)
      else if (alert.urgency === "urgent" && hoursSinceDelivery >= 12) {
        await this.escalateAlert(alert.id);
        escalated++;
      }
    }

    return escalated;
  }

  /**
   * Send alert via available channel.
   * Production: LinqApp → iMessage, fallback SMS via Twilio.
   * Current: logs for manual delivery.
   */
  private async sendAlert(signal: MonitorSignal): Promise<string> {
    // Production implementation would:
    // 1. POST to LinqApp API for iMessage delivery
    // 2. On failure: retry × 2 (60s, 120s)
    // 3. If still failing: fallback to Twilio SMS
    // 4. If SMS fails: in-app notification + operator alert

    const message = [
      `CHRIS: ${signal.signalLabel}`,
      signal.specificFact,
      `Risk: ${signal.consequenceOfInaction}`,
      signal.recommendedAction,
      "[Confirmed] [Show data] [Open queue] [Escalate]",
    ].join("\n");

    console.log(`[Execution] Alert to ${signal.recipientRole}:\n${message}`);

    // Return delivery method used
    return "in_app"; // Default for now — LinqApp/Twilio integration in production
  }

  /**
   * Deliver queued 6am alerts (dead hours queue).
   * Run at 6am AEST daily.
   */
  async deliverQueuedAlerts(): Promise<number> {
    const queued = await db
      .select()
      .from(alertLoops)
      .where(
        and(
          eq(alertLoops.status, "open"),
          eq(alertLoops.deliveryMethod, "queued_6am"),
          isNull(alertLoops.deliveredAt)
        )
      );

    let delivered = 0;
    for (const alert of queued) {
      await db
        .update(alertLoops)
        .set({
          deliveredAt: new Date(),
          deliveryMethod: "in_app",
          deliveryConfirmed: true,
        })
        .where(eq(alertLoops.id, alert.id));
      delivered++;
    }

    return delivered;
  }
}
