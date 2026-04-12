"use client";

import { Shield, AlertTriangle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { BENCHMARKS, fmtK } from "@/lib/financial-benchmarks";
import { compliance_obligations, sirs_events } from "@/lib/seed-data";

/**
 * Quality Lead Compliance Financial Panel
 *
 * Penalty exposure tracker, SIRS non-reporting risk,
 * care minutes funding linkage, QI accuracy/occupancy connection.
 * Every compliance gap has a dollar sign next to it.
 */

const atRiskObligations = compliance_obligations.filter((o) => o.status === "at_risk");
const openSirs = sirs_events.filter((e) => e.status !== "closed");

export function ComplianceFinancialPanel() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
        Compliance financial exposure
      </p>

      {/* Penalty exposure tracker */}
      <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-terracotta))]" style={{ background: "rgba(196,112,74,0.04)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[hsl(var(--brand-terracotta))]" />
          <p className="text-sm font-semibold text-foreground">Penalty exposure</p>
        </div>

        <div className="space-y-3">
          {/* QS 2.8.2 gap */}
          {atRiskObligations.filter((o) => o.obligation.includes("Psychological Safety") || o.obligation.includes("Worker Consultation")).map((obl) => (
            <div key={obl.id} className="border-b border-border pb-2 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-foreground">{obl.obligation.split("—")[0].trim()}</p>
                <span className="text-[10px] font-bold text-[hsl(var(--brand-terracotta))]">up to {fmtK(BENCHMARKS.category_1_penalty_max)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
                {obl.gap}
              </p>
              {obl.action_eta_min && (
                <div className="flex items-center gap-2">
                  <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                    Fix now ({obl.action_eta_min} min) →
                  </button>
                  <p className="text-[9px] text-muted-foreground">CHRIS can close this gap immediately</p>
                </div>
              )}
            </div>
          ))}

          {/* ISO 45003 gap */}
          {atRiskObligations.filter((o) => o.obligation.includes("Control Measures")).map((obl) => (
            <div key={obl.id} className="border-b border-border pb-2 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-foreground">ISO 45003 + WHS Regulation + Aged Care Act</p>
                <span className="text-[10px] font-bold text-[hsl(var(--brand-terracotta))]">&gt;{fmtK(BENCHMARKS.iso_45003_combined_penalty)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
                {obl.gap}
              </p>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                Document escalation brief →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SIRS reporting financial risk */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-sm font-semibold text-foreground mb-2">SIRS reporting status</p>
        {openSirs.length === 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-[hsl(var(--brand-teal))]">✅</span>
            <p className="text-xs text-muted-foreground">All {sirs_events.length} events submitted on time. No financial risk from SIRS non-reporting.</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {openSirs.length} open SIRS items. Cat 1 missed deadline: penalty exposure + compliance notice. Cat 2: 30-day window.
          </p>
        )}
      </div>

      {/* Care minutes funding linkage */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-sm font-semibold text-foreground mb-2">Care minutes funding linkage</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          For MM1 facilities, care minutes compliance links to AN-ACC funding from April 2026.
          Sustained non-compliance could affect the AN-ACC starting price.
        </p>
        <p className="text-[11px] text-muted-foreground/70">
          Current month: compliant. But 3 non-compliant days occurred in November and 6 in January.
          If sustained beyond threshold, estimated revenue at risk: <span className="font-medium text-[hsl(var(--brand-amber))]">{fmtK(42000)}/month</span>.
        </p>
      </div>

      {/* QI accuracy → occupancy → revenue */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "rgba(27,67,50,0.05)" }}>
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Accurate QI data is publicly reported and affects Star Ratings, which influence occupancy.
            A 1% occupancy drop at this facility = ~{fmtK(Math.round(137 * 0.01 * BENCHMARKS.revenue_per_vacant_bed_day * 30))}/month in lost revenue.
            QI submission is due in 9 days — draft ready.
          </p>
        </div>
      </div>
    </div>
  );
}
