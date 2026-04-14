/**
 * CHRIS Financial Benchmarks & Helpers
 *
 * StewartBrown sector averages (FY2024-25 data) and calculation
 * helpers for all role-specific financial views.
 *
 * Source: StewartBrown Aged Care Financial Performance Survey
 * Updated: Annual (next update expected Aug 2026)
 */

import { financial_monthly, facility, workforce_monthly } from "./seed-data";
import { facility_financials, facility_workforce } from "./seed-facilities";

// ============================================================
// STEWARTBROWN SECTOR BENCHMARKS
// ============================================================

export const BENCHMARKS = {
  // Earnings
  ebitda_bed_day: 18.68,           // $/bed/day (sector avg)
  ebitda_bed_year: 6817,           // $/bed/year (sector avg)
  ebitda_bed_year_investment: 20000, // $/bed/year (investment-grade target)
  npbt_bed_day: 20.69,            // $/bed/day (FY25)

  // Revenue
  revenue_bed_day: 425,            // $/bed/day (blended)
  annacc_starting_price: 295.64,   // $/resident/day
  basic_daily_fee: 63.57,         // $/day
  hotelling_supplement: 22.15,     // $/day
  max_accommodation_supplement: 69.79, // $/day

  // Labour
  labour_pct_revenue: 0.70,        // 70%
  direct_care_bed_day: 223.48,     // $/bed/day
  allied_health_bed_day: 18.89,    // $/bed/day
  total_labour_bed_day: 235.88,    // $/bed/day

  // Occupancy & Residents
  occupancy: 0.944,                // 94.4%
  supported_resident_ratio: 0.464, // 46.4%

  // Accommodation
  avg_rad_received: 516770,        // $ average RAD
  rad_price_cap: 750000,           // $ max RAD
  rad_retention_rate: 0.02,        // 2% per annum (new residents from Nov 2025)
  mpir: 0.0817,                    // Maximum Permissible Interest Rate 8.17%

  // Care
  care_ratio_target: 0.55,         // 55%
  direct_care_margin_bed_day: 10.32, // $/bed/day (Sep-24)

  // Depreciation
  depreciation_bed_day: 22.55,     // $/bed/day

  // Penalties
  category_1_penalty_max: 1584000, // s.179 serious failure corporate: 4,800 × $330
  iso_45003_combined_penalty: 1000000, // $1M+ combined WHS + Aged Care Act

  // Workforce costs (estimates for turnover calculations)
  cost_per_ain_exit_low: 8000,
  cost_per_ain_exit_high: 12000,
  cost_per_rn_exit_low: 40000,
  cost_per_rn_exit_high: 80000,
  agency_rn_shift_premium: 190,    // $ premium over permanent per shift
  agency_rn_shift_cost: 480,       // $ full agency shift cost
  permanent_rn_shift_cost: 290,    // $ permanent equivalent

  // WC
  avg_wc_claim_low: 45000,
  avg_wc_claim_high: 290000,

  // Revenue per vacant bed day (AN-ACC + hotelling)
  revenue_per_vacant_bed_day: 420,
} as const;

// ============================================================
// QUARTILE THRESHOLDS (for facility scorecard colouring)
// ============================================================

export type Quartile = "top" | "second" | "third" | "bottom";

export function ebitdaQuartile(ebitdaBedDay: number): Quartile {
  if (ebitdaBedDay >= 55) return "top";      // >$55/bed/day
  if (ebitdaBedDay >= 30) return "second";   // $30-55
  if (ebitdaBedDay >= 10) return "third";    // $10-30
  return "bottom";                            // <$10
}

export function quartileColor(q: Quartile): string {
  return q === "top" ? "text-[hsl(var(--brand-teal))]"
    : q === "second" ? "text-[hsl(var(--brand-amber))]"
    : "text-[hsl(var(--brand-terracotta))]";
}

export function quartileBg(q: Quartile): string {
  return q === "top" ? "bg-[rgba(45,125,115,0.06)]"
    : q === "second" ? "bg-[rgba(212,160,23,0.06)]"
    : "bg-[rgba(196,112,74,0.06)]";
}

// ============================================================
// PER-BED-DAY CALCULATIONS
// ============================================================

export function daysInMonth(period: string): number {
  const [y, m] = period.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

export function bedDays(beds: number, period: string): number {
  return beds * daysInMonth(period);
}

/** Revenue per bed day for a given month */
export function revenuePerBedDay(monthIdx: number): number {
  const m = financial_monthly[monthIdx];
  const bd = bedDays(facility.beds, m.period);
  return Math.round(m.revenue.total / bd);
}

/** Labour cost per bed day for a given month */
export function labourPerBedDay(monthIdx: number): number {
  const m = financial_monthly[monthIdx];
  const bd = bedDays(facility.beds, m.period);
  return Math.round((m.expenditure.direct_care_permanent + m.expenditure.direct_care_agency) / bd);
}

/** EBITDA per bed day for a given month */
export function ebitdaPerBedDay(monthIdx: number): number {
  const m = financial_monthly[monthIdx];
  const bd = bedDays(facility.beds, m.period);
  return Math.round((m.ebitda / bd) * 100) / 100;
}

/** EBITDA per bed year (annualised from latest month) */
export function ebitdaPerBedYear(monthIdx: number): number {
  return Math.round(ebitdaPerBedDay(monthIdx) * 365);
}

// ============================================================
// LATEST MONTH DERIVED METRICS
// ============================================================

const latest = financial_monthly[financial_monthly.length - 1];
const latestBD = bedDays(facility.beds, latest.period);

export const currentMetrics = {
  // Revenue
  revenuePerBedDay: Math.round(latest.revenue.total / latestBD),
  revenueBudgetVariancePct: latest.revenue.variance_pct,

  // Labour
  labourPerBedDay: latest.labour_cost_per_bed_day,
  labourPctRevenue: Math.round(((latest.expenditure.direct_care_permanent + latest.expenditure.direct_care_agency) / latest.revenue.total) * 1000) / 10,
  agencyPctCareWorkforce: Math.round(latest.agency_cost_pct_of_care_workforce * 1000) / 10,
  agencyCost: latest.expenditure.direct_care_agency,
  agencyPerBedDay: Math.round(latest.expenditure.direct_care_agency / latestBD),
  permanentPerBedDay: Math.round(latest.expenditure.direct_care_permanent / latestBD),

  // EBITDA
  ebitda: latest.ebitda,
  ebitdaPerBedDay: Math.round((latest.ebitda / latestBD) * 100) / 100,
  ebitdaPerBedYear: Math.round((latest.ebitda / latestBD) * 365),

  // Care ratio
  careRatio: Math.round(latest.care_ratio * 1000) / 10,

  // Occupancy
  occupancy: latest.occupancy_pct,
  vacantBeds: Math.round(facility.beds * (1 - latest.occupancy_pct)),
  revenuePerVacantBedDay: BENCHMARKS.revenue_per_vacant_bed_day,

  // Budget
  budgetVariancePct: latest.budget_variance_pct,
};

// ============================================================
// YTD CALCULATIONS
// ============================================================

export const ytdMetrics = {
  totalRevenue: financial_monthly.reduce((s, m) => s + m.revenue.total, 0),
  totalExpenditure: financial_monthly.reduce((s, m) => s + m.expenditure.total, 0),
  totalEbitda: financial_monthly.reduce((s, m) => s + m.ebitda, 0),
  totalAgencyCost: financial_monthly.reduce((s, m) => s + m.expenditure.direct_care_agency, 0),
  totalAgencyOverBudget: financial_monthly.reduce((s, m) => s + Math.max(0, m.expenditure.direct_care_agency - 98000), 0),
  avgOccupancy: Math.round((financial_monthly.reduce((s, m) => s + m.occupancy_pct, 0) / financial_monthly.length) * 1000) / 10,
  avgCareRatio: Math.round((financial_monthly.reduce((s, m) => s + m.care_ratio, 0) / financial_monthly.length) * 1000) / 10,
};

// ============================================================
// TURNOVER COST ESTIMATOR
// ============================================================

export function estimateTurnoverCost(): {
  ainExits: number; rnExits: number;
  ainCostRange: [number, number]; rnCostRange: [number, number];
  totalRange: [number, number];
} {
  const latestWf = workforce_monthly[workforce_monthly.length - 1];
  // Annualise from 6-month data
  const totalSeps = workforce_monthly.reduce((s, m) => s + m.separations, 0);
  const annualisedSeps = Math.round(totalSeps * 2); // 6 months → 12
  // Estimate RN vs AIN from the Dec spike narrative
  const rnExits = 4; // 2 in Dec + estimated 2 more over year
  const ainExits = annualisedSeps - rnExits;

  return {
    ainExits,
    rnExits,
    ainCostRange: [ainExits * BENCHMARKS.cost_per_ain_exit_low, ainExits * BENCHMARKS.cost_per_ain_exit_high],
    rnCostRange: [rnExits * BENCHMARKS.cost_per_rn_exit_low, rnExits * BENCHMARKS.cost_per_rn_exit_high],
    totalRange: [
      ainExits * BENCHMARKS.cost_per_ain_exit_low + rnExits * BENCHMARKS.cost_per_rn_exit_low,
      ainExits * BENCHMARKS.cost_per_ain_exit_high + rnExits * BENCHMARKS.cost_per_rn_exit_high,
    ],
  };
}

// ============================================================
// AGENCY PREMIUM CALCULATOR
// ============================================================

export function agencyPremium(): {
  monthlyPremium: number;
  annualisedPremium: number;
  savingIfNormalised: number;
} {
  // Premium = agency cost - what it would cost if those hours were permanent
  // Rough estimate: agency costs ~1.6x permanent equivalent
  const agencyCost = latest.expenditure.direct_care_agency;
  const permanentEquivalent = Math.round(agencyCost / 1.6);
  const premium = agencyCost - permanentEquivalent;

  // Oct baseline agency was $98K — that's the "normal" level
  const normalAgency = 98000;
  const savingIfNormalised = (agencyCost - normalAgency) * 12;

  return {
    monthlyPremium: premium,
    annualisedPremium: premium * 12,
    savingIfNormalised,
  };
}

// ============================================================
// ROSTER COST HELPER (for DON view)
// ============================================================

export function tonightRosterCost(agencyShifts: number, permanentShifts: number) {
  return {
    permanentCost: permanentShifts * BENCHMARKS.permanent_rn_shift_cost,
    agencyCost: agencyShifts * BENCHMARKS.agency_rn_shift_cost,
    premium: agencyShifts * BENCHMARKS.agency_rn_shift_premium,
    totalPremiumThisWeek: agencyShifts * BENCHMARKS.agency_rn_shift_premium * 7, // rough weekly
  };
}

// ============================================================
// FORMAT HELPERS
// ============================================================

export function fmtK(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

export function fmtPct(n: number, decimals = 1): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

export function fmtBedDay(n: number): string {
  return `$${n.toFixed(0)}/bed/day`;
}
