"use client";

import { useState } from "react";
import { Bell, Clock, ChevronRight, Sparkles, CheckCircle, Mic, MoreHorizontal, AlertTriangle, Activity, Shield, Users, Calendar, FileText } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { useRouter } from "next/navigation";

// ============================================================================
// DON COMMAND CENTRE — Home Screen
// Every at-risk item is a full action card. Nothing is buried.
// Principle: "The action is on the card."
// ============================================================================

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// --- Action Card: every item needing attention is one of these ---
function ActionCard({ urgency, icon, title, chris, actionLabel, onAction, deadline, meta }: {
  urgency: "critical" | "warning" | "info" | "positive";
  icon: React.ReactNode;
  title: string;
  chris: string;
  actionLabel: string;
  onAction: () => void;
  deadline?: string;
  meta?: string;
}) {
  const borderColor = {
    critical: "border-l-[hsl(var(--brand-terracotta))]",
    warning: "border-l-[hsl(var(--brand-amber))]",
    info: "border-l-[hsl(var(--brand-forest))]",
    positive: "border-l-[hsl(var(--brand-teal))]",
  }[urgency];

  return (
    <div className={`bg-card rounded-xl p-4 shadow-warm border border-border border-l-4 ${borderColor} mb-3`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {deadline && <span className="text-[10px] text-muted-foreground font-mono shrink-0">{deadline}</span>}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{chris}</p>
          {meta && <p className="text-[10px] text-muted-foreground/60 mb-2">{meta}</p>}
          <div className="flex items-center gap-2">
            <button onClick={onAction} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              {actionLabel}
            </button>
            <button className="text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Status Summary: compact row for things that are OK ---
function StatusSummary({ items }: { items: Array<{ label: string; value: string; ok: boolean }> }) {
  return (
    <div className="flex gap-2 overflow-x-auto mb-4">
      {items.map((item) => (
        <div key={item.label} className="bg-card rounded-lg px-3 py-2 border border-border min-w-[80px] text-center flex-1">
          <p className={`text-base font-bold ${item.ok ? "text-brand-teal" : "text-brand-amber"}`}>{item.value}</p>
          <p className="text-[9px] text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function CommandCentre() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-lg font-semibold text-foreground">{getGreeting()}, Sarah</p>
          <p className="text-xs text-muted-foreground">Harbison Bowral · {new Date().toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })} · Day shift</p>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[hsl(var(--brand-terracotta))] text-white text-[9px] font-bold rounded-full flex items-center justify-center">5</span>
        </button>
      </div>

      {/* === EVERY ITEM NEEDING ACTION IS A CARD === */}

      {/* SIRS deadline — most urgent */}
      <ActionCard
        urgency="critical"
        icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />}
        title="SIRS Cat 1 · Submit by 2:23pm"
        chris="Unexpected fall – Wing B – Tuesday 2:15pm. CHRIS has the draft ready. Add resident details and submit to ACQSC."
        actionLabel="Review draft →"
        onAction={() => router.push("/dashboard/sirs")}
        deadline="6h 14m"
      />

      {/* Care minutes gap — actionable */}
      <ActionCard
        urgency="warning"
        icon={<Activity className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="Care minutes at risk · Day 3"
        chris="You're 14 minutes short on care hours. Tonight's RN shift is unfilled — that's the gap. CHRIS can generate the agency shift brief."
        actionLabel="Find agency cover →"
        onAction={() => router.push("/dashboard/care-minutes")}
        meta="186 actual · 200 target · RN: 37/40 · Deputy 2h ago ✅"
      />

      {/* Monday Briefing — unread */}
      <ActionCard
        urgency="info"
        icon={<Sparkles className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="Monday Briefing · 3 actions"
        chris="Your team's trust is under strain — staff are pulling back. Three things to address this week. Practice attached."
        actionLabel="Read briefing →"
        onAction={() => router.push("/dashboard/briefing")}
        meta="3 signals · 8 min read"
      />

      {/* Board Pack — approval needed */}
      <ActionCard
        urgency="info"
        icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Board Pack · Needs your approval"
        chris="CHRIS draft ready. 8 sections. Estimated 35 min review. Meeting in 8 days. 3 decisions need your framing."
        actionLabel="Start review →"
        onAction={() => router.push("/dashboard/reporting")}
        deadline="8 days"
      />

      {/* Medication audit overdue */}
      <ActionCard
        urgency="warning"
        icon={<Shield className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="Medication audit · 3 days overdue"
        chris="CHRIS can guide you through it now by voice. Takes about 45 minutes. Non-conformances will queue automatically."
        actionLabel="Start audit →"
        onAction={() => router.push("/dashboard/audits")}
      />

      {/* PSH convergence — predictive signal */}
      <ActionCard
        urgency="warning"
        icon={<Users className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="Night team approaching burnout · PREDICTIVE"
        chris="PSH_01 + PSH_08 co-elevated 3 cycles. Sick leave up 28%. This pattern precedes WC claims in 68% of comparable teams. A conversation with the night team leader this week is the intervention."
        actionLabel="Schedule check-in →"
        onAction={() => router.push("/dashboard/psh")}
        meta="Workforce · PSH · EMERGING confidence"
      />

      {/* Practice outcome — positive */}
      <ActionCard
        urgency="positive"
        icon={<CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))]" />}
        title="Practice worked · Wattle Wing"
        chris="'Protect breaks under pressure' — hazard score reduced 0.08, above the 0.05 success threshold. Worth reinforcing with the team."
        actionLabel="View outcome →"
        onAction={() => router.push("/dashboard/risk")}
      />

      {/* === STATUS SUMMARY: things that are OK === */}
      <div className="mt-6 mb-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">On track</p>
        <StatusSummary items={[
          { label: "RN 24/7", value: "✅", ok: true },
          { label: "Training", value: "91%", ok: true },
          { label: "Agency", value: "14%", ok: true },
          { label: "Connectors", value: "All ✅", ok: true },
        ]} />
      </div>

      {/* Quick actions */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Quick actions</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: "+ Report incident", icon: "📋", href: "/dashboard/sirs" },
          { label: "+ Handover note", icon: "📝", href: "/dashboard/coach" },
          { label: "Check SIRS deadlines", icon: "⏱", href: "/dashboard/sirs" },
          { label: "View roster tonight", icon: "👥", href: "/dashboard/care-minutes" },
        ].map((a) => (
          <button key={a.label} onClick={() => router.push(a.href)} className="bg-card rounded-lg px-3 py-2.5 shadow-warm-sm border border-border hover:shadow-warm transition-shadow text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span>
            <span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Domain nav */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Domains</p>
      <div className="grid grid-cols-3 gap-2 mb-16">
        {[
          { label: "Clinical", href: "/dashboard/clinical", dot: "bg-[hsl(var(--brand-terracotta))]" },
          { label: "Workforce", href: "/dashboard/workforce", dot: "bg-[hsl(var(--brand-amber))]" },
          { label: "Governance", href: "/dashboard/compliance", dot: "bg-[hsl(var(--brand-amber))]" },
          { label: "Operations", href: "/dashboard/operations", dot: "bg-[hsl(var(--brand-amber))]" },
          { label: "Financial", href: "/dashboard/financial", dot: "bg-[hsl(var(--brand-amber))]" },
          { label: "PSH", href: "/dashboard/psh", dot: "bg-[hsl(var(--brand-terracotta))]" },
        ].map((d) => (
          <button key={d.label} onClick={() => router.push(d.href)} className="bg-card rounded-lg p-3 border border-border hover:shadow-warm transition-shadow text-center">
            <span className={`inline-block w-2 h-2 rounded-full ${d.dot} mb-1`} />
            <p className="text-xs font-medium text-foreground">{d.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
