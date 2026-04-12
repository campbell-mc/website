"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { financial_monthly, facility } from "@/lib/seed-data";
import { BENCHMARKS } from "@/lib/financial-benchmarks";
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const DAYS = [31, 30, 31, 31, 28, 31];

const chartData = financial_monthly.map((m, i) => {
  const bd = facility.beds * DAYS[i];
  const careRevPerBD = Math.round((m.expenditure.direct_care_permanent + m.expenditure.direct_care_agency) / bd);
  const revPerBD = Math.round(m.revenue.total / bd);
  return {
    month: MONTHS[i],
    ratio: Math.round(m.care_ratio * 1000) / 10,
    labourPerBD: careRevPerBD,
    revenuePerBD: revPerBD,
    agencyPct: Math.round(m.agency_cost_pct_of_care_workforce * 100),
  };
});

const latest = financial_monthly[financial_monthly.length - 1];
const latestRatio = Math.round(latest.care_ratio * 1000) / 10;

// Forward projection
const projection = [
  { month: "Apr", ratio: 52.4 },
  { month: "May", ratio: 53.8 },
  { month: "Jun", ratio: 55.1 },
];

export default function CareRatioPage() {
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
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Care Ratio Analysis</p>
            <p className="text-[10px] text-muted-foreground">Target: ≥55% · Current: {latestRatio}% · Sector avg: ~51%</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* Main chart */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-0.5">Care ratio trend</p>
        <p className="text-[10px] text-muted-foreground mb-3">6 months actual + 3-month projection</p>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[...chartData, ...projection.map((p) => ({ ...p, projected: true }))]} margin={{ top: 5, right: 40, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 15% 90%)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(152 20% 35%)" }} axisLine={false} tickLine={false} />
            <YAxis domain={[48, 58]} tick={{ fontSize: 9, fill: "hsl(152 20% 55%)" }} axisLine={false} tickLine={false} width={32} tickFormatter={(v: number) => `${v}%`} />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(30 15% 88%)" }} formatter={(v: any) => [`${v}%`, "Care Ratio"]} />
            <ReferenceLine
              y={55}
              stroke="hsl(var(--brand-amber))"
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{ value: "55% target", position: "right", fontSize: 9, fill: "hsl(var(--brand-amber))" }}
            />
            <ReferenceLine
              y={51}
              stroke="hsl(152 20% 70%)"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{ value: "Sector avg ~51%", position: "right", fontSize: 9, fill: "hsl(152 20% 60%)" }}
            />
            <Line type="monotone" dataKey="ratio" stroke="hsl(20, 60%, 52%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(20, 60%, 52%)" }} connectNulls />
          </LineChart>
        </ResponsiveContainer>

        {/* Annotations */}
        <div className="flex items-center gap-4 mt-2 text-[9px] text-muted-foreground">
          <span>Dec: RN exits → agency surge</span>
          <span>Jan: Agency peak 28%</span>
          <span>Mar: Recovering</span>
        </div>
      </div>

      {/* What drives care ratio */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-2">What drives the care ratio</p>
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Care revenue (AN-ACC + hotelling)</span>
            <span className="font-medium text-foreground">${chartData[5].revenuePerBD}/bed/day · stable</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Direct care labour cost</span>
            <span className="font-medium text-[hsl(var(--brand-terracotta))]">${chartData[5].labourPerBD}/bed/day · the variable</span>
          </div>
          <div className="border-t border-border pt-2">
            <p className="text-xs text-muted-foreground">
              Care ratio = direct care labour ÷ care revenue.
              The ratio is below target because <span className="font-medium text-foreground">labour cost rose, not because revenue fell</span>.
              Specifically: agency labour peaked at ${chartData[3].labourPerBD}/bed/day in January vs ~${chartData[0].labourPerBD}/bed/day in October.
            </p>
          </div>
        </div>
      </div>

      {/* Recovery trajectory */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-2">Recovery trajectory</p>
        <div className="space-y-1.5 mb-3">
          {projection.map((p) => (
            <div key={p.month} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{p.month} projected</span>
              <span className={`font-bold ${p.ratio >= 55 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]"}`}>
                {p.ratio}% {p.ratio >= 55 ? "✅ target achieved" : ""}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/70">
          Projection assumes agency dependency continues reducing at current rate.
        </p>
      </div>

      {/* Sector context */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-2">Sector context</p>
        <div className="space-y-1.5 mb-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Your care ratio</span>
            <span className="font-bold text-foreground">{latestRatio}%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">StewartBrown sector average</span>
            <span className="text-muted-foreground">~51-53%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">StewartBrown top quartile</span>
            <span className="text-muted-foreground">&gt;58%</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/70">
          Care ratio is a sector-wide challenge. Your trajectory is positive.
        </p>
      </div>

      {/* CHRIS interpretation */}
      <div className="rounded-xl p-4 mb-16" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-2">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            The care ratio dipped to {chartData[3].ratio}% in January — the lowest point — driven entirely by the agency cost spike following the Wattle Wing RN exits. Revenue was stable throughout.
            March is at {latestRatio}%, recovering. At current trajectory, the 55% target is achievable by June 2026 as agency dependency normalises.
            The sector average sits around 51-53%, so you are not an outlier — but your pre-December trajectory of 54.5% shows this facility can achieve above-sector performance when workforce is stable.
          </p>
        </div>
      </div>
    </div>
  );
}
