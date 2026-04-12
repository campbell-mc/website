"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { financial_monthly, facility } from "@/lib/seed-data";
import { BENCHMARKS } from "@/lib/financial-benchmarks";
import { BarChart, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, Cell } from "recharts";

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const ANNOTATIONS: Record<string, string> = {
  Dec: "First RN exit",
  Jan: "Peak — 2 RN vacancies",
  Mar: "New RN settling in",
};

const chartData = financial_monthly.map((m, i) => ({
  month: MONTHS[i],
  agency: Math.round(m.expenditure.direct_care_agency / 1000),
  pct: Math.round(m.agency_cost_pct_of_care_workforce * 100),
  annotation: ANNOTATIONS[MONTHS[i]] || null,
}));

const latest = financial_monthly[financial_monthly.length - 1];
const latestAgency = Math.round(latest.expenditure.direct_care_agency / 1000);
const latestPct = Math.round(latest.agency_cost_pct_of_care_workforce * 100);
const ytdAgency = financial_monthly.reduce((s, m) => s + m.expenditure.direct_care_agency, 0);
const ytdPremium = financial_monthly.reduce((s, m) => s + Math.max(0, m.expenditure.direct_care_agency - 98000), 0);
const baselineAgency = 98000; // October — "normal"

function barColor(pct: number): string {
  if (pct > 20) return "hsl(20, 60%, 52%)";  // terracotta
  if (pct > 15) return "hsl(45, 82%, 46%)";  // amber
  return "hsl(170, 46%, 33%)";                // teal
}

export default function AgencyCostPage() {
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
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Agency Cost Analysis</p>
            <p className="text-[10px] text-muted-foreground">Current: ${latestAgency}K/month · {latestPct}% of care workforce · Target: &lt;15%</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* Agency trend chart */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-0.5">Agency cost by month</p>
        <p className="text-[10px] text-muted-foreground mb-3">Coloured by threshold: teal &lt;15% · amber 15-20% · terracotta &gt;20%</p>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barCategoryGap="20%">
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(152 20% 35%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(152 20% 55%)" }} axisLine={false} tickLine={false} width={36} tickFormatter={(v: number) => `$${v}K`} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(30 15% 88%)" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => [`$${v}K`, "Agency Cost"]}
            />
            <ReferenceLine
              y={Math.round(baselineAgency / 1000)}
              stroke="hsl(170, 46%, 33%)"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{ value: `$${Math.round(baselineAgency / 1000)}K baseline`, position: "right", fontSize: 9, fill: "hsl(170, 46%, 33%)" }}
            />
            <Bar dataKey="agency" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={barColor(entry.pct)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Annotations below chart */}
        <div className="flex items-center gap-3 mt-2">
          {chartData.filter((d) => d.annotation).map((d) => (
            <span key={d.month} className="text-[9px] text-muted-foreground">
              {d.month}: {d.annotation}
            </span>
          ))}
        </div>
      </div>

      {/* Cost premium analysis */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-2">Cost premium analysis</p>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Agency RN shift rate</span>
            <span className="font-medium text-foreground">~${BENCHMARKS.agency_rn_shift_cost}/shift</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Permanent RN equivalent</span>
            <span className="font-medium text-foreground">~${BENCHMARKS.permanent_rn_shift_cost}/shift</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Premium per agency shift</span>
            <span className="font-bold text-[hsl(var(--brand-terracotta))]">${BENCHMARKS.agency_rn_shift_premium}</span>
          </div>
          <div className="border-t border-border pt-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">YTD total premium (above Oct baseline)</span>
            <span className="font-bold text-[hsl(var(--brand-terracotta))]">${Math.round(ytdPremium / 1000)}K</span>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          If agency returns to October levels (11%), monthly saving: <span className="font-bold text-[hsl(var(--brand-teal))]">${Math.round((latest.expenditure.direct_care_agency - baselineAgency) / 1000)}K/month</span>.
          Annualised: <span className="font-bold text-[hsl(var(--brand-teal))]">${Math.round((latest.expenditure.direct_care_agency - baselineAgency) * 12 / 1000)}K/year</span>.
        </div>
      </div>

      {/* Root cause — CHRIS cross-domain signal */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Financial</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Workforce</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">PSH</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Root cause: culture signal, not labour market</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          The agency surge follows 2 Wattle Wing RN exits in December. PSH_13 (Recognition) had been declining in that team for 4 cycles before the exits. This is a culture cost — the RNs didn&apos;t leave for better pay, they left because they didn&apos;t feel valued. The $389K YTD premium is the price of not detecting that signal earlier.
        </p>
        <div className="flex gap-2">
          <button onClick={() => router.push("/dashboard/psh")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">View PSH data →</button>
          <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">Add to ELT agenda →</button>
        </div>
      </div>

      {/* Reduction plan */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-2">Reduction plan</p>
        <div className="space-y-1.5 mb-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Open RN vacancies</span>
            <span className="font-medium text-foreground">1 remaining</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Permanent RN start</span>
            <span className="font-medium text-foreground">In process</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Projected normalisation</span>
            <span className="font-medium text-[hsl(var(--brand-teal))]">June 2026</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Saving to year end if achieved</span>
            <span className="font-bold text-[hsl(var(--brand-teal))]">~$189K</span>
          </div>
        </div>
      </div>

      {/* CHRIS interpretation */}
      <div className="rounded-xl p-4 mb-16" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-2">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Agency peaked at $239K in January — {chartData[3].pct}% of care workforce cost. It has reduced every month since: ${chartData[4].agency}K in February, ${chartData[5].agency}K in March. The new RN is settling in and the remaining vacancy is in recruitment. At current trajectory, agency normalises to ~11% (October levels) by June 2026. The cumulative premium — the cost of not having those two RNs — will be approximately $389K by year end. Recognition practices cost $0.
          </p>
        </div>
      </div>
    </div>
  );
}
