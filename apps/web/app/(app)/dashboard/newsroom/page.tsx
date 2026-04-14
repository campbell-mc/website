"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ExternalLink, RefreshCw, Rss, Search, AlertTriangle, TrendingUp } from "lucide-react";

interface Update {
  id: string;
  category: string;
  importance: string;
  headline: string;
  summary: string;
  implication: string | null;
  primarySource: string | null;
  sourceTitle: string | null;
  sourceCategory: string;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  regulatory: { label: "Regulatory", color: "text-[hsl(var(--brand-terracotta))]" },
  funding: { label: "Funding", color: "text-[hsl(var(--brand-amber))]" },
  workforce: { label: "Workforce", color: "text-[hsl(var(--brand-forest))]" },
  compliance: { label: "Compliance", color: "text-[hsl(var(--brand-terracotta))]" },
  psychosocial: { label: "PSH", color: "text-[hsl(var(--brand-amber))]" },
  quality_standards: { label: "Quality", color: "text-[hsl(var(--brand-teal))]" },
  policy: { label: "Policy", color: "text-[hsl(var(--brand-forest))]" },
  sector_news: { label: "Sector", color: "text-muted-foreground" },
  legal: { label: "Legal", color: "text-[hsl(var(--brand-terracotta))]" },
  accreditation: { label: "Accreditation", color: "text-[hsl(var(--brand-teal))]" },
  technology: { label: "Technology", color: "text-muted-foreground" },
};

const IMPORTANCE_STYLES: Record<string, string> = {
  critical: "bg-[hsl(var(--brand-terracotta)/0.1)] text-[hsl(var(--brand-terracotta))]",
  high: "bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]",
  medium: "bg-muted text-muted-foreground",
  low: "bg-muted text-muted-foreground/60",
};

export default function NewsroomPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [stats, setStats] = useState<{ totalUpdates: number; sourcesWatched: number; rssFeedsActive: number; lastRun: any } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/newsroom/feed").then((r) => r.json()),
      fetch("/api/newsroom/status").then((r) => r.json()),
    ]).then(([feed, status]) => {
      setUpdates(feed.updates ?? []);
      setStats(status);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function triggerRun() {
    setRunning(true);
    try {
      const res = await fetch("/api/newsroom/run", { method: "POST" });
      const result = await res.json();
      if (result.updates) setUpdates(result.updates);
      const statusRes = await fetch("/api/newsroom/status");
      setStats(await statusRes.json());
    } catch (err) {
      console.error("Curator run failed:", err);
    } finally {
      setRunning(false);
    }
  }

  const displayed = filter ? updates.filter((u) => u.category === filter) : updates;

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <PageHeader title="The Newsroom" subtitle="Sector intelligence from The Curator agent" />

      {/* Stats bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Rss className="w-3 h-3" /> {stats?.rssFeedsActive ?? 0} RSS feeds</span>
          <span className="flex items-center gap-1"><Search className="w-3 h-3" /> {stats?.sourcesWatched ?? 0} sources</span>
          <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {stats?.totalUpdates ?? 0} updates</span>
        </div>
        <div className="ml-auto">
          <button
            onClick={triggerRun}
            disabled={running}
            className="flex items-center gap-1.5 text-[10px] font-medium px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${running ? "animate-spin" : ""}`} />
            {running ? "Running..." : "Run Curator"}
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        <button
          onClick={() => setFilter(null)}
          className={`text-[10px] px-2.5 py-1 rounded-full transition-colors ${
            filter === null ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFilter(filter === key ? null : key)}
            className={`text-[10px] px-2.5 py-1 rounded-full transition-colors ${
              filter === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Updates feed */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-full mb-1" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16">
          <Rss className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">No updates yet</p>
          <p className="text-xs text-muted-foreground mb-4">Click "Run Curator" to fetch the latest sector intelligence.</p>
          <button
            onClick={triggerRun}
            disabled={running}
            className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {running ? "Running..." : "Run now"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((update) => {
            const cat = CATEGORY_LABELS[update.category] ?? { label: update.category, color: "text-muted-foreground" };
            const imp = IMPORTANCE_STYLES[update.importance] ?? IMPORTANCE_STYLES.medium;
            return (
              <div key={update.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${imp}`}>
                    {update.importance}
                  </span>
                  <span className={`text-[9px] font-medium uppercase tracking-wider ${cat.color}`}>
                    {cat.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground/50 ml-auto">
                    {new Date(update.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground mb-1.5">{update.headline}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{update.summary}</p>
                {update.implication && (
                  <div className="flex items-start gap-1.5 mb-2">
                    <AlertTriangle className="w-3 h-3 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-foreground">{update.implication}</p>
                  </div>
                )}
                {update.primarySource && (
                  <a
                    href={update.primarySource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {update.sourceTitle ?? "Source"}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
