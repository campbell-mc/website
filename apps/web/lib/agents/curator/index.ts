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

let allUpdates: ResearchUpdate[] = [];
const existingHashes = new Set<string>();
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
