"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Sparkles, Mic, MoreHorizontal } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { todays_picture, facility, psh_cycles } from "@/lib/seed-data";
import { OperationalFinancialPanel } from "@/components/financial/OperationalFinancialPanel";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { useMobile } from "@/lib/hooks/useMobile";
import MobileHome from "@/components/mobile/MobileHome";

// ============================================================================
// HOME SCREEN — Today's Briefing
// Not a task queue. A daily intelligence summary of what's happening,
// followed by the top actions that flow from it.
// "What's going on at my facility today?" → then "What do I do about it?"
// ============================================================================

function getGreeting(shift?: string): string {
  // Shift takes priority — a DON starting day shift at 6:30pm gets "Good morning"
  if (shift === "day" || shift === "morning") return "Good morning";
  if (shift === "afternoon") return "Good afternoon";
  if (shift === "night") return "Good evening";
  // Fallback to time-based
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
      className={`flex items-start gap-3 w-full px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors text-left ${
        domain.status === "act" ? "bg-[rgba(196,112,74,0.04)]" : ""
      }`}
    >
      <span className="text-sm shrink-0 mt-0.5">{indicator}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{domain.name}</p>
        <p className="text-xs text-muted-foreground leading-snug mt-0.5">{domain.summary}</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-1" />
    </button>
  );
}

// --- Data derived from seed ---
const DOMAIN_HREFS: Record<string, string> = {
  Clinical: "/dashboard/clinical",
  Workforce: "/dashboard/workforce",
  Governance: "/dashboard/compliance",
  Operations: "/dashboard/operations",
  Financial: "/dashboard/financial",
};

const DOMAINS: DomainStatus[] = todays_picture.domain_status.map((d) => ({
  name: d.domain,
  status: d.status === "ok" ? "clear" as const : "watch" as const,
  summary: d.summary,
  href: DOMAIN_HREFS[d.domain] || "/dashboard",
}));

const PRIORITY_MAP: Record<string, "clear" | "watch" | "act"> = {
  immediate: "act",
  urgent: "watch",
  info: "clear",
  warning: "watch",
};

const TOP_ACTIONS = todays_picture.top_3_actions.map((a) => ({
  priority: PRIORITY_MAP[a.priority] || ("watch" as const),
  label: a.description + (a.context ? ` — ${a.context.split("·")[0].trim()}` : ""),
  actionLabel: a.action_label,
  href: a.route,
}));

export default function HomePage() {
  const router = useRouter();
  const mobile = useMobile();

  if (mobile) return <MobileHome />;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      {/* DEV: Role switcher — top of page */}
      <div className="bg-[hsl(var(--brand-forest))] rounded-xl p-3 mb-4 overflow-hidden">
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "white" }}>Demo — switch role view</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1.5">
          {[
            { label: "DON", href: "/dashboard" },
            { label: "Facility Mgr", href: "/dashboard/fm" },
            { label: "CEO", href: "/dashboard/ceo" },
            { label: "CFO", href: "/dashboard/cfo" },
            { label: "Clinical Dir.", href: "/dashboard/clinical-director" },
            { label: "Quality Lead", href: "/dashboard/quality-lead" },
            { label: "WHS Lead", href: "/dashboard/whs" },
            { label: "HR / P&C", href: "/dashboard/hr" },
            { label: "Board", href: "/dashboard/board" },
            { label: "Team Leader", href: "/dashboard/team-leader" },
          ].map((r) => (
            <button key={r.label} onClick={() => router.push(r.href)} className="bg-white/10 hover:bg-white/20 rounded-lg px-2 py-2 text-[11px] font-medium text-white transition-colors">
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. GREETING */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[28px] lg:text-lg font-bold lg:font-semibold text-foreground">{getGreeting("day")}, Sarah</p>
          <p className="text-xs text-muted-foreground">
            {facility.name} · {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })} · Day shift
          </p>
        </div>
        <NotificationBell />
      </div>

      {/* 2. TODAY'S PICTURE — avatar above, never beside */}
      <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-center gap-2.5 mb-3">
          <ChrisAvatar size="small" showGlow className="shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">CHRIS</p>
            <p className="text-[10px] text-muted-foreground">Updated 2h ago</p>
          </div>
        </div>
        <p className="text-[17px] lg:text-sm text-foreground leading-[1.65] lg:leading-relaxed font-serif-accent">
          {todays_picture.chris_text}
        </p>
      </div>

      <AgentPulse domain="all" />

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
            className={`rounded-xl p-4 border border-border border-l-[6px] ${
              action.priority === "act" ? "border-l-[#C4704A] bg-[#FEF7F0]" :
              action.priority === "watch" ? "border-l-[#D4A017] bg-[#FFFBF0]" :
              "border-l-[#2D7D73] bg-white"
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">{i + 1}.</span>
              <p className="text-sm font-medium text-foreground">{action.label}</p>
            </div>
            <button
              data-has-handler="true"
              onClick={() => router.push(action.href)}
              className="w-full text-xs font-medium px-3 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
            >
              {action.actionLabel}
            </button>
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
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">{todays_picture.chris_intelligence_signal.type}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">{todays_picture.chris_intelligence_signal.confidence}</span>
          {todays_picture.chris_intelligence_signal.domains.map((d) => (
            <span key={d} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{d}</span>
          ))}
        </div>
        <p className="text-sm font-medium text-foreground mb-1">{todays_picture.chris_intelligence_signal.headline}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{todays_picture.chris_intelligence_signal.detail}</p>
        <div className="flex items-center gap-2">
          {todays_picture.chris_intelligence_signal.actions.map((a, i) => (
            i === 0 ? <button key={a} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">{a}</button> :
            i === 1 ? <button key={a} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted">{a}</button> :
            <button key={a} className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground ml-auto">{a}</button>
          ))}
        </div>
      </div>

      {/* 5.5 OPERATIONAL FINANCIAL IMPACT */}
      <OperationalFinancialPanel />

      <div className="h-16" />
    </div>
  );
}
