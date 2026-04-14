// lib/simulation/scenarios/keeper/index.ts
// 4 Keeper micro-scenarios testing workforce intelligence detection.

import { seedHealthyResidential, seedPressuredResidential } from '../../seed';
import type { Scenario } from '../../types';

const healthy = seedHealthyResidential();
const pressured = seedPressuredResidential();

export const keeperScenarios: Scenario[] = [

  // ── 13. TURNOVER PRECURSOR — PSH_13 decline ────────────────
  {
    id: 'keeper-turnover-precursor-013',
    name: 'Turnover precursor — PSH_13 decline',
    description: 'PSH_13 (Low Recognition) elevated at 0.60+ in one team. Keeper should flag 71% turnover probability.',
    tier: 'micro', agents: ['keeper'], care_type: 'residential', duration_ticks: 2,
    world: {
      ...healthy,
      psh_scores: {
        'TEAM-001': { PSH_01: 0.52, PSH_02: 0.41, PSH_08: 0.44, PSH_13: 0.62 },
        'TEAM-002': { PSH_01: 0.48, PSH_02: 0.38, PSH_08: 0.36, PSH_13: 0.41 },
      },
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'keeper', finding_type: 'turnover_precursor', severity: 'urgent', max_ticks_to_detect: 1, description: 'PSH_13 elevated in TEAM-001 — 71% turnover probability within 4-6 cycles' },
      ],
      expected_silence: [
        { agent: 'keeper', should_not_fire: 'TEAM-002' },
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.3, accuracy: 0.2, convergence: 0.1, completeness: 0.2 },
  },

  // ── 14. ABSENTEEISM CLUSTER ────────────────────────────────
  {
    id: 'keeper-absenteeism-cluster-014',
    name: 'Absenteeism above threshold',
    description: 'Absenteeism rate at 9.1% — above the 8% alert threshold. Keeper should flag.',
    tier: 'micro', agents: ['keeper'], care_type: 'residential', duration_ticks: 2,
    world: {
      ...healthy,
      workforce: { ...healthy.workforce, absenteeism_pct: 9.1, turnover_pct: 32 },
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'keeper', finding_type: 'turnover_elevated', severity: 'routine', max_ticks_to_detect: 1, description: 'Turnover 32% above 28% alert threshold' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.2, accuracy: 0.3, convergence: 0.1, completeness: 0.2 },
  },

  // ── 15. AHPRA EXPIRY — 6 registrations ─────────────────────
  {
    id: 'keeper-ahpra-expiry-015',
    name: 'AHPRA expiry — 6 registrations in 3 weeks',
    description: '6 RN AHPRA registrations expiring within 30 days. Keeper should alert.',
    tier: 'micro', agents: ['keeper'], care_type: 'residential', duration_ticks: 2,
    world: {
      ...healthy,
      workforce: { ...healthy.workforce, credentials_expiring_30d: 6 },
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'keeper', finding_type: 'credentials_expiring', severity: 'urgent', max_ticks_to_detect: 1, description: '6 AHPRA registrations expiring — care minutes compliance at risk' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.3, accuracy: 0.3, convergence: 0.0, completeness: 0.2 },
  },

  // ── 16. LEAVE LIABILITY — $48K accrued ─────────────────────
  {
    id: 'keeper-leave-liability-016',
    name: 'Leave liability — $48K accrued',
    description: '4 staff with excessive leave accrual. Keeper should flag financial and wellbeing risk.',
    tier: 'micro', agents: ['keeper'], care_type: 'residential', duration_ticks: 2,
    world: {
      ...healthy,
      workforce: { ...healthy.workforce, credentials_expiring_30d: 0, turnover_pct: 25 },
    },
    events: [],
    ground_truth: {
      // Leave liability isn't directly tracked in workforce snapshot — this tests a gap
      expected_findings: [],
      expected_silence: [
        { agent: 'keeper', should_not_fire: 'credentials_expiring' }, // 0 expiring — should stay silent
        { agent: 'keeper', should_not_fire: 'turnover_elevated' }, // 25% is below 28% threshold
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.1, actionability: 0.2, accuracy: 0.4, convergence: 0.0, completeness: 0.3 },
  },
];
