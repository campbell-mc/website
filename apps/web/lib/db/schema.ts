// lib/db/schema.ts
// Maintained by Ivan Sanchez
//
// Drizzle ORM schema for CHRIS canonical data layer.
// All tables defined here — migrations generated via drizzle-kit.
// RLS policies applied at the database level (Neon PostgreSQL).
//
// TODO: Ivan — migrate full canonical schema from CLAUDE.md build prompts.
// This file currently contains the network_benchmarks table only.
// The remaining tables (providers, facilities, facility_workforce, etc.)
// will be added as we wire the DB layer.

import {
  pgTable,
  serial,
  text,
  real,
  integer,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

// ── NETWORK BENCHMARKS ───────────────────────────────────────
// The beginning of the proprietary CHRIS dataset.
// Every metric computed from every CHRIS provider goes here.
// Anonymised — no provider identifiable from this table.
//
// Lifecycle:
//   <3 providers:  suppress output — too small to be meaningful
//   5+ providers:  available to Oracle as supplementary reference
//   10+ providers: surface to Benchmarks screen alongside StewartBrown
//
// The scheduler runs calculateNetworkBenchmarks() quarterly that
// aggregates across all CHRIS providers and writes to this table.

export const networkBenchmarks = pgTable('network_benchmarks', {
  id: serial('id').primaryKey(),
  metric_domain: text('metric_domain').notNull(),   // 'psh' | 'care_minutes' | 'workforce' | 'financial'
  metric_name: text('metric_name').notNull(),        // e.g. 'ebitda_per_bed_day', 'psh_08_avg', 'turnover_rate'
  metric_value: real('metric_value').notNull(),
  care_type: text('care_type').notNull(),             // 'residential' | 'home_care' | 'ndis'
  bed_count_band: text('bed_count_band'),             // '<60' | '60-100' | '100-150' | '150+'
  mm_region: text('mm_region'),                       // MM1-MM7 (metro to very remote)
  period: text('period').notNull(),                   // 'FY26-Q1' etc
  facility_count: integer('facility_count').notNull(), // how many facilities contributed
  calculated_at: timestamp('calculated_at').defaultNow(),
  // No facility_id — this is aggregate only
});

// ── INCIDENTS ────────────────────────────────────────────────

export const incidents = pgTable('incidents', {
  id: text('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  incident_type: text('incident_type').notNull(),
  occurred_at: timestamp('occurred_at').notNull(),
  wing: text('wing'),
  location_detail: text('location_detail'),
  description: text('description'),
  immediate_actions: text('immediate_actions'),
  medical_attention: boolean('medical_attention').default(false),
  outcome_description: text('outcome_description'),
  sirs_category: integer('sirs_category'),
  sirs_assessed_at: timestamp('sirs_assessed_at'),
  sirs_notification_deadline: timestamp('sirs_notification_deadline'),
  sirs_submitted_at: timestamp('sirs_submitted_at'),
  status: text('status').default('logged'), // 'logged' | 'assessed' | 'sirs_notified' | 'closed'
  days_open: integer('days_open').default(0),
  chronicler_document_id: integer('chronicler_document_id'),
  logged_by_role: text('logged_by_role'),
  shift: text('shift'),
  agency_shift: boolean('agency_shift').default(false),
  created_at: timestamp('created_at').defaultNow(),
  closed_at: timestamp('closed_at'),
});

// ── HANDOVERS ────────────────────────────────────────────────

export const handovers = pgTable('handovers', {
  id: text('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  shift: text('shift').notNull(),       // 'morning' | 'afternoon' | 'night'
  shift_date: text('shift_date').notNull(),
  items: jsonb('items').default([]),
  notes: jsonb('notes').default([]),
  completed_at: timestamp('completed_at'),
  completed_by: text('completed_by'),
  status: text('status').default('active'), // 'active' | 'completed'
  created_at: timestamp('created_at').defaultNow(),
});

// ── ROSTER SHIFTS ────────────────────────────────────────────

export const rosterShifts = pgTable('roster_shifts', {
  id: text('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  shift_date: text('shift_date').notNull(),
  shift: text('shift').notNull(),         // 'morning' | 'afternoon' | 'night'
  role: text('role').notNull(),           // 'RN' | 'EN' | 'AIN'
  wing: text('wing'),
  worker_name: text('worker_name'),
  worker_role: text('worker_role'),
  is_agency: boolean('is_agency').default(false),
  agency_cost: integer('agency_cost'),
  is_gap: boolean('is_gap').default(false),
  status: text('status').default('filled'), // 'filled' | 'gap' | 'cancelled'
  created_at: timestamp('created_at').defaultNow(),
});

// ── LEAVE RECORDS ────────────────────────────────────────────

export const leaveRecords = pgTable('leave_records', {
  id: text('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  worker_id: text('worker_id').notNull(),
  worker_role: text('worker_role').notNull(),
  wing: text('wing'),
  leave_type: text('leave_type').notNull(),   // annual | sick | carer | training | rdo | wc
  start_date: text('start_date').notNull(),
  end_date: text('end_date').notNull(),
  days: integer('days').notNull(),
  status: text('status').notNull(),            // approved | pending | rejected | cancelled
  eh_record_id: text('eh_record_id'),
  care_minutes_impact: integer('care_minutes_impact'),
  creates_gap: boolean('creates_gap').default(false),
  synced_at: timestamp('synced_at').defaultNow(),
  created_at: timestamp('created_at').defaultNow(),
});

// ── LEAVE ALERTS ─────────────────────────────────────────────

export const leaveAlerts = pgTable('leave_alerts', {
  id: serial('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  alert_type: text('alert_type').notNull(),   // care_minutes_risk | concentration | sick_trend | liability
  severity: text('severity').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  agent: text('agent').notNull(),             // keeper | sentinel | steward
  resolved: boolean('resolved').default(false),
  created_at: timestamp('created_at').defaultNow(),
});

// ── CUSTOM PULSE SURVEYS ─────────────────────────────────────

export const customPulseSurveys = pgTable('custom_pulse_surveys', {
  id: text('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  created_by_role: text('created_by_role').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  frequency: text('frequency').notNull(),       // daily | weekly | fortnightly | monthly | one_off
  target_roles: text('target_roles').array().notNull(),
  target_wings: text('target_wings').array(),
  questions: jsonb('questions').notNull(),
  status: text('status').default('active'),     // active | paused | archived
  next_send_at: timestamp('next_send_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const customPulseResponses = pgTable('custom_pulse_responses', {
  id: text('id').primaryKey(),
  survey_id: text('survey_id').notNull(),
  facility_id: text('facility_id').notNull(),
  respondent_role: text('respondent_role').notNull(),
  respondent_wing: text('respondent_wing'),
  cycle_id: text('cycle_id').notNull(),
  answers: jsonb('answers').notNull(),
  submitted_at: timestamp('submitted_at').defaultNow(),
  // No respondent_id — fully anonymous
});

export const customPulseCycles = pgTable('custom_pulse_cycles', {
  id: text('id').primaryKey(),
  survey_id: text('survey_id').notNull(),
  facility_id: text('facility_id').notNull(),
  period_start: timestamp('period_start').notNull(),
  period_end: timestamp('period_end').notNull(),
  target_count: integer('target_count').notNull(),
  response_count: integer('response_count').default(0),
  participation_pct: real('participation_pct').default(0),
  results: jsonb('results'),
  status: text('status').default('open'),       // open | closed
  created_at: timestamp('created_at').defaultNow(),
  closed_at: timestamp('closed_at'),
});

// ── WORKFORCE METRICS SNAPSHOTS ──────────────────────────────
// Computed daily from connector data. One row per facility per day.

export const workforceMetrics = pgTable('workforce_metrics', {
  id: serial('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  snapshot_date: text('snapshot_date').notNull(),
  turnover_pct: real('turnover_pct'),
  voluntary_turnover_pct: real('voluntary_turnover_pct'),
  absenteeism_pct: real('absenteeism_pct'),
  unplanned_leave_pct: real('unplanned_leave_pct'),
  agency_pct: real('agency_pct'),
  agency_cost_week: integer('agency_cost_week'),
  overtime_cost_week: integer('overtime_cost_week'),
  permanent_ratio: real('permanent_ratio'),
  rn_ratio: real('rn_ratio'),
  avg_tenure_days: integer('avg_tenure_days'),
  training_compliance_pct: real('training_compliance_pct'),
  ahpra_current_pct: real('ahpra_current_pct'),
  leave_liability: integer('leave_liability'),
  turnover_cost_ytd: integer('turnover_cost_ytd'),
  care_ratio: real('care_ratio'),
  labour_cost_pbd: real('labour_cost_pbd'),
  psh_composite_score: real('psh_composite_score'),
  psh_participation_pct: real('psh_participation_pct'),
  created_at: timestamp('created_at').defaultNow(),
});

// ── LEADER LOOP CYCLES ───────────────────────────────────────

export const leaderLoopCycles = pgTable('leader_loop_cycles', {
  id: text('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  leader_role: text('leader_role').notNull(),
  cycle_number: integer('cycle_number').notNull(),
  practice: text('practice').notNull(),
  sent_to_count: integer('sent_to_count').notNull(),
  response_count: integer('response_count').default(0),
  practice_visible_yes: integer('practice_visible_yes').default(0),
  practice_visible_somewhat: integer('practice_visible_somewhat').default(0),
  practice_visible_no: integer('practice_visible_no').default(0),
  support_rating_avg: real('support_rating_avg'),
  support_rating_prior: real('support_rating_prior'),
  word_themes: text('word_themes').array(),
  status: text('status').default('open'),
  sent_at: timestamp('sent_at').defaultNow(),
  closed_at: timestamp('closed_at'),
});

// ── LEADER REFLECTIONS ───────────────────────────────────────
// Private to leader — never joined to reporting queries.

export const leaderReflections = pgTable('leader_reflections', {
  id: text('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  leader_role: text('leader_role').notNull(),
  cycle_number: integer('cycle_number').notNull(),
  answers: jsonb('answers').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// ── LEADERSHIP SESSION RECORDS ───────────────────────────────

export const leadershipSessionRecords = pgTable('leadership_session_records', {
  id: text('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  cycle_number: integer('cycle_number').notNull(),
  attendees: text('attendees'),
  key_insights: text('key_insights'),
  actions: jsonb('actions').default([]),
  practice_commitments: jsonb('practice_commitments').default([]),
  held_at: timestamp('held_at'),
  documented_by: text('documented_by'),
  status: text('status').default('planned'),
  created_at: timestamp('created_at').defaultNow(),
});

// ── PRACTICE LOGS ────────────────────────────────────────────

export const practiceLogs = pgTable('practice_logs', {
  id: text('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  team_id: text('team_id').notNull(),
  leader_role: text('leader_role').notNull(),
  cycle_number: integer('cycle_number').notNull(),
  practice: text('practice').notNull(),
  delivered: boolean('delivered').default(false),
  delivered_at: timestamp('delivered_at'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
});
