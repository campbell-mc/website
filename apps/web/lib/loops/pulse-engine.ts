// lib/loops/pulse-engine.ts
// Maintained by Ivan Sanchez
//
// The Pulse Engine processes anonymous pulse responses into PSH hazard scores.
// Runs once per cycle close (Sunday 20:00 AEST).
//
// Pipeline:
//   1. Aggregate responses per team (anonymous — never store individual)
//   2. Calculate 16 PSH domain scores (0.0 – 1.0)
//   3. Run convergence detection against operational data
//   4. Calculate trajectory vs prior cycle
//   5. Prescribe practices from canonical library
//   6. Generate Team Briefing via Claude API
//   7. Transition cycle state → briefing_ready
//
// Pure TypeScript engine. Database reads/writes are at the boundary.

import {
  detectConvergence,
  generateConvergenceInsights,
  PULSE_THRESHOLDS,
  type HazardDetection,
  type ConvergenceInsight,
} from '@/lib/chris/convergence';
import {
  type TeamLoopCycle,
  type ConvergenceRecord,
  type PSHDomain,
  PSH_DOMAINS,
  PSH_LABELS,
  HAZARD_THRESHOLDS,
  classifyHazard,
  getTrajectory,
} from './cycle';
import { selectPractice, type Practice } from './practice-library';

// ── TYPES ────────────────────────────────────────────────────

export interface PulseResponse {
  team_id: string;
  // 4 pulse questions mapped to culture outcome domains
  // Scores are 1-5 (emoji scale from UI)
  q1_motivated: number;
  q2_safe_speaking_up: number;
  q3_appreciated: number;
  q4_values_alignment: number;
  comment?: string;
}

export interface PulseQuestionMapping {
  question_id: string;
  text: string;
  primary_psh: PSHDomain[];
  weight: number;
}

// Maps each pulse question to the PSH domains it informs
export const PULSE_QUESTION_MAP: PulseQuestionMapping[] = [
  {
    question_id: 'q1_motivated',
    text: 'I feel motivated to do my best work each day.',
    primary_psh: ['PSH_01', 'PSH_12', 'PSH_13'],
    weight: 1.0,
  },
  {
    question_id: 'q2_safe_speaking_up',
    text: 'I feel safe speaking up about mistakes.',
    primary_psh: ['PSH_11', 'PSH_10', 'PSH_03'],
    weight: 1.0,
  },
  {
    question_id: 'q3_appreciated',
    text: 'I feel appreciated for the work I do.',
    primary_psh: ['PSH_13', 'PSH_02', 'PSH_05'],
    weight: 1.0,
  },
  {
    question_id: 'q4_values_alignment',
    text: 'Our team lives the values we claim.',
    primary_psh: ['PSH_03', 'PSH_07', 'PSH_05'],
    weight: 1.0,
  },
];

export interface TeamHazardResult {
  team_id: string;
  response_count: number;
  response_rate: number;
  eligible_respondents: number;
  scores: Record<string, number>;
  elevated: string[];
  monitoring: string[];
  convergence: ConvergenceRecord | null;
  trajectory: Record<string, 'improving' | 'stable' | 'declining' | 'acute' | 'unknown'>;
  prescribed_practice: Practice | null;
  prior_outcome: {
    practice_id: string;
    hazard: string;
    delta: number;
    outcome: 'improved' | 'stable' | 'worsened';
  } | null;
}

export interface CycleProcessingResult {
  cycle_id: number;
  facility_id: string;
  processed_at: Date;
  teams: TeamHazardResult[];
  facility_response_rate: number;
  convergence_insights: ConvergenceInsight[];
}

// ── MAIN PROCESSING PIPELINE ─────────────────────────────────

export async function processPulseCycle(
  cycleId: number,
  facilityId: string,
  responses: PulseResponse[],
  teamEligible: Record<string, number>,
  priorScores: Record<string, Record<string, number>>,
  operationalData: Map<string, number>,
): Promise<CycleProcessingResult> {

  // 1. Group responses by team
  const byTeam = new Map<string, PulseResponse[]>();
  for (const r of responses) {
    const existing = byTeam.get(r.team_id) ?? [];
    existing.push(r);
    byTeam.set(r.team_id, existing);
  }

  // 2. Process each team
  const teams: TeamHazardResult[] = [];
  const allDetections: HazardDetection[] = [];

  for (const [teamId, teamResponses] of byTeam) {
    const eligible = teamEligible[teamId] ?? teamResponses.length;
    const responseRate = teamResponses.length / eligible;

    // Skip teams below minimum response rate
    if (responseRate < PULSE_THRESHOLDS.MIN_RESPONSE_RATE) {
      console.log(`[PulseEngine] ${teamId} below minimum response rate: ${(responseRate * 100).toFixed(0)}%`);
      continue;
    }

    // Calculate PSH scores from pulse responses
    const pulseScores = calculatePSHScores(teamResponses);

    // Run convergence detection
    const detections = detectConvergence(pulseScores, operationalData);
    allDetections.push(...detections);

    // Build scores record
    const scores: Record<string, number> = {};
    for (const [domain, score] of pulseScores) {
      scores[domain] = score;
    }

    // Classify hazards
    const elevated: string[] = [];
    const monitoring: string[] = [];
    for (const [domain, score] of Object.entries(scores)) {
      const level = classifyHazard(score);
      if (level === 'red') elevated.push(domain);
      else if (level === 'amber') monitoring.push(domain);
    }

    // Calculate trajectory vs prior cycle
    const prior = priorScores[teamId] ?? {};
    const trajectory: Record<string, ReturnType<typeof getTrajectory>> = {};
    for (const domain of PSH_DOMAINS) {
      trajectory[domain] = getTrajectory(scores[domain] ?? 0, prior[domain] ?? null);
    }

    // Build convergence record
    const convergedDetections = detections.filter((d) => d.convergence);
    let convergence: ConvergenceRecord | null = null;
    if (convergedDetections.length > 0) {
      convergence = {
        type: 'AMPLIFYING',
        signals: convergedDetections.map((d) => d.psh_code),
        severity: convergedDetections.some((d) => d.final_score > 0.8) ? 'high'
          : convergedDetections.some((d) => d.final_score > 0.5) ? 'moderate'
          : 'low',
        confidence: convergedDetections.length >= 3 ? 'STRONG' : convergedDetections.length >= 2 ? 'MODERATE' : 'WEAK',
        cycles_persisting: 1, // TODO: Ivan — look up from prior cycles
        note: `${convergedDetections.length} PSH domains converged with operational data`,
      };
    }

    // Calculate prior cycle outcome
    let priorOutcome: TeamHazardResult['prior_outcome'] = null;
    // TODO: Ivan — look up prior practice from DB

    // Prescribe practice
    const practice = selectPractice(elevated, monitoring, scores);

    teams.push({
      team_id: teamId,
      response_count: teamResponses.length,
      response_rate: responseRate,
      eligible_respondents: eligible,
      scores,
      elevated,
      monitoring,
      convergence,
      trajectory,
      prescribed_practice: practice,
      prior_outcome: priorOutcome,
    });
  }

  // 3. Generate facility-level convergence insights
  const convergenceInsights = generateConvergenceInsights(allDetections);

  // 4. Calculate facility response rate
  const totalResponses = responses.length;
  const totalEligible = Object.values(teamEligible).reduce((a, b) => a + b, 0);
  const facilityResponseRate = totalEligible > 0 ? totalResponses / totalEligible : 0;

  return {
    cycle_id: cycleId,
    facility_id: facilityId,
    processed_at: new Date(),
    teams,
    facility_response_rate: facilityResponseRate,
    convergence_insights: convergenceInsights,
  };
}

// ── PSH SCORE CALCULATION ────────────────────────────────────
//
// Each pulse question maps to 2-3 PSH domains.
// Raw scores (1-5) are inverted and normalised to 0.0–1.0 hazard scale:
//   5 (Strongly Agree) → 0.0 (no hazard)
//   1 (Strongly Disagree) → 1.0 (maximum hazard)
//
// Multi-question domains are averaged.

function calculatePSHScores(responses: PulseResponse[]): Map<string, number> {
  const domainAccumulator = new Map<string, number[]>();

  for (const r of responses) {
    const questionScores: Record<string, number> = {
      q1_motivated: r.q1_motivated,
      q2_safe_speaking_up: r.q2_safe_speaking_up,
      q3_appreciated: r.q3_appreciated,
      q4_values_alignment: r.q4_values_alignment,
    };

    for (const mapping of PULSE_QUESTION_MAP) {
      const rawScore = questionScores[mapping.question_id];
      if (rawScore == null) continue;

      // Invert: 5 → 0.0, 1 → 1.0
      const hazardScore = (5 - rawScore) / 4;

      for (const pshDomain of mapping.primary_psh) {
        const existing = domainAccumulator.get(pshDomain) ?? [];
        existing.push(hazardScore * mapping.weight);
        domainAccumulator.set(pshDomain, existing);
      }
    }
  }

  // Average across all responses per domain
  const scores = new Map<string, number>();
  for (const [domain, values] of domainAccumulator) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    scores.set(domain, Math.round(avg * 100) / 100);
  }

  // Fill remaining PSH domains with baseline (no direct pulse signal)
  for (const domain of PSH_DOMAINS) {
    if (!scores.has(domain)) {
      scores.set(domain, 0.35); // neutral baseline
    }
  }

  return scores;
}

// ── TEAM BRIEFING CONTEXT ────────────────────────────────────
// Builds the data context that feeds into the briefing generation engine.

export function buildTeamBriefingContext(result: TeamHazardResult): Record<string, unknown> {
  return {
    team_id: result.team_id,
    response_rate: result.response_rate,
    response_count: result.response_count,
    eligible: result.eligible_respondents,
    elevated_domains: result.elevated.map((d) => ({
      code: d,
      label: PSH_LABELS[d as PSHDomain],
      score: result.scores[d],
      trajectory: result.trajectory[d],
    })),
    monitoring_domains: result.monitoring.map((d) => ({
      code: d,
      label: PSH_LABELS[d as PSHDomain],
      score: result.scores[d],
      trajectory: result.trajectory[d],
    })),
    convergence: result.convergence,
    prescribed_practice: result.prescribed_practice ? {
      id: result.prescribed_practice.id,
      title: result.prescribed_practice.title,
      tagline: result.prescribed_practice.tagline,
      signals_addressed: result.prescribed_practice.signals_addressed,
    } : null,
    prior_outcome: result.prior_outcome,
  };
}
