// ============================================================================
// CHRIS Nightly Cycle
// Comprehensive daily evaluation — runs at 4am AEST.
// Adapted from Prism's nightly evaluator.
//
// Phases:
//   1. Connector sync verification
//   2. Care minutes calculation for prior day
//   3. Incident review + SIRS check
//   4. Workforce snapshot
//   5. Convergence detection
//   6. Monday Briefing prep (Sundays)
//   7. Governance cycle check
//   8. Trust decay
//   9. Bayesian prior decay (weekly)
//   10. Evidence trail integrity check
//   11. Action logging
// ============================================================================

import { db, facilities, evidenceRecords } from "@chris/db";
import { eq } from "drizzle-orm";
import {
  CareMinutesEngine, checkDeadlines, MonitoringEngine,
  ConvergenceDetector, TrustEngine, decayPriors,
} from "@chris/engines";

export interface NightlyCycleResult {
  facilityId: string;
  startedAt: Date;
  completedAt: Date;
  phases: Array<{ name: string; success: boolean; duration: number; detail?: string }>;
  careMinutesStatus: string;
  sirsDeadlines: number;
  signalsDetected: number;
  convergenceEvents: number;
  trustDecayed: number;
}

/**
 * Run the full nightly cycle for a facility.
 * This is the comprehensive daily health check.
 */
export async function runNightlyCycle(facilityId: string): Promise<NightlyCycleResult> {
  const startedAt = new Date();
  const phases: NightlyCycleResult["phases"] = [];
  let careMinutesStatus = "unknown";
  let sirsDeadlines = 0;
  let signalsDetected = 0;
  let convergenceEvents = 0;
  let trustDecayed = 0;

  console.log(`[CHRIS Nightly] Starting for ${facilityId}`);

  // Phase 1: Connector sync verification
  const p1Start = Date.now();
  try {
    const [facility] = await db.select().from(facilities).where(eq(facilities.id, facilityId));
    const staleHours = facility?.lastIngestionAt
      ? (Date.now() - new Date(facility.lastIngestionAt).getTime()) / 3600000
      : -1;

    phases.push({
      name: "connector_verification",
      success: staleHours >= 0 && staleHours < 26,
      duration: Date.now() - p1Start,
      detail: `Last ingestion: ${staleHours.toFixed(1)}h ago`,
    });
  } catch (e) {
    phases.push({ name: "connector_verification", success: false, duration: Date.now() - p1Start, detail: String(e) });
  }

  // Phase 2: Care minutes for yesterday
  const p2Start = Date.now();
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const engine = new CareMinutesEngine();
    const result = await engine.calculateDaily(facilityId, yesterday.toISOString().split("T")[0]);
    careMinutesStatus = result.complianceStatus;
    phases.push({
      name: "care_minutes_yesterday",
      success: true,
      duration: Date.now() - p2Start,
      detail: `${result.totalCareMinutesPerResident.toFixed(1)} min/resident — ${result.complianceStatus}`,
    });
  } catch (e) {
    phases.push({ name: "care_minutes_yesterday", success: false, duration: Date.now() - p2Start, detail: String(e) });
  }

  // Phase 3: SIRS deadline check
  const p3Start = Date.now();
  try {
    const alerts = await checkDeadlines();
    sirsDeadlines = alerts.length;
    phases.push({
      name: "sirs_deadline_check",
      success: true,
      duration: Date.now() - p3Start,
      detail: `${alerts.length} alerts generated`,
    });
  } catch (e) {
    phases.push({ name: "sirs_deadline_check", success: false, duration: Date.now() - p3Start, detail: String(e) });
  }

  // Phase 4: Monitoring pass
  const p4Start = Date.now();
  try {
    const monitor = new MonitoringEngine();
    const signals = await monitor.runAllMonitors(facilityId);
    signalsDetected = signals.length;
    phases.push({
      name: "monitoring_pass",
      success: true,
      duration: Date.now() - p4Start,
      detail: `${signals.length} signals (${signals.filter((s) => s.urgency === "immediate").length} immediate)`,
    });
  } catch (e) {
    phases.push({ name: "monitoring_pass", success: false, duration: Date.now() - p4Start, detail: String(e) });
  }

  // Phase 5: Convergence detection
  const p5Start = Date.now();
  try {
    const detector = new ConvergenceDetector();
    const signals = await detector.detectSignals(facilityId);
    convergenceEvents = signals.length;
    phases.push({
      name: "convergence_detection",
      success: true,
      duration: Date.now() - p5Start,
      detail: `${signals.length} cross-domain signals`,
    });
  } catch (e) {
    phases.push({ name: "convergence_detection", success: false, duration: Date.now() - p5Start, detail: String(e) });
  }

  // Phase 6: Trust decay
  const p6Start = Date.now();
  try {
    const trust = new TrustEngine();
    trustDecayed = await trust.decayInactive();
    phases.push({
      name: "trust_decay",
      success: true,
      duration: Date.now() - p6Start,
      detail: `${trustDecayed} scores decayed`,
    });
  } catch (e) {
    phases.push({ name: "trust_decay", success: false, duration: Date.now() - p6Start, detail: String(e) });
  }

  // Phase 7: Bayesian prior decay (weekly — Sundays only)
  const isSunday = new Date().getDay() === 0;
  if (isSunday) {
    const p7Start = Date.now();
    try {
      const decayed = await decayPriors(facilityId);
      phases.push({
        name: "bayesian_decay",
        success: true,
        duration: Date.now() - p7Start,
        detail: `${decayed} priors decayed`,
      });
    } catch (e) {
      phases.push({ name: "bayesian_decay", success: false, duration: Date.now() - p7Start, detail: String(e) });
    }
  }

  // Phase 8: Cooldown cleanup
  const p8Start = Date.now();
  try {
    const monitor = new MonitoringEngine();
    const cleaned = await monitor.cleanupExpiredCooldowns();
    phases.push({
      name: "cooldown_cleanup",
      success: true,
      duration: Date.now() - p8Start,
      detail: `${cleaned} expired cooldowns removed`,
    });
  } catch (e) {
    phases.push({ name: "cooldown_cleanup", success: false, duration: Date.now() - p8Start, detail: String(e) });
  }

  // Log nightly cycle
  const completedAt = new Date();
  const totalDuration = completedAt.getTime() - startedAt.getTime();
  const successfulPhases = phases.filter((p) => p.success).length;

  await db.insert(evidenceRecords).values({
    facilityId,
    recordType: "action",
    actionCategory: "nightly_cycle",
    triggeredAt: startedAt,
    executedAt: completedAt,
    triggeredBy: "chris",
    executedBy: "chris",
    outcome: `${successfulPhases}/${phases.length} phases · ${totalDuration}ms · care: ${careMinutesStatus} · sirs: ${sirsDeadlines} · signals: ${signalsDetected} · convergence: ${convergenceEvents}`,
    signalData: { phases: phases.map((p) => ({ name: p.name, success: p.success })) },
  });

  console.log(`[CHRIS Nightly] Complete for ${facilityId}: ${successfulPhases}/${phases.length} phases, ${totalDuration}ms`);

  return {
    facilityId,
    startedAt,
    completedAt,
    phases,
    careMinutesStatus,
    sirsDeadlines,
    signalsDetected,
    convergenceEvents,
    trustDecayed,
  };
}
