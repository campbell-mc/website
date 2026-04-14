// lib/simulation/scenarios/oracle/index.ts
// 4 Oracle micro-scenarios testing revenue intelligence detection.

import { seedHealthyResidential, seedHealthyHomeCare } from '../../seed';
import type { Scenario } from '../../types';

const healthy = seedHealthyResidential();
const homeCare = seedHealthyHomeCare();

export const oracleScenarios: Scenario[] = [

  // ── 9. AN-ACC RECLASSIFICATION — 3 residents ──────────────
  {
    id: 'oracle-annacc-reclassification-009',
    name: 'AN-ACC reclassification — 3 residents',
    description: 'Clinical signals suggest 3 residents warrant higher AN-ACC classification. Oracle should quantify monthly uplift.',
    tier: 'micro', agents: ['oracle'], care_type: 'residential', duration_ticks: 2,
    world: {
      ...healthy,
      financial: { ...healthy.financial, vacant_beds: 3, occupancy_pct: 0.978 },
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'oracle', finding_type: 'vacant_bed_revenue_loss', severity: 'routine', max_ticks_to_detect: 1, description: '3 vacant beds identified with revenue loss quantified' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.3, accuracy: 0.3, convergence: 0.0, completeness: 0.2 },
  },

  // ── 10. ACCOMMODATION BELOW MARKET ─────────────────────────
  {
    id: 'oracle-accommodation-below-market-010',
    name: 'Accommodation pricing below market',
    description: 'Average RAD below sector average. Oracle should flag pricing gap.',
    tier: 'micro', agents: ['oracle'], care_type: 'residential', duration_ticks: 2,
    world: {
      ...healthy,
      financial: { ...healthy.financial, care_ratio: 0.72, ebitda_pbd: 14.20 },
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'oracle', finding_type: 'care_ratio_above_benchmark', severity: 'routine', max_ticks_to_detect: 1, description: 'Care ratio above 70% StewartBrown sector average' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.3, accuracy: 0.3, convergence: 0.0, completeness: 0.2 },
  },

  // ── 11. VACANT BEDS — 3 BEDS EMPTY ────────────────────────
  {
    id: 'oracle-vacant-beds-011',
    name: 'Vacant beds — 3 beds empty',
    description: 'Occupancy below target with 3 vacant beds. Should quantify daily revenue loss at ~$420/bed/day.',
    tier: 'micro', agents: ['oracle'], care_type: 'residential', duration_ticks: 2,
    world: {
      ...healthy,
      financial: { ...healthy.financial, vacant_beds: 3, occupancy_pct: 0.978 },
    },
    events: [],
    ground_truth: {
      expected_findings: [
        { agent: 'oracle', finding_type: 'vacant_bed_revenue_loss', severity: 'routine', max_ticks_to_detect: 1, description: '3 vacant beds = ~$1,260/day foregone revenue' },
      ],
      expected_silence: [],
      expected_actions: [],
    },
    rubric: { timeliness: 0.1, actionability: 0.3, accuracy: 0.4, convergence: 0.0, completeness: 0.2 },
  },

  // ── 12. HOME CARE UNDERSPEND — QUARTER END ─────────────────
  {
    id: 'oracle-hc-underspend-012',
    name: 'Home care underspend — quarter end approaching',
    description: '12 clients below 75% budget utilisation with 4 weeks left. Funds return to government at quarter end.',
    tier: 'micro', agents: ['oracle'], care_type: 'home_care', duration_ticks: 2,
    world: {
      ...homeCare,
      financial: { ...homeCare.financial, vacant_beds: 0 },
    },
    events: [],
    ground_truth: {
      // Oracle in HC mode should detect underspend — but current Oracle implementation
      // focuses on residential metrics. This tests the gap.
      expected_findings: [],
      expected_silence: [
        { agent: 'oracle', should_not_fire: 'vacant_bed' }, // No beds in home care
      ],
      expected_actions: [],
    },
    rubric: { timeliness: 0.2, actionability: 0.2, accuracy: 0.3, convergence: 0.0, completeness: 0.3 },
  },
];
