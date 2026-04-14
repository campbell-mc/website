// lib/simulation/scenarios/multi-agent/index.ts
// 4 composed scenarios testing cross-agent coordination.

import { seedPressuredResidential, seedHealthyResidential } from '../../seed';
import type { Scenario } from '../../types';

const pressured = seedPressuredResidential();
const healthy = seedHealthyResidential();

export const multiAgentScenarios: Scenario[] = [

  // ── 17. SUNDAY PM STRUCTURAL GAP ──────────────────────────
  {
    id: 'multi-sunday-structural-gap-017',
    name: 'Sunday PM structural gap — Steward + Oracle + Town Crier',
    description: 'Steward detects structural agency dependency. Oracle quantifies cost. Town Crier should merge into one recommendation.',
    tier: 'composed', agents: ['sentinel', 'steward', 'oracle', 'town_crier'], care_type: 'residential', duration_ticks: 4,
    world: {
      ...pressured,
      workforce: { ...pressured.workforce, agency_pct: 22 },
      financial: { ...pressured.financial, agency_cost_week: 1920 },
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'steward', finding_type: 'agency_above_threshold', severity: 'urgent', max_ticks_to_detect: 1, description: 'Agency 22% — above 15% threshold. Steward identifies structural pattern.' },
        { agent: 'steward', finding_type: 'roster_gaps', severity: 'urgent', max_ticks_to_detect: 1, description: 'Active roster gap detected' },
        { agent: 'sentinel', finding_type: 'care_minutes_at_risk', severity: 'urgent', max_ticks_to_detect: 2, description: 'Care minutes below alert from pressured world state' },
        { agent: 'sentinel', finding_type: 'rn_gap_tonight', severity: 'immediate', max_ticks_to_detect: 2, description: 'Night RN not confirmed' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.25, actionability: 0.25, accuracy: 0.2, convergence: 0.15, completeness: 0.15 },
  },

  // ── 18. SIRS + CHRONICLER PIPELINE ─────────────────────────
  {
    id: 'multi-sirs-chronicler-018',
    name: 'SIRS incident → Sentinel classifies → Chronicler drafts',
    description: 'New fall incident logged at tick 1. Sentinel classifies as Cat 1. Chronicler should draft notification.',
    tier: 'composed', agents: ['sentinel', 'chronicler'], care_type: 'residential', duration_ticks: 6,
    world: healthy,
    events: [
      {
        tick: 1,
        type: 'sirs_event',
        description: 'Fall with injury logged — Wing B bathroom',
        payload: {
          action: 'add',
          item: {
            id: 'SIRS-SIM-NEW-001',
            category: 1,
            incident_type: 'Fall with injury',
            deadline: '2026-04-14T07:00:00',
            hours_remaining: 7,
            status: 'logged',
          },
        },
      },
    ],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'sirs_deadline_approaching', severity: 'immediate', max_ticks_to_detect: 5, description: 'SIRS Cat 1 deadline detected — under 24h' },
      ],
      expected_silence: [],
      expected_actions: [
        { type: 'chronicler_draft', description: 'Chronicler drafts SIRS Cat 1 notification' },
      ],
    },
    rubric: { timeliness: 0.3, actionability: 0.25, accuracy: 0.2, convergence: 0.0, completeness: 0.25 },
  },

  // ── 19. PSH CONVERGENCE + KEEPER ───────────────────────────
  {
    id: 'multi-psh-convergence-keeper-019',
    name: 'PSH convergence detected → Keeper flags precursor',
    description: 'PSH_01 + PSH_08 co-elevated. Sentinel detects convergence. Keeper flags turnover precursor.',
    tier: 'composed', agents: ['sentinel', 'keeper'], care_type: 'residential', duration_ticks: 4,
    world: {
      ...healthy,
      psh_scores: {
        'TEAM-001': { PSH_01: 0.71, PSH_02: 0.63, PSH_08: 0.68, PSH_13: 0.61 },
        'TEAM-002': { PSH_01: 0.48, PSH_02: 0.38, PSH_08: 0.36, PSH_13: 0.41 },
      },
      workforce: { ...healthy.workforce, turnover_pct: 30, credentials_expiring_30d: 0 },
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'psh_convergence', severity: 'urgent', max_ticks_to_detect: 2, description: 'PSH_01 + PSH_08 co-elevated in TEAM-001' },
        { agent: 'keeper', finding_type: 'turnover_precursor', severity: 'urgent', max_ticks_to_detect: 1, description: 'PSH_13 elevated — turnover precursor in TEAM-001' },
        { agent: 'keeper', finding_type: 'turnover_elevated', severity: 'routine', max_ticks_to_detect: 1, description: 'Turnover 30% above 28% alert threshold' },
      ],
      expected_silence: [
        { agent: 'sentinel', should_not_fire: 'TEAM-002' },
        { agent: 'keeper', should_not_fire: 'credentials_expiring' },
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.2, accuracy: 0.2, convergence: 0.3, completeness: 0.1 },
  },

  // ── 20. FULL DAY — 3 SIMULTANEOUS ISSUES ──────────────────
  {
    id: 'multi-full-day-020',
    name: 'Full day simulation — 3 simultaneous issues',
    description: 'RN gap at tick 2, SIRS Cat 2 deadline at tick 3, PSH convergence throughout. Tests prioritisation.',
    tier: 'integration', agents: ['sentinel', 'steward', 'keeper', 'chronicler', 'town_crier'], care_type: 'residential',
    duration_ticks: 12, // 6 hours simulated
    world: {
      ...pressured,
      sirs_open: [
        { id: 'SIRS-SIM-EXISTING', category: 2, incident_type: 'Medication error', deadline: '2026-04-17T00:00:00', hours_remaining: 72, status: 'assessed' },
      ],
    },
    events: [
      {
        tick: 2,
        type: 'roster_update',
        description: 'Morning RN calls in sick — cover needed',
        payload: { shift: 'morning', updates: { rn_confirmed: false, gaps: 1 }, care_minutes_impact: -12, rn_impact: -6 },
      },
      {
        tick: 4,
        type: 'sirs_event',
        description: 'SIRS Cat 2 deadline moves to urgent threshold',
        payload: { action: 'update', id: 'SIRS-SIM-EXISTING', updates: { hours_remaining: 160 } },
      },
      {
        tick: 6,
        type: 'roster_update',
        description: 'Agency RN confirmed for morning shift',
        payload: { shift: 'morning', updates: { rn_confirmed: true, gaps: 0, agency_count: 1 }, care_minutes_impact: 12, rn_impact: 6 },
      },
    ],
    ground_truth: {
      expected_findings: [
        // Sentinel should detect all three issues
        { agent: 'sentinel', finding_type: 'rn_gap_tonight', severity: 'immediate', max_ticks_to_detect: 3, description: 'Morning RN gap from callout at tick 2' },
        { agent: 'sentinel', finding_type: 'care_minutes_at_risk', severity: 'urgent', max_ticks_to_detect: 3, description: 'Care minutes drop from RN callout' },
        { agent: 'sentinel', finding_type: 'psh_convergence', severity: 'urgent', max_ticks_to_detect: 2, description: 'PSH convergence from pressured world' },
        // Steward should detect structural issues
        { agent: 'steward', finding_type: 'agency_above_threshold', severity: 'routine', max_ticks_to_detect: 1, description: 'Agency 18% above threshold' },
        { agent: 'steward', finding_type: 'roster_gaps', severity: 'urgent', max_ticks_to_detect: 1, description: 'Initial roster gaps in pressured world' },
        // Keeper should detect workforce signals
        { agent: 'keeper', finding_type: 'credentials_expiring', severity: 'urgent', max_ticks_to_detect: 1, description: '6 credentials expiring' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.25, actionability: 0.2, accuracy: 0.2, convergence: 0.15, completeness: 0.2 },
  },
];
