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
