// lib/loops/cycle.ts
// Maintained by Ivan Sanchez
//
// The Loop Cycle state machine — drives both Team Loop and Leader Loop.
//
// Team Loop (fortnightly, aligned with pulse cycle):
//   pulse_open → pulse_closed → briefing_ready → in_progress → loop_close_pending
//
// Leader Loop (alternate weeks, between pulse cycles):
//   arrival → profile_review → insights → obp_selection → development_active
//
// State transitions are triggered by:
//   - Scheduled events (pulse open/close times)
//   - User actions (submit pulse, commit practice, close loop)
//   - Engine completions (hazard scores calculated, briefing generated)
//
// No Inngest. No managed queue. node-cron triggers + direct function calls.

import { detectConvergence, generateConvergenceInsights, type HazardDetection } from '@/lib/chris/convergence';

// ── TEAM LOOP TYPES ──────────────────────────────────────────

export type TeamLoopState =
  | 'pulse_open'        // Pulse survey active — staff responding
  | 'pulse_closed'      // Responses locked — engine processing
  | 'briefing_ready'    // Hazard scores calculated, briefing generated
  | 'in_progress'       // Leader has committed to a practice
  | 'loop_close_pending'; // Awaiting leader reflection + effectiveness rating

export interface TeamLoopCycle {
  cycle_id: number;
  facility_id: string;
  team_id: string;
  state: TeamLoopState;
  pulse_open_at: Date;
  pulse_close_at: Date;
  briefing_generated_at: Date | null;
  practice_committed_at: Date | null;
  practice_id: string | null;
  practice_personalised: string | null;
  reflection_submitted_at: Date | null;
  loop_closed_at: Date | null;
  effectiveness_rating: number | null;
  // Hazard data
  hazard_scores: Record<string, number> | null;
  convergence_detected: boolean;
  convergence_data: ConvergenceRecord | null;
  // Prior cycle outcome
  prior_practice_id: string | null;
  prior_hazard_domain: string | null;
  prior_delta: number | null;
  prior_outcome: 'improved' | 'stable' | 'worsened' | null;
}

export interface ConvergenceRecord {
  type: 'AMPLIFYING' | 'MITIGATING';
  signals: string[];
  severity: 'low' | 'moderate' | 'high';
  confidence: 'WEAK' | 'MODERATE' | 'STRONG';
  cycles_persisting: number;
  note: string;
  wc_risk?: {
    probability: number;
    estimated_exposure_aud: number;
    window_weeks: string;
  };
}

// ── LEADER LOOP TYPES ────────────────────────────────────────

export type LeaderLoopState =
  | 'arrival'           // Emotional check-in before 360 feedback
  | 'profile_review'    // Reviewing Genos 6 competency data
  | 'insights'          // Pattern recognition + reflection
  | 'obp_selection'     // Choosing One Big Practice
  | 'development_active'; // OBP confirmed, micro-practice assigned

export interface LeaderLoopCycle {
  cycle_id: number;
  facility_id: string;
  team_id: string;
  leader_id: string;
  state: LeaderLoopState;
  // 360 data
  arrival_emotion: string | null;
  arrival_at: Date | null;
  profile_reviewed_at: Date | null;
  reflection_text: string | null;
  reflection_submitted_at: Date | null;
  // OBP
  obp_competency: string | null;
  obp_behavior: string | null;
  obp_personalised: string | null;
  obp_confirmed_at: Date | null;
  // Development tracking
  development_started_at: Date | null;
  micro_practice_id: string | null;
}

// ── GENOS 6 COMPETENCIES ─────────────────────────────────────
// The Genos Emotional Intelligence framework underpins the Leader Loop.
// 6 competencies, each with productive ↔ unproductive poles,
// 7 behaviours, and importance/demonstration scoring.

export interface GenosCompetency {
  id: string;
  name: string;
  productive: string;
  unproductive: string;
  behaviors: string[];
}

export const GENOS_COMPETENCIES: GenosCompetency[] = [
  {
    id: 'selfAwareness', name: 'Self-Awareness',
    productive: 'Present', unproductive: 'Disconnected',
    behaviors: [
      'Understands the impact their behaviour has on others',
      'Aware of their strengths and limitations',
      'Seeks feedback from others about their behaviour',
      'Responds to feedback in a positive manner',
      'Behaves consistently with what they say',
      'Behaves in a manner they expect of others',
      'Demonstrates awareness of their mood and its impact',
    ],
  },
  {
    id: 'awarenessOfOthers', name: 'Awareness of Others',
    productive: 'Empathetic', unproductive: 'Insensitive',
    behaviors: [
      'Makes others feel valued and appreciated',
      'Adjusts their communication style to suit others',
      'Notices when someone is not coping or needs support',
      'Takes the perspective of others into account',
      'Acknowledges the views of others',
      'Anticipates how others will react',
      'Balances results with others\' needs',
    ],
  },
  {
    id: 'authenticity', name: 'Authenticity',
    productive: 'Genuine', unproductive: 'Untrustworthy',
    behaviors: [
      'Openly expresses their thoughts and feelings',
      'Expresses themselves with sensitivity',
      'Facilitates robust discussion and debate',
      'Is honest about their own mistakes',
      'Honours commitments they make',
      'Encourages others to speak honestly',
      'Responds effectively when challenged',
    ],
  },
  {
    id: 'emotionalReasoning', name: 'Emotional Reasoning',
    productive: 'Expansive', unproductive: 'Limited',
    behaviors: [
      'Consults others before making decisions',
      'Explains the rationale behind their decisions',
      'Involves others in decisions that affect them',
      'Takes multiple perspectives into account',
      'Considers the bigger picture when deciding',
      'Reflects on feelings when making decisions',
      'Makes ethical decisions consistently',
    ],
  },
  {
    id: 'selfManagement', name: 'Self-Management',
    productive: 'Resilient', unproductive: 'Temperamental',
    behaviors: [
      'Manages emotions in difficult situations',
      'Maintains a positive demeanour',
      'Manages their time effectively',
      'Learns from their mistakes',
      'Stays aware of industry changes',
      'Strives to continuously improve',
      'Adapts quickly to new circumstances',
    ],
  },
  {
    id: 'inspiringPerformance', name: 'Inspiring Performance',
    productive: 'Empowering', unproductive: 'Demoralising',
    behaviors: [
      'Provides useful support and guidance',
      'Gives constructive feedback',
      'Helps others understand their purpose',
      'Notices and responds to inappropriate behaviour',
      'Maintains a positive work environment',
      'Facilitates career development',
      'Recognises hard work and effort',
    ],
  },
];

// ── STATE TRANSITIONS ────────────────────────────────────────

export function advanceTeamLoop(
  cycle: TeamLoopCycle,
  action: 'close_pulse' | 'generate_briefing' | 'commit_practice' | 'submit_reflection' | 'close_loop'
): TeamLoopCycle {
  const now = new Date();

  switch (action) {
    case 'close_pulse':
      if (cycle.state !== 'pulse_open') throw new Error(`Cannot close pulse in state: ${cycle.state}`);
      return { ...cycle, state: 'pulse_closed' };

    case 'generate_briefing':
      if (cycle.state !== 'pulse_closed') throw new Error(`Cannot generate briefing in state: ${cycle.state}`);
      return { ...cycle, state: 'briefing_ready', briefing_generated_at: now };

    case 'commit_practice':
      if (cycle.state !== 'briefing_ready') throw new Error(`Cannot commit practice in state: ${cycle.state}`);
      return { ...cycle, state: 'in_progress', practice_committed_at: now };

    case 'close_loop':
      if (cycle.state !== 'in_progress' && cycle.state !== 'loop_close_pending') {
        throw new Error(`Cannot close loop in state: ${cycle.state}`);
      }
      return { ...cycle, state: 'loop_close_pending', loop_closed_at: now };

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

export function advanceLeaderLoop(
  cycle: LeaderLoopCycle,
  action: 'arrive' | 'review_profile' | 'submit_reflection' | 'confirm_obp' | 'start_development'
): LeaderLoopCycle {
  const now = new Date();

  switch (action) {
    case 'arrive':
      if (cycle.state !== 'arrival') throw new Error(`Cannot arrive in state: ${cycle.state}`);
      return { ...cycle, arrival_at: now };

    case 'review_profile':
      if (cycle.state !== 'arrival') throw new Error(`Cannot review profile in state: ${cycle.state}`);
      return { ...cycle, state: 'profile_review', profile_reviewed_at: now };

    case 'submit_reflection':
      if (cycle.state !== 'profile_review') throw new Error(`Cannot submit reflection in state: ${cycle.state}`);
      return { ...cycle, state: 'insights', reflection_submitted_at: now };

    case 'confirm_obp':
      if (cycle.state !== 'insights') throw new Error(`Cannot confirm OBP in state: ${cycle.state}`);
      return { ...cycle, state: 'obp_selection', obp_confirmed_at: now };

    case 'start_development':
      if (cycle.state !== 'obp_selection') throw new Error(`Cannot start development in state: ${cycle.state}`);
      return { ...cycle, state: 'development_active', development_started_at: now };

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

// ── CYCLE FACTORY ────────────────────────────────────────────

export function createTeamLoopCycle(
  cycleId: number,
  facilityId: string,
  teamId: string,
  pulseOpenAt: Date,
  pulseCloseAt: Date,
): TeamLoopCycle {
  return {
    cycle_id: cycleId,
    facility_id: facilityId,
    team_id: teamId,
    state: 'pulse_open',
    pulse_open_at: pulseOpenAt,
    pulse_close_at: pulseCloseAt,
    briefing_generated_at: null,
    practice_committed_at: null,
    practice_id: null,
    practice_personalised: null,
    reflection_submitted_at: null,
    loop_closed_at: null,
    effectiveness_rating: null,
    hazard_scores: null,
    convergence_detected: false,
    convergence_data: null,
    prior_practice_id: null,
    prior_hazard_domain: null,
    prior_delta: null,
    prior_outcome: null,
  };
}

export function createLeaderLoopCycle(
  cycleId: number,
  facilityId: string,
  teamId: string,
  leaderId: string,
): LeaderLoopCycle {
  return {
    cycle_id: cycleId,
    facility_id: facilityId,
    team_id: teamId,
    leader_id: leaderId,
    state: 'arrival',
    arrival_emotion: null,
    arrival_at: null,
    profile_reviewed_at: null,
    reflection_text: null,
    reflection_submitted_at: null,
    obp_competency: null,
    obp_behavior: null,
    obp_personalised: null,
    obp_confirmed_at: null,
    development_started_at: null,
    micro_practice_id: null,
  };
}

// ── SCHEDULE HELPERS ─────────────────────────────────────────

/**
 * Calculate the next pulse open/close dates for a fortnightly cycle.
 * Pulse opens: Sunday 09:00 AEST
 * Pulse closes: 2 weeks later, Sunday 20:00 AEST
 */
export function getNextCycleDates(fromDate: Date = new Date()): { openAt: Date; closeAt: Date } {
  const d = new Date(fromDate);
  // Find next Sunday
  const daysUntilSunday = (7 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSunday);
  d.setHours(9, 0, 0, 0); // 09:00 AEST

  const closeDate = new Date(d);
  closeDate.setDate(closeDate.getDate() + 14);
  closeDate.setHours(20, 0, 0, 0); // 20:00 AEST

  return { openAt: d, closeAt: closeDate };
}

/**
 * Determine whether this is a Team Loop week or Leader Loop week.
 * Team Loop: pulse weeks (odd cycles)
 * Leader Loop: alternate weeks (even cycles)
 */
export function getActiveLoopType(cycleId: number): 'team' | 'leader' {
  return cycleId % 2 === 0 ? 'leader' : 'team';
}

// ── PSH DOMAIN CODES ─────────────────────────────────────────

export const PSH_DOMAINS = [
  'PSH_01', 'PSH_02', 'PSH_03', 'PSH_04', 'PSH_05', 'PSH_06',
  'PSH_07', 'PSH_08', 'PSH_09', 'PSH_10', 'PSH_11', 'PSH_12',
  'PSH_13', 'PSH_14', 'PSH_15', 'PSH_16',
] as const;

export type PSHDomain = typeof PSH_DOMAINS[number];

export const PSH_LABELS: Record<PSHDomain, string> = {
  PSH_01: 'High Job Demands',
  PSH_02: 'Lack of Support',
  PSH_03: 'Poor Organisational Justice',
  PSH_04: 'Low Job Control',
  PSH_05: 'Poor Relationships',
  PSH_06: 'Role Conflict',
  PSH_07: 'Poor Change Management',
  PSH_08: 'Traumatic Exposure',
  PSH_09: 'Remote / Isolated Work',
  PSH_10: 'Violence & Aggression',
  PSH_11: 'Harassment & Bullying',
  PSH_12: 'Emotional Demands',
  PSH_13: 'Low Recognition',
  PSH_14: 'Poor Physical Environment',
  PSH_15: 'Job Insecurity',
  PSH_16: 'Work-Life Imbalance',
};

// ── HAZARD CLASSIFICATION ────────────────────────────────────

export const HAZARD_THRESHOLDS = {
  GREEN: 0.35,    // healthy
  AMBER: 0.60,    // watch
  // > 0.60 = RED (act)
} as const;

export function classifyHazard(score: number): 'green' | 'amber' | 'red' {
  if (score <= HAZARD_THRESHOLDS.GREEN) return 'green';
  if (score <= HAZARD_THRESHOLDS.AMBER) return 'amber';
  return 'red';
}

export function getTrajectory(current: number, previous: number | null): 'improving' | 'stable' | 'declining' | 'acute' | 'unknown' {
  if (previous === null) return 'unknown';
  const delta = current - previous;
  if (delta <= -0.05) return 'improving';  // score decreased = hazard reducing
  if (delta >= 0.05) return 'declining';   // score increased = hazard growing
  // Check for acute jump
  if (classifyHazard(previous) === 'green' && classifyHazard(current) === 'red') return 'acute';
  return 'stable';
}
