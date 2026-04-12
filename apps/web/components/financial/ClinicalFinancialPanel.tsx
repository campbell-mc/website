"use client";

import { AlertTriangle, TrendingUp } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { BENCHMARKS, fmtK } from "@/lib/financial-benchmarks";
import { facility } from "@/lib/seed-data";

/**
 * Clinical Director Financial Panel
 *
 * AN-ACC classification health, reassessment opportunities,
 * care minutes vs AN-ACC targets, admissions mix impact.
 * Shows clinical decisions through a financial lens.
 */

// AN-ACC classification mix from seed data (latest month)
const classificationMix = [
  { label: "Class 1-3 (low)", residents: 12, avgPerDay: 148, pct: 9 },
  { label: "Class 4-7 (medium)", residents: 38, avgPerDay: 246, pct: 28 },
  { label: "Class 8-10 (high)", residents: 52, avgPerDay: 342, pct: 38 },
  { label: "Class 11-13 (very high)", residents: 33, avgPerDay: 458, pct: 24 },
];

const currentRevenuePerBedDay = 295; // From AN-ACC
const optimisedRevenuePerBedDay = 308; // If reassessments completed
const reassessmentUplift = (optimisedRevenuePerBedDay - currentRevenuePerBedDay) * facility.beds * 30;

export function ClinicalFinancialPanel() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
        Clinical financial impact
      </p>

      {/* AN-ACC Classification Health */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-sm font-semibold text-foreground mb-2">AN-ACC classification health</p>
        <div className="space-y-1.5 mb-3">
          {classificationMix.map((c) => (
            <div key={c.label} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">{c.residents} residents · ${c.avgPerDay}/day</span>
            </div>
          ))}
        </div>
        <div className="bg-muted/50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Current mix revenue</span>
            <span className="font-bold text-foreground">${currentRevenuePerBedDay}/bed/day</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Achievable if assessments current</span>
            <span className="font-bold text-[hsl(var(--brand-teal))]">${optimisedRevenuePerBedDay}/bed/day</span>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "rgba(27,67,50,0.05)" }}>
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Your current classification mix generates ${currentRevenuePerBedDay}/bed/day.
            CHRIS estimates ${optimisedRevenuePerBedDay}/bed/day is achievable with current resident cohort
            if assessments are current and accurate. Gap: {fmtK(reassessmentUplift)}/month.
          </p>
        </div>
      </div>

      {/* Reassessment opportunities */}
      <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))]">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-[hsl(var(--brand-amber))]" />
          <p className="text-sm font-semibold text-foreground">Reassessment opportunities</p>
        </div>
        <div className="space-y-1.5 mb-3 text-xs text-muted-foreground">
          <p>• <span className="font-medium text-foreground">8 residents</span> with assessments &gt;12 months old</p>
          <p>• <span className="font-medium text-foreground">5 residents</span> with documented care needs suggesting upward reclassification</p>
          <p>• <span className="font-medium text-foreground">3 residents</span> whose clinical trajectory suggests downward risk</p>
          <p className="mt-2">Net estimated revenue impact if optimised: <span className="font-bold text-[hsl(var(--brand-teal))]">+{fmtK(reassessmentUplift)}/month</span></p>
        </div>
        <div className="flex gap-2">
          <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
            Alert DONs to prioritise →
          </button>
          <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
            Export for CFO →
          </button>
        </div>
      </div>

      {/* Care minutes vs AN-ACC */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-sm font-semibold text-foreground mb-2">Care minutes vs AN-ACC targets</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          Class 8-13 residents require 245 min/day target. You are delivering ~218 min/day to this cohort.
          Under-delivery risk: potential funding adjustment for MM1 facilities from April 2026.
        </p>
        <p className="text-[10px] text-muted-foreground/70">
          Allied health hours: ${Math.round(BENCHMARKS.allied_health_bed_day)}/bed/day vs ${BENCHMARKS.allied_health_bed_day} sector avg.
          Allied health dropped 18% in Q3 — correlates with QI_03 (falls) and AN-ACC accuracy risk.
        </p>
      </div>
    </div>
  );
}
