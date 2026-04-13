// lib/simulation/types.ts
// All types for the CHRIS Agent Simulation Engine.
// Scenarios are JSON-serializable configs — no code, just data.
// Agents are invoked through the same interfaces they use in production.

import type { AgentType } from '@/lib/librarian/types';

// ── SCENARIO ─────────────────────────────────────────────────

export interface Scenario {
  id: string;
  name: string;
  description: string;
  tier: 'micro' | 'composed' | 'integration';
  agents: AgentType[];
  care_type: 'residential' | 'home_care';
  duration_ticks: number;         // each tick = 30 minutes sim time

  world: ScenarioWorld;
  events: ScenarioEvent[];
  ground_truth: GroundTruth;
  rubric: ScoringRubric;
}

export interface ScenarioWorld {
  facility: { id: string; name: string; beds: number; care_type: string };
  roster: SimRosterShift[];
  care_minutes: { projected_total: number; rn_minutes: number; compliant: boolean };
  psh_scores: Record<string, Record<string, number>>;  // team_id → { PSH_01: 0.68, ... }
  sirs_open: SimSIRSItem[];
  compliance: SimComplianceItem[];
  workforce: SimWorkforce;
  financial: SimFinancial;
  connectors: SimConnector[];
}

export interface SimRosterShift {
  shift: 'morning' | 'afternoon' | 'night';
  total_rostered: number;
  gaps: number;
  rn_confirmed: boolean;
  agency_count: number;
}

export interface SimSIRSItem {
  id: string;
  category: 1 | 2;
  incident_type: string;
  deadline: string;              // ISO date
  hours_remaining: number;
  status: 'logged' | 'assessed' | 'draft_ready';
}

export interface SimComplianceItem {
  id: string;
  name: string;
  status: 'compliant' | 'at_risk' | 'overdue';
  deadline: string;
  days_remaining: number;
}

export interface SimWorkforce {
  total_staff: number;
  agency_pct: number;
  turnover_pct: number;
  absenteeism_pct: number;
  credentials_expiring_30d: number;
  psh_composite: number;
}

export interface SimFinancial {
  ebitda_pbd: number;
  care_ratio: number;
  occupancy_pct: number;
  agency_cost_week: number;
  vacant_beds: number;
}

export interface SimConnector {
  name: string;
  last_sync_hours_ago: number;
  status: 'healthy' | 'stale' | 'error';
}

// ── EVENTS ───────────────────────────────────────────────────

export interface ScenarioEvent {
  tick: number;
  type: EventType;
  description: string;
  payload: Record<string, unknown>;
}

export type EventType =
  | 'roster_update'        // shift change, agency confirmation, callout
  | 'care_minutes_update'  // projected minutes change
  | 'sirs_event'           // new incident or deadline change
  | 'psh_update'           // PSH score change
  | 'compliance_update'    // deadline approaching or met
  | 'connector_update'     // connector status change
  | 'workforce_update'     // staff change, credential expiry
  | 'financial_update'     // financial metric change
  | 'incident_logged'      // new incident
  | 'complaint_logged';    // new complaint

// ── GROUND TRUTH ─────────────────────────────────────────────

export interface GroundTruth {
  expected_findings: ExpectedFinding[];
  expected_silence: ExpectedSilence[];
  expected_actions: ExpectedAction[];
}

export interface ExpectedFinding {
  agent: AgentType;
  finding_type: string;          // matches SentinelFinding.type, OracleOpportunity.type, etc
  severity: 'immediate' | 'urgent' | 'routine';
  max_ticks_to_detect: number;
  description: string;
}

export interface ExpectedSilence {
  agent: AgentType;
  should_not_fire: string;       // description of false positive to avoid
}

export interface ExpectedAction {
  type: 'chronicler_draft' | 'queue_item' | 'narrative_refresh' | 'agent_coordination';
  description: string;
}

// ── SCORING ──────────────────────────────────────────────────

export interface ScoringRubric {
  timeliness: number;            // weight 0-1
  actionability: number;
  accuracy: number;
  convergence: number;
  completeness: number;
}

// ── RESULTS ──────────────────────────────────────────────────

export interface AgentFinding {
  agent: AgentType;
  type: string;
  severity: string;
  title: string;
  detail: string;
  tick: number;
}

export interface AgentAction {
  agent: AgentType;
  type: string;
  description: string;
  tick: number;
}

export interface ScenarioResult {
  scenario: Scenario;
  findings: AgentFinding[];
  actions: AgentAction[];
  ticks_run: number;
  duration_ms: number;
  error?: string;
}

export interface Detection {
  expected: ExpectedFinding;
  found: boolean;
  tick_detected?: number;
}

export interface SilenceCheck {
  expected: ExpectedSilence;
  silent: boolean;
  false_positive?: AgentFinding;
}

export interface Verdict {
  scenario_id: string;
  scenario_name: string;
  pass: boolean;
  overall_score: number;          // 0-1
  detection_rate: number;
  silence_rate: number;
  timeliness_score: number;
  detections: Detection[];
  silence_checks: SilenceCheck[];
  findings_count: number;
  actions_count: number;
  duration_ms: number;
}

export interface SuiteReport {
  total_scenarios: number;
  passed: number;
  failed: number;
  overall_score: number;
  by_tier: Record<string, { total: number; passed: number; avg_score: number }>;
  by_agent: Record<string, { total: number; passed: number; avg_score: number }>;
  verdicts: Verdict[];
  run_at: string;
  duration_ms: number;
}
