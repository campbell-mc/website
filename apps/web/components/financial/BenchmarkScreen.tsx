"use client";

import AGED_CARE_KNOWLEDGE from "@/lib/chris/aged-care-knowledge";
import { financial_monthly } from "@/lib/seed-data";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

// ── TYPES ────────────────────────────────────────────────────

interface BenchmarkMetric {
  label: string;
  facilityValue: number;
  facilityDisplay: string;
  sectorAverage: number;
  sectorDisplay: string;
  topQuartile: number;
  topQuartileDisplay: string;
  unit: string;
  lowerIsBetter?: boolean;
  quartilePosition: "top" | "second" | "third" | "fourth";
  gapToAverage: number;
  gapToAverageAnnualised: number;
  gapToTopQuartile: number;
  gapToTopQuartileAnnualised: number;
  beds: number;
  urgency: "good" | "watch" | "act";
  driver?: string;
}

// ── HELPERS ──────────────────────────────────────────────────

function getQuartilePosition(
  value: number,
  avg: number,
  top: number,
  lowerIsBetter = false
): "top" | "second" | "third" | "fourth" {
  if (lowerIsBetter) {
    if (value <= top) return "top";
    if (value <= avg * 0.9) return "second";
    if (value <= avg * 1.1) return "third";
    return "fourth";
  }
  if (value >= top) return "top";
  if (value >= avg) return "second";
  if (value >= avg * 0.85) return "third";
  return "fourth";
}

const QUARTILE_COLORS = {
  top: { bg: "bg-[#F0F7F4]", text: "text-[#1B4332]", border: "border-[#2D7D73]", label: "Top quartile" },
  second: { bg: "bg-[#F0F7F4]", text: "text-[#2D7D73]", border: "border-[#6BAF92]", label: "2nd quartile" },
  third: { bg: "bg-[#FFFBF0]", text: "text-[#D4A017]", border: "border-[#D4A017]", label: "3rd quartile" },
  fourth: { bg: "bg-[#FEF7F0]", text: "text-[#C4704A]", border: "border-[#C4704A]", label: "4th quartile" },
};

const BAR_COLORS = {
  top: "bg-[#2D7D73]",
  second: "bg-[#6BAF92]",
  third: "bg-[#D4A017]",
  fourth: "bg-[#C4704A]",
};

function fmtDollar(n: number): string {
  if (Math.abs(n) >= 1000) return `$${Math.round(n / 1000).toLocaleString("en-AU")}K`;
  return `$${Math.round(n).toLocaleString("en-AU")}`;
}

// ── COMPONENT ────────────────────────────────────────────────

export function BenchmarkScreen() {
  const sb = AGED_CARE_KNOWLEDGE.stewartbrown_benchmarks.residential;
  const latestFin = financial_monthly[financial_monthly.length - 1];
  const beds = 137;

  // Facility metrics from seed data
  const facilityMetrics = {
    ebitda_pbd: 16.10,
    care_ratio: latestFin.care_ratio,
    occupancy: latestFin.occupancy_pct,
    agency_pct: 0.18,
    direct_care_labour_pbd: 212.00,
    accommodation_revenue_pbd: 41.20,
    care_minutes_pbd: 201,
    rn_minutes_pbd: 37,
  };

  const metrics: BenchmarkMetric[] = [
    {
      label: "EBITDA per bed day",
      facilityValue: facilityMetrics.ebitda_pbd,
      facilityDisplay: `$${facilityMetrics.ebitda_pbd.toFixed(2)}`,
      sectorAverage: sb.ebitda.per_bed_day.sector_average,
      sectorDisplay: `$${sb.ebitda.per_bed_day.sector_average}`,
      topQuartile: sb.ebitda.per_bed_day.top_quartile_threshold,
      topQuartileDisplay: `$${sb.ebitda.per_bed_day.top_quartile_threshold}+`,
      unit: "per occupied bed day",
      quartilePosition: getQuartilePosition(facilityMetrics.ebitda_pbd, sb.ebitda.per_bed_day.sector_average, sb.ebitda.per_bed_day.top_quartile_threshold),
      gapToAverage: sb.ebitda.per_bed_day.sector_average - facilityMetrics.ebitda_pbd,
      gapToAverageAnnualised: (sb.ebitda.per_bed_day.sector_average - facilityMetrics.ebitda_pbd) * 365 * beds,
      gapToTopQuartile: sb.ebitda.per_bed_day.top_quartile_threshold - facilityMetrics.ebitda_pbd,
      gapToTopQuartileAnnualised: (sb.ebitda.per_bed_day.top_quartile_threshold - facilityMetrics.ebitda_pbd) * 365 * beds,
      beds,
      urgency: facilityMetrics.ebitda_pbd >= sb.ebitda.per_bed_day.sector_average ? "good" : facilityMetrics.ebitda_pbd >= sb.ebitda.per_bed_day.sector_average * 0.8 ? "watch" : "act",
      driver: "Agency cost primary drag — $950/week premium above permanent equivalent",
    },
    {
      label: "Care ratio",
      facilityValue: facilityMetrics.care_ratio,
      facilityDisplay: `${(facilityMetrics.care_ratio * 100).toFixed(1)}%`,
      sectorAverage: sb.labour.care_ratio.sector_average,
      sectorDisplay: `${(sb.labour.care_ratio.sector_average * 100).toFixed(0)}%`,
      topQuartile: sb.labour.care_ratio.top_quartile,
      topQuartileDisplay: `${(sb.labour.care_ratio.top_quartile * 100).toFixed(0)}%`,
      unit: "labour as % of care revenue",
      lowerIsBetter: true,
      quartilePosition: getQuartilePosition(facilityMetrics.care_ratio, sb.labour.care_ratio.sector_average, sb.labour.care_ratio.top_quartile, true),
      gapToAverage: facilityMetrics.care_ratio - sb.labour.care_ratio.sector_average,
      gapToAverageAnnualised: 0,
      gapToTopQuartile: facilityMetrics.care_ratio - sb.labour.care_ratio.top_quartile,
      gapToTopQuartileAnnualised: 0,
      beds,
      urgency: "good",
      driver: "Strong — well below sector average. Agency costs are elevated but overall ratio favourable.",
    },
    {
      label: "Occupancy",
      facilityValue: facilityMetrics.occupancy,
      facilityDisplay: `${(facilityMetrics.occupancy * 100).toFixed(1)}%`,
      sectorAverage: sb.occupancy.sector_average,
      sectorDisplay: `${(sb.occupancy.sector_average * 100).toFixed(1)}%`,
      topQuartile: sb.occupancy.top_quartile,
      topQuartileDisplay: `${(sb.occupancy.top_quartile * 100).toFixed(1)}%`,
      unit: "",
      quartilePosition: getQuartilePosition(facilityMetrics.occupancy, sb.occupancy.sector_average, sb.occupancy.top_quartile),
      gapToAverage: facilityMetrics.occupancy - sb.occupancy.sector_average,
      gapToAverageAnnualised: 0,
      gapToTopQuartile: facilityMetrics.occupancy - sb.occupancy.top_quartile,
      gapToTopQuartileAnnualised: 0,
      beds,
      urgency: "good",
      driver: `3 vacant beds at $${sb.occupancy.revenue_per_bed_day}/day = $${3 * sb.occupancy.revenue_per_bed_day}/day foregone — occupancy strong but not at capacity`,
    },
    {
      label: "Agency usage",
      facilityValue: facilityMetrics.agency_pct,
      facilityDisplay: `${(facilityMetrics.agency_pct * 100).toFixed(0)}%`,
      sectorAverage: sb.labour.agency.chris_alert_threshold,
      sectorDisplay: "15% (CHRIS alert)",
      topQuartile: 0.10,
      topQuartileDisplay: "<10%",
      unit: "of all shifts",
      lowerIsBetter: true,
      quartilePosition: "third",
      gapToAverage: facilityMetrics.agency_pct - sb.labour.agency.chris_alert_threshold,
      gapToAverageAnnualised: Math.round((facilityMetrics.agency_pct - 0.15) * beds * 365 * sb.labour.agency.typical_rn_premium_per_shift / 8),
      gapToTopQuartile: facilityMetrics.agency_pct - 0.10,
      gapToTopQuartileAnnualised: Math.round((facilityMetrics.agency_pct - 0.10) * beds * 365 * sb.labour.agency.typical_rn_premium_per_shift / 8),
      beds,
      urgency: "watch",
      driver: "Structural Sunday PM RN gap identified by Steward — resolving reduces agency dependency",
    },
    {
      label: "Direct care minutes",
      facilityValue: facilityMetrics.care_minutes_pbd,
      facilityDisplay: `${facilityMetrics.care_minutes_pbd} min`,
      sectorAverage: sb.care_minutes.sector_average_pbd,
      sectorDisplay: `${sb.care_minutes.sector_average_pbd} min`,
      topQuartile: sb.care_minutes.top_quartile_pbd,
      topQuartileDisplay: `${sb.care_minutes.top_quartile_pbd}+ min`,
      unit: "per resident per day",
      quartilePosition: "third",
      gapToAverage: sb.care_minutes.sector_average_pbd - facilityMetrics.care_minutes_pbd,
      gapToAverageAnnualised: 0,
      gapToTopQuartile: sb.care_minutes.top_quartile_pbd - facilityMetrics.care_minutes_pbd,
      gapToTopQuartileAnnualised: 0,
      beds,
      urgency: "watch",
      driver: `Tonight 14 minutes short of regulatory minimum (${sb.care_minutes.regulatory_minimum_total}). Weekly compliance strong — tonight is an anomaly.`,
    },
  ];

  const topCount = metrics.filter((m) => m.quartilePosition === "top").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Sector Benchmarks</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            vs StewartBrown ACFPS FY25 · {topCount} metrics in top quartile
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground/60">Source: StewartBrown ACFPS</p>
          <p className="text-xs text-muted-foreground/60">FY25 (June 2025) · 1,192 homes</p>
          <p className="text-xs text-[hsl(var(--brand-teal))] font-medium mt-1">Updated quarterly</p>
        </div>
      </div>

      {/* Quartile summary grid */}
      <div className="grid grid-cols-4 gap-3">
        {(["top", "second", "third", "fourth"] as const).map((q) => {
          const count = metrics.filter((m) => m.quartilePosition === q).length;
          const c = QUARTILE_COLORS[q];
          return (
            <div key={q} className={`rounded-xl border ${c.border} ${c.bg} p-3 text-center`}>
              <p className={`text-2xl font-bold ${c.text}`}>{count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* Individual metrics */}
      <div className="space-y-4">
        {metrics.map((metric) => {
          const c = QUARTILE_COLORS[metric.quartilePosition];
          const isAboveAvg = metric.lowerIsBetter
            ? metric.facilityValue <= metric.sectorAverage
            : metric.facilityValue >= metric.sectorAverage;
          const pctDiff = Math.abs(
            metric.lowerIsBetter
              ? ((metric.sectorAverage - metric.facilityValue) / metric.sectorAverage) * 100
              : ((metric.facilityValue - metric.sectorAverage) / metric.sectorAverage) * 100
          );

          return (
            <div key={metric.label} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
              {/* Metric header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{metric.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{metric.unit}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.bg} ${c.text} border ${c.border} shrink-0`}>
                  {c.label}
                </span>
              </div>

              {/* Benchmark bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Your facility: <strong className={c.text}>{metric.facilityDisplay}</strong></span>
                  <span>Top quartile: <strong>{metric.topQuartileDisplay}</strong></span>
                </div>

                {/* Visual bar */}
                <div className="relative h-2 bg-muted rounded-full">
                  {/* Sector average marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/40 rounded-full"
                    style={{ left: `${Math.min((metric.sectorAverage / (metric.topQuartile * 1.2)) * 100, 85)}%` }}
                  />
                  {/* Facility value bar */}
                  <div
                    className={`absolute top-0 bottom-0 left-0 rounded-full ${BAR_COLORS[metric.quartilePosition]}`}
                    style={{
                      width: `${Math.min(
                        metric.lowerIsBetter
                          ? Math.max(0, (1 - metric.facilityValue / (metric.sectorAverage * 1.5)) * 100)
                          : (metric.facilityValue / (metric.topQuartile * 1.1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 mt-1">
                  <span>Sector avg: {metric.sectorDisplay}</span>
                  <span className={isAboveAvg ? "text-[#2D7D73]" : "text-[#C4704A]"}>
                    {isAboveAvg ? "\u2191" : "\u2193"} {pctDiff.toFixed(1)}% vs sector avg
                  </span>
                </div>
              </div>

              {/* Dollar impact */}
              {metric.gapToAverageAnnualised !== 0 && (
                <div className={`rounded-lg p-2.5 mb-3 ${metric.gapToAverageAnnualised > 0 ? "bg-[#FEF7F0]" : "bg-[#F0F7F4]"}`}>
                  <p className={`text-xs font-semibold ${metric.gapToAverageAnnualised > 0 ? "text-[#C4704A]" : "text-[#2D7D73]"}`}>
                    {metric.gapToAverageAnnualised > 0
                      ? `\u2013${fmtDollar(Math.abs(metric.gapToAverageAnnualised))} vs sector average/year`
                      : `+${fmtDollar(Math.abs(metric.gapToAverageAnnualised))} above sector average/year`}
                  </p>
                  {metric.gapToTopQuartileAnnualised > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Gap to top quartile: \u2013{fmtDollar(Math.abs(metric.gapToTopQuartileAnnualised))}/year
                    </p>
                  )}
                </div>
              )}

              {/* Driver */}
              {metric.driver && (
                <p className="text-xs text-muted-foreground italic">{metric.driver}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Oracle analysis card */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[hsl(var(--brand-teal))] flex items-center justify-center">
            <span className="text-white text-xs font-bold">O</span>
          </div>
          <p className="text-sm font-semibold text-foreground">Oracle — benchmark analysis</p>
          <span className="text-xs text-muted-foreground ml-auto">Updated Sunday 21:00</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed font-serif-accent">
          Your care ratio at {(facilityMetrics.care_ratio * 100).toFixed(1)}% is in the top quartile — a genuine strength.
          The primary gap to sector EBITDA benchmarks is agency cost at 18% of shifts.
          Resolving the Steward&apos;s structural Sunday PM gap recommendation would contribute
          $4,940/year. The three AN-ACC reclassification opportunities identified this week
          represent $11,400/month — the single highest-return action available right now
          against the benchmark gap.
        </p>
        <div className="flex gap-3 mt-3 pt-3 border-t border-border">
          <button className="text-xs text-[hsl(var(--brand-teal))] font-medium">View full Oracle report &rarr;</button>
          <button className="text-xs text-muted-foreground">Ask CHRIS about benchmarks</button>
        </div>
      </div>

      {/* Source info */}
      <div className="bg-muted/50 rounded-xl p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">
          About these benchmarks
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Benchmarks sourced from the StewartBrown Aged Care Financial Performance Survey (ACFPS)
          FY2025, covering {AGED_CARE_KNOWLEDGE.stewartbrown_benchmarks.metadata.facilities_in_survey.toLocaleString()} residential
          aged care homes and {AGED_CARE_KNOWLEDGE.stewartbrown_benchmarks.metadata.beds_in_survey.toLocaleString()} beds
          across Australia. The ACFPS is the largest financial benchmark in the Australian aged care sector,
          published quarterly.
        </p>
        <div className="flex gap-4 mt-3">
          <div>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide">Current period</p>
            <p className="text-xs font-semibold text-foreground">FY25 (June 2025)</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide">Facilities surveyed</p>
            <p className="text-xs font-semibold text-foreground">1,192</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide">Next update</p>
            <p className="text-xs font-semibold text-foreground">Feb 2026 (Q2 FY26)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
