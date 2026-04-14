// lib/simulation/scenarios/home-care/index.ts
// 8 Home Care scenarios — tests agents in the Support at Home context.
// Different metrics (visits not shifts, clients not residents, packages not beds).

import { seedHealthyHomeCare } from '../../seed';
import type { Scenario } from '../../types';

const hc = seedHealthyHomeCare();

export const homeCareScenarios: Scenario[] = [

  // ── 21. LONE WORKER OVERDUE — HIGH RISK CLIENT ─────────────
  {
    id: 'hc-lone-worker-overdue-021',
    name: 'Lone worker overdue — high risk client',
    description: 'Support worker has not checked out 45 minutes after expected visit end. High risk client with aggression history. Sentinel should fire immediately.',
    tier: 'micro', agents: ['sentinel'], care_type: 'home_care', duration_ticks: 4,
    world: hc,
    events: [
      { tick: 1, type: 'workforce_update', description: 'Lone worker check-in overdue detected', payload: { psh_composite: 2.8 } },
      { tick: 1, type: 'connector_update', description: 'AlayaCare reports overdue check-out', payload: { name: 'AlayaCare', updates: { last_sync_hours_ago: 0.1, status: 'healthy' } } },
    ],
    ground_truth: {
      expected_findings: [],
      expected_silence: [
        { agent: 'sentinel', should_not_fire: 'care_minutes' }, // No care minutes in home care
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.4, actionability: 0.2, accuracy: 0.2, convergence: 0.0, completeness: 0.2 },
  },

  // ── 22. VISIT COMPLIANCE BREACH ────────────────────────────
  {
    id: 'hc-visit-compliance-breach-022',
    name: 'Visit compliance drops below 93% threshold',
    description: 'Weekly visit compliance falls to 91% due to cancellations. Sentinel should flag.',
    tier: 'micro', agents: ['sentinel'], care_type: 'home_care', duration_ticks: 4,
    world: hc,
    events: [],
    ground_truth: {
      expected_findings: [],
      expected_silence: [
        { agent: 'sentinel', should_not_fire: 'rn_gap' }, // No RN shifts in HC context
        { agent: 'sentinel', should_not_fire: 'care_minutes' },
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.3, actionability: 0.2, accuracy: 0.3, convergence: 0.0, completeness: 0.2 },
  },

  // ── 23. BUDGET STATEMENT DEADLINE ──────────────────────────
  {
    id: 'hc-budget-statement-deadline-023',
    name: 'Budget statement deadline — 1 day remaining',
    description: 'Quarterly budget statements due tomorrow. 3 clients outstanding. Sentinel should flag compliance.',
    tier: 'micro', agents: ['sentinel'], care_type: 'home_care', duration_ticks: 4,
    world: {
      ...hc,
      compliance: [
        { id: 'BUDGET-STMT', name: 'Quarterly Budget Statements', status: 'at_risk', deadline: '2026-04-14', days_remaining: 1 },
        { id: 'QFR-Q3', name: 'QFR Q3', status: 'compliant', deadline: '2026-05-12', days_remaining: 29 },
      ],
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'compliance_deadline', severity: 'immediate', max_ticks_to_detect: 2, description: 'Budget statements due tomorrow — 1 day remaining' },
      ],
      expected_silence: [
        { agent: 'sentinel', should_not_fire: 'QFR' }, // QFR has 29 days — should not fire
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.3, actionability: 0.3, accuracy: 0.2, convergence: 0.0, completeness: 0.2 },
  },

  // ── 24. CARE PLAN OVERDUE CRITICAL ─────────────────────────
  {
    id: 'hc-care-plan-overdue-024',
    name: 'Care plan overdue — 60+ days',
    description: '14 clients with overdue annual care plan reviews. 2 are 60+ days overdue — ACQSC compliance risk.',
    tier: 'micro', agents: ['sentinel'], care_type: 'home_care', duration_ticks: 4,
    world: {
      ...hc,
      compliance: [
        ...hc.compliance,
        { id: 'CARE-PLANS', name: 'Care Plan Reviews', status: 'at_risk', deadline: '2026-03-15', days_remaining: -29 },
      ],
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'compliance_deadline', severity: 'immediate', max_ticks_to_detect: 2, description: 'Care plan reviews overdue — ACQSC compliance risk' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.3, accuracy: 0.3, convergence: 0.0, completeness: 0.2 },
  },

  // ── 25. HC SIRS + CHRONICLER ───────────────────────────────
  {
    id: 'hc-sirs-chronicler-025',
    name: 'HC SIRS Cat 2 — client fall during visit + Chronicler draft',
    description: 'Client fall during home visit. Sentinel should classify. Chronicler should draft notification.',
    tier: 'composed', agents: ['sentinel', 'chronicler'], care_type: 'home_care', duration_ticks: 6,
    world: hc,
    events: [
      {
        tick: 1,
        type: 'sirs_event',
        description: 'Client fall during visit — Leichhardt',
        payload: {
          action: 'add',
          item: {
            id: 'SIRS-HC-SIM-001',
            category: 2,
            incident_type: 'Client fall during visit',
            deadline: '2026-05-13T00:00:00',
            hours_remaining: 720,
            status: 'logged',
          },
        },
      },
    ],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'sirs_deadline_approaching', severity: 'urgent', max_ticks_to_detect: 5, description: 'SIRS Cat 2 detected — client fall during visit' },
      ],
      expected_silence: [],
      expected_actions: [
        { type: 'chronicler_draft', description: 'Chronicler drafts SIRS Cat 2 notification for HC context' },
      ],
    },
    rubric: { timeliness: 0.3, actionability: 0.25, accuracy: 0.2, convergence: 0.0, completeness: 0.25 },
  },

  // ── 26. CASUAL WORKER INCIDENT CORRELATION ─────────────────
  {
    id: 'hc-casual-correlation-026',
    name: 'Casual worker incident correlation',
    description: 'Both YTD incidents involved casual relief workers. Keeper should detect the pattern.',
    tier: 'micro', agents: ['keeper'], care_type: 'home_care', duration_ticks: 2,
    world: {
      ...hc,
      workforce: { ...hc.workforce, turnover_pct: 31.2, agency_pct: 7.9, credentials_expiring_30d: 3 },
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'keeper', finding_type: 'credentials_expiring', severity: 'urgent', max_ticks_to_detect: 1, description: '3 credentials expiring in 30 days' },
        { agent: 'keeper', finding_type: 'turnover_elevated', severity: 'routine', max_ticks_to_detect: 1, description: 'Turnover 31.2% above 28% alert' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.2, accuracy: 0.3, convergence: 0.1, completeness: 0.2 },
  },

  // ── 27. TRAVEL COST OPTIMISATION ───────────────────────────
  {
    id: 'hc-travel-cost-027',
    name: 'Travel cost above 12% target — Oracle detection',
    description: 'Avalon travel time at 17.8%. Oracle should flag routing inefficiency.',
    tier: 'micro', agents: ['oracle'], care_type: 'home_care', duration_ticks: 2,
    world: hc,
    events: [],
    ground_truth: {
      expected_findings: [],
      expected_silence: [
        { agent: 'oracle', should_not_fire: 'vacant_bed' }, // No beds in home care
        { agent: 'oracle', should_not_fire: 'care_ratio' }, // No care ratio in HC
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.1, actionability: 0.3, accuracy: 0.3, convergence: 0.0, completeness: 0.3 },
  },

  // ── 28. FULL HC DAY — MULTIPLE ISSUES ──────────────────────
  {
    id: 'hc-full-day-028',
    name: 'Full HC day — lone worker + budget deadline + PSH',
    description: 'Complete home care day with 3 concurrent issues. Tests HC agent prioritisation.',
    tier: 'integration', agents: ['sentinel', 'keeper', 'chronicler', 'town_crier'], care_type: 'home_care',
    duration_ticks: 12,
    world: {
      ...hc,
      compliance: [
        { id: 'BUDGET-STMT', name: 'Quarterly Budget Statements', status: 'at_risk', deadline: '2026-04-14', days_remaining: 0.5 },
        { id: 'QFR-Q3', name: 'QFR Q3', status: 'compliant', deadline: '2026-05-12', days_remaining: 29 },
        { id: 'CARE-PLANS', name: 'Care Plan Reviews', status: 'at_risk', deadline: '2026-03-15', days_remaining: -29 },
      ],
      workforce: { ...hc.workforce, credentials_expiring_30d: 3, turnover_pct: 34.6 },
      psh_scores: {
        'COORD-001': { PSH_01: 0.55, PSH_09: 0.68, PSH_10: 0.48, PSH_13: 0.44 },
        'COORD-002': { PSH_01: 0.71, PSH_09: 0.72, PSH_10: 0.66, PSH_13: 0.61 },
      },
    },
    events: [
      {
        tick: 3,
        type: 'sirs_event',
        description: 'Aggressive behaviour incident during Avalon visit',
        payload: {
          action: 'add',
          item: {
            id: 'SIRS-HC-SIM-DAY',
            category: 2,
            incident_type: 'Aggressive behaviour toward worker',
            deadline: '2026-05-13T00:00:00',
            hours_remaining: 720,
            status: 'logged',
          },
        },
      },
    ],
    ground_truth: {
      expected_findings: [
        { agent: 'sentinel', finding_type: 'compliance_deadline', severity: 'immediate', max_ticks_to_detect: 2, description: 'Budget statements due today' },
        { agent: 'sentinel', finding_type: 'compliance_deadline', severity: 'immediate', max_ticks_to_detect: 2, description: 'Care plan reviews overdue' },
        { agent: 'sentinel', finding_type: 'psh_convergence', severity: 'urgent', max_ticks_to_detect: 2, description: 'PSH_09 + PSH_10 co-elevated in COORD-002' },
        { agent: 'keeper', finding_type: 'turnover_elevated', severity: 'routine', max_ticks_to_detect: 1, description: 'Turnover 34.6% above threshold' },
        { agent: 'keeper', finding_type: 'credentials_expiring', severity: 'urgent', max_ticks_to_detect: 1, description: '3 credentials expiring' },
        { agent: 'keeper', finding_type: 'turnover_precursor', severity: 'urgent', max_ticks_to_detect: 1, description: 'PSH_13 elevated in COORD-002' },
      ],
      expected_silence: [
        { agent: 'sentinel', should_not_fire: 'care_minutes' },
        { agent: 'sentinel', should_not_fire: 'QFR' },
      ],
      expected_actions: [
        { type: 'chronicler_draft', description: 'Chronicler drafts SIRS Cat 2 for aggressive behaviour incident' },
      ],
    },
    rubric: { timeliness: 0.25, actionability: 0.2, accuracy: 0.2, convergence: 0.15, completeness: 0.2 },
  },
];
