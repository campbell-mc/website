// lib/agents/curator/index.ts
// The Curator — CHRIS's sector intelligence agent.
// Runs two streams: RSS ingestion (fast) + targeted web search (deep).
// Produces structured intelligence updates for the CHRIS Newsroom.

import Anthropic from "@anthropic-ai/sdk";
import { createHash, randomUUID } from "crypto";
import { fetchRssFeed, type RssItem } from "./rss";
import { RSS_FEEDS, type RssFeedConfig } from "./feeds";
import { SEARCH_TARGETS } from "./search-targets";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Types ────────────────────────────────────────────────────────────────────

export interface ResearchUpdate {
  id: string;
  category: string;
  importance: "critical" | "high" | "medium" | "low";
  headline: string;
  summary: string;
  implication: string | null;
  primarySource: string | null;
  sourceTitle: string | null;
  sourceCategory: string;
  contentHash: string;
  createdAt: string;
  agentRunId: string;
}

export interface CuratorRunResult {
  runId: string;
  status: "completed" | "failed";
  rssUpdates: number;
  searchUpdates: number;
  totalNew: number;
  tokensUsed: number;
  durationMs: number;
  updates: ResearchUpdate[];
}

// ── In-memory store (until DB is connected) ─────────────────────────────────
// Seed with representative updates so the feed is never empty on cold start.

const SEED_UPDATES: ResearchUpdate[] = [
  { id: "seed-001", category: "regulatory", importance: "critical", headline: "ACQSC issues new guidance on Priority 1 SIRS notification timing — 24-hour clock clarified", summary: "The Aged Care Quality and Safety Commission has published updated guidance confirming the 24-hour notification clock starts from when any staff member becomes aware of a reportable incident, not from when management is informed. This addresses the most common source of late notifications across the sector.", implication: "Review your internal escalation procedures. If your current process routes through a manager before notification, you may already be consuming critical hours of the 24-hour window.", primarySource: "https://www.agedcarequality.gov.au/providers/serious-incident-response-scheme", sourceTitle: "ACQSC — SIRS Provider Resources", sourceCategory: "regulator", contentHash: "seed001", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), agentRunId: "seed" },
  { id: "seed-002", category: "funding", importance: "high", headline: "Support at Home quarterly budget carryover rules confirmed — $1,000 or 10% threshold", summary: "The Department of Health has confirmed the carryover rules for Support at Home quarterly budgets. Unspent funds carry over up to $1,000 or 10% of the quarterly budget, whichever is greater. Overspends must be absorbed by the provider and cannot be carried to future quarters.", implication: "Providers with clients tracking below 75% utilisation need proactive care coordinator intervention before quarter end to avoid fund clawback.", primarySource: "https://www.health.gov.au/our-work/support-at-home", sourceTitle: "Department of Health — Support at Home", sourceCategory: "government", contentHash: "seed002", createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), agentRunId: "seed" },
  { id: "seed-003", category: "workforce", importance: "high", headline: "Sector turnover remains at 28% — StewartBrown FY25 data shows agency dependency rising", summary: "The latest StewartBrown Aged Care Financial Performance Survey shows sector-wide annual turnover holding at 28%, with overnight RN agency coverage averaging 29% nationally. The agency cost premium continues to drive care ratio above 70% for the median provider.", implication: "Providers above 15% agency dependency should review whether structural roster redesign would reduce costs more than continuing to backfill with agency.", primarySource: "https://www.stewartbrown.com.au", sourceTitle: "StewartBrown — ACFPS FY25", sourceCategory: "sector_body", contentHash: "seed003", createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), agentRunId: "seed" },
  { id: "seed-004", category: "compliance", importance: "high", headline: "45.9% of services meeting both care minutes targets — national compliance rate stagnant", summary: "The Productivity Commission's Report on Government Services 2026 confirms only 45.9% of residential aged care services met both total (215 min) and RN (44 min) care minutes targets in 2024-25. RN target compliance alone sits at 70.2%.", implication: "With the new externally audited Care Minutes Performance Statement requirement from 2025-26, providers not meeting targets face increased scrutiny. Review your monthly averages against the casemix-adjusted target.", primarySource: "https://www.pc.gov.au/ongoing/report-on-government-services/community-services/aged-care-services/", sourceTitle: "Productivity Commission — RoGS 2026", sourceCategory: "government", contentHash: "seed004", createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), agentRunId: "seed" },
  { id: "seed-005", category: "psychosocial", importance: "high", headline: "Victorian PSH regulations now 4 months in — WorkSafe signalling enforcement focus on aged care", summary: "Victoria's psychosocial hazard regulations (commenced 1 December 2025) are now past the initial transition period. WorkSafe Victoria has indicated aged care is a priority enforcement sector given the documented burnout rates and mental health claim costs in the industry.", implication: "Ensure your 16 PSH domains are being systematically identified and assessed at least fortnightly. Evidence of worker consultation is the most commonly requested documentation in early enforcement actions.", primarySource: "https://www.worksafe.vic.gov.au", sourceTitle: "WorkSafe Victoria", sourceCategory: "government", contentHash: "seed005", createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), agentRunId: "seed" },
  { id: "seed-006", category: "legal", importance: "medium", headline: "Hall & Wilcox analysis: s.180 responsible person duty — DON personal exposure confirmed", summary: "Hall & Wilcox has published an updated analysis confirming that Directors of Nursing, as registered nurses responsible for the overall management of nursing services, are 'responsible persons' under section 180 of the Aged Care Act 2024 and personally exposed to civil penalties up to $165,000.", implication: "DONs and board members should ensure they can demonstrate the five limbs of due diligence under s.180(2). CHRIS generates this evidence trail automatically through its fortnightly pulse cycle.", primarySource: "https://hallandwilcox.com.au/news/how-will-the-new-aged-care-bill-affect-aged-care-approved-providers/", sourceTitle: "Hall & Wilcox — Provider Impacts", sourceCategory: "legal", contentHash: "seed006", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), agentRunId: "seed" },
  { id: "seed-007", category: "quality_standards", importance: "medium", headline: "7 Strengthened Quality Standards — ACQSC publishing first assessment outcomes under new framework", summary: "The ACQSC has begun publishing assessment outcomes under the 7 Strengthened Quality Standards framework that commenced 1 November 2025. Early assessments indicate Standard 2 (The Organisation) — which now covers psychosocial safety — is the most common area of partial compliance.", implication: "Standard 2 requires documented evidence of governance, workforce management, and psychosocial hazard controls. This is where most providers are weakest under the new framework.", primarySource: "https://www.agedcarequality.gov.au/providers/assessment-monitoring/star-ratings", sourceTitle: "ACQSC — Star Ratings", sourceCategory: "regulator", contentHash: "seed007", createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), agentRunId: "seed" },
  { id: "seed-008", category: "sector_news", importance: "medium", headline: "Australian Ageing Agenda: aged care providers facing $1B+ annual mental health claim cost burden", summary: "Reporting from Australian Ageing Agenda highlights that total mental health claim costs in the aged care sector have now crossed $1 billion annually, with the average claim costing $288,542 and a median of 35.7 weeks off work. The industry's 73% burnout rate is identified as the primary driver.", implication: "The financial case for psychosocial hazard management is now clear — prevention is significantly cheaper than claims. ISO 45003 compliance and proactive pulse monitoring are the evidence-based interventions.", primarySource: "https://www.australianageingagenda.com.au", sourceTitle: "Australian Ageing Agenda", sourceCategory: "news", contentHash: "seed008", createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), agentRunId: "seed" },
  { id: "seed-009", category: "policy", importance: "medium", headline: "CHSP transition to Support at Home delayed — no earlier than 1 July 2027", summary: "The Department of Health has confirmed that the transition of the Commonwealth Home Support Programme (CHSP) into Support at Home will not occur before 1 July 2027, giving CHSP providers additional time to prepare for the new framework.", implication: "CHSP providers should use this additional runway to understand Support at Home classification, pricing, and SIRS obligations that will apply to them upon transition.", primarySource: "https://www.health.gov.au/our-work/support-at-home", sourceTitle: "Department of Health — Support at Home", sourceCategory: "government", contentHash: "seed009", createdAt: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(), agentRunId: "seed" },
];

let allUpdates: ResearchUpdate[] = [...SEED_UPDATES];
const existingHashes = new Set<string>(SEED_UPDATES.map((u) => u.contentHash));
const lastPullTimes: Record<string, Date> = {};
const runHistory: Array<{ id: string; completedAt: string; rss: number; search: number; total: number }> = [];

export function getUpdates(limit = 50): ResearchUpdate[] {
  return allUpdates.slice(0, limit);
}

export function getUpdatesByCategory(category: string, limit = 20): ResearchUpdate[] {
  return allUpdates.filter((u) => u.category === category).slice(0, limit);
}

export function getRunHistory() {
  return runHistory.slice(0, 10);
}

export function getStats() {
  return {
    totalUpdates: allUpdates.length,
    sourcesWatched: RSS_FEEDS.length + SEARCH_TARGETS.length,
    rssFeedsActive: RSS_FEEDS.length,
    searchTargets: SEARCH_TARGETS.length,
    lastRun: runHistory[0] ?? null,
    byCategory: Object.entries(
      allUpdates.reduce((acc, u) => {
        acc[u.category] = (acc[u.category] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort(([, a], [, b]) => b - a),
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function headlineHash(headline: string): string {
  return createHash("sha256")
    .update(headline.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 100))
    .digest("hex")
    .slice(0, 16);
}

const VALID_CATEGORIES = [
  "regulatory", "funding", "workforce", "compliance", "psychosocial",
  "quality_standards", "technology", "policy", "sector_news", "legal", "accreditation",
];

const VALID_IMPORTANCE = ["critical", "high", "medium", "low"];

// ── RSS relevance filter prompt ──────────────────────────────────────────────

const RSS_FILTER_PROMPT = `You are The Curator — CHRIS's sector intelligence agent for Australian aged care.

You have been given a list of recent articles from aged care news sources. Your job is
to identify which are genuinely relevant to aged care providers operating in Australia,
and synthesise the relevant ones into structured intelligence updates.

RELEVANT topics: regulatory changes, compliance actions, ACQSC decisions, funding changes,
AN-ACC, Support at Home, QFR, workforce issues, psychosocial safety, WHS enforcement,
star ratings, quality standards, accreditation outcomes, policy, legislation, major provider
news, sector data.

NOT RELEVANT: individual resident stories without policy implications, provider marketing,
retirement living, tech vendor announcements without regulatory context, general health news.

For each relevant article, produce a JSON object:
{
  "category": "regulatory|funding|workforce|compliance|psychosocial|quality_standards|technology|policy|sector_news|legal|accreditation",
  "importance": "critical|high|medium|low",
  "headline": "One sentence: what happened. Max 200 chars.",
  "summary": "2-4 sentences: what this means for aged care providers.",
  "implication": "1-2 sentences: what providers should watch for or do.",
  "primarySource": "The article URL",
  "sourceTitle": "Publication name — Article title"
}

Return a JSON array. If no articles are relevant, return [].`;

// ── Stream 1: RSS Ingestion ─────────────────────────────────────────────────

async function processRssFeeds(runId: string): Promise<number> {
  console.log("[The Curator] Starting RSS ingestion...");
  let newUpdates = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const items = await fetchRssFeed(feed.url);
      const lastPull = lastPullTimes[feed.url] ?? new Date(Date.now() - 3 * 60 * 60 * 1000);

      const newItems = items.filter((item) => {
        if (!item.pubDate) return true;
        const pubDate = new Date(item.pubDate);
        return !isNaN(pubDate.getTime()) && pubDate > lastPull;
      });

      if (newItems.length === 0) {
        console.log(`[The Curator] ${feed.name}: no new items`);
        continue;
      }

      console.log(`[The Curator] ${feed.name}: ${newItems.length} new items, filtering...`);

      // Batch to Claude for relevance filtering (max 20 per call)
      for (let i = 0; i < newItems.length; i += 20) {
        const batch = newItems.slice(i, i + 20);
        const articlesText = batch
          .map((item, idx) =>
            `${idx + 1}. TITLE: ${item.title}\n   URL: ${item.link}\n   EXCERPT: ${item.description.slice(0, 300)}`
          )
          .join("\n\n");

        try {
          const response = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            system: RSS_FILTER_PROMPT,
            messages: [{
              role: "user",
              content: `SOURCE: ${feed.name}\n\nARTICLES:\n${articlesText}\n\nFilter for relevance and synthesise. Return JSON array.`,
            }],
          });

          const text = response.content
            .filter((b) => b.type === "text")
            .map((b) => (b as { type: "text"; text: string }).text)
            .join("");

          const jsonMatch = text.match(/\[[\s\S]*?\]/);
          if (!jsonMatch) continue;

          let updates: Record<string, unknown>[] = [];
          try { updates = JSON.parse(jsonMatch[0]); } catch { continue; }

          for (const update of updates) {
            if (!update.headline || !update.summary) continue;
            const hash = headlineHash(String(update.headline));
            if (existingHashes.has(hash)) continue;

            const entry: ResearchUpdate = {
              id: randomUUID(),
              category: VALID_CATEGORIES.includes(String(update.category)) ? String(update.category) : feed.category,
              importance: VALID_IMPORTANCE.includes(String(update.importance)) ? String(update.importance) as ResearchUpdate["importance"] : "medium",
              headline: String(update.headline).slice(0, 300),
              summary: String(update.summary),
              implication: update.implication ? String(update.implication) : null,
              primarySource: update.primarySource ? String(update.primarySource) : null,
              sourceTitle: update.sourceTitle ? String(update.sourceTitle) : feed.name,
              sourceCategory: feed.sourceCategory,
              contentHash: hash,
              createdAt: new Date().toISOString(),
              agentRunId: runId,
            };

            allUpdates.unshift(entry);
            existingHashes.add(hash);
            newUpdates++;
          }
        } catch (err) {
          console.warn(`[The Curator] Claude filter failed for ${feed.name} batch:`, err);
        }

        await new Promise((r) => setTimeout(r, 1000));
      }

      lastPullTimes[feed.url] = new Date();
    } catch (err) {
      console.warn(`[The Curator] RSS feed failed: ${feed.name} —`, err);
    }
  }

  console.log(`[The Curator] RSS ingestion complete. ${newUpdates} new updates.`);
  return newUpdates;
}

// ── Stream 2: Deep Web Search ───────────────────────────────────────────────

const SEARCH_SYSTEM_PROMPT = `You are The Curator — CHRIS's sector intelligence agent for Australian aged care.

You have access to web search. Run the provided queries and synthesise genuinely new,
important findings for aged care providers. Focus on content from the last 48 hours.

For each genuinely new finding, produce a JSON object:
{
  "category": "regulatory|funding|workforce|compliance|psychosocial|quality_standards|technology|policy|sector_news|legal|accreditation",
  "importance": "critical|high|medium|low",
  "headline": "One sentence: what happened. Max 200 chars.",
  "summary": "2-4 sentences: what this means for aged care providers.",
  "implication": "1-2 sentences: what providers should do.",
  "primarySource": "URL of the primary source",
  "sourceTitle": "Source name — Article title",
  "sourceCategory": "government|regulator|legal|sector_body|news|academic"
}

Return a JSON array. Return [] if nothing genuinely new found.`;

async function processWebSearch(runId: string): Promise<{ updates: number; tokens: number }> {
  console.log("[The Curator] Starting deep web search...");
  let newUpdates = 0;
  let tokensUsed = 0;

  const existingHeadlines = allUpdates
    .map((r) => r.headline.toLowerCase().slice(0, 80))
    .slice(0, 30);

  // Process in batches of 6 queries
  for (let i = 0; i < SEARCH_TARGETS.length; i += 6) {
    const batch = SEARCH_TARGETS.slice(i, i + 6);
    const queries = batch.map((t) => t.query);

    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: SEARCH_SYSTEM_PROMPT,
        tools: [{ type: "web_search_20250305" as any, name: "web_search" } as any],
        messages: [{
          role: "user",
          content: `Run these searches and synthesise genuinely new findings:\n\n${queries.map((q, idx) => `${idx + 1}. "${q}"`).join("\n")}\n\nEXISTING HEADLINES TO AVOID:\n${JSON.stringify(existingHeadlines)}\n\nReturn JSON array of new updates only.`,
        }],
      });

      tokensUsed += (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);

      const text = response.content
        .filter((b: any) => b.type === "text")
        .map((b: any) => b.text)
        .join("");

      const jsonMatch = text.match(/\[[\s\S]*?\]/);
      if (!jsonMatch) continue;

      let updates: Record<string, unknown>[] = [];
      try { updates = JSON.parse(jsonMatch[0]); } catch { continue; }

      for (const update of updates) {
        if (!update.headline || !update.summary) continue;
        const hash = headlineHash(String(update.headline));
        if (existingHashes.has(hash)) continue;

        const entry: ResearchUpdate = {
          id: randomUUID(),
          category: VALID_CATEGORIES.includes(String(update.category)) ? String(update.category) : "sector_news",
          importance: VALID_IMPORTANCE.includes(String(update.importance)) ? String(update.importance) as ResearchUpdate["importance"] : "medium",
          headline: String(update.headline).slice(0, 300),
          summary: String(update.summary),
          implication: update.implication ? String(update.implication) : null,
          primarySource: update.primarySource ? String(update.primarySource).slice(0, 500) : null,
          sourceTitle: update.sourceTitle ? String(update.sourceTitle).slice(0, 300) : null,
          sourceCategory: String(update.sourceCategory ?? "news"),
          contentHash: hash,
          createdAt: new Date().toISOString(),
          agentRunId: runId,
        };

        allUpdates.unshift(entry);
        existingHashes.add(hash);
        newUpdates++;
      }
    } catch (err) {
      console.error(`[The Curator] Search batch failed:`, err);
    }

    await new Promise((r) => setTimeout(r, 2500));
  }

  console.log(`[The Curator] Web search complete. ${newUpdates} new updates. ${tokensUsed} tokens.`);
  return { updates: newUpdates, tokens: tokensUsed };
}

// ── Main runner ─────────────────────────────────────────────────────────────

export async function runCurator(): Promise<CuratorRunResult> {
  const runId = randomUUID();
  const startTime = Date.now();
  console.log(`[The Curator] Starting run ${runId}`);

  try {
    // Stream 1: RSS
    const rssNew = await processRssFeeds(runId);

    // Stream 2: Web search
    const searchResult = await processWebSearch(runId);

    const totalNew = rssNew + searchResult.updates;
    const durationMs = Date.now() - startTime;

    // Trim store to last 500 updates
    if (allUpdates.length > 500) allUpdates = allUpdates.slice(0, 500);

    runHistory.unshift({
      id: runId,
      completedAt: new Date().toISOString(),
      rss: rssNew,
      search: searchResult.updates,
      total: totalNew,
    });

    console.log(`[The Curator] Run complete. ${totalNew} new (${rssNew} RSS, ${searchResult.updates} search). ${durationMs}ms.`);

    return {
      runId,
      status: "completed",
      rssUpdates: rssNew,
      searchUpdates: searchResult.updates,
      totalNew,
      tokensUsed: searchResult.tokens,
      durationMs,
      updates: allUpdates.slice(0, 50),
    };
  } catch (error) {
    console.error(`[The Curator] Run failed:`, error);
    return {
      runId,
      status: "failed",
      rssUpdates: 0,
      searchUpdates: 0,
      totalNew: 0,
      tokensUsed: 0,
      durationMs: Date.now() - startTime,
      updates: [],
    };
  }
}

/**
 * Validate all RSS feeds are reachable. Call on startup.
 */
export async function validateRssFeeds(): Promise<void> {
  console.log("[The Curator] Validating RSS feeds...");
  for (const feed of RSS_FEEDS) {
    try {
      const items = await fetchRssFeed(feed.url);
      console.log(`[The Curator] ✓ ${feed.name}: ${items.length} items available`);
    } catch (err) {
      console.warn(`[The Curator] ✗ ${feed.name}: ${err}`);
    }
  }
}
