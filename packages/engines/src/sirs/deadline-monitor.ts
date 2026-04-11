// ============================================================================
// SIRS Deadline Monitor
//
// Runs every 30 minutes. Checks for pending SIRS reports approaching deadline.
//
// Category 1 (24h window):
//   ≤12h remaining: SMS + push to DON
//   ≤4.8h (80% elapsed): escalate to CEO + facility_gm
//   ≤2.4h (90% elapsed): CRITICAL — all channels simultaneously
//
// Category 2 (30-day window):
//   ≤7 days remaining: reminder to DON
//   ≤3 days: urgent reminder
//   ≤24h: escalate to CEO
// ============================================================================

import { db, facilityIncidents, donReviewItems } from "@chris/db";
import { and, isNull, isNotNull, sql } from "drizzle-orm";

export interface DeadlineAlert {
  incidentId: string;
  facilityId: string;
  sirsCategory: 1 | 2;
  hoursRemaining: number;
  escalationLevel: "reminder" | "urgent" | "critical";
  recipients: string[];
  message: string;
}

export async function checkDeadlines(): Promise<DeadlineAlert[]> {
  const alerts: DeadlineAlert[] = [];

  // Query: incidents with SIRS category set but not yet reported
  const pending = await db
    .select()
    .from(facilityIncidents)
    .where(
      and(
        isNotNull(facilityIncidents.sirsCategory),
        isNull(facilityIncidents.sirsReportedAt)
      )
    );

  const now = new Date();

  for (const incident of pending) {
    if (!incident.sirsReportingDeadline || !incident.sirsCategory) continue;

    const deadline = new Date(incident.sirsReportingDeadline);
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining <= 0) {
      // Already past deadline — critical alert
      alerts.push({
        incidentId: incident.id,
        facilityId: incident.facilityId,
        sirsCategory: incident.sirsCategory as 1 | 2,
        hoursRemaining,
        escalationLevel: "critical",
        recipients: ["don", "ceo", "facility_gm", "campbell", "ivan"],
        message: `OVERDUE: SIRS Category ${incident.sirsCategory} report is ${Math.abs(hoursRemaining).toFixed(1)}h past deadline. Immediate action required. Penalty risk: up to $783,000.`,
      });
      continue;
    }

    if (incident.sirsCategory === 1) {
      // Category 1: 24h window
      if (hoursRemaining <= 2.4) {
        alerts.push({
          incidentId: incident.id,
          facilityId: incident.facilityId,
          sirsCategory: 1,
          hoursRemaining,
          escalationLevel: "critical",
          recipients: ["don", "ceo", "facility_gm", "campbell", "ivan"],
          message: `CRITICAL: SIRS Category 1 report due in ${hoursRemaining.toFixed(1)}h (90% of window elapsed). All channels activated.`,
        });
      } else if (hoursRemaining <= 4.8) {
        alerts.push({
          incidentId: incident.id,
          facilityId: incident.facilityId,
          sirsCategory: 1,
          hoursRemaining,
          escalationLevel: "urgent",
          recipients: ["don", "ceo", "facility_gm"],
          message: `URGENT: SIRS Category 1 report due in ${hoursRemaining.toFixed(1)}h (80% of window elapsed). CEO and GM escalation.`,
        });
      } else if (hoursRemaining <= 12) {
        alerts.push({
          incidentId: incident.id,
          facilityId: incident.facilityId,
          sirsCategory: 1,
          hoursRemaining,
          escalationLevel: "reminder",
          recipients: ["don"],
          message: `Reminder: SIRS Category 1 report due in ${hoursRemaining.toFixed(1)}h. Please review and approve in DON queue.`,
        });
      }
    } else {
      // Category 2: 30-day window
      const hoursRemainingDays = hoursRemaining / 24;

      if (hoursRemainingDays <= 1) {
        alerts.push({
          incidentId: incident.id,
          facilityId: incident.facilityId,
          sirsCategory: 2,
          hoursRemaining,
          escalationLevel: "critical",
          recipients: ["don", "ceo"],
          message: `CRITICAL: SIRS Category 2 report due in ${hoursRemaining.toFixed(0)}h. CEO escalation.`,
        });
      } else if (hoursRemainingDays <= 3) {
        alerts.push({
          incidentId: incident.id,
          facilityId: incident.facilityId,
          sirsCategory: 2,
          hoursRemaining,
          escalationLevel: "urgent",
          recipients: ["don"],
          message: `URGENT: SIRS Category 2 report due in ${hoursRemainingDays.toFixed(0)} days. Immediate DON action required.`,
        });
      } else if (hoursRemainingDays <= 7) {
        alerts.push({
          incidentId: incident.id,
          facilityId: incident.facilityId,
          sirsCategory: 2,
          hoursRemaining,
          escalationLevel: "reminder",
          recipients: ["don"],
          message: `Reminder: SIRS Category 2 report due in ${hoursRemainingDays.toFixed(0)} days. Please review and approve.`,
        });
      }
    }
  }

  // Create DON review items for any urgent/critical alerts not already tracked
  for (const alert of alerts) {
    if (alert.escalationLevel !== "reminder") {
      await db.insert(donReviewItems).values({
        facilityId: alert.facilityId,
        itemType: "sirs_classification",
        urgency: alert.escalationLevel === "critical" ? "immediate" : "urgent",
        summary: alert.message,
        fullContext: {
          incidentId: alert.incidentId,
          sirsCategory: alert.sirsCategory,
          hoursRemaining: alert.hoursRemaining,
          escalationLevel: alert.escalationLevel,
          recipients: alert.recipients,
        },
        chrisRecommendation: "Open DON queue and approve the pending SIRS report immediately.",
        deadline: new Date(Date.now() + alert.hoursRemaining * 60 * 60 * 1000),
      });
    }
  }

  return alerts;
}
