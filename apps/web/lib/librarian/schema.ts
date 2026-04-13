// lib/librarian/schema.ts
// The Librarian's persistence layer — 6 tables that power the knowledge system.
//
// These tables are append-heavy, query-heavy, and compliance-critical.
// episode_ledger is immutable. knowledge_objects are versioned.
// embeddings use pgvector for semantic search.
// reasoning_traces provide agent audit trail.
// practice_outcomes enable closed-loop learning.
// convergence_evidence tracks signal correlation accuracy.

import {
  pgTable,
  serial,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

// ── EPISODE LEDGER ───────────────────────────────────────────
// Immutable event log. Every event persisted BEFORE any agent sees it.
// This is the canonical record of "what happened" — never updated, never deleted.
// Agents query the ledger for replay, Town Crier reads from it for coordination.

export const episodeLedger = pgTable('episode_ledger', {
  id: serial('id').primaryKey(),
  event_id: text('event_id').notNull(),             // deterministic hash (facility + type + payload + timestamp)
  facility_id: text('facility_id').notNull(),
  event_type: text('event_type').notNull(),          // ConnectorDataType | AgentEventType | UserAction
  source: text('source').notNull(),                  // 'connector:deputy' | 'agent:sentinel' | 'user:don'
  domain: text('domain').notNull(),                  // 'clinical' | 'workforce' | 'financial' | 'governance' | 'residents'
  payload: jsonb('payload').notNull(),
  metadata: jsonb('metadata'),                       // { connector_pull_id, agent_run_id, correlation_id }
  observed_at: timestamp('observed_at').notNull(),    // when the event actually happened
  recorded_at: timestamp('recorded_at').defaultNow(), // when Librarian persisted it
  // NEVER updated. Append-only. This is the compliance audit trail.
});

// ── KNOWLEDGE OBJECTS ────────────────────────────────────────
// Versioned regulatory knowledge. Replaces hardcoded AGED_CARE_KNOWLEDGE.
// Each object: domain + key + value + version + effective dates.
// When StewartBrown publishes quarterly, new versions are added — old ones get effective_to set.
// getKnowledge() queries for currently active version (effective_to IS NULL).

export const knowledgeObjects = pgTable('knowledge_objects', {
  id: serial('id').primaryKey(),
  domain: text('domain').notNull(),                  // 'care_minutes' | 'sirs' | 'psh' | 'financial' | 'qi' | 'whs' | 'workforce'
  key: text('key').notNull(),                        // e.g. 'total_minutes_per_resident_day' | 'cat1_notification_hours'
  value: jsonb('value').notNull(),                   // the actual data (number, object, array)
  care_type: text('care_type').notNull(),             // 'residential' | 'home_care' | 'ndis' | 'all'
  source: text('source').notNull(),                  // 'aged_care_act_2024' | 'stewartbrown_fy25' | 'chris_network' | 'iso_45003'
  source_detail: text('source_detail'),              // 'Table 3, p.14' | 'Section 8.1.2'
  version: integer('version').notNull().default(1),
  effective_from: timestamp('effective_from').notNull(),
  effective_to: timestamp('effective_to'),            // null = currently active
  updated_by: text('updated_by').notNull(),          // 'ivan' | 'system' | 'stewartbrown_import'
  created_at: timestamp('created_at').defaultNow(),
});

// ── EMBEDDINGS ───────────────────────────────────────────────
// pgvector embeddings for semantic search. Requires: CREATE EXTENSION vector;
// Stores Voyage AI voyage-3 1024-dimension embeddings.
// content_hash prevents re-embedding unchanged content.
// metadata carries structured filters for hybrid search (semantic + structured).

export const libraryEmbeddings = pgTable('library_embeddings', {
  id: serial('id').primaryKey(),
  source_type: text('source_type').notNull(),        // 'practice' | 'knowledge' | 'finding' | 'situation_report' | 'conversation'
  source_id: text('source_id').notNull(),            // practice ID, knowledge object key, etc.
  content_hash: text('content_hash').notNull(),      // SHA-256 of embedded_text — skip re-embed if unchanged
  // embedding: vector('embedding', { dimensions: 1024 }),  // Uncomment when pgvector is enabled on Neon
  // For now, store as jsonb until pgvector extension is active:
  embedding_data: jsonb('embedding_data'),            // float[] as JSON — migrates to vector column
  embedded_text: text('embedded_text').notNull(),     // the text that was embedded (for debug/reindex)
  metadata: jsonb('metadata'),                        // { care_type, domain, signals_addressed, hazards, etc }
  created_at: timestamp('created_at').defaultNow(),
});

// ── REASONING TRACES ─────────────────────────────────────────
// Every agent decision gets a trace: what knowledge was consulted,
// what data was queried, what was decided, and why.
// This is the answer to "why did CHRIS recommend this?" —
// traceable back to specific knowledge objects and data points.

export const reasoningTraces = pgTable('reasoning_traces', {
  id: serial('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  agent: text('agent').notNull(),                    // 'sentinel' | 'oracle' | 'steward' | 'keeper' | 'chronicler' | 'town_crier'
  run_id: text('run_id').notNull(),                  // unique per agent invocation
  trigger: text('trigger').notNull(),                // 'scheduled' | 'threshold_crossing' | 'event_driven' | 'manual'
  // What the agent consulted
  knowledge_used: jsonb('knowledge_used').notNull(),  // array of knowledge domain+key pairs
  data_queried: jsonb('data_queried').notNull(),      // what query kinds + params were issued
  context_snapshot: jsonb('context_snapshot'),         // optional: the assembled context (for replay)
  // What the agent produced
  findings_count: integer('findings_count').default(0),
  findings: jsonb('findings'),                        // the findings/opportunities generated
  narrative: text('narrative'),                        // situation report or briefing text
  actions_recommended: jsonb('actions_recommended'),   // structured action recommendations
  // Cost and performance
  model: text('model'),                               // 'claude-sonnet-4-20250514' etc.
  input_tokens: integer('input_tokens'),
  output_tokens: integer('output_tokens'),
  estimated_cost_usd: real('estimated_cost_usd'),
  duration_ms: integer('duration_ms'),
  created_at: timestamp('created_at').defaultNow(),
});

// ── PRACTICE OUTCOMES ────────────────────────────────────────
// Closed-loop learning. When a practice is prescribed and the next cycle
// completes, we record what happened. Over time, this builds Bayesian
// evidence for which practices actually move which hazards.

export const practiceOutcomesTable = pgTable('practice_outcomes', {
  id: serial('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  team_id: text('team_id').notNull(),
  cycle_id: text('cycle_id').notNull(),
  practice_id: text('practice_id').notNull(),         // MP_001, etc.
  signal_targeted: text('signal_targeted').notNull(),  // primary signal matched
  hazard_domain: text('hazard_domain').notNull(),      // PSH_01, PSH_08, etc.
  pre_score: real('pre_score'),                        // hazard score before practice
  post_score: real('post_score'),                      // hazard score next cycle
  delta: real('delta'),                                // post - pre (negative = improved)
  outcome: text('outcome'),                            // 'improved' | 'stable' | 'worsened'
  leader_effectiveness_rating: integer('leader_effectiveness_rating'), // 1-5
  practice_delivered: boolean('practice_delivered').default(false),
  contextual_factors: jsonb('contextual_factors'),     // { agency_pct, staff_changes, incidents_during }
  created_at: timestamp('created_at').defaultNow(),
});

// ── CONVERGENCE EVIDENCE ─────────────────────────────────────
// Persists every convergence detection. Over time, this replaces
// the hardcoded CONVERGENCE_PAIRS in convergence.ts with learned
// correlations. When a convergence resolves (or doesn't), that's
// evidence for whether the pair is real.

export const convergenceEvidenceTable = pgTable('convergence_evidence', {
  id: serial('id').primaryKey(),
  facility_id: text('facility_id').notNull(),
  team_id: text('team_id'),
  cycle_id: text('cycle_id'),
  hazard_domain: text('hazard_domain').notNull(),      // PSH_01, PSH_08, etc.
  pulse_severity: real('pulse_severity'),
  operational_severity: real('operational_severity'),
  final_score: real('final_score').notNull(),           // weighted + boosted
  confidence: text('confidence').notNull(),              // 'high' | 'medium' | 'low'
  evidence_source: text('evidence_source').notNull(),    // 'converged' | 'pulse_only' | 'operational_only'
  narrative: text('narrative'),                          // the "why" sentence
  cycles_persisting: integer('cycles_persisting').default(1),
  resolved: boolean('resolved').default(false),
  resolved_at: timestamp('resolved_at'),
  resolution_outcome: text('resolution_outcome'),        // 'confirmed' | 'false_positive' | 'inconclusive'
  created_at: timestamp('created_at').defaultNow(),
});
