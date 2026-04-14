// lib/agents/curator/search-targets.ts
// Targeted web search queries for sources without reliable RSS feeds.

export interface SearchTarget {
  query: string;
  category: string;
  sourceCategory: string;
  priority: 1 | 2 | 3;
}

export const SEARCH_TARGETS: SearchTarget[] = [
  // ── Government & regulators ───────────────────────────────────────────────
  { query: "site:agedcarequality.gov.au compliance decisions 2026", category: "compliance", sourceCategory: "regulator", priority: 1 },
  { query: "site:agedcarequality.gov.au SIRS changes 2026", category: "regulatory", sourceCategory: "regulator", priority: 1 },
  { query: "site:agedcarequality.gov.au star ratings update", category: "quality_standards", sourceCategory: "regulator", priority: 1 },
  { query: "site:health.gov.au aged care funding changes 2026", category: "funding", sourceCategory: "government", priority: 1 },
  { query: "site:health.gov.au AN-ACC classification update", category: "funding", sourceCategory: "government", priority: 1 },
  { query: "site:health.gov.au support at home program update", category: "funding", sourceCategory: "government", priority: 1 },
  { query: "site:legislation.gov.au aged care rules 2025 amendment", category: "regulatory", sourceCategory: "government", priority: 2 },
  { query: "site:safeworkaustralia.gov.au psychosocial hazard aged care", category: "psychosocial", sourceCategory: "government", priority: 2 },

  // ── Legal firms ───────────────────────────────────────────────────────────
  { query: "site:hallandwilcox.com.au aged care 2026", category: "legal", sourceCategory: "legal", priority: 2 },
  { query: "site:maddocks.com.au aged care 2026", category: "legal", sourceCategory: "legal", priority: 2 },
  { query: "site:minterellison.com aged care 2026", category: "legal", sourceCategory: "legal", priority: 2 },
  { query: "site:wottonkearney.com aged care 2026", category: "legal", sourceCategory: "legal", priority: 2 },
  { query: "site:millsoakley.com.au aged care 2026", category: "legal", sourceCategory: "legal", priority: 2 },
  { query: "site:crisplaw.com.au aged care 2026", category: "legal", sourceCategory: "legal", priority: 3 },
  { query: "site:russellkennedy.com.au aged care 2026", category: "legal", sourceCategory: "legal", priority: 3 },

  // ── Sector bodies ─────────────────────────────────────────────────────────
  { query: "site:lasa.asn.au news 2026", category: "policy", sourceCategory: "sector_body", priority: 2 },
  { query: "site:stewartbrown.com.au aged care survey 2026", category: "sector_news", sourceCategory: "sector_body", priority: 2 },
  { query: "site:anspa.com.au aged care workforce", category: "workforce", sourceCategory: "sector_body", priority: 3 },

  // ── State regulators ──────────────────────────────────────────────────────
  { query: "site:safework.nsw.gov.au psychosocial hazard prosecution aged care", category: "psychosocial", sourceCategory: "government", priority: 2 },
  { query: "site:worksafe.vic.gov.au aged care psychosocial enforcement 2026", category: "psychosocial", sourceCategory: "government", priority: 2 },

  // ── Workforce & Fair Work ─────────────────────────────────────────────────
  { query: "site:fwc.gov.au aged care worker pay determination 2026", category: "workforce", sourceCategory: "government", priority: 1 },
  { query: "aged care nurse shortage staffing crisis Australia 2026", category: "workforce", sourceCategory: "news", priority: 2 },

  // ── Broad regulatory ──────────────────────────────────────────────────────
  { query: "aged care civil penalty banning order ACQSC 2026", category: "compliance", sourceCategory: "regulator", priority: 1 },
  { query: "aged care quality standard accreditation outcome Australia 2026", category: "accreditation", sourceCategory: "regulator", priority: 2 },
  { query: "aged care provider sanction registration revoked Australia 2026", category: "compliance", sourceCategory: "regulator", priority: 1 },
];
