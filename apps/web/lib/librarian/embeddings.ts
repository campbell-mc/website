// lib/librarian/embeddings.ts
// Embedding generation and management for semantic search.
// Uses Voyage AI voyage-3 (1024 dimensions) for high-quality domain-specific retrieval.
// When Voyage API key is not available, falls back to keyword matching.

import { createHash } from 'crypto';
import { RESIDENTIAL_PRACTICES, HOME_CARE_PRACTICES, PSH_HAZARD_PRACTICES, LEADER_PRACTICES, type Practice } from '@/lib/loops/practice-library';

// ── EMBEDDING GENERATION ─────────────────────────────────────

/**
 * Generate an embedding vector for text.
 * Phase 1: Returns null (no API key yet). Search falls back to keyword matching.
 * Phase 2: Calls Voyage AI voyage-3 API.
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ input: [text], model: 'voyage-3' }),
    });
    const data = await response.json();
    return data.data?.[0]?.embedding ?? null;
  } catch (error) {
    console.error('[Librarian] Embedding generation failed:', error);
    return null;
  }
}

/**
 * Generate a content hash for dedup — skip re-embedding unchanged content.
 */
export function contentHash(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

// ── PRACTICE EMBEDDING TEXT ──────────────────────────────────
// Constructs the text that gets embedded for each practice.
// Optimised for retrieval against situation descriptions.

export function buildPracticeEmbeddingText(practice: Practice): string {
  return [
    `[${practice.id}] ${practice.title}`,
    `Signals: ${practice.signals_addressed.join(', ')}`,
    `Hazards: ${practice.psychosocial_hazard.join(', ')}`,
    `Setting: ${practice.care_setting}`,
    `Theme: ${practice.theme}`,
    `Skill: ${practice.skill_level}`,
    practice.why_this_helps,
  ].join('. ');
}

// ── PRACTICE EMBEDDING CATALOG ───────────────────────────────
// Pre-built catalog of all practices with their embedding text.
// Used for: (1) batch embedding on startup, (2) keyword fallback search.

export interface PracticeEmbeddingRecord {
  source_type: 'practice';
  source_id: string;
  content_hash: string;
  embedded_text: string;
  metadata: {
    care_setting: string;
    theme: string;
    skill_level: string;
    psychosocial_hazard: string[];
    signals_addressed: string[];
  };
}

export function buildPracticeCatalog(): PracticeEmbeddingRecord[] {
  const allPractices = [...RESIDENTIAL_PRACTICES, ...HOME_CARE_PRACTICES, ...PSH_HAZARD_PRACTICES];

  return allPractices.map((p) => {
    const text = buildPracticeEmbeddingText(p);
    return {
      source_type: 'practice' as const,
      source_id: p.id,
      content_hash: contentHash(text),
      embedded_text: text,
      metadata: {
        care_setting: p.care_setting,
        theme: p.theme,
        skill_level: p.skill_level,
        psychosocial_hazard: [...p.psychosocial_hazard],
        signals_addressed: [...p.signals_addressed],
      },
    };
  });
}

// ── LEADER PRACTICE EMBEDDING ────────────────────────────────

export function buildLeaderPracticeEmbeddingText(practice: typeof LEADER_PRACTICES[number]): string {
  return [
    `[${practice.id}] ${practice.title}`,
    `Competency: ${practice.competency_name}`,
    `Behaviour: ${practice.behavior_text}`,
    practice.what_to_practise,
    practice.why_this_matters,
  ].join('. ');
}

// ── BATCH EMBED ──────────────────────────────────────────────

/**
 * Embed all practices. Call once on setup or when practice library changes.
 * Phase 1: Builds catalog but doesn't call API (no key yet).
 * Phase 2: Calls Voyage AI for each practice, stores in embeddings table.
 */
export async function embedAllPractices(): Promise<{ total: number; embedded: number; skipped: number }> {
  const catalog = buildPracticeCatalog();
  let embedded = 0;
  let skipped = 0;

  for (const record of catalog) {
    // TODO: Phase 2 — check if content_hash already exists in embeddings table
    // If exists and hash matches: skip (content unchanged)
    // If not exists or hash changed: generate embedding and upsert

    const embedding = await generateEmbedding(record.embedded_text);
    if (embedding) {
      // TODO: Phase 2 — INSERT into library_embeddings table
      embedded++;
    } else {
      skipped++;
    }
  }

  console.log(`[Librarian] embedAllPractices: ${catalog.length} total, ${embedded} embedded, ${skipped} skipped`);
  return { total: catalog.length, embedded, skipped };
}
