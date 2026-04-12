"use client";

import { DollarSign, Users, BedDouble, AlertTriangle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import {
  BENCHMARKS, currentMetrics, fmtK,
  tonightRosterCost,
} from "@/lib/financial-benchmarks";
import { facility, workforce_monthly, financial_monthly } from "@/lib/seed-data";

/**
 * DON Operational Financial Panel
 *
 * Shows financial consequences of the DON's daily decisions:
 * - Tonight's roster cost (agency vs permanent premium)
 * - Occupancy revenue (vacant beds × $420/day)
 * - AN-ACC reassessment flags
 * - Weekly financial summary
 *
 * Principle: CHRIS makes financial consequences visible at the
 * point of decision, not in a monthly report two weeks later.
 */

const latestWf = workforce_monthly[workforce_monthly.length - 1];

// Simulated tonight's roster — 1 agency RN, rest permanent
const tonight = tonightRosterCost(1, 4);

export function OperationalFinancialPanel() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
        Financial impact — your decisions today
      </p>

      {/* Tonight's roster cost */}
      <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))]">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-4 h-4 text-[hsl(var(--brand-amber))]" />
          <p className="text-sm font-semibold text-foreground">Tonight&apos;s roster cost</p>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="text-center">
            <p className="text-xs font-bold text-foreground">{fmtK(tonight.permanentCost)}</p>
            <p className="text-[9px] text-muted-foreground">Permanent (4 shifts)</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-[hsl(var(--brand-terracotta))]">{fmtK(tonight.agencyCost)}</p>
            <p className="text-[9px] text-muted-foreground">Agency (1 RN shift)</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-[hsl(var(--brand-amber))]">+{fmtK(tonight.premium)}</p>
            <p className="text-[9px] text-muted-foreground">Premium vs permanent</p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "rgba(27,67,50,0.05)" }}>
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Tonight&apos;s unfilled RN shift costs ${BENCHMARKS.agency_rn_shift_cost} agency vs ${BENCHMARKS.permanent_rn_shift_cost} permanent — ${BENCHMARKS.agency_rn_shift_premium} premium.
            This week&apos;s agency total so far: ~{fmtK(tonight.premium * 5)} above permanent equivalent.
          </p>
        </div>
      </div>

      {/* Occupancy and revenue */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <BedDouble className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">Occupancy &amp; revenue</p>
        </div>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-2xl font-bold text-foreground">{Math.round(currentMetrics.occupancy * 100)}%</span>
          <span className="text-xs text-muted-foreground">
            {facility.beds - currentMetrics.vacantBeds}/{facility.beds} beds · {currentMetrics.vacantBeds} vacant
          </span>
        </div>
        {currentMetrics.vacantBeds > 0 && (
          <p className="text-[11px] text-muted-foreground mb-2">
            Each vacant bed costs ~${BENCHMARKS.revenue_per_vacant_bed_day}/day in foregone revenue.{" "}
            <span className="font-medium text-[hsl(var(--brand-amber))]">
              {currentMetrics.vacantBeds} vacant = {fmtK(currentMetrics.vacantBeds * BENCHMARKS.revenue_per_vacant_bed_day)}/day.
            </span>
          </p>
        )}
        {currentMetrics.occupancy < BENCHMARKS.occupancy && (
          <p className="text-[10px] text-muted-foreground/70">
            Sector average: {(BENCHMARKS.occupancy * 100).toFixed(1)}%. You are {((BENCHMARKS.occupancy - currentMetrics.occupancy) * 100).toFixed(1)}pp below.
          </p>
        )}
      </div>

      {/* AN-ACC reassessment flags */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-[hsl(var(--brand-amber))]" />
          <p className="text-sm font-semibold text-foreground">AN-ACC reassessments</p>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          3 residents approaching reassessment. Accurate classification protects funding — DON should prioritise clinical review before assessment dates.
        </p>
        <p className="text-[11px] text-muted-foreground/70 mb-2">
          Estimated revenue impact if all reclassify downward: <span className="font-medium text-[hsl(var(--brand-amber))]">-$8.2K/month</span>
        </p>
        <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
          Schedule clinical reviews →
        </button>
      </div>

      {/* Weekly financial summary — one simple card */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">This week — financial summary</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Agency shifts</span>
            <span className="font-medium text-foreground">5 shifts · premium {fmtK(5 * BENCHMARKS.agency_rn_shift_premium)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Agency as % care hours</span>
            <span className={`font-medium ${currentMetrics.agencyPctCareWorkforce > 15 ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-teal))]"}`}>
              {currentMetrics.agencyPctCareWorkforce}%
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Occupancy</span>
            <span className="font-medium text-foreground">{Math.round(currentMetrics.occupancy * 100)}% · {currentMetrics.vacantBeds} beds vacant</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">AN-ACC flags</span>
            <span className="font-medium text-[hsl(var(--brand-amber))]">3 residents for review</span>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2.5 rounded-lg mt-3" style={{ background: "rgba(27,67,50,0.05)" }}>
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Financial health: <span className="font-medium text-foreground">recovering</span>.
            Agency reducing month on month ({currentMetrics.agencyPctCareWorkforce}%, down from 28% in January).
            YTD agency premium above normal is ~{fmtK(financial_monthly_ytd_premium())} — this recovers as permanent recruitment resolves.
          </p>
        </div>
      </div>
    </div>
  );
}

function financial_monthly_ytd_premium(): number {
  // Sum agency cost above October baseline ($98K)
  return financial_monthly.reduce((s, m) => s + Math.max(0, m.expenditure.direct_care_agency - 98000), 0);
}
