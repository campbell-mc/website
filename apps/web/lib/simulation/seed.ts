// lib/simulation/seed.ts
// Deterministic seed data generators for simulation scenarios.
// Each function returns a complete ScenarioWorld for a specific facility type.

import type { ScenarioWorld } from './types';

/**
 * Seed a healthy residential facility.
 * All metrics within normal ranges. Good baseline for single-issue scenarios.
 */
export function seedHealthyResidential(): ScenarioWorld {
  return {
    facility: { id: 'SIM-RES-001', name: 'Simulation Residential', beds: 137, care_type: 'residential' },
    roster: [
      { shift: 'morning', total_rostered: 8, gaps: 0, rn_confirmed: true, agency_count: 1 },
      { shift: 'afternoon', total_rostered: 7, gaps: 0, rn_confirmed: true, agency_count: 0 },
      { shift: 'night', total_rostered: 5, gaps: 0, rn_confirmed: true, agency_count: 0 },
    ],
    care_minutes: { projected_total: 205, rn_minutes: 42, compliant: true },
    psh_scores: {
      'TEAM-001': { PSH_01: 0.52, PSH_02: 0.41, PSH_08: 0.44, PSH_13: 0.48 },
      'TEAM-002': { PSH_01: 0.48, PSH_02: 0.38, PSH_08: 0.36, PSH_13: 0.41 },
      'TEAM-003': { PSH_01: 0.55, PSH_02: 0.46, PSH_08: 0.42, PSH_13: 0.50 },
    },
    sirs_open: [],
    compliance: [
      { id: 'QI-Q2', name: 'QI Q2 submission', status: 'compliant', deadline: '2026-04-21', days_remaining: 8 },
      { id: 'QFR-Q3', name: 'QFR Q3 submission', status: 'compliant', deadline: '2026-05-12', days_remaining: 29 },
    ],
    workforce: { total_staff: 273, agency_pct: 11, turnover_pct: 26, absenteeism_pct: 6.8, credentials_expiring_30d: 2, psh_composite: 2.8 },
    financial: { ebitda_pbd: 18.68, care_ratio: 0.52, occupancy_pct: 0.99, agency_cost_week: 480, vacant_beds: 2 },
    connectors: [
      { name: 'Deputy', last_sync_hours_ago: 1, status: 'healthy' },
      { name: 'AlayaCare', last_sync_hours_ago: 2, status: 'healthy' },
      { name: 'ELMO', last_sync_hours_ago: 3, status: 'healthy' },
    ],
  };
}

/**
 * Seed a facility under pressure.
 * Multiple metrics at alert thresholds. Good for multi-signal scenarios.
 */
export function seedPressuredResidential(): ScenarioWorld {
  return {
    ...seedHealthyResidential(),
    roster: [
      { shift: 'morning', total_rostered: 8, gaps: 0, rn_confirmed: true, agency_count: 2 },
      { shift: 'afternoon', total_rostered: 7, gaps: 1, rn_confirmed: true, agency_count: 1 },
      { shift: 'night', total_rostered: 5, gaps: 0, rn_confirmed: false, agency_count: 0 },
    ],
    care_minutes: { projected_total: 188, rn_minutes: 38, compliant: false },
    psh_scores: {
      'TEAM-001': { PSH_01: 0.71, PSH_02: 0.63, PSH_08: 0.68, PSH_13: 0.54 },
      'TEAM-002': { PSH_01: 0.48, PSH_02: 0.38, PSH_08: 0.36, PSH_13: 0.41 },
      'TEAM-003': { PSH_01: 0.69, PSH_02: 0.51, PSH_08: 0.62, PSH_13: 0.48 },
    },
    workforce: { total_staff: 273, agency_pct: 18, turnover_pct: 32, absenteeism_pct: 9.1, credentials_expiring_30d: 6, psh_composite: 3.4 },
    financial: { ebitda_pbd: 12.30, care_ratio: 0.71, occupancy_pct: 0.97, agency_cost_week: 1440, vacant_beds: 4 },
  };
}

/**
 * Seed a healthy home care service.
 */
export function seedHealthyHomeCare(): ScenarioWorld {
  return {
    facility: { id: 'SIM-HC-001', name: 'Simulation Home Care', beds: 0, care_type: 'home_care' },
    roster: [], // Home care uses visit schedules, not shifts
    care_minutes: { projected_total: 0, rn_minutes: 0, compliant: true }, // Not applicable to HC
    psh_scores: {
      'COORD-001': { PSH_01: 0.55, PSH_09: 0.62, PSH_10: 0.48, PSH_13: 0.44 },
      'COORD-002': { PSH_01: 0.51, PSH_09: 0.58, PSH_10: 0.42, PSH_13: 0.41 },
    },
    sirs_open: [],
    compliance: [
      { id: 'QFR-Q3', name: 'QFR Q3', status: 'compliant', deadline: '2026-05-12', days_remaining: 29 },
      { id: 'BUDGET-STMT', name: 'Quarterly Budget Statements', status: 'at_risk', deadline: '2026-04-14', days_remaining: 1 },
    ],
    workforce: { total_staff: 89, agency_pct: 7.9, turnover_pct: 31.2, absenteeism_pct: 6.4, credentials_expiring_30d: 3, psh_composite: 3.1 },
    financial: { ebitda_pbd: 0, care_ratio: 0, occupancy_pct: 0, agency_cost_week: 320, vacant_beds: 0 },
    connectors: [
      { name: 'AlayaCare', last_sync_hours_ago: 0.5, status: 'healthy' },
      { name: 'EmploymentHero', last_sync_hours_ago: 1, status: 'healthy' },
    ],
  };
}
