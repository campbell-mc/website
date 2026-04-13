// lib/librarian/search.ts
// Semantic search via pgvector (Phase 2) with keyword fallback (Phase 1).
// search("team experiencing cumulative grief") → MP_033, MP_004 ranked by relevance.

import type { SearchFilters, SearchResult } from './types';
import { generateEmbedding, buildPracticeCatalog } from './embeddings';
import { RESIDENTIAL_PRACTICES, HOME_CARE_PRACTICES, PSH_HAZARD_PRACTICES, type Practice } from '@/lib/loops/practice-library';

/**
 * Semantic search across practices, knowledge objects, and findings.
 * Phase 1: Keyword matching against practice catalog (no API key needed).
 * Phase 2: pgvector cosine similarity search.
 */
export async function search(text: string, filters?: SearchFilters): Promise<SearchResult[]> {
  const limit = filters?.limit ?? 10;
  const minScore = filters?.min_score ?? 0.3;

  // Try vector search first (Phase 2)
  const embedding = await generateEmbedding(text);
  if (embedding) {
    return vectorSearch(embedding, filters, limit);
  }

  // Phase 1 fallback: keyword matching
  return keywordSearch(text, filters, limit, minScore);
}

// ── VECTOR SEARCH (Phase 2) ──────────────────────────────────

async function vectorSearch(
  _embedding: number[],
  _filters: SearchFilters | undefined,
  _limit: number,
): Promise<SearchResult[]> {
  // TODO: Phase 2 — query pgvector:
  // const results = await db.execute(sql`
  //   SELECT source_type, source_id, embedded_text, metadata,
  //          1 - (embedding <=> ${embedding}::vector) as score
  //   FROM library_embeddings
  //   WHERE source_type = ${filters?.source_type ?? 'practice'}
  //   ORDER BY embedding <=> ${embedding}::vector
  //   LIMIT ${limit}
  // `);
  // return results.rows.map(...)

  return []; // Not yet available
}

// ── KEYWORD SEARCH (Phase 1) ─────────────────────────────────
// Simple but effective: tokenise query, match against practice text,
// score by token overlap + signal intersection.

function keywordSearch(
  text: string,
  filters: SearchFilters | undefined,
  limit: number,
  minScore: number,
): SearchResult[] {
  const queryTokens = tokenise(text);

  // Build searchable catalog
  const allPractices: Practice[] = [
    ...RESIDENTIAL_PRACTICES,
    ...HOME_CARE_PRACTICES,
    ...PSH_HAZARD_PRACTICES,
  ];

  // Filter by care_type if specified
  const filtered = filters?.care_type
    ? allPractices.filter((p) => p.care_setting === filters.care_type || p.care_setting === 'both')
    : allPractices;

  // Score each practice
  const scored = filtered.map((practice) => {
    const practiceTokens = tokenise([
      practice.title,
      practice.tagline,
      practice.why_this_helps,
      practice.theme,
      ...practice.signals_addressed,
      ...practice.psychosocial_hazard,
    ].join(' '));

    // Token overlap score
    const queryArr = Array.from(queryTokens);
    const overlap = queryArr.filter((t) => practiceTokens.has(t)).length;
    const tokenScore = queryArr.length > 0 ? overlap / queryArr.length : 0;

    // Signal intersection bonus (if query mentions specific signals)
    const signalTokens = queryArr.filter((t) =>
      t.startsWith('psh_') || t.includes('workload') || t.includes('trauma') ||
      t.includes('grief') || t.includes('recognition') || t.includes('agency') ||
      t.includes('fatigue') || t.includes('violence') || t.includes('bullying') ||
      t.includes('absenteeism') || t.includes('turnover')
    );
    const signalOverlap = signalTokens.filter((t) =>
      practice.signals_addressed.some((s) => s.toLowerCase().includes(t)) ||
      practice.psychosocial_hazard.some((h) => h.toLowerCase().includes(t))
    ).length;
    const signalBonus = signalTokens.length > 0 ? (signalOverlap / signalTokens.length) * 0.3 : 0;

    const score = Math.min(tokenScore + signalBonus, 1.0);

    return {
      source_type: 'practice' as const,
      source_id: practice.id,
      score,
      content: `${practice.title}: ${practice.tagline}`,
      metadata: {
        care_setting: practice.care_setting,
        theme: practice.theme,
        psychosocial_hazard: practice.psychosocial_hazard,
        signals_addressed: practice.signals_addressed,
      },
    };
  });

  // Sort by score, filter by minimum, limit
  return scored
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ── TOKENISATION ─────────────────────────────────────────────
// Simple word tokenisation with stop word removal.

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'and', 'but', 'or',
  'nor', 'not', 'no', 'so', 'if', 'then', 'than', 'that', 'this',
  'these', 'those', 'it', 'its', 'my', 'your', 'our', 'their', 'what',
  'which', 'who', 'whom', 'when', 'where', 'how', 'why', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
]);

function tokenise(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9_\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
  );
}
