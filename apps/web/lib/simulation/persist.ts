// lib/simulation/persist.ts
// Persist simulation results to Neon for historical tracking.
// Phase 1: writes to in-memory store (no DB connection yet).
// Phase 2: writes to simulationRuns + simulationVerdicts + simulationFailures tables.

import type { SuiteReport, Verdict } from './types';

// ── IN-MEMORY STORE (Phase 1) ────────────────────────────────
// Replaced with Neon writes when DB is connected.

interface StoredRun {
  id: number;
  suite: string;
  total_scenarios: number;
  passed: number;
  failed: number;
  overall_score: number;
  llm_judge_enabled: boolean;
  llm_avg_quality?: number;
  duration_ms: number;
  by_agent: Record<string, { total: number; passed: number; avg_score: number }>;
  triggered_by: string;
  created_at: string;
  verdicts: Verdict[];
}

interface StoredFailure {
  id: number;
  run_id: number;
  scenario_id: string;
  failure_type: string;
  agent: string;
  expected: string;
  actual: string | null;
  related_threshold: string | null;
  resolved: boolean;
  created_at: string;
}

// In-memory store — persists across requests in dev server, resets on restart
const runHistory: StoredRun[] = [];
const failureHistory: StoredFailure[] = [];
let nextRunId = 1;
let nextFailureId = 1;

/**
 * Persist a suite report after a simulation run.
 * Returns the run ID for reference.
 */
export function persistRun(report: SuiteReport, suite: string, triggeredBy: string = 'manual'): number {
  const runId = nextRunId++;

  const storedRun: StoredRun = {
    id: runId,
    suite,
    total_scenarios: report.total_scenarios,
    passed: report.passed,
    failed: report.failed,
    overall_score: report.overall_score,
    llm_judge_enabled: report.llm_judge_available,
    llm_avg_quality: report.llm_avg_quality,
    duration_ms: report.duration_ms,
    by_agent: report.by_agent,
    triggered_by: triggeredBy,
    created_at: report.run_at,
    verdicts: report.verdicts,
  };

  runHistory.push(storedRun);

  // Extract and persist failures
  for (const verdict of report.verdicts) {
    if (!verdict.pass) {
      // Missed detections
      for (const detection of verdict.detections) {
        if (!detection.found) {
          failureHistory.push({
            id: nextFailureId++,
            run_id: runId,
            scenario_id: verdict.scenario_id,
            failure_type: 'missed_detection',
            agent: detection.expected.agent,
            expected: detection.expected.description,
            actual: null,
            related_threshold: guessThreshold(detection.expected.finding_type),
            resolved: false,
            created_at: report.run_at,
          });
        }
      }

      // False positives
      for (const silence of verdict.silence_checks) {
        if (!silence.silent && silence.false_positive) {
          failureHistory.push({
            id: nextFailureId++,
            run_id: runId,
            scenario_id: verdict.scenario_id,
            failure_type: 'false_positive',
            agent: silence.expected.agent,
            expected: `Should NOT fire: ${silence.expected.should_not_fire}`,
            actual: silence.false_positive.title,
            related_threshold: null,
            resolved: false,
            created_at: report.run_at,
          });
        }
      }
    }
  }

  // TODO: Phase 2 — write to Neon:
  // await db.insert(simulationRuns).values({ ... })
  // await db.insert(simulationVerdicts).values(report.verdicts.map(...))
  // await db.insert(simulationFailures).values(failures)

  console.log(`[Simulation] Run #${runId} persisted: ${report.passed}/${report.total_scenarios} passed · ${Math.round(report.overall_score * 100)}%`);

  return runId;
}

/**
 * Get historical runs for the dashboard.
 */
export function getRunHistory(limit: number = 20): StoredRun[] {
  return runHistory.slice(-limit).reverse();
}

/**
 * Get all unresolved failures.
 */
export function getUnresolvedFailures(): StoredFailure[] {
  return failureHistory.filter((f) => !f.resolved);
}

/**
 * Get failure patterns — which thresholds cause the most failures?
 */
export function getFailurePatterns(): Array<{
  threshold: string;
  failure_count: number;
  scenarios_affected: string[];
  suggestion: string;
}> {
  const byThreshold = new Map<string, { count: number; scenarios: Set<string> }>();

  for (const failure of failureHistory.filter((f) => !f.resolved && f.related_threshold)) {
    const key = failure.related_threshold!;
    const entry = byThreshold.get(key) ?? { count: 0, scenarios: new Set() };
    entry.count++;
    entry.scenarios.add(failure.scenario_id);
    byThreshold.set(key, entry);
  }

  return Array.from(byThreshold.entries())
    .map(([threshold, data]) => ({
      threshold,
      failure_count: data.count,
      scenarios_affected: Array.from(data.scenarios),
      suggestion: buildSuggestion(threshold, data.count),
    }))
    .sort((a, b) => b.failure_count - a.failure_count);
}

/**
 * Get score trend over time.
 */
export function getScoreTrend(): Array<{ run_id: number; score: number; passed: number; total: number; date: string }> {
  return runHistory.map((r) => ({
    run_id: r.id,
    score: r.overall_score,
    passed: r.passed,
    total: r.total_scenarios,
    date: r.created_at,
  }));
}

// ── HELPERS ──────────────────────────────────────────────────

function guessThreshold(findingType: string): string | null {
  const map: Record<string, string> = {
    care_minutes_at_risk: 'care_minutes.chris_alert_threshold_pct',
    care_minutes_critical: 'care_minutes.chris_critical_threshold_pct',
    rn_gap_tonight: 'care_minutes.rn_minutes_per_resident_day',
    sirs_deadline_approaching: 'sirs.chris_alert_thresholds',
    connector_stale: 'connector_stale_hours_threshold',
    compliance_deadline: 'compliance_deadline_days_threshold',
    psh_convergence: 'psh.thresholds.elevated',
    credentials_expiring: 'credentials_expiring_days_threshold',
    turnover_precursor: 'psh.turnover_precursors.PSH_13_consecutive_decline_cycles',
    turnover_elevated: 'workforce_benchmarks.turnover.chris_alert_threshold',
  };
  return map[findingType] ?? null;
}

function buildSuggestion(threshold: string, failureCount: number): string {
  if (threshold.includes('alert_threshold')) {
    return `${failureCount} failures linked to this threshold. Consider adjusting — run scenario generator to test impact.`;
  }
  if (threshold.includes('elevated')) {
    return `${failureCount} PSH convergence failures. Verify elevated threshold (0.65) matches clinical expectations.`;
  }
  return `${failureCount} failures linked to ${threshold}. Review threshold value against operational reality.`;
}
