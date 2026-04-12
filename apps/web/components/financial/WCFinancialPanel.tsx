"use client";

import { Shield, AlertTriangle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { BENCHMARKS, fmtK } from "@/lib/financial-benchmarks";
import { workforce_monthly, psh_cycles } from "@/lib/seed-data";

/**
 * WHS Lead Workers Compensation Financial Panel
 *
 * WC claims/cost, predictive WC signals with dollar exposure,
 * prevention vs claim cost ROI, ISO 45003 compliance value.
 */

const latestWf = workforce_monthly[workforce_monthly.length - 1];
const totalWcHours = workforce_monthly.reduce((s, m) => s + m.wc_hours, 0);
const latestCycle = psh_cycles[psh_cycles.length - 1];
const grevilleaConvergence = latestCycle.teams["TEAM-003"]?.convergence;

export function WCFinancialPanel() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
        Workers compensation financial risk
      </p>

      {/* WC exposure summary */}
      <div className="flex gap-2">
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-base font-bold text-foreground">{totalWcHours}</p>
          <p className="text-[9px] text-muted-foreground">WC hours YTD</p>
        </div>
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-base font-bold text-foreground">{fmtK(totalWcHours * 55)}</p>
          <p className="text-[9px] text-muted-foreground">Est. WC cost YTD</p>
        </div>
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-base font-bold text-[hsl(var(--brand-amber))]">1</p>
          <p className="text-[9px] text-muted-foreground">Active claim</p>
        </div>
      </div>

      {/* Predictive WC signal */}
      <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))]" style={{ background: "rgba(212,160,23,0.06)" }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">PREDICTIVE</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">PSH</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Financial</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Grevillea Wing: WC claim probability elevated</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          PSH_10 (Violence and Aggression) + PSH_08 (Traumatic Exposure) co-elevated for 6 cycles in Grevillea Wing.
          Historical correlation: 68% of comparable teams with this profile have a WC claim within 4-6 weeks.
          <span className="font-medium text-[hsl(var(--brand-terracotta))]"> Estimated claim cost: {fmtK(BENCHMARKS.avg_wc_claim_high)}.</span>
        </p>
        <div className="flex gap-2">
          <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
            Prescribe Level 2 intervention →
          </button>
          <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
            Build advocacy brief →
          </button>
        </div>
      </div>

      {/* Prevention vs claim ROI */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-sm font-semibold text-foreground mb-2">Prevention vs claim cost</p>
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Average WC claim cost (aged care)</span>
            <span className="font-bold text-[hsl(var(--brand-terracotta))]">{fmtK(BENCHMARKS.avg_wc_claim_low)}–{fmtK(BENCHMARKS.avg_wc_claim_high)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Level 4 practice cost</span>
            <span className="font-bold text-[hsl(var(--brand-teal))]">~$0 + 2h leader time/fortnight</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Level 2 intervention cost</span>
            <span className="font-medium text-foreground">$2,000–$5,000 specialist input</span>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "rgba(27,67,50,0.05)" }}>
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            The practice prescribed for Wattle Wing last cycle (MP_033) cost ~2 hours of leader time per fortnight.
            If it prevents one WC claim, the ROI is &gt;100:1. Level 2 intervention for Grevillea Wing at $3,000
            vs estimated claim exposure of {fmtK(BENCHMARKS.avg_wc_claim_high)} — the economics are clear.
          </p>
        </div>
      </div>

      {/* ISO 45003 penalty exposure */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-sm font-semibold text-foreground mb-1">ISO 45003 compliance value</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          Non-compliance with ISO 45003 + QS 2.8.2 when both NSW WHS Regulation 2025 and Aged Care Act 2024 apply:
          <span className="font-medium text-[hsl(var(--brand-terracotta))]"> combined penalty exposure &gt;{fmtK(BENCHMARKS.iso_45003_combined_penalty)} per breach.</span>
        </p>
        <p className="text-[10px] text-muted-foreground/70 mb-2">
          Your ISO 45003 evidence pack is audit-ready for 3 of 4 categories. An ACQSC audit finding on psychological safety
          would cost $15,000-50,000 in external consultant response + operational disruption.
          Cost of maintaining current evidence: $0 + CHRIS time.
        </p>
        <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          Export ISO 45003 evidence pack →
        </button>
      </div>
    </div>
  );
}
