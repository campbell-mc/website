// lib/chris/convergence.ts
// Extracted from ivan-ai-san/chris-mvp-test — the signal convergence engine
// Maintained by Ivan Sanchez
//
// Detects when pulse AND operational signals both identify the same PSH hazard.
// When convergence is detected, applies 1.5x priority boost to increase confidence.
// Pure TypeScript — no database calls, no API calls. Fast and free to run.
//
// Application: feeds into briefings, situation reports, and agent findings
// to add the "why" layer alongside deterministic metrics.

// ── THRESHOLDS ────────────────────────────────────────────────

export const PULSE_THRESHOLDS = {
  CONCERN: 3.0,           // Score below this triggers signal
  HEALTHY: 4.0,           // Score above this = low risk
  RELATIVE_DROP: 0.4,     // Drop from prior cycle that triggers signal
  MIN_RESPONSE_RATE: 0.30, // Minimum for pulse signal detection
} as const;

export const OPERATIONAL_THRESHOLDS = {
  OVERTIME_RATE: 0.06,         // 6%
  AGENCY_RATE: 0.15,           // 15%
  UNFILLED_RATE: 0.04,         // 4%
  LATE_CHANGES_PER_10H: 1.5,
  MISSED_BREAKS_PER_10H: 1.0,
  INCIDENT_COUNT: 3,
  HAZARD_COUNT: 5,
  COMPLAINT_COUNT: 2,
  SICK_LEAVE_RATE: 0.03,       // 3%
} as const;

export const CONVERGENCE_BOOST = 1.5;
const PULSE_WEIGHT = 0.6;
const OPERATIONAL_WEIGHT = 0.4;

// ── CONVERGENCE PAIRS ─────────────────────────────────────────
// When a pulse signal and an operational signal both point at the
// same hazard domain, convergence is detected.

export const CONVERGENCE_PAIRS = [
  { pulse: 'workload_low', operational: ['overtime', 'agency_dependency', 'unfilled_shifts'] },
  { pulse: 'psych_safety_low', operational: ['incident_rate', 'complaints'] },
  { pulse: 'trust_declining', operational: ['turnover'] },
  { pulse: 'support_low', operational: ['missed_breaks', 'overtime'] },
  { pulse: 'fairness_low', operational: ['late_changes', 'agency_dependency'] },
] as const;

// ── PULSE DIMENSIONS ──────────────────────────────────────────

export const PULSE_DIMENSIONS = [
  'workload', 'support', 'fairness', 'voice',
  'trust', 'psych_safety', 'role_clarity', 'teamwork',
] as const;

export type PulseDimension = typeof PULSE_DIMENSIONS[number];

export const PULSE_DIMENSION_LABELS: Record<PulseDimension, string> = {
  workload: 'Workload', support: 'Support', fairness: 'Fairness',
  voice: 'Voice', trust: 'Trust', psych_safety: 'Psychological Safety',
  role_clarity: 'Role Clarity', teamwork: 'Teamwork',
};

// ── TYPES ─────────────────────────────────────────────────────

export interface HazardDetection {
  psh_code: string;
  pulse_severity: number | null;
  operational_severity: number | null;
  convergence: boolean;
  final_score: number;        // 0-1, with 1.5x boost if converged
  confidence: 'high' | 'medium' | 'low';
  evidence_source: 'converged' | 'pulse_only' | 'operational_only';
}

export interface ConvergenceSummary {
  total_hazards: number;
  convergent_hazards: number;
  high_confidence: string[];
  boost_applied: boolean;
}

export interface ConvergenceInsight {
  detected: boolean;
  hazard: string;
  pulse_signal: string;
  operational_signal: string;
  confidence: 'high' | 'medium' | 'low';
  narrative: string;          // One sentence explaining the "why"
}

// ── CORE ALGORITHM ────────────────────────────────────────────

/**
 * Detects convergence between pulse and operational signals.
 *
 * When both streams detect the same PSH hazard:
 *   final_score = ((pulse × 0.6) + (ops × 0.4)) × 1.5, capped at 1.0
 *
 * Pulse only: direct score, medium confidence
 * Operational only: direct score, low confidence
 */
export function detectConvergence(
  pulseScores: Map<string, number>,
  operationalScores: Map<string, number>
): HazardDetection[] {
  const allHazards = new Set([...pulseScores.keys(), ...operationalScores.keys()]);
  const detections: HazardDetection[] = [];

  for (const psh_code of allHazards) {
    const pulse = pulseScores.get(psh_code) ?? null;
    const ops = operationalScores.get(psh_code) ?? null;
    const convergence = pulse !== null && ops !== null;

    let final_score: number;
    let confidence: HazardDetection['confidence'];
    let evidence_source: HazardDetection['evidence_source'];

    if (convergence) {
      final_score = (pulse * PULSE_WEIGHT + ops * OPERATIONAL_WEIGHT) * CONVERGENCE_BOOST;
      confidence = 'high';
      evidence_source = 'converged';
    } else if (pulse !== null) {
      final_score = pulse;
      confidence = 'medium';
      evidence_source = 'pulse_only';
    } else {
      final_score = ops!;
      confidence = 'low';
      evidence_source = 'operational_only';
    }

    detections.push({
      psh_code,
      pulse_severity: pulse,
      operational_severity: ops,
      convergence,
      final_score: Math.min(final_score, 1.0),
      confidence,
      evidence_source,
    });
  }

  return detections.sort((a, b) => b.final_score - a.final_score);
}

/**
 * Gets a summary of convergence detections.
 */
export function getConvergenceSummary(detections: HazardDetection[]): ConvergenceSummary {
  const convergent = detections.filter((d) => d.convergence);
  return {
    total_hazards: detections.length,
    convergent_hazards: convergent.length,
    high_confidence: convergent.map((d) => d.psh_code),
    boost_applied: convergent.length > 0,
  };
}

// ── HELPER FUNCTIONS ──────────────────────────────────────────

export function getRiskLevel(score: number): 'low' | 'medium' | 'elevated' {
  if (score >= PULSE_THRESHOLDS.HEALTHY) return 'low';
  if (score >= PULSE_THRESHOLDS.CONCERN) return 'medium';
  return 'elevated';
}

export function triggersSignal(score: number): boolean {
  return score < PULSE_THRESHOLDS.CONCERN;
}

export function triggersRelativeSignal(current: number, previous: number): boolean {
  return previous - current >= PULSE_THRESHOLDS.RELATIVE_DROP;
}

export function hasSufficientResponses(responseRate: number): boolean {
  return responseRate >= PULSE_THRESHOLDS.MIN_RESPONSE_RATE;
}

export function getTrend(current: number, previous: number | null): 'improving' | 'stable' | 'worsening' | 'unknown' {
  if (previous === null) return 'unknown';
  const diff = current - previous;
  if (diff >= PULSE_THRESHOLDS.RELATIVE_DROP) return 'improving';
  if (diff <= -PULSE_THRESHOLDS.RELATIVE_DROP) return 'worsening';
  return 'stable';
}

// ── NARRATIVE GENERATION ──────────────────────────────────────
// Generates the "why" sentence for briefings and situation reports.
// Called after convergence detection to add context to deterministic metrics.

const CONVERGENCE_NARRATIVES: Record<string, (pulseSignal: string, opsSignal: string) => string> = {
  PSH_01: (p, o) => `Convergence detected: ${p} staff report high job demands AND ${o} — this is a workload design problem, not a staffing gap.`,
  PSH_02: (p, o) => `Convergence detected: ${p} staff report lack of support AND ${o} — systemic support gaps are driving both signals.`,
  PSH_03: (p, o) => `Convergence detected: ${p} staff report fairness concerns AND ${o} — perceived inequity is affecting operational outcomes.`,
  PSH_08: (p, o) => `Convergence detected: ${p} staff report traumatic exposure AND ${o} — unprocessed trauma is affecting care delivery.`,
  PSH_10: (p, o) => `Convergence detected: ${p} staff report violence/aggression AND ${o} — environment safety and WC risk are linked.`,
  PSH_13: (p, o) => `Convergence detected: ${p} staff report low recognition AND ${o} — this is a culture signal presenting as a cost line.`,
  PSH_16: (p, o) => `Convergence detected: ${p} staff report work-life imbalance AND ${o} — roster design is the intervention point.`,
};

/**
 * Generate convergence insights for use in briefings and narratives.
 * Returns only converged hazards — deterministic metrics don't need this.
 */
export function generateConvergenceInsights(
  detections: HazardDetection[]
): ConvergenceInsight[] {
  return detections
    .filter((d) => d.convergence)
    .map((d) => {
      const narrativeFn = CONVERGENCE_NARRATIVES[d.psh_code];
      const pulseLabel = `pulse scores indicate`;
      const opsLabel = `operational data confirms`;
      return {
        detected: true,
        hazard: d.psh_code,
        pulse_signal: pulseLabel,
        operational_signal: opsLabel,
        confidence: d.confidence,
        narrative: narrativeFn
          ? narrativeFn(pulseLabel, opsLabel)
          : `Convergence detected on ${d.psh_code}: both pulse and operational signals agree. Confidence: ${d.confidence}.`,
      };
    });
}
