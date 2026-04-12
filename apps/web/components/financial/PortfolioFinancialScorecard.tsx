"use client";

import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { BENCHMARKS, ebitdaQuartile, quartileColor, quartileBg, fmtK, currentMetrics, ytdMetrics } from "@/lib/financial-benchmarks";
import { facility_financials } from "@/lib/seed-facilities";
import { facility, financial_monthly } from "@/lib/seed-data";

/**
 * CEO Portfolio Financial Scorecard
 *
 * One row per facility: EBITDA/bed/day, care ratio, agency%,
 * occupancy, budget variance. StewartBrown quartile colouring.
 * Strategic financial outlook from CHRIS.
 */

// Per-facility metrics with bed days
const facilityRows = facility_financials.map((f) => {
  const beds = f.name.includes("Home Care") ? 0 : (
    f.name.includes("Bowral") ? 137 :
    f.name.includes("Goulburn") && !f.name.includes("Home") ? 96 :
    f.name.includes("Young") ? 72 : 60
  );
  const daysInMar = 31;
  const bd = beds * daysInMar;
  const ebitdaBD = bd > 0 ? Math.round((f.ebitda / bd) * 100) / 100 : 0;
  const q = ebitdaQuartile(ebitdaBD);

  return {
    ...f,
    beds,
    ebitdaBD,
    quartile: q,
    careRatioPct: f.care_ratio ? Math.round(f.care_ratio * 1000) / 10 : null,
    agencyPct: f.agency_cost ? Math.round((f.agency_cost / (f.expenditure - (f.revenue - f.ebitda - f.agency_cost))) * 100) : null,
    budgetVarPct: Math.round(f.budget_variance_pct * 1000) / 10,
  };
});

// Network totals
const networkRevenue = facility_financials.reduce((s, f) => s + f.revenue, 0);
const networkEbitda = facility_financials.reduce((s, f) => s + f.ebitda, 0);
const totalBeds = 365; // 137 + 96 + 72 + 60
const networkEbitdaBD = Math.round((networkEbitda / (totalBeds * 31)) * 100) / 100;
const networkEbitdaBY = Math.round(networkEbitdaBD * 365);

export function PortfolioFinancialScorecard() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
        Portfolio financial health — all facilities
      </p>

      {/* Network headline metrics */}
      <div className="flex gap-2 mb-1">
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className={`text-base font-bold ${networkEbitdaBD >= BENCHMARKS.ebitda_bed_day ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]"}`}>
            ${networkEbitdaBD.toFixed(0)}
          </p>
          <p className="text-[9px] text-muted-foreground">EBITDA/bed/day</p>
          <p className="text-[8px] text-muted-foreground/60">Sector: ${BENCHMARKS.ebitda_bed_day}</p>
        </div>
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-base font-bold text-foreground">{fmtK(networkRevenue)}</p>
          <p className="text-[9px] text-muted-foreground">Network revenue</p>
          <p className="text-[8px] text-muted-foreground/60">March 2026</p>
        </div>
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className={`text-base font-bold ${networkEbitdaBY >= BENCHMARKS.ebitda_bed_year ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]"}`}>
            {fmtK(networkEbitdaBY)}
          </p>
          <p className="text-[9px] text-muted-foreground">EBITDA/bed/year</p>
          <p className="text-[8px] text-muted-foreground/60">Target: {fmtK(BENCHMARKS.ebitda_bed_year_investment)}</p>
        </div>
      </div>

      {/* Facility scorecard table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 gap-1 px-3 py-2 border-b border-border text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="col-span-2">Facility</span>
          <span className="text-right">EBITDA/bd</span>
          <span className="text-right">Care %</span>
          <span className="text-right">Agency</span>
          <span className="text-right">Budget</span>
        </div>

        {/* Rows — residential only for scorecard */}
        {facilityRows.filter((f) => f.beds > 0).map((f) => {
          const q = f.quartile;
          return (
            <div key={f.facility_id} className={`grid grid-cols-6 gap-1 px-3 py-2.5 border-b border-border last:border-b-0 ${quartileBg(q)}`}>
              <div className="col-span-2">
                <p className="text-xs font-medium text-foreground truncate">{f.name.replace("The Holy Grail ", "")}</p>
                <p className="text-[9px] text-muted-foreground">{f.beds} beds</p>
              </div>
              <p className={`text-xs font-bold text-right ${quartileColor(q)}`}>${f.ebitdaBD.toFixed(0)}</p>
              <p className={`text-xs font-medium text-right ${(f.careRatioPct ?? 0) >= 55 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-terracotta))]"}`}>
                {f.careRatioPct ?? "—"}%
              </p>
              <p className={`text-xs font-medium text-right ${(f.agency_cost ?? 0) > 100000 ? "text-[hsl(var(--brand-terracotta))]" : "text-muted-foreground"}`}>
                {f.agency_cost ? fmtK(f.agency_cost) : "—"}
              </p>
              <p className={`text-xs font-medium text-right ${f.budgetVarPct >= 0 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]"}`}>
                {f.budgetVarPct > 0 ? "+" : ""}{f.budgetVarPct}%
              </p>
            </div>
          );
        })}

        {/* Home care summary row */}
        <div className="grid grid-cols-6 gap-1 px-3 py-2.5 bg-muted/30">
          <div className="col-span-2">
            <p className="text-xs font-medium text-muted-foreground">Home Care (2 services)</p>
            <p className="text-[9px] text-muted-foreground">84 HCP</p>
          </div>
          <p className="text-xs text-muted-foreground text-right">—</p>
          <p className="text-xs text-muted-foreground text-right">—</p>
          <p className="text-xs text-muted-foreground text-right">{fmtK(facilityRows.filter(f => f.beds === 0).reduce((s, f) => s + (f.agency_cost ?? 0), 0))}</p>
          <p className="text-xs text-muted-foreground text-right">
            {facilityRows.filter(f => f.beds === 0).length > 0 ? "0.0%" : "—"}
          </p>
        </div>
      </div>

      {/* Quartile key */}
      <div className="flex items-center gap-4 text-[9px] text-muted-foreground">
        <span><span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--brand-teal))] mr-1" />Top quartile (&gt;$55/bd)</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--brand-amber))] mr-1" />2nd quartile ($30-55)</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--brand-terracotta))] mr-1" />3rd/4th (&lt;$30)</span>
      </div>

      {/* Strategic financial outlook */}
      <div className="rounded-xl p-4" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-2">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Strategic financial outlook</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              At current performance, FY2026 network EBITDA will reach ~{fmtK(networkEbitdaBY)}/bed/year.
              Gap to investment grade ({fmtK(BENCHMARKS.ebitda_bed_year_investment)}): {fmtK(BENCHMARKS.ebitda_bed_year_investment - networkEbitdaBY)}/bed/year.
              Primary recovery levers: agency normalisation (~{fmtK(180000)} annualised saving),
              AN-ACC optimisation (~{fmtK(98000)} if reassessments prioritised),
              and occupancy recovery at Young (~{fmtK(72 * 3 * BENCHMARKS.revenue_per_vacant_bed_day * 30 / 1000 * 1000)} annualised if 3 beds filled).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
