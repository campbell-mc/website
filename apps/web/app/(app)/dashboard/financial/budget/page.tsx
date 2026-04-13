"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { financial_monthly, facility } from "@/lib/seed-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, ReferenceLine } from "recharts";

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const ANNOTATIONS: Record<string, string> = { Dec: "Agency surge", Jan: "Worst month", Mar: "Recovering" };

const chartData = financial_monthly.map((m, i) => ({
  month: MONTHS[i],
  variance: Math.round((m.expenditure.total - m.expenditure.budget) / 1000), // negative = adverse
  revVariance: Math.round(m.revenue.variance / 1000),
  netVariance: Math.round((m.revenue.variance - (m.expenditure.total - m.expenditure.budget)) / 1000),
}));

// Cumulative YTD
let cumulative = 0;
const cumulativeData = chartData.map((d) => {
  cumulative += d.netVariance;
  return { ...d, cumYTD: cumulative };
});

const latest = financial_monthly[financial_monthly.length - 1];
const ytdExpVariance = financial_monthly.reduce((s, m) => s + (m.expenditure.total - m.expenditure.budget), 0);
const ytdRevVariance = financial_monthly.reduce((s, m) => s + m.revenue.variance, 0);
const ytdNetVariance = ytdRevVariance - ytdExpVariance;

// Cost centre breakdown for latest month
const costCentres = [
  { name: "Direct care — permanent", budget: 879000, actual: latest.expenditure.direct_care_permanent, key: "permanent" },
  { name: "Direct care — agency", budget: 98000, actual: latest.expenditure.direct_care_agency, key: "agency" },
  { name: "Allied health", budget: 44000, actual: 48000, key: "allied" },
  { name: "Hotel services", budget: 187000, actual: latest.expenditure.hotel_services, key: "hotel" },
  { name: "Admin & management", budget: 124000, actual: latest.expenditure.admin_management, key: "admin" },
  { name: "Capital", budget: 22000, actual: latest.expenditure.capital, key: "capital" },
];

function fmtK(n: number): string {
  if (Math.abs(n) < 1000) return `$${Math.round(n)}`;
  return `$${Math.round(n / 1000)}K`;
}

export default function BudgetPerformancePage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/financial")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Budget Performance</p>
            <p className="text-[10px] text-muted-foreground">YTD: {fmtK(ytdNetVariance)} · FY2026 · Full year forecast: -1.2%</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* Headlines */}
      <div className="flex gap-2 mb-4">
        <div className="bg-card rounded-lg px-4 py-3 border border-border flex-1 text-center">
          <p className={`text-lg font-bold ${ytdRevVariance >= 0 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-terracotta))]"}`}>
            {ytdRevVariance >= 0 ? "+" : ""}{fmtK(ytdRevVariance)}
          </p>
          <p className="text-[9px] text-muted-foreground">Revenue vs budget</p>
        </div>
        <div className="bg-card rounded-lg px-4 py-3 border border-border flex-1 text-center">
          <p className={`text-lg font-bold ${ytdExpVariance <= 0 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-terracotta))]"}`}>
            {ytdExpVariance > 0 ? "-" : "+"}{fmtK(Math.abs(ytdExpVariance))}
          </p>
          <p className="text-[9px] text-muted-foreground">Cost vs budget</p>
        </div>
        <div className="bg-card rounded-lg px-4 py-3 border border-border flex-1 text-center">
          <p className={`text-lg font-bold ${ytdNetVariance >= 0 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-terracotta))]"}`}>
            {ytdNetVariance >= 0 ? "+" : ""}{fmtK(ytdNetVariance)}
          </p>
          <p className="text-[9px] text-muted-foreground">Net YTD</p>
        </div>
      </div>

      {/* Budget variance chart */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-0.5">Monthly budget variance</p>
        <p className="text-[10px] text-muted-foreground mb-3">Net (revenue variance minus cost overrun) · teal = favourable · terracotta = adverse</p>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cumulativeData} barCategoryGap="20%">
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(152 20% 35%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(152 20% 55%)" }} axisLine={false} tickLine={false} width={40} tickFormatter={(v: number) => `${v >= 0 ? "+" : ""}$${v}K`} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(30 15% 88%)" }} />
            <ReferenceLine y={0} stroke="hsl(30 15% 80%)" />
            <Bar dataKey="netVariance" radius={[4, 4, 0, 0]} name="Net variance ($K)">
              {cumulativeData.map((entry, i) => (
                <Cell key={i} fill={entry.netVariance >= 0 ? "hsl(170, 46%, 33%)" : "hsl(20, 60%, 52%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Annotations */}
        <div className="flex items-center gap-3 mt-2">
          {Object.entries(ANNOTATIONS).map(([month, text]) => (
            <span key={month} className="text-[9px] text-muted-foreground">{month}: {text}</span>
          ))}
        </div>
      </div>

      {/* Cost centre breakdown */}
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        <div className="px-3 py-2 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Cost centre breakdown — {MONTHS[MONTHS.length - 1]}</p>
        </div>
        <div className="grid grid-cols-4 gap-1 px-3 py-2 border-b border-border text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="col-span-1">Cost centre</span>
          <span className="text-right">Budget</span>
          <span className="text-right">Actual</span>
          <span className="text-right">Variance</span>
        </div>
        {costCentres.map((cc) => {
          const variance = cc.actual - cc.budget;
          const isAdverse = variance > 5000;
          return (
            <div key={cc.key} className={`grid grid-cols-4 gap-1 px-3 py-2.5 border-b border-border last:border-b-0 text-xs ${isAdverse ? "bg-[rgba(196,112,74,0.04)]" : ""}`}>
              <span className="col-span-1 font-medium text-foreground truncate">{cc.name}</span>
              <span className="text-right text-muted-foreground">{fmtK(cc.budget)}</span>
              <span className="text-right text-foreground">{fmtK(cc.actual)}</span>
              <span className={`text-right font-medium ${variance <= 0 ? "text-[hsl(var(--brand-teal))]" : isAdverse ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-amber))]"}`}>
                {variance <= 0 ? "" : "+"}{fmtK(variance)} {isAdverse ? "🔴" : variance > 0 ? "⚠️" : "✅"}
              </span>
            </div>
          );
        })}
        {/* Total row */}
        <div className="grid grid-cols-4 gap-1 px-3 py-2.5 bg-muted/30 text-xs font-bold">
          <span className="col-span-1 text-foreground">Total</span>
          <span className="text-right text-muted-foreground">{fmtK(costCentres.reduce((s, c) => s + c.budget, 0))}</span>
          <span className="text-right text-foreground">{fmtK(costCentres.reduce((s, c) => s + c.actual, 0))}</span>
          <span className={`text-right ${ytdExpVariance > 0 ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-teal))]"}`}>
            {fmtK(costCentres.reduce((s, c) => s + (c.actual - c.budget), 0))}
          </span>
        </div>
      </div>

      {/* CHRIS full year forecast */}
      <div className="rounded-xl p-4 mb-16" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-2">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Full year forecast</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              At current trajectory, full-year budget variance will be approximately -1.2% ({fmtK(Math.round(ytdNetVariance * 2))}). Agency cost is the only materially adverse line — all other cost centres are on budget or better. Agency normalises by June at current trajectory — H2 should be favourable, potentially recovering ~{fmtK(189000)} of the YTD adverse variance. The December-January spike was a workforce event (2 RN exits), not a structural cost issue. Once permanent recruitment completes, the cost base returns to budget.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
