"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { financial_monthly, facility } from "@/lib/seed-data";
import { BENCHMARKS } from "@/lib/financial-benchmarks";
import { BarChart, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from "recharts";

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const DAYS = [31, 30, 31, 31, 28, 31];

const chartData = financial_monthly.map((m, i) => {
  const bd = facility.beds * DAYS[i];
  return {
    month: MONTHS[i],
    annacc: Math.round(m.revenue.annacc_residential / bd),
    hotelling: Math.round((m.revenue.total - m.revenue.annacc_residential) / bd),
    total: Math.round(m.revenue.total / bd),
  };
});

const ytdRevenue = financial_monthly.reduce((s, m) => s + m.revenue.total, 0);
const ytdBudget = financial_monthly.reduce((s, m) => s + m.revenue.budget, 0);
const ytdVariance = ytdRevenue - ytdBudget;
const ytdVariancePct = Math.round((ytdVariance / ytdBudget) * 1000) / 10;

export default function RevenueDetailPage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/financial")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Revenue Detail</p>
            <p className="text-[10px] text-muted-foreground">{facility.provider_name} · FY2026</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* YTD headline */}
      <div className="flex gap-2 mb-4">
        <div className="bg-card rounded-lg px-4 py-3 border border-border flex-1 text-center">
          <p className={`text-lg font-bold ${ytdVariancePct >= 0 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]"}`}>
            {ytdVariancePct > 0 ? "+" : ""}{ytdVariancePct}%
          </p>
          <p className="text-[9px] text-muted-foreground">YTD vs budget</p>
        </div>
        <div className="bg-card rounded-lg px-4 py-3 border border-border flex-1 text-center">
          <p className="text-lg font-bold text-foreground">${Math.round(ytdRevenue / 1000000 * 10) / 10}M</p>
          <p className="text-[9px] text-muted-foreground">YTD revenue</p>
        </div>
        <div className="bg-card rounded-lg px-4 py-3 border border-border flex-1 text-center">
          <p className="text-lg font-bold text-foreground">${chartData[chartData.length - 1].total}</p>
          <p className="text-[9px] text-muted-foreground">$/bed/day (Mar)</p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-0.5">Revenue per bed day</p>
        <p className="text-[10px] text-muted-foreground mb-3">6 months · AN-ACC + hotelling/accommodation</p>

        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--brand-forest))]" /><span className="text-[9px] text-muted-foreground">AN-ACC</span></div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--brand-teal))]" /><span className="text-[9px] text-muted-foreground">Hotelling + accommodation</span></div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barGap={0} barCategoryGap="20%">
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(152 20% 35%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(152 20% 55%)" }} axisLine={false} tickLine={false} width={36} tickFormatter={(v: number) => `$${v}`} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(30 15% 88%)" }} />
            <ReferenceLine
              y={BENCHMARKS.revenue_bed_day}
              stroke="hsl(152 20% 65%)"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{ value: `Sector ~$${BENCHMARKS.revenue_bed_day}`, position: "right", fontSize: 9, fill: "hsl(152 20% 55%)" }}
            />
            <Bar dataKey="annacc" stackId="rev" fill="hsl(152, 45%, 15%)" name="AN-ACC" />
            <Bar dataKey="hotelling" stackId="rev" radius={[2, 2, 0, 0]} fill="hsl(170, 46%, 33%)" name="Hotelling + Accom" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly breakdown table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        <div className="grid grid-cols-5 gap-1 px-3 py-2 border-b border-border text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Month</span>
          <span className="text-right">AN-ACC</span>
          <span className="text-right">Other</span>
          <span className="text-right">Total</span>
          <span className="text-right">vs Budget</span>
        </div>
        {financial_monthly.map((m, i) => {
          const variance = m.revenue.variance;
          return (
            <div key={m.period} className="grid grid-cols-5 gap-1 px-3 py-2 border-b border-border last:border-b-0 text-xs">
              <span className="font-medium text-foreground">{MONTHS[i]}</span>
              <span className="text-right text-muted-foreground">${Math.round(m.revenue.annacc_residential / 1000)}K</span>
              <span className="text-right text-muted-foreground">${Math.round((m.revenue.total - m.revenue.annacc_residential) / 1000)}K</span>
              <span className="text-right font-medium text-foreground">${Math.round(m.revenue.total / 1000)}K</span>
              <span className={`text-right font-medium ${variance >= 0 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-terracotta))]"}`}>
                {variance >= 0 ? "+" : ""}{variance >= 1000 || variance <= -1000 ? `$${Math.round(variance / 1000)}K` : `$${Math.round(variance / 100) * 100}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* CHRIS analysis */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-2">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Revenue is running {ytdVariancePct > 0 ? "+" : ""}{ytdVariancePct}% vs budget YTD. AN-ACC is the stable component — classification mix is unchanged and generating ~${chartData[0].annacc}/bed/day. The January dip was occupancy-driven — {Math.round(facility.beds * (1 - financial_monthly[3].occupancy_pct))} vacant beds for 3 weeks following departures. Occupancy has recovered to {(financial_monthly[5].occupancy_pct * 100).toFixed(1)}%. Hotelling improved following the hotelling supplement increase ($22.15/day). Revenue trajectory is positive.
          </p>
        </div>
      </div>

      {/* AN-ACC risk panel */}
      <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-16">
        <p className="text-sm font-semibold text-foreground mb-1">AN-ACC reassessment risk</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          3 residents approaching reassessment. Estimated impact if all reclassify downward: <span className="font-medium text-[hsl(var(--brand-amber))]">-$8.2K/month</span>.
        </p>
        <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
          Alert DON to prioritise clinical review →
        </button>
      </div>
    </div>
  );
}
