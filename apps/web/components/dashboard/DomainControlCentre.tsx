"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Mic } from "lucide-react";
import { ChrisAvatar } from "../chris/ChrisAvatar";
import { useRouter } from "next/navigation";

// ============================================================================
// Domain Control Centre — Reusable Template
// Every domain passes in its config. Layout is identical everywhere.
// Spec: "CHRIS Command Centre — Domain Control Centre Prompt"
// ============================================================================

// --- Types ---

export interface DominantItem {
  type: string;
  title: string;
  chris: string; // CHRIS speaks first — plain language
  urgency: "critical" | "warning" | "info";
  deadline?: string;
  deadlinePct?: number; // 0-100 for progress bar
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
}

export interface MetricTile {
  label: string;
  value: string;
  sub: string;
  status: "ok" | "warn" | "bad";
  actionLabel?: string;
  href: string; // Feature Detail screen
}

export interface QueueItem {
  urgency: "immediate" | "urgent" | "routine";
  title: string;
  chris: string;
  actionLabel: string;
  href?: string;
  meta?: string;
}

export interface InsightSignal {
  type: string;
  confidence: string;
  domains: string[];
  headline: string;
  detail: string;
}

export interface SubFeature {
  label: string;
  summary: string;
  status: "clear" | "amber" | "terracotta";
  actionLabel?: string;
  href: string;
}

export interface QuickAction {
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
}

export interface DomainConfig {
  name: string;
  facility: string;
  dominant: DominantItem | null; // null = domain health summary
  healthSummary?: string; // shown when dominant is null
  metrics: MetricTile[];
  queue: QueueItem[];
  queueTotal: number;
  insights: InsightSignal[];
  subFeatures: SubFeature[];
  quickActions: QuickAction[];
}

// --- Component ---

export function DomainControlCentre({ config }: { config: DomainConfig }) {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-[rgba(27,67,50,0.04)] rounded-lg">
            <ChevronLeft className="w-5 h-5 text-[var(--brand-forest)]" />
          </button>
          <div>
            <p className="text-base font-semibold text-[var(--brand-forest)]">{config.name} Control Centre</p>
            <p className="text-[10px] text-gray-400">{config.facility}</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-[var(--border-default)] text-[var(--brand-forest)] hover:bg-[rgba(27,67,50,0.04)]">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* DOMINANT ZONE */}
      {config.dominant ? (
        <DominantCard item={config.dominant} />
      ) : (
        <div className="rounded-xl bg-white shadow-warm p-4 mb-4 card-teal">
          <div className="flex items-start gap-3">
            <ChrisAvatar size="small" showGlow className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--brand-forest)] mb-1">{config.name}: all clear</p>
              <p className="text-xs text-gray-500">{config.healthSummary ?? "All metrics within range."}</p>
            </div>
          </div>
        </div>
      )}

      {/* LIVE METRICS ROW */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {config.metrics.map((m) => (
          <MetricTileCard key={m.label} tile={m} />
        ))}
      </div>

      {/* DOMAIN QUEUE */}
      {config.queue.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{config.name} queue · {config.queueTotal} items</span>
            {config.queueTotal > config.queue.length && (
              <button className="text-[11px] text-[var(--brand-teal)] font-medium hover:underline">View all →</button>
            )}
          </div>
          {config.queue.map((item, i) => (
            <DomainQueueCard key={i} item={item} />
          ))}
        </div>
      )}

      {/* CHRIS INTELLIGENCE */}
      {config.insights.length > 0 && (
        <div className="mb-4">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 block">CHRIS intelligence</span>
          {config.insights.map((signal, i) => (
            <DomainInsightCard key={i} signal={signal} />
          ))}
        </div>
      )}

      {/* SUB-FEATURE GRID */}
      <div className="mb-4">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Features</span>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {config.subFeatures.map((sf) => (
            <SubFeatureCard key={sf.label} feature={sf} />
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-16">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Quick actions</span>
        <div className="grid grid-cols-2 gap-2">
          {config.quickActions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick ?? (() => {})}
              className="bg-white rounded-lg px-3 py-2.5 shadow-warm-sm border border-[var(--border-default)] hover:shadow-warm transition-shadow text-left flex items-center gap-2"
            >
              <span className="text-sm">{a.icon}</span>
              <span className="text-xs font-medium text-[var(--brand-forest)]">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function DominantCard({ item }: { item: DominantItem }) {
  const borderColor = item.urgency === "critical" ? "border-l-[var(--brand-terracotta)]" : item.urgency === "warning" ? "border-l-[var(--brand-amber)]" : "border-l-[var(--brand-teal)]";

  return (
    <div className={`rounded-xl border-l-4 ${borderColor} bg-white shadow-warm p-4 mb-4`}>
      {item.deadline && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase">{item.type}</span>
          <span className="text-xs text-gray-500 font-mono">{item.deadline}</span>
        </div>
      )}
      <div className="flex items-start gap-3 mb-3">
        <ChrisAvatar size="small" className="mt-0.5 shrink-0" />
        <p className="text-sm text-gray-800 leading-relaxed">{item.chris}</p>
      </div>
      {item.deadlinePct !== undefined && (
        <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full ${item.urgency === "critical" ? "bg-[var(--brand-terracotta)] animate-[pulseSoft_2s_ease-in-out_infinite]" : "bg-[var(--brand-amber)]"}`}
            style={{ width: `${item.deadlinePct}%` }}
          />
        </div>
      )}
      <div className="flex justify-end">
        <button className="text-sm font-medium px-4 py-2.5 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90 transition-opacity">
          {item.actionLabel}
        </button>
      </div>
    </div>
  );
}

function MetricTileCard({ tile }: { tile: MetricTile }) {
  const router = useRouter();
  const dotColor = tile.status === "ok" ? "bg-[var(--brand-teal)]" : tile.status === "warn" ? "bg-[var(--brand-amber)]" : "bg-[var(--brand-terracotta)]";
  const needsAction = tile.status !== "ok" && tile.actionLabel;

  return (
    <div className="bg-white rounded-xl p-3 shadow-warm-sm border border-[var(--border-default)] min-w-[120px] flex-1">
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-2 h-2 rounded-full ${dotColor} ${tile.status === "bad" ? "animate-[pulseSoft_2s_ease-in-out_infinite]" : ""}`} />
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider truncate">{tile.label}</span>
      </div>
      <p className="text-lg font-bold text-[var(--brand-forest)] leading-tight">{tile.value}</p>
      <p className="text-[10px] text-gray-400 truncate">{tile.sub}</p>
      {needsAction && (
        <button
          onClick={() => router.push(tile.href)}
          className="mt-2 w-full text-[10px] font-medium py-1.5 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90"
        >
          {tile.actionLabel}
        </button>
      )}
    </div>
  );
}

function DomainQueueCard({ item }: { item: QueueItem }) {
  const borderColor = item.urgency === "immediate" ? "border-l-[var(--brand-terracotta)]" : item.urgency === "urgent" ? "border-l-[var(--brand-amber)]" : "border-l-[var(--brand-teal)]";

  return (
    <div className={`bg-white rounded-xl p-4 shadow-warm-sm border border-[var(--border-default)] border-l-4 ${borderColor} mb-2`}>
      <div className="flex items-start justify-between mb-1">
        <p className="text-sm font-medium text-[var(--brand-forest)]">{item.title}</p>
        <button className="text-gray-300 hover:text-gray-500 p-1"><MoreHorizontal className="w-4 h-4" /></button>
      </div>
      <p className="text-xs text-gray-600 mb-2 leading-relaxed">{item.chris}</p>
      {item.meta && <p className="text-[10px] text-gray-400 mb-2">{item.meta}</p>}
      <div className="flex justify-end">
        <button className="text-xs font-medium px-3 py-2 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90">
          {item.actionLabel}
        </button>
      </div>
    </div>
  );
}

function DomainInsightCard({ signal }: { signal: InsightSignal }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 shadow-warm-sm border border-[var(--border-default)] mb-2">
      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[rgba(212,160,23,0.1)] text-[var(--brand-amber)]">{signal.type}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[var(--brand-amber)] text-gray-500">{signal.confidence}</span>
        {signal.domains.map((d) => (
          <span key={d} className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(27,67,50,0.06)] text-gray-500">{d}</span>
        ))}
      </div>
      <button onClick={() => setExpanded(!expanded)} className="text-left w-full">
        <p className="text-sm font-medium text-[var(--brand-forest)]">{signal.headline}</p>
        {expanded && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{signal.detail}</p>}
      </button>
      <div className="flex items-center gap-2 mt-2">
        <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90">Act</button>
        <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border-default)] text-gray-500 hover:bg-[rgba(27,67,50,0.04)]">Monitor</button>
        <button className="text-[11px] text-gray-400 hover:text-gray-600 ml-auto">Not relevant</button>
      </div>
    </div>
  );
}

function SubFeatureCard({ feature }: { feature: SubFeature }) {
  const router = useRouter();
  const dotColor = feature.status === "clear" ? "" : feature.status === "amber" ? "bg-[var(--brand-amber)]" : "bg-[var(--brand-terracotta)]";

  return (
    <button
      onClick={() => router.push(feature.href)}
      className="bg-white rounded-xl p-3 shadow-warm-sm border border-[var(--border-default)] hover:shadow-warm transition-shadow text-left"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-[var(--brand-forest)]">{feature.label}</span>
        {feature.status !== "clear" && <span className={`w-2 h-2 rounded-full ${dotColor} ${feature.status === "terracotta" ? "animate-[pulseSoft_2s_ease-in-out_infinite]" : ""}`} />}
      </div>
      <p className="text-[10px] text-gray-500 leading-relaxed">{feature.summary}</p>
      {feature.actionLabel && feature.status !== "clear" && (
        <span className="text-[10px] font-medium text-[var(--brand-teal)] mt-1 block">{feature.actionLabel}</span>
      )}
    </button>
  );
}
