// ============================================================================
// Always-On Monitoring Layer
//
// Continuous monitoring between scheduled cycles.
// Event-driven (Supabase Realtime on INSERT) + scheduled (pg_cron).
//
// Three urgency tiers:
//   IMMEDIATE INTERRUPT — alert within 5 minutes of detection
//   URGENT QUEUE — alert within 30 minutes, action within 24 hours
//   ROUTINE QUEUE — daily or weekly digest
//
// Adapted from Prism's observer system with dedup, dispatch, cooldown.
// ============================================================================

import { db, facilityRostering, facilityIncidents, facilityHazardScores, facilityWorkforce, alertLoops } from "@chris/db";
import { eq, and, gte, gt, isNull, isNotNull, desc } from "drizzle-orm";
import type { AlertUrgency } from "@chris/db";

export interface MonitorSignal {
  type: string;
  urgency: AlertUrgency;
  facilityId: string;
  signalLabel: string;
  specificFact: string;
  consequenceOfInaction: string;
  recommendedAction: string;
  recipientRole: string;
  data: Record<string, unknown>;
}

export class MonitoringEngine {
  /**
   * Run all monitors for a facility. Called on schedule or on data change.
   */
  async runAllMonitors(facilityId: string): Promise<MonitorSignal[]> {
    const signals: MonitorSignal[] = [];

    const [careMinutes, rnCoverage, sirsDeadlines, pshThresholds, connectorHealth] =
      await Promise.all([
        this.checkCareMinutes(facilityId),
        this.checkRnCoverage(facilityId),
        this.checkSirsDeadlines(facilityId),
        this.checkPshThresholds(facilityId),
        this.checkConnectorHealth(facilityId),
      ]);

    signals.push(...careMinutes, ...rnCoverage, ...sirsDeadlines, ...pshThresholds, ...connectorHealth);

    // Deduplicate: suppress if same alert type + facility within 4 hours
    const deduplicated = await this.deduplicateSignals(facilityId, signals);

    // Create alert loops for non-suppressed signals
    for (const signal of deduplicated) {
      await this.createAlertLoop(signal);
    }

    return deduplicated;
  }

  // --- Care Minutes Monitor (hourly) ---
  private async checkCareMinutes(facilityId: string): Promise<MonitorSignal[]> {
    const signals: MonitorSignal[] = [];
    const today = new Date().toISOString().split("T")[0];

    const rows = await db.select().from(facilityRostering).where(
      and(eq(facilityRostering.facilityId, facilityId), eq(facilityRostering.shiftDate, today))
    );

    if (rows.length === 0) return signals;

    const totalMinutes = rows.reduce((s, r) => s + Number(r.actualTotalMinutes ?? 0), 0);
    const rnMinutes = rows.reduce((s, r) => s + Number(r.actualRnMinutes ?? 0), 0);
    const beds = rows[0].operationalBeds ?? 0;

    if (beds === 0) return signals;

    const perResTotal = totalMinutes / beds;
    const perResRn = rnMinutes / beds;

    // IMMEDIATE: RN < 38 or total < 190
    if (perResRn < 38) {
      signals.push({
        type: "care_minutes_rn_breach",
        urgency: "immediate",
        facilityId,
        signalLabel: "RN care minutes below threshold",
        specificFact: `RN care minutes at ${perResRn.toFixed(1)} min/resident (threshold: 40, at-risk: 38).`,
        consequenceOfInaction: "Non-compliance with AN-ACC care minutes requirement. Financial penalty risk.",
        recommendedAction: "Review RN roster for remaining shifts today. Confirm RN coverage or arrange agency.",
        recipientRole: "don",
        data: { perResRn, perResTotal, beds },
      });
    } else if (perResTotal < 190) {
      signals.push({
        type: "care_minutes_total_breach",
        urgency: "immediate",
        facilityId,
        signalLabel: "Total care minutes below threshold",
        specificFact: `Total care minutes at ${perResTotal.toFixed(1)} min/resident (threshold: 200, at-risk: 190).`,
        consequenceOfInaction: "Non-compliance with AN-ACC care minutes requirement.",
        recommendedAction: "Review staffing for remaining shifts. Identify unfilled positions.",
        recipientRole: "don",
        data: { perResRn, perResTotal, beds },
      });
    }
    // URGENT: watch thresholds
    else if (perResRn < 39 || perResTotal < 195) {
      signals.push({
        type: "care_minutes_watch",
        urgency: "urgent",
        facilityId,
        signalLabel: "Care minutes approaching threshold",
        specificFact: `Care minutes: ${perResTotal.toFixed(1)} total, ${perResRn.toFixed(1)} RN per resident.`,
        consequenceOfInaction: "Trending toward non-compliance if pattern continues.",
        recommendedAction: "Monitor closely. Review roster for tomorrow.",
        recipientRole: "don",
        data: { perResRn, perResTotal },
      });
    }

    return signals;
  }

  // --- RN Coverage Monitor ---
  private async checkRnCoverage(facilityId: string): Promise<MonitorSignal[]> {
    const signals: MonitorSignal[] = [];
    const today = new Date().toISOString().split("T")[0];

    const rows = await db.select().from(facilityRostering).where(
      and(
        eq(facilityRostering.facilityId, facilityId),
        eq(facilityRostering.shiftDate, today),
        eq(facilityRostering.rnCoverageGap, true)
      )
    );

    for (const row of rows) {
      signals.push({
        type: "rn_coverage_gap",
        urgency: "immediate",
        facilityId,
        signalLabel: "RN coverage gap detected",
        specificFact: `No RN coverage on ${row.shiftDate} (${row.shiftType} shift). Gap: ${row.rnCoverageGapHours}h.`,
        consequenceOfInaction: "Breach of 24/7 RN coverage requirement under Aged Care Act 2024.",
        recommendedAction: "Arrange agency RN or redistribute RN coverage immediately.",
        recipientRole: "don",
        data: { shiftDate: row.shiftDate, shiftType: row.shiftType, gapHours: row.rnCoverageGapHours },
      });
    }

    return signals;
  }

  // --- SIRS Deadline Monitor (every 30 min) ---
  private async checkSirsDeadlines(facilityId: string): Promise<MonitorSignal[]> {
    const signals: MonitorSignal[] = [];

    const pending = await db.select().from(facilityIncidents).where(
      and(
        eq(facilityIncidents.facilityId, facilityId),
        isNotNull(facilityIncidents.sirsCategory),
        isNull(facilityIncidents.sirsReportedAt)
      )
    );

    const now = new Date();

    for (const incident of pending) {
      if (!incident.sirsReportingDeadline || !incident.sirsCategory) continue;
      const deadline = new Date(incident.sirsReportingDeadline);
      const hoursRemaining = (deadline.getTime() - now.getTime()) / 3_600_000;

      if (hoursRemaining <= 0) {
        signals.push({
          type: "sirs_overdue",
          urgency: "immediate",
          facilityId,
          signalLabel: "SIRS report OVERDUE",
          specificFact: `SIRS Category ${incident.sirsCategory} report is ${Math.abs(hoursRemaining).toFixed(1)}h past deadline.`,
          consequenceOfInaction: "Penalty risk: up to $783,000 per contravention.",
          recommendedAction: "Submit SIRS report immediately via DON queue.",
          recipientRole: "don",
          data: { incidentId: incident.id, sirsCategory: incident.sirsCategory, hoursOverdue: Math.abs(hoursRemaining) },
        });
      } else if (incident.sirsCategory === 1 && hoursRemaining <= 4.8) {
        signals.push({
          type: "sirs_cat1_critical",
          urgency: "immediate",
          facilityId,
          signalLabel: `SIRS Cat 1 deadline — ${hoursRemaining.toFixed(1)}h remaining`,
          specificFact: `80%+ of 24h window elapsed. ${hoursRemaining.toFixed(1)} hours remaining.`,
          consequenceOfInaction: "SIRS Category 1 non-reporting penalty: up to $783,000.",
          recommendedAction: "Escalate to CEO. Review and approve SIRS report now.",
          recipientRole: "ceo",
          data: { incidentId: incident.id, hoursRemaining },
        });
      } else if (incident.sirsCategory === 1 && hoursRemaining <= 12) {
        signals.push({
          type: "sirs_cat1_reminder",
          urgency: "urgent",
          facilityId,
          signalLabel: `SIRS Cat 1 — ${hoursRemaining.toFixed(1)}h remaining`,
          specificFact: `SIRS Category 1 report due in ${hoursRemaining.toFixed(1)} hours.`,
          consequenceOfInaction: "24h reporting window closing.",
          recommendedAction: "Review and approve SIRS report in DON queue.",
          recipientRole: "don",
          data: { incidentId: incident.id, hoursRemaining },
        });
      } else if (incident.sirsCategory === 2 && hoursRemaining <= 72) {
        signals.push({
          type: "sirs_cat2_urgent",
          urgency: "urgent",
          facilityId,
          signalLabel: `SIRS Cat 2 — ${Math.floor(hoursRemaining / 24)} days remaining`,
          specificFact: `SIRS Category 2 report due in ${Math.floor(hoursRemaining / 24)} days.`,
          consequenceOfInaction: "30-day reporting window closing.",
          recommendedAction: "Review and approve SIRS report in DON queue.",
          recipientRole: "don",
          data: { incidentId: incident.id, hoursRemaining },
        });
      }
    }

    return signals;
  }

  // --- PSH Threshold Monitor ---
  private async checkPshThresholds(facilityId: string): Promise<MonitorSignal[]> {
    const signals: MonitorSignal[] = [];

    const latest = await db.select().from(facilityHazardScores)
      .where(eq(facilityHazardScores.facilityId, facilityId))
      .orderBy(desc(facilityHazardScores.cycleId))
      .limit(10);

    for (const hazard of latest) {
      const score = Number(hazard.overallScore ?? 0);

      if (score > 0.85) {
        signals.push({
          type: "psh_critical_threshold",
          urgency: "urgent",
          facilityId,
          signalLabel: "Critical PSH hazard level",
          specificFact: `Team ${hazard.teamId} overall PSH score at ${(score * 100).toFixed(0)}% (critical threshold: 85%).`,
          consequenceOfInaction: "Sustained critical PSH scores are the strongest leading indicator of turnover and WHS incidents.",
          recommendedAction: "DON escalation — this requires facility-level response, not team-level practice.",
          recipientRole: "don",
          data: { teamId: hazard.teamId, score, cycleId: hazard.cycleId },
        });
      }

      if (hazard.convergenceDetected) {
        signals.push({
          type: "psh_convergence_event",
          urgency: "urgent",
          facilityId,
          signalLabel: "PSH convergence detected",
          specificFact: `Convergence event for team ${hazard.teamId} — pulse + operational signals corroborate.`,
          consequenceOfInaction: "Convergence indicates systemic issue confirmed by multiple data sources.",
          recommendedAction: "Review convergence detail in Monday Briefing. Consider workload review.",
          recipientRole: "don",
          data: { teamId: hazard.teamId, convergencePairs: hazard.convergencePairs },
        });
      }
    }

    return signals;
  }

  // --- Connector Health Monitor (every 4 hours) ---
  private async checkConnectorHealth(facilityId: string): Promise<MonitorSignal[]> {
    const signals: MonitorSignal[] = [];

    const [facility] = await db.select().from(
      (await import("@chris/db")).facilities
    ).where(eq((await import("@chris/db")).facilities.id, facilityId));

    if (!facility?.lastIngestionAt) return signals;

    const hoursSinceIngestion = (Date.now() - new Date(facility.lastIngestionAt).getTime()) / 3_600_000;

    if (hoursSinceIngestion > 48) {
      signals.push({
        type: "connector_stale_critical",
        urgency: "immediate",
        facilityId,
        signalLabel: "Connector data critically stale",
        specificFact: `No data ingestion for ${Math.floor(hoursSinceIngestion)} hours (threshold: 26h).`,
        consequenceOfInaction: "Care minutes calculation unreliable. RN coverage monitoring suspended.",
        recommendedAction: "Check connector status. Contact operator if connector health check fails.",
        recipientRole: "don",
        data: { hoursSinceIngestion },
      });
    } else if (hoursSinceIngestion > 26) {
      signals.push({
        type: "connector_stale_watch",
        urgency: "routine",
        facilityId,
        signalLabel: "Connector data stale",
        specificFact: `Last ingestion ${Math.floor(hoursSinceIngestion)} hours ago (daily pull expected).`,
        consequenceOfInaction: "Data may not reflect current rostering or workforce state.",
        recommendedAction: "Monitor — will auto-resolve on next successful connector pull.",
        recipientRole: "don",
        data: { hoursSinceIngestion },
      });
    }

    return signals;
  }

  // --- Deduplication ---
  private async deduplicateSignals(facilityId: string, signals: MonitorSignal[]): Promise<MonitorSignal[]> {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

    const recentAlerts = await db.select().from(alertLoops).where(
      and(
        eq(alertLoops.facilityId, facilityId),
        gte(alertLoops.createdAt, fourHoursAgo)
      )
    );

    const recentTypes = new Set(recentAlerts.map((a) => a.alertType));

    return signals.filter((s) => {
      if (recentTypes.has(s.type)) {
        // Escalating urgency overrides suppression
        const existingUrgencies = recentAlerts
          .filter((a) => a.alertType === s.type)
          .map((a) => a.urgency);

        const urgencyRank = { immediate: 3, urgent: 2, routine: 1 };
        const existingMax = Math.max(...existingUrgencies.map((u) => urgencyRank[u as keyof typeof urgencyRank] ?? 0));
        const newRank = urgencyRank[s.urgency] ?? 0;

        if (newRank > existingMax) return true; // Escalation overrides
        return false; // Suppress duplicate
      }
      return true;
    });
  }

  // --- Create Alert Loop ---
  private async createAlertLoop(signal: MonitorSignal): Promise<void> {
    await db.insert(alertLoops).values({
      facilityId: signal.facilityId,
      alertType: signal.type,
      urgency: signal.urgency,
      status: "open",
      recipientRole: signal.recipientRole,
      signalLabel: signal.signalLabel,
      specificFact: signal.specificFact,
      consequenceOfInaction: signal.consequenceOfInaction,
      recommendedAction: signal.recommendedAction,
      responseOptions: JSON.stringify([
        { label: "Confirmed", action: "confirm_done" },
        { label: "Open queue", action: "open_queue" },
        { label: "Escalate", action: "escalate" },
        { label: "Show data", action: "show_data" },
      ]),
    });
  }
}
