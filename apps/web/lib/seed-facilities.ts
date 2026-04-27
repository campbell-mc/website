/**
 * CHRIS Platform — Multi-Facility Seed Data
 * Mt Gib Gardens — 4 residential + 2 home care
 *
 * Each facility has its own narrative arc derived from the Bowral template.
 * Data covers Oct 2025 – Mar 2026 (6 months).
 */

// ============================================================
// FACILITY CONFIGS
// ============================================================

export interface FacilityConfig {
  id: string;
  name: string;
  type: "residential" | "home_care";
  care_type: "residential" | "home_care" | "ndis";
  beds?: number;
  packages?: number;
  location: string;
  status: "ok" | "warn" | "critical";
  summary: string;
  signals: number;
  narrative: string;
  // Key metrics — current month (Mar 2026)
  care_minutes_compliant: boolean;
  agency_pct: number;
  turnover_12m: number;
  sirs_open: number;
  sirs_ytd: number;
  compliance_score: number;
  occupancy_pct: number;
  psh_teams_elevated: number;
  care_ratio?: number;
}

export const ALL_FACILITIES: FacilityConfig[] = [
  {
    id: "FAC-001",
    name: "Mt Gib Gardens Bowral",
    type: "residential",
    care_type: "residential",
    beds: 137,
    location: "Bowral, NSW 2576",
    status: "warn",
    summary: "Care min compliant · Wattle Wing PSH improving · Falls QI above benchmark 3rd quarter",
    signals: 3,
    narrative: "Wattle Wing PSH improving after practice intervention. Agency reducing from Jan peak. Falls trend above benchmark but linked to agency coverage — expected to improve as workforce stabilises.",
    care_minutes_compliant: true,
    agency_pct: 18,
    turnover_12m: 29,
    sirs_open: 0,
    sirs_ytd: 4,
    compliance_score: 84,
    occupancy_pct: 97.8,
    psh_teams_elevated: 3,
    care_ratio: 51.9,
  },
  {
    id: "FAC-002",
    name: "The Holy Grail Goulburn",
    type: "residential",
    care_type: "residential",
    beds: 96,
    location: "Goulburn, NSW 2580",
    status: "ok",
    summary: "All compliant · 1 team PSH_01 elevated · compliance 88",
    signals: 1,
    narrative: "Stable facility. One dementia wing team showing elevated PSH_01 (High Job Demands) — monitoring. Care minutes consistently above target. No open SIRS. Financial tracking to budget.",
    care_minutes_compliant: true,
    agency_pct: 11,
    turnover_12m: 24,
    sirs_open: 0,
    sirs_ytd: 2,
    compliance_score: 88,
    occupancy_pct: 95.8,
    psh_teams_elevated: 1,
    care_ratio: 56.2,
  },
  {
    id: "FAC-003",
    name: "The Holy Grail Young",
    type: "residential",
    care_type: "residential",
    beds: 72,
    location: "Young, NSW 2594",
    status: "warn",
    summary: "Care min at risk · RN gap 2 days · 2 teams PSH elevated",
    signals: 2,
    narrative: "Smallest residential facility, hardest to recruit. RN care minutes at risk — gap for tonight not filled. Two teams with elevated PSH_01. Agency dependency rising. This is the facility most at risk of entering a reinforcing loop.",
    care_minutes_compliant: false,
    agency_pct: 22,
    turnover_12m: 33,
    sirs_open: 0,
    sirs_ytd: 1,
    compliance_score: 82,
    occupancy_pct: 93.1,
    psh_teams_elevated: 2,
    care_ratio: 48.4,
  },
  {
    id: "FAC-004",
    name: "The Holy Grail Temora",
    type: "residential",
    care_type: "residential",
    beds: 60,
    location: "Temora, NSW 2666",
    status: "warn",
    summary: "SIRS Cat 2 draft ready · 18 days remaining · compliance 91",
    signals: 1,
    narrative: "Small, well-run facility. One open SIRS Cat 2 (medication error) with draft ready. No workforce pressure — stable permanent team. Compliance strong at 91. The SIRS item is the only thing requiring DON attention.",
    care_minutes_compliant: true,
    agency_pct: 8,
    turnover_12m: 21,
    sirs_open: 1,
    sirs_ytd: 1,
    compliance_score: 91,
    occupancy_pct: 96.7,
    psh_teams_elevated: 0,
    care_ratio: 57.8,
  },
  {
    id: "FAC-005",
    name: "Mt Gib Home Care Southern Highlands",
    type: "home_care",
    care_type: "home_care",
    packages: 48,
    location: "Bowral, NSW 2576",
    status: "ok",
    summary: "46 active packages · compliance 94 · all clear",
    signals: 0,
    narrative: "Home care operating well. 46 of 48 packages active. 2 packages in assessment phase. No incidents. Worker safety pulse scores stable. Financial tracking to budget.",
    care_minutes_compliant: true,
    agency_pct: 5,
    turnover_12m: 18,
    sirs_open: 0,
    sirs_ytd: 0,
    compliance_score: 94,
    occupancy_pct: 95.8,
    psh_teams_elevated: 0,
  },
  {
    id: "FAC-006",
    name: "Mt Gib Home Care Goulburn",
    type: "home_care",
    care_type: "home_care",
    packages: 36,
    location: "Goulburn, NSW 2580",
    status: "ok",
    summary: "34 active packages · compliance 89 · all clear",
    signals: 0,
    narrative: "Smaller home care operation. 34 of 36 packages active. Compliance at 89 — one training credential expiring. No incidents. Operating within budget.",
    care_minutes_compliant: true,
    agency_pct: 3,
    turnover_12m: 15,
    sirs_open: 0,
    sirs_ytd: 0,
    compliance_score: 89,
    occupancy_pct: 94.4,
    psh_teams_elevated: 0,
  },
];

// ============================================================
// PORTFOLIO SUMMARY — aggregated across all facilities
// ============================================================

export const portfolio_summary = {
  provider_name: "Mt Gib Gardens",
  total_beds: 365,
  total_hcp: 84,
  residential_facilities: 4,
  home_care_services: 2,
  total_staff: 580,

  // Aggregated metrics (Mar 2026)
  care_minutes_compliant_facilities: ALL_FACILITIES.filter((f) => f.care_minutes_compliant).length,
  avg_agency_pct: Math.round(ALL_FACILITIES.reduce((s, f) => s + f.agency_pct, 0) / ALL_FACILITIES.length),
  avg_turnover: Math.round(ALL_FACILITIES.reduce((s, f) => s + f.turnover_12m, 0) / ALL_FACILITIES.length),
  total_sirs_open: ALL_FACILITIES.reduce((s, f) => s + f.sirs_open, 0),
  total_sirs_ytd: ALL_FACILITIES.reduce((s, f) => s + f.sirs_ytd, 0),
  avg_compliance: Math.round(ALL_FACILITIES.reduce((s, f) => s + f.compliance_score, 0) / ALL_FACILITIES.length),
  total_psh_teams_elevated: ALL_FACILITIES.reduce((s, f) => s + f.psh_teams_elevated, 0),

  // Network-level signals
  signals: [
    {
      type: "AMPLIFYING" as const,
      confidence: "STRONG" as const,
      facility: "The Holy Grail Young",
      headline: "Young: care minutes + agency + PSH loop forming",
      detail: "RN care minutes at risk 2 days. Agency at 22%. PSH_01 elevated in 2 teams. Pattern historically precedes sustained non-compliance.",
    },
    {
      type: "PREDICTIVE" as const,
      confidence: "EMERGING" as const,
      facility: "Mt Gib Gardens Bowral",
      headline: "Bowral: turnover risk building in Wing B",
      detail: "PSH_02 + PSH_16 co-elevated for 3 cycles. Historically precedes voluntary turnover within 2-4 cycles in 71% of comparable teams.",
    },
    {
      type: "CAUSAL" as const,
      confidence: "STRONG" as const,
      facility: "Mt Gib Gardens Bowral",
      headline: "Agency cost spike traced to PSH_13 decline",
      detail: "Dec-Jan agency surge ($240K YTD adverse) follows 4-cycle PSH_13 (Recognition) decline in Wattle Wing. Culture signal, not rostering failure.",
    },
  ],
};

// ============================================================
// FINANCIAL SUMMARY — by facility (Mar 2026)
// ============================================================

export const facility_financials = [
  { facility_id: "FAC-001", name: "Mt Gib Gardens Bowral", revenue: 2003400, expenditure: 1373000, ebitda: 630400, care_ratio: 0.519, agency_cost: 161000, budget_variance_pct: -0.028 },
  { facility_id: "FAC-002", name: "The Holy Grail Goulburn", revenue: 1402400, expenditure: 924000, ebitda: 478400, care_ratio: 0.562, agency_cost: 72000, budget_variance_pct: 0.012 },
  { facility_id: "FAC-003", name: "The Holy Grail Young", revenue: 1051800, expenditure: 738000, ebitda: 313800, care_ratio: 0.484, agency_cost: 98000, budget_variance_pct: -0.044 },
  { facility_id: "FAC-004", name: "The Holy Grail Temora", revenue: 876500, expenditure: 598000, ebitda: 278500, care_ratio: 0.578, agency_cost: 31000, budget_variance_pct: 0.008 },
  { facility_id: "FAC-005", name: "Mt Gib Home Care SH", revenue: 384000, expenditure: 298000, ebitda: 86000, budget_variance_pct: 0.003 },
  { facility_id: "FAC-006", name: "Mt Gib Home Care Goulburn", revenue: 288000, expenditure: 231000, ebitda: 57000, budget_variance_pct: -0.002 },
];

// ============================================================
// WORKFORCE SUMMARY — by facility (Mar 2026)
// ============================================================

export const facility_workforce = [
  { facility_id: "FAC-001", name: "Mt Gib Gardens Bowral", headcount: 271, rn: 27, en: 25, ain: 185, agency_pct: 18, turnover: 29, psh_elevated: 3, vacancies: { rn: 1, en: 0, ain: 2 } },
  { facility_id: "FAC-002", name: "The Holy Grail Goulburn", headcount: 188, rn: 19, en: 16, ain: 124, agency_pct: 11, turnover: 24, psh_elevated: 1, vacancies: { rn: 0, en: 0, ain: 1 } },
  { facility_id: "FAC-003", name: "The Holy Grail Young", headcount: 134, rn: 13, en: 11, ain: 89, agency_pct: 22, turnover: 33, psh_elevated: 2, vacancies: { rn: 2, en: 0, ain: 3 } },
  { facility_id: "FAC-004", name: "The Holy Grail Temora", headcount: 112, rn: 11, en: 10, ain: 74, agency_pct: 8, turnover: 21, psh_elevated: 0, vacancies: { rn: 0, en: 0, ain: 1 } },
  { facility_id: "FAC-005", name: "Mt Gib Home Care SH", headcount: 42, agency_pct: 5, turnover: 18, psh_elevated: 0 },
  { facility_id: "FAC-006", name: "Mt Gib Home Care Goulburn", headcount: 31, agency_pct: 3, turnover: 15, psh_elevated: 0 },
];

export default {
  ALL_FACILITIES,
  portfolio_summary,
  facility_financials,
  facility_workforce,
};
