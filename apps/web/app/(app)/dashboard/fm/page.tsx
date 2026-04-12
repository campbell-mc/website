"use client";

import { useRouter } from "next/navigation";
import { Bell, ChevronRight, Sparkles } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { todays_picture, facility, financial_monthly, workforce_monthly, compliance_obligations, corrective_actions, resident_intelligence } from "@/lib/seed-data";
import { currentMetrics, fmtK, BENCHMARKS } from "@/lib/financial-benchmarks";
import { OperationalFinancialPanel } from "@/components/financial/OperationalFinancialPanel";

// ============================================================================
// FACILITY MANAGER HOME — Integrated operational picture
// 5 domains: Clinical, Workforce, Financial, Governance, Residents
// Broader than DON (adds financial + residents), narrower than CEO (single facility)
// ============================================================================

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const latestWf = workforce_monthly[workforce_monthly.length - 1];
const latestFin = financial_monthly[financial_monthly.length - 1];
const atRiskObligations = compliance_obligations.filter((o) => o.status === "at_risk").length;
const overdueCA = corrective_actions.filter((ca) => ca.status === "not_started" || (ca.status === "in_progress" && ca.due_date && new Date(ca.due_date) < new Date())).length;

// FM domain strip — 5 domains
const DOMAINS: Array<{ name: string; status: "clear" | "watch" | "act"; summary: string; href: string }> = [
  {
    name: "Clinical", status: "watch",
    summary: `Care minutes compliant · Falls QI above benchmark 3rd qtr · QI submission due 9 days`,
    href: "/dashboard/clinical",
  },
  {
    name: "Workforce", status: "watch",
    summary: `PSH improving Wattle Wing · Grevillea 6-cycle convergence · Agency ${Math.round(latestWf.agency_hours_pct * 100)}%`,
    href: "/dashboard/workforce",
  },
  {
    name: "Financial", status: "watch",
    summary: `Care ratio ${currentMetrics.careRatio}% (target 55%) · Agency ${fmtK(latestFin.expenditure.direct_care_agency)} · Occupancy ${Math.round(currentMetrics.occupancy * 100)}%`,
    href: "/dashboard/financial",
  },
  {
    name: "Governance", status: atRiskObligations > 0 ? "watch" : "clear",
    summary: `Compliance ${compliance_obligations.filter(o => o.status === "compliant").length}/${compliance_obligations.length} · ${atRiskObligations} at risk · ${overdueCA} CA overdue · Board Pack due 8 days`,
    href: "/dashboard/compliance",
  },
  {
    name: "Residents", status: resident_intelligence.care_plans.overdue_90_180d > 0 || resident_intelligence.complaints.open > 0 ? "watch" : "clear",
    summary: `Occupancy ${Math.round(resident_intelligence.cohort.occupancy_pct * 100)}% · Consumer exp ${resident_intelligence.consumer_experience.qi_11_score} · ${resident_intelligence.care_plans.overdue_90_180d} care plans overdue · ${resident_intelligence.complaints.open} open complaint`,
    href: "/dashboard/residents",
  },
];

// FM top 3 actions — cross-domain
const TOP_ACTIONS: Array<{ priority: "clear" | "watch" | "act"; label: string; context: string; actionLabel: string; href: string }> = [
  {
    priority: "act",
    label: "Grevillea Wing PSH convergence — 6 cycles, Level 4 insufficient",
    context: "PSH_08 + PSH_10 co-elevated · Level 2 specialist referral recommended",
    actionLabel: "Review with WHS Lead →",
    href: "/dashboard/psh",
  },
  {
    priority: "watch",
    label: `Board Pack ready for approval — meeting in 8 days`,
    context: "8 sections · CHRIS draft complete · 35 min review",
    actionLabel: "Start review →",
    href: "/dashboard/reporting",
  },
  {
    priority: "watch",
    label: `QI submission due in 9 days — CHRIS draft ready`,
    context: "14 QIs compiled · Falls above benchmark 3rd quarter — needs commentary",
    actionLabel: "Review submission →",
    href: "/dashboard/quality",
  },
];

// FM Today's Picture — covers all 5 domains
const FM_TODAYS_PICTURE = "The facility is in reasonable shape today. Care minutes have been compliant all week and the RN gap from last month is resolved. The Grevillea Wing PSH convergence needs your attention — it's been 6 cycles and Level 4 practices aren't moving it. This warrants a conversation with the WHS Lead about a Level 2 specialist referral. Financially, care ratio is at " + currentMetrics.careRatio + "% and recovering — agency cost is reducing month on month. The Board Pack is ready for your review before the 17th and the QI submission is due in 9 days with CHRIS draft ready.";

export default function FMHomePage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* 1. GREETING */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-lg font-semibold text-foreground">{getGreeting()}, Michael</p>
          <p className="text-xs text-muted-foreground">
            {facility.name} · {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })} · Facility Manager
          </p>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[hsl(var(--brand-amber))] text-white text-[9px] font-bold rounded-full flex items-center justify-center">4</span>
        </button>
      </div>

      {/* 2. TODAY'S PICTURE — 5 domains in 4 sentences */}
      <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed font-serif-accent">
            {FM_TODAYS_PICTURE}
          </p>
        </div>
      </div>

      {/* 3. DOMAIN STATUS STRIP — 5 domains */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Across your domains</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        {DOMAINS.map((d) => {
          const indicator = d.status === "clear" ? "✅" : d.status === "watch" ? "⚠️" : "🔴";
          return (
            <button
              key={d.name}
              onClick={() => router.push(d.href)}
              className={`flex items-center justify-between w-full px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors text-left ${
                d.status === "act" ? "bg-[rgba(196,112,74,0.04)]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">{indicator}</span>
                <span className="text-sm font-medium text-foreground">{d.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{d.summary}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. TOP 3 ACTIONS */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Top 3 actions</p>
      <div className="space-y-2 mb-5">
        {TOP_ACTIONS.map((action, i) => (
          <div
            key={i}
            className={`bg-card rounded-xl p-4 border border-border border-l-4 ${
              action.priority === "act" ? "border-l-[hsl(var(--brand-terracotta))]" : action.priority === "clear" ? "border-l-[hsl(var(--brand-teal))]" : "border-l-[hsl(var(--brand-amber))]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                </div>
                <p className="text-[10px] text-muted-foreground ml-7 mb-2">{action.context}</p>
              </div>
              <button
                data-has-handler="true"
                onClick={() => router.push(action.href)}
                className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 shrink-0"
              >
                {action.actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5. CHRIS INTELLIGENCE — star rating signal */}
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">PREDICTIVE</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">EMERGING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Clinical</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Financial</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Star rating risk — falls QI affecting Quality Measures star</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          QI_03 (Falls) above benchmark for 3 consecutive quarters. Sustained QI underperformance affects the Quality Measures component of the star rating. A drop in overall star rating affects admissions and occupancy. Each 1% occupancy drop = ~{fmtK(Math.round(facility.beds * 0.01 * BENCHMARKS.revenue_per_vacant_bed_day * 30))}/month in lost revenue at this facility.
        </p>
        <div className="flex items-center gap-2">
          <button data-has-handler="true" onClick={() => router.push("/dashboard/quality")} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">View QI performance →</button>
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted">Monitor</button>
        </div>
      </div>

      {/* 6. OPERATIONAL FINANCIAL IMPACT */}
      <OperationalFinancialPanel />

      <div className="h-16" />
    </div>
  );
}
