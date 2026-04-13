// lib/librarian/knowledge.ts
// Versioned regulatory knowledge access.
// Phase 1: Falls back to static AGED_CARE_KNOWLEDGE when DB empty.
// Phase 2: DB is primary source, static constant is emergency fallback.

import AGED_CARE_KNOWLEDGE from '@/lib/chris/aged-care-knowledge';
import type { KnowledgeDomain, KnowledgeResult } from './types';

// Static knowledge map — flattened for domain lookup
const STATIC_KNOWLEDGE: Record<string, Record<string, unknown>> = {
  care_minutes: AGED_CARE_KNOWLEDGE.care_minutes,
  sirs: AGED_CARE_KNOWLEDGE.sirs,
  psh: AGED_CARE_KNOWLEDGE.psh,
  financial: AGED_CARE_KNOWLEDGE.financial,
  qi: AGED_CARE_KNOWLEDGE.quality_indicators,
  whs: AGED_CARE_KNOWLEDGE.whs,
  workforce: AGED_CARE_KNOWLEDGE.workforce_benchmarks,
  stewartbrown: AGED_CARE_KNOWLEDGE.stewartbrown_benchmarks,
  legislation: AGED_CARE_KNOWLEDGE.legislation,
  quality_standards: AGED_CARE_KNOWLEDGE.quality_standards,
  reporting_cycles: AGED_CARE_KNOWLEDGE.reporting_cycles,
  connectors: AGED_CARE_KNOWLEDGE.connector_source_systems,
};

/**
 * Get versioned knowledge for a domain.
 * Phase 1: Always returns static fallback (DB not yet populated).
 * Phase 2: Queries knowledge_objects table, falls back to static if empty.
 */
export async function getKnowledge(
  domain: KnowledgeDomain,
  _careType: string = 'residential',
): Promise<KnowledgeResult> {

  // TODO: Phase 2 — query knowledge_objects table first:
  // const dbKnowledge = await db.select()
  //   .from(knowledgeObjects)
  //   .where(and(
  //     eq(knowledgeObjects.domain, domain),
  //     or(eq(knowledgeObjects.care_type, careType), eq(knowledgeObjects.care_type, 'all')),
  //     isNull(knowledgeObjects.effective_to),
  //   ))
  //   .orderBy(desc(knowledgeObjects.version));
  //
  // if (dbKnowledge.length > 0) {
  //   return { source: 'database', version: dbKnowledge[0].version, domain, data: buildKnowledgeObject(dbKnowledge) };
  // }

  // Phase 1: Return static constant
  const data = STATIC_KNOWLEDGE[domain];
  if (!data) {
    console.warn(`[Librarian] Unknown knowledge domain: ${domain}`);
    return { source: 'static_fallback', version: 0, domain, data: {} };
  }

  return {
    source: 'static_fallback',
    version: 0,
    domain,
    data: data as Record<string, unknown>,
  };
}
