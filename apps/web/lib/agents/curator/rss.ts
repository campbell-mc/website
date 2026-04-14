// lib/agents/curator/rss.ts
// RSS feed fetching and parsing for The Curator agent.

import { parseStringPromise } from "xml2js";

export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

/**
 * Fetch and parse a single RSS/Atom feed.
 * Returns parsed items or empty array on failure.
 */
export async function fetchRssFeed(feedUrl: string): Promise<RssItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "CHRIS-OS Research Agent/1.0 (aged care intelligence)",
        "Accept": "application/rss+xml, application/xml, text/xml",
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const parsed = await parseStringPromise(xml, { explicitArray: false });

    // Handle both RSS 2.0 and Atom formats
    const channel = parsed?.rss?.channel ?? parsed?.feed;
    if (!channel) return [];

    const items = channel.item ?? channel.entry ?? [];
    const itemArray = Array.isArray(items) ? items : [items];

    return itemArray
      .map((item: Record<string, unknown>) => ({
        title: String((item.title as any)?._ ?? item.title ?? "").trim(),
        link: String((item.link as any)?.$?.href ?? item.link ?? item.guid ?? "").trim(),
        description: String(
          item.description ?? item.summary ?? item["content:encoded"] ?? ""
        )
          .replace(/<[^>]+>/g, "")
          .trim(),
        pubDate: String(item.pubDate ?? item.published ?? item.updated ?? "").trim(),
      }))
      .filter((item) => item.title && item.link);
  } finally {
    clearTimeout(timeout);
  }
}
