"use client";

import { useState } from "react";
import { Bell, Clock, ChevronRight, ChevronDown, Sparkles, CheckCircle, MessageSquare, Mic, MoreHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

// ============================================================================
// DON COMMAND CENTRE
// Spec: "CHRIS Command Centre — Operational Dashboard Specification"
// Principles: Zero friction. One most important thing. Action on the card.
// Mobile is the product. CHRIS speaks first, explains second.
// ============================================================================

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// --- Dominant Card: CHRIS decides what's most important ---
// Priority: SIRS deadline > Care minutes breach > Unread briefing > Queue items > All clear

type DominantType = "sirs_deadline" | "care_minutes_breach" | "unread_briefing" | "queue" | "all_clear";

function DominantCard({ type }: { type: DominantType }) {
  if (type === "sirs_deadline") {
    return (
      <div className="rounded-xl border-l-4 border-l-[var(--brand-terracotta)] bg-white shadow-warm p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge status="non-compliant" label="SIRS · CAT 1" size="sm" showDot />
          <span className="text-xs text-gray-400 ml-auto font-mono">6h 14m remaining</span>
        </div>

        {/* CHRIS speaks first */}
        <div className="flex items-start gap-3 mb-3">
          <ChrisAvatar size="small" className="mt-0.5 shrink-0" />
          <p className="text-sm text-gray-800 leading-relaxed">
            Unexpected fall – Wing B – Tuesday 2:15pm. CHRIS has the draft ready. You need to add resident details and submit to ACQSC.
          </p>
        </div>

        {/* Deadline bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div className="h-2 rounded-full bg-[var(--brand-terracotta)] animate-[pulseSoft_2s_ease-in-out_infinite]" style={{ width: "80%" }} />
        </div>

        {/* Action on the card — one primary, always bottom right */}
        <div className="flex justify-end">
          <button className="text-sm font-medium px-4 py-2.5 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90 transition-opacity">
            Review draft →
          </button>
        </div>
      </div>
    );
  }

  if (type === "care_minutes_breach") {
    return (
      <div className="rounded-xl border-l-4 border-l-[var(--brand-amber)] bg-white shadow-warm p-4 mb-4">
        <StatusBadge status="at-risk" label="Care Minutes · Day 3" size="sm" showDot className="mb-2" />
        <div className="flex items-start gap-3 mb-3">
          <ChrisAvatar size="small" className="mt-0.5 shrink-0" />
          <p className="text-sm text-gray-800 leading-relaxed">
            You're 14 minutes short on care hours today. Tonight's RN shift is unfilled — that's the gap.
          </p>
        </div>
        {/* Data one tap away */}
        <p className="text-[11px] text-gray-400 mb-3">186 actual · 200 target · RN: 37/40 · Deputy · 2h ago ✅</p>
        <div className="flex justify-end">
          <button className="text-sm font-medium px-4 py-2.5 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90">
            Fix gap →
          </button>
        </div>
      </div>
    );
  }

  if (type === "unread_briefing") {
    return (
      <div className="rounded-xl bg-white shadow-warm overflow-hidden mb-4">
        <div className="h-1 bg-gradient-to-r from-[var(--brand-forest)] via-[var(--brand-terracotta)] to-[var(--brand-amber)]" />
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[var(--brand-amber)]" />
            <span className="text-sm font-semibold text-[var(--brand-forest)]">Monday Briefing</span>
            <span className="text-[10px] text-gray-400 ml-auto">3 signals · 3 actions · 8 min</span>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <ChrisAvatar size="small" className="mt-0.5 shrink-0" />
            <p className="text-sm text-gray-800 leading-relaxed">
              Your team's trust is under strain — staff are pulling back. Three things to address this week.
            </p>
          </div>
          <div className="flex justify-end">
            <button className="text-sm font-medium px-4 py-2.5 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90">
              Read briefing →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // All clear
  return (
    <div className="rounded-xl bg-white shadow-warm p-4 mb-4 card-teal">
      <div className="flex items-start gap-3">
        <ChrisAvatar size="small" showGlow className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-[var(--brand-forest)] mb-1">All good. Here's what CHRIS is watching.</p>
          <p className="text-xs text-gray-500">Care minutes compliant. No SIRS deadlines. Queue clear. Next pulse launches Monday.</p>
        </div>
      </div>
    </div>
  );
}

// --- Status Tile (tap to drill) ---
function StatusTile({ label, value, sub, status }: { label: string; value: string; sub: string; status: "ok" | "warn" | "bad" }) {
  const dotColor = status === "ok" ? "bg-[var(--brand-teal)]" : status === "warn" ? "bg-[var(--brand-amber)]" : "bg-[var(--brand-terracotta)]";
  return (
    <button className="bg-white rounded-xl p-3 shadow-warm-sm border border-[var(--border-default)] hover:shadow-warm transition-shadow text-left flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider truncate">{label}</span>
      </div>
      <p className="text-lg font-bold text-[var(--brand-forest)] leading-tight">{value}</p>
      <p className="text-[10px] text-gray-400 truncate">{sub}</p>
    </button>
  );
}

// --- Queue Item Card (action on the card) ---
function QueueCard({ urgency, title, chris, action, actionLabel, meta }: {
  urgency: "immediate" | "urgent" | "routine";
  title: string; chris: string; action: () => void; actionLabel: string; meta?: string;
}) {
  const borderColor = urgency === "immediate" ? "border-l-[var(--brand-terracotta)]" : urgency === "urgent" ? "border-l-[var(--brand-amber)]" : "border-l-[var(--brand-teal)]";

  return (
    <div className={`bg-white rounded-xl p-4 shadow-warm-sm border border-[var(--border-default)] border-l-4 ${borderColor} mb-2`}>
      <div className="flex items-start justify-between mb-1">
        <p className="text-sm font-medium text-[var(--brand-forest)]">{title}</p>
        <button className="text-gray-300 hover:text-gray-500 p-1"><MoreHorizontal className="w-4 h-4" /></button>
      </div>
      <p className="text-xs text-gray-600 mb-2 leading-relaxed">{chris}</p>
      {meta && <p className="text-[10px] text-gray-400 mb-2">{meta}</p>}
      <div className="flex justify-end">
        <button onClick={action} className="text-xs font-medium px-3 py-2 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90">
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

// --- CHRIS Insight Card (signal convergence, inline) ---
function InsightCard({ type, confidence, domains, headline, detail }: {
  type: string; confidence: string; domains: string[]; headline: string; detail: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 shadow-warm-sm border border-[var(--border-default)] mb-2">
      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[rgba(212,160,23,0.1)] text-[var(--brand-amber)]">{type}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[var(--brand-amber)] text-gray-500">{confidence}</span>
        {domains.map((d) => (
          <span key={d} className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(27,67,50,0.06)] text-gray-500">{d}</span>
        ))}
      </div>
      <button onClick={() => setExpanded(!expanded)} className="text-left w-full">
        <p className="text-sm font-medium text-[var(--brand-forest)]">{headline}</p>
        {expanded && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{detail}</p>}
      </button>
      <div className="flex items-center gap-2 mt-2">
        <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90">Act</button>
        <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border-default)] text-gray-500 hover:bg-[rgba(27,67,50,0.04)]">Monitor</button>
        <button className="text-[11px] text-gray-400 hover:text-gray-600 ml-auto">Not relevant</button>
      </div>
    </div>
  );
}

// --- Page ---

export default function SiteDashboardPage() {
  // In production: CHRIS determines dominant type from live data
  const [dominant] = useState<DominantType>("sirs_deadline");

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Top bar context */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-lg font-semibold text-[var(--brand-forest)]">{getGreeting()}, Sarah</p>
          <p className="text-xs text-gray-400">Harbison Bowral · Fri 11 Apr · Day shift</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-[rgba(27,67,50,0.04)]">
            <Bell className="w-5 h-5 text-[var(--brand-forest)]" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--brand-terracotta)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
          </button>
        </div>
      </div>

      {/* DOMINANT: The single most important thing right now */}
      <DominantCard type={dominant} />

      {/* STATUS ROW: Live metrics, tap to drill */}
      <div className="flex gap-2 mb-4">
        <StatusTile label="Care min" value="186" sub="/200 · RN: 37" status="bad" />
        <StatusTile label="Roster" value="2 gaps" sub="tonight" status="warn" />
        <StatusTile label="Compliance" value="78" sub="score" status="warn" />
      </div>

      {/* QUEUE: Top items, action on card */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Queue · 4 items</span>
          <button className="text-[11px] text-[var(--brand-teal)] font-medium hover:underline">View all →</button>
        </div>

        <QueueCard
          urgency="urgent"
          title="Board Pack · Needs your approval"
          chris="CHRIS draft ready. 8 sections. Est. 35 min review. Meeting in 8 days."
          action={() => {}}
          actionLabel="Start review →"
        />
        <QueueCard
          urgency="urgent"
          title="Monday Briefing · Unread"
          chris="3 signals this week. Practice attached. 8 min read."
          action={() => {}}
          actionLabel="Read briefing →"
          meta="3 actions · 1 practice"
        />
      </div>

      {/* CHRIS INSIGHT: Cross-domain signal, not a dashboard panel */}
      <div className="mb-4">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 block">CHRIS intelligence</span>
        <InsightCard
          type="PREDICTIVE"
          confidence="EMERGING"
          domains={["Workforce", "PSH"]}
          headline="Night team approaching burnout threshold"
          detail="PSH_01 + PSH_08 co-elevated 3 cycles. Sick leave up 28%. Historically precedes WC claims within 4-6 weeks in 68% of comparable teams. Intervention window is open."
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-4">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Quick actions</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "+ Report incident", icon: "📋" },
            { label: "+ Handover note", icon: "📝" },
            { label: "Start audit", icon: "✅" },
            { label: "SIRS deadlines", icon: "⏱" },
          ].map((a) => (
            <button key={a.label} className="bg-white rounded-lg px-3 py-2.5 shadow-warm-sm border border-[var(--border-default)] hover:shadow-warm transition-shadow text-left flex items-center gap-2">
              <span className="text-sm">{a.icon}</span>
              <span className="text-xs font-medium text-[var(--brand-forest)]">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CHRIS Coach floating button hint */}
      <div className="text-center py-6 mb-16">
        <p className="text-[10px] text-gray-400">
          <Mic className="w-3 h-3 inline mr-1" />
          Tap the CHRIS button to speak or type — CHRIS already knows your context
        </p>
      </div>
    </div>
  );
}
