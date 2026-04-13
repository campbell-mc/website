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
  timestamp,
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
