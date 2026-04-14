// lib/simulation/scenarios/sentinel/index.ts
// 8 Sentinel micro-scenarios testing care minutes, SIRS, connectors, compliance, PSH convergence.

import { seedHealthyResidential, seedPressuredResidential } from '../../seed';
import type { Scenario } from '../../types';

const healthy = seedHealthyResidential();
const pressured = seedPressuredResidential();

export const sentinelScenarios: Scenario[] = [

  // ── 1. CARE MINUTES BREACH — RN gap ────────────────────────
  {
    id: 'sentinel-care-minutes-breach-001',
    name: 'Care minutes breach — evening RN gap',
    description: 'RN calls in sick at tick 2. Projected minutes drop below 200. Sentinel should alert immediately.',
    tier: 'micro', agents: ['sentinel'], care_type: 'residential', duration_ticks: 6,
    world: healthy,
    events: [
      { tick: 2, type: 'roster_update', description: 'Evening RN calls in sick', payload: { shift: 'afternoon', updates: { rn_confirmed: false, gaps: 1 }, care_minutes_impact: -14, rn_impact: -8 } },
    ],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'care_minutes_at_risk', severity: 'urgent', max_ticks_to_detect: 3, description: 'Projected care minutes below 200 after RN callout' },
        { agent: 'sentinel', finding_type: 'rn_gap_tonight', severity: 'immediate', max_ticks_to_detect: 3, description: 'No RN confirmed for afternoon shift' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.3, actionability: 0.2, accuracy: 0.2, convergence: 0.1, completeness: 0.2 },
  },

  // ── 2. CARE MINUTES SAFE — agency confirmed (false positive test) ──
  {
    id: 'sentinel-care-minutes-safe-002',
    name: 'Care minutes safe — agency confirmed',
    description: 'RN gap appears at tick 2 but agency fills at tick 3. Sentinel should NOT alert after tick 3.',
    tier: 'micro', agents: ['sentinel'], care_type: 'residential', duration_ticks: 6,
    world: healthy,
    events: [
      { tick: 2, type: 'roster_update', description: 'RN gap appears', payload: { shift: 'afternoon', updates: { rn_confirmed: false, gaps: 1 }, care_minutes_impact: -14, rn_impact: -8 } },
      { tick: 3, type: 'roster_update', description: 'Agency RN confirmed', payload: { shift: 'afternoon', updates: { rn_confirmed: true, gaps: 0, agency_count: 1 }, care_minutes_impact: 14, rn_impact: 8 } },
    ],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'rn_gap_tonight', severity: 'immediate', max_ticks_to_detect: 3, description: 'Brief RN gap detected before agency confirmation' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.2, accuracy: 0.3, convergence: 0.1, completeness: 0.2 },
  },

  // ── 3. SIRS CAT 1 — 6 hours remaining ─────────────────────
  {
    id: 'sentinel-sirs-cat1-deadline-003',
    name: 'SIRS Cat 1 — 6 hours remaining',
    description: 'Open SIRS Cat 1 item approaches 6-hour deadline. Sentinel should escalate to immediate.',
    tier: 'micro', agents: ['sentinel'], care_type: 'residential', duration_ticks: 8,
    world: {
      ...healthy,
      sirs_open: [
        { id: 'SIRS-SIM-001', category: 1, incident_type: 'Fall with injury', deadline: '2026-04-14T00:00:00', hours_remaining: 8, status: 'draft_ready' },
      ],
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'sirs_deadline_approaching', severity: 'immediate', max_ticks_to_detect: 4, description: 'SIRS Cat 1 deadline approaching — under 6 hours' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.4, actionability: 0.2, accuracy: 0.2, convergence: 0.0, completeness: 0.2 },
  },

  // ── 4. SIRS CAT 2 — 7 days remaining ──────────────────────
  {
    id: 'sentinel-sirs-cat2-deadline-004',
    name: 'SIRS Cat 2 — 7 days remaining',
    description: 'Open SIRS Cat 2 approaching 7-day warning threshold.',
    tier: 'micro', agents: ['sentinel'], care_type: 'residential', duration_ticks: 4,
    world: {
      ...healthy,
      sirs_open: [
        { id: 'SIRS-SIM-002', category: 2, incident_type: 'Medication error', deadline: '2026-04-17T00:00:00', hours_remaining: 70, status: 'assessed' },
      ],
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'sirs_deadline_approaching', severity: 'urgent', max_ticks_to_detect: 4, description: 'SIRS Cat 2 within 7-day warning window' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.3, actionability: 0.2, accuracy: 0.3, convergence: 0.0, completeness: 0.2 },
  },

  // ── 5. CONNECTOR STALE — 12 hours ─────────────────────────
  {
    id: 'sentinel-connector-stale-005',
    name: 'Connector stale — 12 hours',
    description: 'Deputy data not refreshed for 12+ hours. Should flag connector health.',
    tier: 'micro', agents: ['sentinel'], care_type: 'residential', duration_ticks: 4,
    world: {
      ...healthy,
      connectors: [
        { name: 'Deputy', last_sync_hours_ago: 11, status: 'healthy' },
        { name: 'AlayaCare', last_sync_hours_ago: 2, status: 'healthy' },
      ],
    },
    events: [],  // Time advancing will push Deputy past 12h
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'connector_stale', severity: 'routine', max_ticks_to_detect: 4, description: 'Deputy data stale — over 12 hours since last sync' },
      ],
      expected_silence: [
        { agent: 'sentinel', should_not_fire: 'AlayaCare' },
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.2, accuracy: 0.3, convergence: 0.0, completeness: 0.3 },
  },

  // ── 6. COMPLIANCE — QI due 3 days ─────────────────────────
  {
    id: 'sentinel-compliance-qi-due-006',
    name: 'Compliance — QI due in 3 days',
    description: 'QI submission deadline approaching. Should surface in compliance scan.',
    tier: 'micro', agents: ['sentinel'], care_type: 'residential', duration_ticks: 4,
    world: {
      ...healthy,
      compliance: [
        { id: 'QI-Q2', name: 'QI Q2 submission', status: 'at_risk', deadline: '2026-04-16', days_remaining: 2.5 },
        { id: 'QFR-Q3', name: 'QFR Q3', status: 'compliant', deadline: '2026-05-12', days_remaining: 29 },
      ],
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'compliance_deadline', severity: 'urgent', max_ticks_to_detect: 2, description: 'QI Q2 submission due in under 3 days' },
      ],
      expected_silence: [
        { agent: 'sentinel', should_not_fire: 'QFR' },
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.3, actionability: 0.2, accuracy: 0.3, convergence: 0.0, completeness: 0.2 },
  },

  // ── 7. PSH CONVERGENCE — 2 domains elevated ───────────────
  {
    id: 'sentinel-psh-convergence-007',
    name: 'PSH convergence — 2 domains elevated',
    description: 'PSH_01 + PSH_08 both above 0.65 threshold in TEAM-001. Should detect convergence.',
    tier: 'micro', agents: ['sentinel'], care_type: 'residential', duration_ticks: 4,
    world: {
      ...healthy,
      psh_scores: {
        'TEAM-001': { PSH_01: 0.71, PSH_02: 0.41, PSH_08: 0.68, PSH_13: 0.48 },
        'TEAM-002': { PSH_01: 0.48, PSH_02: 0.38, PSH_08: 0.36, PSH_13: 0.41 },
      },
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'psh_convergence', severity: 'urgent', max_ticks_to_detect: 2, description: 'PSH_01 + PSH_08 co-elevated in TEAM-001' },
      ],
      expected_silence: [
        { agent: 'sentinel', should_not_fire: 'TEAM-002' },
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.2, accuracy: 0.2, convergence: 0.3, completeness: 0.1 },
  },

  // ── 8. MULTIPLE SIGNALS — no false merge ───────────────────
  {
    id: 'sentinel-multiple-signals-008',
    name: 'Multiple signals — no false merge',
    description: 'Two unrelated issues: care minutes gap AND connector stale. Should surface separately.',
    tier: 'micro', agents: ['sentinel'], care_type: 'residential', duration_ticks: 4,
    world: {
      ...pressured,
      connectors: [
        { name: 'Deputy', last_sync_hours_ago: 13, status: 'stale' },
        { name: 'AlayaCare', last_sync_hours_ago: 2, status: 'healthy' },
      ],
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'care_minutes_at_risk', severity: 'urgent', max_ticks_to_detect: 2, description: 'Care minutes below alert threshold' },
        { agent: 'sentinel', finding_type: 'connector_stale', severity: 'routine', max_ticks_to_detect: 2, description: 'Deputy data stale' },
        { agent: 'sentinel', finding_type: 'rn_gap_tonight', severity: 'immediate', max_ticks_to_detect: 2, description: 'Night RN not confirmed' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.2, accuracy: 0.2, convergence: 0.1, completeness: 0.3 },
  },
];
