"use client";

import { useState, useEffect } from "react";

const COVERAGE = [
  "Regulatory changes", "ACQSC decisions", "Funding & AN-ACC", "Support at Home",
  "Fair Work & pay", "Psychosocial WHS", "Legal developments", "Star ratings",
  "Quality Standards", "Policy & parliament", "Sector news", "Weekly reports",
];

function ago(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function CuratorHero() {
  const [stats, setStats] = useState<{ totalUpdates: number; sourcesWatched: number; lastRun: { completedAt: string } | null }>({
    totalUpdates: 0, sourcesWatched: 35, lastRun: null,
  });

  useEffect(() => {
    fetch("/api/newsroom/status").then((r) => r.json()).then((d) => {
      setStats({ totalUpdates: d.totalUpdates ?? 0, sourcesWatched: d.sourcesWatched ?? 35, lastRun: d.lastRun ?? null });
    }).catch(() => {});
  }, []);

  return (
    <section className="bg-[#1B4332]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[540px]">
        {/* Left — identity */}
        <div className="px-6 lg:px-16 py-16 lg:py-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/8">
          <div className="inline-flex items-center gap-2.5 bg-white/8 border border-white/12 rounded-full px-3.5 py-1.5 mb-8 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/60">
              The Curator · Agent 07
            </span>
          </div>

          <h1 className="text-[clamp(30px,4vw,50px)] font-normal leading-[1.08] tracking-[-0.02em] text-white mb-6" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            The sector, watched.
            <br />
            <em className="italic text-emerald-300">Every 2 hours. All 35 sources.</em>
          </h1>

          <p className="text-[15px] leading-[1.75] text-white/80 max-w-md mb-6">
            The Curator is the seventh CHRIS agent. Where the other six watch your
            facility — clinical, financial, workforce, compliance — The Curator watches
            the world. Regulators, government, courts, legal analysts, sector media.
            Every 2 hours, without pause.
          </p>

          <p className="text-[14px] leading-[1.75] text-white/60 max-w-md mb-10">
            This is The Newsroom — what The Curator produces. A live intelligence feed,
            not a newsletter someone assembled on a Thursday afternoon. Real sources.
            Real synthesis. Updated continuously.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <a href="#feed" className="bg-white text-[#1B4332] px-6 py-3 rounded-lg text-[13px] font-medium hover:bg-white/90 transition-colors">
              Read the latest →
            </a>
            <a href="#sources" className="border border-white/30 text-white/80 px-6 py-3 rounded-lg text-[13px] hover:border-white/50 hover:text-white transition-colors">
              All 35 sources
            </a>
          </div>
        </div>

        {/* Right — status panel */}
        <div className="px-6 lg:px-16 py-16 lg:py-20 flex flex-col justify-center gap-4">
          <div className="bg-white/6 border border-white/10 rounded-2xl p-6">
            <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-white/55 mb-5">
              Agent status
            </div>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { v: String(stats.totalUpdates), l: "Total updates" },
                { v: "—", l: "Last 24 hours" },
                { v: "35", l: "Sources watched" },
              ].map(({ v, l }) => (
                <div key={l}>
                  <div className="text-[30px] text-white leading-none mb-1" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>{v}</div>
                  <div className="text-[10px] text-white/55 uppercase tracking-wide leading-tight">{l}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/8 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[12px] text-white/50">Active · 2-hour cycle</span>
              </div>
              <span className="text-[11px] text-white/50">
                Last run {stats.lastRun ? ago(stats.lastRun.completedAt) : "starting up"}
              </span>
            </div>
          </div>

          <div className="bg-white/4 border border-white/8 rounded-xl p-5">
            <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-white/50 mb-4">
              Coverage areas
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {COVERAGE.map((a) => (
                <div key={a} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#2D7D73]/50 flex-shrink-0" />
                  <span className="text-[11px] text-white/65 leading-none">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
