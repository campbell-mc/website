// lib/agents/curator/feeds.ts
// Verified RSS feeds for The Curator agent — all confirmed live April 2026.

export interface RssFeedConfig {
  name: string;
  url: string;
  category: string;
  sourceCategory: string;
  priority: 1 | 2 | 3;
}

export const RSS_FEEDS: RssFeedConfig[] = [
  // ── Sector news (high frequency — daily publication) ──────────────────────
  {
    name: "Australian Ageing Agenda",
    url: "https://www.australianageingagenda.com.au/feed",
    category: "sector_news",
    sourceCategory: "news",
    priority: 1,
  },
  {
    name: "Aged Care Insite",
    url: "https://www.agedcareinsite.com.au/feed",
    category: "sector_news",
    sourceCategory: "news",
    priority: 1,
  },
  {
    name: "Aged Care Essentials",
    url: "https://www.agedcareessentials.com.au/feed",
    category: "regulatory",
    sourceCategory: "news",
    priority: 2,
  },
  {
    name: "Aged Care News",
    url: "https://www.agedcarenews.com.au/feed",
    category: "sector_news",
    sourceCategory: "news",
    priority: 2,
  },
  {
    name: "Inside Ageing",
    url: "https://www.insideageing.com.au/feed",
    category: "sector_news",
    sourceCategory: "news",
    priority: 2,
  },
  {
    name: "Community Care Review",
    url: "https://www.australianageingagenda.com.au/category/community-care-review/feed",
    category: "funding",
    sourceCategory: "news",
    priority: 2,
  },

  // ── Government (confirmed live) ───────────────────────────────────────────
  {
    name: "Department of Health and Aged Care — News",
    url: "https://health.gov.au/news/rss.xml",
    category: "regulatory",
    sourceCategory: "government",
    priority: 1,
  },

  // ── Mainstream media ──────────────────────────────────────────────────────
  {
    name: "ABC News — Health",
    url: "https://www.abc.net.au/news/feed/51120/rss.xml",
    category: "sector_news",
    sourceCategory: "news",
    priority: 2,
  },
  {
    name: "The Guardian Australia — Society",
    url: "https://www.theguardian.com/australia-news/rss",
    category: "sector_news",
    sourceCategory: "news",
    priority: 3,
  },

  // ── Sector bodies ─────────────────────────────────────────────────────────
  {
    name: "ACCPA — Aged & Community Care Providers Association",
    url: "https://www.accpa.asn.au/feed",
    category: "policy",
    sourceCategory: "sector_body",
    priority: 2,
  },
  {
    name: "National Seniors Australia",
    url: "https://nationalseniors.com.au/feed",
    category: "policy",
    sourceCategory: "sector_body",
    priority: 3,
  },
];
