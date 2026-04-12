"use client";

import { Users, TrendingDown } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { BENCHMARKS, fmtK, estimateTurnoverCost, agencyPremium } from "@/lib/financial-benchmarks";
import { workforce_monthly } from "@/lib/seed-data";

/**
 * HR / People & Culture Workforce Financial Panel
 *
 * Turnover cost tracker, agency premium calculator,
 * training compliance financial risk, Leader Loop ROI.
 * Shows HR that every people decision has a price tag.
 */

const tc = estimateTurnoverCost();
const ap = agencyPremium();
const latestWf = workforce_monthly[workforce_monthly.length - 1];

export function WorkforceFinancialPanel() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
        Workforce financial impact
      </p>

      {/* Turnover cost tracker */}
      <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))]">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-[hsl(var(--brand-amber))]" />
          <p className="text-sm font-semibold text-foreground">Turnover cost tracker</p>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">AIN exits (annualised)</span>
            <span className="font-medium text-foreground">{tc.ainExits} exits · {fmtK(tc.ainCostRange[0])}–{fmtK(tc.ainCostRange[1])}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">RN exits (annualised)</span>
            <span className="font-medium text-[hsl(var(--brand-terracotta))]">{tc.rnExits} exits · {fmtK(tc.rnCostRange[0])}–{fmtK(tc.rnCostRange[1])}</span>
          </div>
          <div className="border-t border-border pt-2 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Total estimated turnover cost</span>
            <span className="font-bold text-[hsl(var(--brand-terracotta))]">{fmtK(tc.totalRange[0])}–{fmtK(tc.totalRange[1])}/year</span>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-lg mb-3" style={{ background: "rgba(27,67,50,0.05)" }}>
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            AIN turnover at {Math.round(latestWf.turnover_rolling_12m * 100)}% annualised. CHRIS has traced the highest-churn teams
            to PSH_13 (Recognition) declining 4+ cycles before exits. Cost of turnover at current rate: {fmtK(tc.totalRange[1])}/year.
            Cost of recognition practices: $0. ROI on intervention: significant.
          </p>
        </div>

        <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
          Prescribe recognition practices to at-risk teams →
        </button>
      </div>

      {/* Agency dependency financial model */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-sm font-semibold text-foreground mb-2">Agency dependency premium</p>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Current agency spend</span>
            <span className="font-medium text-foreground">{fmtK(workforce_monthly_latest_agency())}/month</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Permanent equivalent</span>
            <span className="font-medium text-muted-foreground">{fmtK(Math.round(workforce_monthly_latest_agency() / 1.6))}/month</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Monthly premium</span>
            <span className="font-bold text-[hsl(var(--brand-terracotta))]">{fmtK(ap.monthlyPremium)}</span>
          </div>
          <div className="border-t border-border pt-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Annualised saving if normalised to Oct level</span>
            <span className="font-bold text-[hsl(var(--brand-teal))]">{fmtK(ap.savingIfNormalised)}</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/70">
          At current hiring rate, agency normalises by ~June 2026. Saving to year end: ~{fmtK(ap.savingIfNormalised / 2)}.
        </p>
      </div>

      {/* Training compliance financial risk */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-sm font-semibold text-foreground mb-1">Training compliance risk</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          <span className="font-medium text-[hsl(var(--brand-amber))]">{latestWf.credentials_expiring_30d} AHPRA registrations</span> expiring in 30 days.
          If RN registrations lapse, those hours become non-compliant for rostering — each non-compliant shift
          requires agency replacement at ${BENCHMARKS.agency_rn_shift_premium} premium per shift.
        </p>
        <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          Send reminder to affected staff →
        </button>
      </div>

      {/* Leader Loop ROI */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "rgba(27,67,50,0.05)" }}>
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Leader Loop ROI</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Leaders who complete 3+ loops: average team PSH improvement of 0.12. Investment: ~4 hours per leader per cycle.
              Estimated turnover reduction value if all leaders complete loops: {fmtK(Math.round(tc.totalRange[1] * 0.3))}/year.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function workforce_monthly_latest_agency(): number {
  const latest = workforce_monthly[workforce_monthly.length - 1];
  // Approximate from agency_hours_pct and total care cost
  return Math.round(latest.agency_hours_pct * 900000); // rough estimate from seed
}
