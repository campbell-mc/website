"use client";

import { useRouter } from "next/navigation";
import { Bell, ChevronRight, Sparkles, Mic, MoreHorizontal } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

// ============================================================================
// HOME SCREEN — Today's Briefing
// Not a task queue. A daily intelligence summary of what's happening,
// followed by the top actions that flow from it.
// "What's going on at my facility today?" → then "What do I do about it?"
// ============================================================================

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// --- Domain Status Row ---
interface DomainStatus {
  name: string;
  status: "clear" | "watch" | "act";
  summary: string;
  href: string;
}

function DomainRow({ domain }: { domain: DomainStatus }) {
  const router = useRouter();
  const indicator = domain.status === "clear" ? "✅" : domain.status === "watch" ? "⚠️" : "🔴";

  return (
    <button
      onClick={() => router.push(domain.href)}
      className={`flex items-center justify-between w-full px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${
        domain.status === "act" ? "bg-[rgba(196,112,74,0.04)]" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm">{indicator}</span>
        <span className="text-sm font-medium text-foreground">{domain.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{domain.summary}</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
      </div>
    </button>
  );
}

// --- Data ---
const DOMAINS: DomainStatus[] = [
  { name: "Clinical", status: "clear", summary: "Care minutes compliant · QIs on track · 1 SIRS Cat 2 open", href: "/dashboard/clinical" },
  { name: "Workforce", status: "watch", summary: "PSH improving · night team to monitor", href: "/dashboard/workforce" },
  { name: "Governance", status: "clear", summary: "SIRS draft ready for review · compliance 84", href: "/dashboard/compliance" },
  { name: "Operations", status: "clear", summary: "RN confirmed tonight · 1 AIN gap", href: "/dashboard/operations" },
  { name: "Financial", status: "clear", summary: "Care ratio 56% · on target", href: "/dashboard/financial" },
];

const TOP_ACTIONS = [
  { priority: "watch" as const, label: "Review SIRS Cat 2 draft — 22 days remaining", actionLabel: "Review draft →", href: "/dashboard/sirs" },
  { priority: "watch" as const, label: "Read your Daily Briefing — 3 signals, 1 positive", actionLabel: "Read briefing →", href: "/team-loop/briefing" },
  { priority: "clear" as const, label: "Acknowledge Wattle Wing practice outcome — hazard reduced", actionLabel: "View outcome →", href: "/dashboard/psh" },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* 1. GREETING */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-lg font-semibold text-foreground">{getGreeting()}, Sarah</p>
          <p className="text-xs text-muted-foreground">
            Harbison Bowral · {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })} · Day shift
          </p>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[hsl(var(--brand-amber))] text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
        </button>
      </div>

      {/* 2. TODAY'S PICTURE — CHRIS speaks first */}
      <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Today's picture</p>
            <p className="text-sm text-foreground leading-relaxed font-serif-accent">
              Good news first — Wattle Wing's practice last fortnight worked. Hazard score dropped 0.08, the strongest improvement this cycle. Care minutes recovered to compliant yesterday after the agency RN was confirmed. One thing still needs your attention — a SIRS Cat 2 submission is due in 22 days and the draft is ready for your review. Tonight's roster has one AIN gap but RN coverage is confirmed. Overall, your facility is in better shape than last week.
            </p>
          </div>
        </div>
      </div>

      {/* 3. DOMAIN STATUS STRIP */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Across your domains</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        {DOMAINS.map((d) => (
          <DomainRow key={d.name} domain={d} />
        ))}
      </div>

      {/* 4. TOP 3 ACTIONS — maximum 3, derived from the picture above */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Top 3 actions</p>
      <div className="space-y-2 mb-5">
        {TOP_ACTIONS.map((action, i) => (
          <div
            key={i}
            className={`bg-card rounded-xl p-4 border border-border border-l-4 ${
              action.priority === "act" ? "border-l-[hsl(var(--brand-terracotta))]" : action.priority === "clear" ? "border-l-[hsl(var(--brand-teal))]" : "border-l-[hsl(var(--brand-amber))]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </div>
              <button
                onClick={() => router.push(action.href)}
                className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 shrink-0 ml-3"
              >
                {action.actionLabel}
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => router.push("/don/queue")}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-1"
        >
          2 routine items in your queue <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 5. CHRIS INTELLIGENCE — max 1 signal on home */}
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">PREDICTIVE</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">EMERGING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Workforce</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">PSH</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Night team PSH improving — but not out of the woods</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">PSH_01 improved 0.06 this cycle after practice intervention. But PSH_08 (Traumatic Exposure) remains elevated. The pattern is moving in the right direction — continued monitoring recommended to confirm the trend holds.</p>
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Act</button>
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted">Monitor</button>
          <button className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground ml-auto">Not relevant</button>
        </div>
      </div>

      {/* 6. DAILY BRIEFING — quiet entry point */}
      <button
        onClick={() => router.push("/team-loop/briefing")}
        className="w-full bg-card rounded-xl p-4 border border-border hover:shadow-warm transition-shadow text-left flex items-center justify-between mb-16"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-[hsl(var(--brand-amber))]" />
          <div>
            <p className="text-sm font-medium text-foreground">Daily Briefing · Cycle 8</p>
            <p className="text-[10px] text-muted-foreground">3 signals · 8 min read</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}
