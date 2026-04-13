"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Mic, DollarSign, AlertTriangle, FileText, MoreHorizontal, CheckCircle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { financial_monthly, facility } from "@/lib/seed-data";
import { PortfolioFinancialScorecard } from "@/components/financial/PortfolioFinancialScorecard";
import { SituationReport } from "@/components/chris/SituationReport";
import { financialReport } from "@/lib/chris/situation-reports";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { BarChart, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from "recharts";

// --- Seed data derivation ---
const latest = financial_monthly[financial_monthly.length - 1];

const latestRevVar = Math.round(latest.revenue.variance_pct * 1000) / 10;
const latestCareRatio = Math.round(latest.care_ratio * 1000) / 10;
const latestAgency = Math.round(latest.expenditure.direct_care_agency / 1000);
const latestBudgetVar = Math.round((latest.budget_variance_pct ?? 0) * 1000) / 10;

// --- Action card (unchanged design) ---
function ActionCard({ urgency, icon, title, chris, actionLabel, onAction, deadline, meta }: {
  urgency: "critical" | "warning" | "info" | "positive"; icon: React.ReactNode; title: string;
  chris: string; actionLabel: string; onAction: () => void; deadline?: string; meta?: string;
}) {
  const styles = { critical: { border: "border-l-[hsl(var(--brand-terracotta))]", bg: "rgba(196,112,74,0.06)", shadow: "0 4px 24px rgba(0,0,0,0.10)" }, warning: { border: "border-l-[hsl(var(--brand-amber))]", bg: "rgba(212,160,23,0.06)", shadow: "0 4px 24px rgba(0,0,0,0.10)" }, info: { border: "border-l-[hsl(var(--brand-forest))]", bg: "transparent", shadow: "" }, positive: { border: "border-l-[hsl(var(--brand-teal))]", bg: "transparent", shadow: "" } }[urgency]; const border = styles.border;
  return (
    <div className={`rounded-xl p-4 border border-border border-l-4 ${border} mb-3`} style={{ background: styles.bg || "var(--color-card)", boxShadow: styles.shadow || "" }}>
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
            <button onClick={onAction} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">{actionLabel}</button>
            <button className="text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Care Ratio Story chart data ---
const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const chartData = financial_monthly.map((m, i) => {
  const beds = facility.beds;
  const daysInMonth = [31, 30, 31, 31, 28, 31][i];
  const bedDays = beds * daysInMonth;
  const revenuePerBedDay = Math.round(m.revenue.total / bedDays);
  const labourPerBedDay = Math.round((m.expenditure.direct_care_permanent + m.expenditure.direct_care_agency) / bedDays);
  const agencyPerBedDay = Math.round(m.expenditure.direct_care_agency / bedDays);
  const permanentPerBedDay = Math.round(m.expenditure.direct_care_permanent / bedDays);
  return {
    month: MONTHS[i],
    revenue: revenuePerBedDay,
    permanent: permanentPerBedDay,
    agency: agencyPerBedDay,
    labour: labourPerBedDay,
    careRatio: Math.round(m.care_ratio * 1000) / 10,
  };
});

export default function FinancialControlCentre() {
  const router = useRouter();

  const statCards = [
    {
      label: "Revenue",
      value: `${latestRevVar > 0 ? "+" : ""}${latestRevVar}%`,
      sub: `vs budget · FY2026-${latest.period.split("-")[1]}`,
      color: latestRevVar >= 0 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]",
      href: "/dashboard/financial/revenue",
    },
    {
      label: "Care Ratio",
      value: `${latestCareRatio}%`,
      sub: "target 55%",
      color: latestCareRatio >= 55 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-terracotta))]",
      href: "/dashboard/financial/care-ratio",
    },
    {
      label: "Agency",
      value: `$${latestAgency}K`,
      sub: `${Math.round(latest.agency_cost_pct_of_care_workforce * 100)}% of workforce`,
      color: latestAgency <= 100 ? "text-[hsl(var(--brand-amber))]" : "text-[hsl(var(--brand-terracotta))]",
      href: "/dashboard/financial/agency",
    },
    {
      label: "Budget",
      value: `${latestBudgetVar > 0 ? "+" : ""}${latestBudgetVar}%`,
      sub: "YTD variance",
      color: latestBudgetVar >= 0 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]",
      href: "/dashboard/financial/budget",
    },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Financial Control Centre</p>
            <p className="text-[10px] text-muted-foreground">{facility.provider_name} · FY2026 · {latest.period}</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      {/* Headline metrics — tappable, each opens a detail screen */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {statCards.map((m) => (
          <button
            key={m.label}
            data-has-handler="true"
            onClick={() => router.push(m.href)}
            className={`rounded-xl px-4 py-3 border border-border hover:shadow-warm transition-shadow text-left flex items-center justify-between ${
              m.label === "Revenue" ? "border-l-4 border-l-[#2D7D73] bg-white" :
              m.label === "Care Ratio" ? "border-l-4 border-l-[#D4A017] bg-[#FFFBF0]" :
              m.label === "Budget" ? "border-l-4 border-l-[#D4A017] bg-[#FFFBF0]" :
              "bg-white"
            }`}
          >
            <div>
              <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
              <p className="text-xs font-medium text-foreground">{m.label}</p>
              <p className="text-[10px] text-muted-foreground">{m.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
          </button>
        ))}
      </div>

      {/* Portfolio scorecard — visible to CEO/CFO */}
      <PortfolioFinancialScorecard />

      <div className="h-3" />

      <AgentPulse domain="financial" />
      <SituationReport domain="financial" narrative={financialReport.narrative} refreshedAt={financialReport.refreshedAt} context={financialReport.context} signals={financialReport.signals} />

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      <ActionCard urgency="warning" icon={<DollarSign className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title={`Care ratio below target — ${latestCareRatio}% vs 55%`}
        chris={`Primary driver: agency cost surge following 2 Wattle Wing RN resignations in December. Agency peaked at 28% of RN hours in January ($${Math.round(financial_monthly[3].expenditure.direct_care_agency / 1000)}K). Now reducing — ${Math.round(latest.agency_cost_pct_of_care_workforce * 100)}% of care workforce cost. CHRIS has traced this to a 4-cycle PSH_13 decline. Culture signal, not labour market.`}
        actionLabel="See full analysis →" onAction={() => {}} meta="Financial · Workforce · PSH · CAUSAL · STRONG" />

      <ActionCard urgency="critical" icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />}
        title={`Agency cost $${latestAgency}K — ${Math.round(latest.agency_cost_pct_of_care_workforce * 100)}% of care workforce`}
        chris={`Down from $${Math.round(financial_monthly[3].expenditure.direct_care_agency / 1000)}K in January. Reducing month on month as new RN settles in. YTD agency overspend: $${Math.round(financial_monthly.reduce((s, m) => s + Math.max(0, m.expenditure.direct_care_agency - 98000), 0) / 1000)}K. At current trajectory, normalises to ~11% by June.`}
        actionLabel="Reduce agency dependency →" onAction={() => {}} />

      <ActionCard urgency="warning" icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="3 residents approaching AN-ACC reassessment"
        chris="Moderate risk of downward reclassification. Estimated revenue impact: $8.2K/month if all reclassify. DON should prioritise clinical review before assessment dates."
        actionLabel="Alert DON →" onAction={() => {}} meta="Est. impact: $8.2K/month" />

      <ActionCard urgency="info" icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="QFR Q2 — draft ready"
        chris="CHRIS has compiled QFR data from connectors. Formatted for GPMS. CFO review: 15 min."
        actionLabel="Review QFR →" onAction={() => {}} deadline="14 days" />

      <ActionCard urgency="info" icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="ELT finance section — draft ready"
        chris={`P&L commentary drafted. Includes agency cost cross-domain context explaining the YTD adverse variance.`}
        actionLabel="Review draft →" onAction={() => router.push("/dashboard/reporting")} />

      <ActionCard urgency="positive" icon={<CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))]" />}
        title={`Revenue above budget — +${(latest.revenue.variance_pct * 100).toFixed(1)}% in ${MONTHS[MONTHS.length - 1]}`}
        chris={`Revenue $${Math.round(latest.revenue.variance / 1000)}K above budget this month. Occupancy at ${(latest.occupancy_pct * 100).toFixed(1)}%. Partially offsets agency overspend. Worth noting in Board commentary.`}
        actionLabel="Add to Board pack →" onAction={() => {}} />

      {/* CHRIS intelligence signal */}
      <div className="bg-card rounded-xl p-4 shadow-warm border border-border mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-teal)/0.1)] text-[hsl(var(--brand-teal))]">PREDICTIVE</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Agency normalisation trajectory</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          {latest.chris_signal?.message || `If agency dependency returns to October 2025 levels (11%) by June 2026, care ratio recovers to 55%+ and FY EBITDA recovers ~$180K of YTD adverse variance.`}
        </p>
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Add context to Board pack →</button>
          <button className="text-[11px] text-muted-foreground hover:text-foreground">Not relevant</button>
        </div>
      </div>

      {/* === THE CARE RATIO STORY — one contextual chart === */}
      <div className="bg-card rounded-xl p-4 shadow-warm border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-0.5">Why the care ratio is where it is</p>
        <p className="text-[10px] text-muted-foreground mb-3">6 months · per bed day · vs 55% target</p>

        {/* Colour key */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--brand-forest))]" /><span className="text-[9px] text-muted-foreground">Permanent labour</span></div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--brand-terracotta))]" /><span className="text-[9px] text-muted-foreground">Agency labour</span></div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--brand-teal))]" /><span className="text-[9px] text-muted-foreground">Revenue</span></div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barGap={1} barCategoryGap="20%">
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(152 20% 35%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(152 20% 55%)" }} axisLine={false} tickLine={false} width={36} tickFormatter={(v: number) => `$${v}`} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(30 15% 88%)" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => [`$${value}/bed/day`, name === "permanent" ? "Permanent" : name === "agency" ? "Agency" : "Revenue"]}
            />
            <ReferenceLine y={0} stroke="transparent" />
            {/* 55% target line — approximate as revenue * 0.55 */}
            <ReferenceLine
              y={Math.round((chartData[0].revenue * 55) / 100)}
              stroke="hsl(var(--brand-amber))"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: "55% target", position: "right", fontSize: 9, fill: "hsl(var(--brand-amber))" }}
            />
            {/* StewartBrown sector avg ~51.9% */}
            <ReferenceLine
              y={Math.round((chartData[0].revenue * 51.9) / 100)}
              stroke="hsl(152 20% 65%)"
              strokeDasharray="2 3"
              strokeWidth={1}
              label={{ value: "Sector avg", position: "right", fontSize: 9, fill: "hsl(152 20% 55%)" }}
            />
            <Bar dataKey="permanent" stackId="labour" radius={[0, 0, 0, 0]} fill="hsl(152, 45%, 15%)" />
            <Bar dataKey="agency" stackId="labour" radius={[2, 2, 0, 0]} fill="hsl(20, 60%, 52%)" />
            <Bar dataKey="revenue" radius={[2, 2, 0, 0]} fill="hsl(170, 46%, 33%)" />
          </BarChart>
        </ResponsiveContainer>

        {/* CHRIS interpretation of the chart */}
        <div className="flex items-start gap-2 p-3 rounded-lg mt-3" style={{ background: "rgba(27,67,50,0.05)" }}>
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            The care ratio dipped to {Math.round(financial_monthly[3].care_ratio * 1000) / 10}% in January following the Wattle Wing RN exits. Agency labour cost peaked at ${chartData[3].agency}/bed/day vs a permanent equivalent of ~${chartData[0].agency}/bed/day. March is recovering — agency cost is down to ${chartData[5].agency}/bed/day and the ratio is at {latestCareRatio}%. At current trajectory, the 55% target is achievable by Q3 if agency dependency normalises to pre-December levels.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2 mb-16">
        {[{ label: "Draft P&L commentary", icon: "📝" }, { label: "Check QFR status", icon: "📊" }, { label: "AN-ACC risk review", icon: "💰" }, { label: "Budget variance detail", icon: "📉" }].map((a) => (
          <button key={a.label} onClick={() => router.push("/dashboard/coach")} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span><span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
