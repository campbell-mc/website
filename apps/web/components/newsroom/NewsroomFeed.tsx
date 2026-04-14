"use client";

import { useState, useEffect, useCallback } from "react";

type Update = {
  id: string;
  createdAt: string;
  category: string;
  importance: "critical" | "high" | "medium" | "low";
  headline: string;
  summary: string;
  implication?: string | null;
  primarySource?: string | null;
  sourceTitle?: string | null;
};

const IMP: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  low: "bg-stone-100 text-stone-500 border-stone-200",
};

const CAT_LABEL: Record<string, string> = {
  regulatory: "Regulatory", funding: "Funding", workforce: "Workforce",
  compliance: "Compliance", psychosocial: "Psychosocial", quality_standards: "Quality",
  technology: "Technology", policy: "Policy", sector_news: "Sector news",
  legal: "Legal", accreditation: "Accreditation",
};

const CAT_STYLE: Record<string, string> = {
  regulatory: "text-[#1B4332] bg-emerald-50 border-emerald-200",
  funding: "text-[#2D7D73] bg-cyan-50 border-cyan-200",
  workforce: "text-orange-700 bg-orange-50 border-orange-200",
  compliance: "text-amber-700 bg-amber-50 border-amber-200",
  psychosocial: "text-purple-700 bg-purple-50 border-purple-200",
  quality_standards: "text-[#1B4332] bg-emerald-50 border-emerald-200",
  legal: "text-stone-700 bg-stone-100 border-stone-300",
  policy: "text-stone-600 bg-stone-50 border-stone-200",
  sector_news: "text-stone-600 bg-stone-50 border-stone-200",
  technology: "text-blue-700 bg-blue-50 border-blue-200",
  accreditation: "text-[#1B4332] bg-emerald-50 border-emerald-200",
};

const CATS = [
  { id: "all", label: "All updates" }, { id: "regulatory", label: "Regulatory" },
  { id: "funding", label: "Funding" }, { id: "workforce", label: "Workforce" },
  { id: "compliance", label: "Compliance" }, { id: "psychosocial", label: "Psychosocial" },
  { id: "legal", label: "Legal" }, { id: "policy", label: "Policy" },
  { id: "sector_news", label: "Sector news" },
];

const IMPS = [
  { id: "all", label: "All" }, { id: "critical", label: "Critical" },
  { id: "high", label: "High" }, { id: "medium", label: "Medium" },
];

function ago(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function Card({ u }: { u: Update }) {
  return (
    <article className="bg-white border border-[#1B4332]/8 rounded-xl p-5 hover:border-[#1B4332]/20 hover:shadow-sm transition-all flex flex-col">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-[9px] font-medium uppercase tracking-wide px-2 py-0.5 rounded border ${IMP[u.importance] ?? IMP.medium}`}>
          {u.importance}
        </span>
        <span className={`text-[9px] font-medium uppercase tracking-wide px-2 py-0.5 rounded border ${CAT_STYLE[u.category] ?? "text-stone-500 bg-stone-50 border-stone-200"}`}>
          {CAT_LABEL[u.category] ?? u.category}
        </span>
        <span className="text-[10px] text-stone-300 ml-auto">{ago(u.createdAt)}</span>
      </div>
      <h3 className="text-[13px] font-medium text-stone-800 leading-snug mb-2.5 flex-1">
        {u.headline}
      </h3>
      <p className="text-[12px] text-stone-500 leading-relaxed mb-3">
        {u.summary.length > 180 ? u.summary.slice(0, 177) + "..." : u.summary}
      </p>
      {u.implication && (
        <div className="text-[11px] text-[#2D7D73] italic border-l-2 border-[#2D7D73]/25 pl-3 mb-3 leading-relaxed">
          {u.implication}
        </div>
      )}
      {u.primarySource && (
        <a href={u.primarySource} target="_blank" rel="noopener noreferrer"
          className="mt-auto pt-2.5 border-t border-stone-50 text-[10px] text-stone-300 hover:text-[#1B4332] flex items-center gap-1 transition-colors">
          ↗ {(u.sourceTitle ?? u.primarySource).slice(0, 55)}
          {(u.sourceTitle ?? u.primarySource).length > 55 ? "..." : ""}
        </a>
      )}
    </article>
  );
}

export function NewsroomFeed() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [cat, setCat] = useState("all");
  const [imp, setImp] = useState("all");
  const [show, setShow] = useState(18);

  const load = useCallback(async () => {
    try {
      const p = new URLSearchParams({ limit: "60" });
      if (cat !== "all") p.set("category", cat);
      const r = await fetch(`/api/newsroom/feed?${p}`);
      if (!r.ok) return;
      const d = await r.json();
      let items = d.updates ?? [];
      if (imp !== "all") items = items.filter((u: Update) => u.importance === imp);
      setUpdates(items);
    } catch {} finally {
      setLoading(false);
    }
  }, [cat, imp]);

  useEffect(() => { setLoading(true); setShow(18); load(); }, [load]);

  async function triggerRun() {
    setRunning(true);
    try {
      const res = await fetch("/api/newsroom/run", { method: "POST" });
      const result = await res.json();
      if (result.updates) setUpdates(result.updates);
    } catch {} finally {
      setRunning(false);
    }
  }

  const visible = updates.slice(0, show);

  return (
    <section className="bg-[#EDE9DF] border-y border-[#1B4332]/8" id="feed">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400">Live feed</span>
            </div>
            <h2 className="text-[clamp(20px,2.5vw,30px)] text-[#1B4332] font-normal tracking-[-0.02em]" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
              {updates.length > 0 ? `${updates.length} intelligence updates` : "Intelligence updates"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {IMPS.map((f) => (
                <button key={f.id} onClick={() => setImp(f.id)}
                  className={`text-[10px] font-medium uppercase tracking-wide px-3 py-1.5 rounded-full border transition-colors ${
                    imp === f.id ? "bg-[#1B4332] text-white border-[#1B4332]" : "border-[#1B4332]/15 text-stone-400 hover:border-[#1B4332]/30"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
            <button onClick={triggerRun} disabled={running}
              className="text-[10px] font-medium px-3 py-1.5 rounded-full border border-[#1B4332]/15 text-stone-400 hover:border-[#1B4332]/30 disabled:opacity-50 transition-colors">
              {running ? "Running..." : "Run Curator"}
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATS.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`text-[11px] font-medium px-4 py-2 rounded-full border transition-colors ${
                cat === c.id ? "bg-[#1B4332] text-white border-[#1B4332]" : "bg-white border-[#1B4332]/12 text-stone-500 hover:border-[#1B4332]/25"
              }`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-44 animate-pulse border border-[#1B4332]/5" />
            ))}
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-[13px] mb-3">
              {cat === "all" && imp === "all" ? "No updates yet. Click \"Run Curator\" to fetch the latest intelligence." : "No updates for this filter."}
            </p>
            {cat === "all" && imp === "all" ? (
              <button onClick={triggerRun} disabled={running}
                className="text-[13px] bg-[#1B4332] text-white px-6 py-3 rounded-lg hover:bg-[#1B4332]/90 disabled:opacity-50 transition-colors">
                {running ? "Running..." : "Run Curator now"}
              </button>
            ) : (
              <button onClick={() => { setCat("all"); setImp("all"); }} className="text-[12px] text-[#1B4332] hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visible.map((u) => <Card key={u.id} u={u} />)}
            </div>
            {updates.length > show && (
              <div className="text-center mt-10">
                <button onClick={() => setShow((n) => n + 18)}
                  className="bg-white border border-[#1B4332]/15 text-[#1B4332] text-[13px] font-medium px-8 py-3 rounded-lg hover:border-[#1B4332]/30 transition-colors">
                  Load {Math.min(18, updates.length - show)} more updates
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
