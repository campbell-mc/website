// lib/librarian/index.ts
// The CHRIS Librarian — unified knowledge layer.
//
// Every agent reads from the Librarian. Every event writes through it.
// Every decision is traceable. This is the single source of truth.
//
// Usage:
//   import { librarian } from '@/lib/librarian';
//   const context = await librarian.assemble('sentinel', facilityId);
//   const knowledge = await librarian.getKnowledge('care_minutes');
//   const practices = await librarian.search('cumulative grief after resident deaths');
//   await librarian.observe(event);
//   await librarian.record(trace);
//   await librarian.learn(outcome);

import { observe } from './observe';
import { query } from './query';
import { search } from './search';
import { assemble } from './assemble';
import { getKnowledge } from './knowledge';
import { record } from './record';
import { learn } from './learn';
import type { Librarian } from './types';

// Re-export types for consumers
export type {
  Librarian,
  LibrarianEvent,
  ObserveResult,
  QueryKind,
  QueryParamsMap,
  QueryResultMap,
  SearchFilters,
  SearchResult,
  AgentType,
  AgentContextMap,
  AssemblyTrigger,
  SentinelContext,
  OracleContext,
  StewardContext,
  KeeperContext,
  ChroniclerContext,
  TownCrierContext,
  KnowledgeDomain,
  KnowledgeResult,
  ReasoningTraceInput,
  PracticeOutcomeInput,
} from './types';

// Re-export schema for migrations
export {
  episodeLedger,
  knowledgeObjects,
  libraryEmbeddings,
  reasoningTraces,
  practiceOutcomesTable,
  convergenceEvidenceTable,
} from './schema';

/**
 * The CHRIS Librarian — singleton instance.
 *
 * Seven methods:
 *   observe(event)        — Single write path. Ledger BEFORE agents.
 *   query(kind, params)   — 14 typed queries for agents.
 *   search(text, filters) — Semantic search via pgvector.
 *   assemble(agent, id)   — Build agent context.
 *   getKnowledge(domain)  — Versioned regulatory thresholds.
 *   record(trace)         — Store reasoning traces.
 *   learn(outcome)        — Feed back practice outcomes.
 */
export const librarian: Librarian = {
  observe,
  query,
  search,
  assemble,
  getKnowledge,
  record,
  learn,
};

export default librarian;
