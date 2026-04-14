
/**
 * CHRIS Platform — The Holy Grail Bowral Seed Data
 * 6 months: October 2025 – March 2026
 * 
 * Facility: The Holy Grail Bowral (FAC-001)
 * Beds: 137 residential + 2 home care services
 * Staff: ~350 (35 leaders, ~315 frontline)
 * Teams: 8 residential teams + 2 HC teams
 * Provider: Knights of the Holy Grail (PROV-001)
 * 
 * Narrative arc:
 * Oct-Nov: Care minutes pressure, PSH_01 elevated across 3 teams
 * Dec: Care minutes resolved, turnover spike (2 RN exits)
 * Jan: Agency surge following exits, PSH_08 emerging in Wattle Wing
 * Feb: PSH convergence detected, intervention prescribed, falls tick up
 * Mar: PSH improving, falls above benchmark, practice working in Wattle Wing
 * 
 * SIRS events: 4 total (0 Cat 1, 4 Cat 2)
 * Audits: Full suite, medication management recurring non-conformance
 * QI trend: Falls 3rd consecutive quarter above benchmark, rest tracking well
 */

// ============================================================
// FACILITY CONFIG
// ============================================================

export const facility = {
  id: 'FAC-001',
  provider_id: 'PROV-001',
  name: 'The Holy Grail Bowral',
  provider_name: 'Knights of the Holy Grail',
  care_types: ['residential', 'home_care'],
  beds: 137,
  home_care_packages: 48,
  location: 'Bowral, NSW 2576',
  location_type: 'regional',
  care_model: 'high_care',
  profit_status: 'not_for_profit',
  acqsc_service_id: 'AC-NSW-00847',
  star_rating: 4.2,
  connectors: ['deputy', 'alayacare', 'elmo', 'technologyone'],
  shift_patterns: {
    morning: { start: '07:00', end: '15:00' },
    afternoon: { start: '15:00', end: '23:00' },
    night: { start: '23:00', end: '07:00' },
  },
};

// ============================================================
// TEAMS (8 residential + 2 HC)
// ============================================================

export const teams = [
  { id: 'TEAM-001', name: 'Wattle Wing', wing: 'Wattle', beds: 18, care_focus: 'high_care', team_leader_role: 'RN' },
  { id: 'TEAM-002', name: 'Banksia Wing', wing: 'Banksia', beds: 18, care_focus: 'high_care', team_leader_role: 'RN' },
  { id: 'TEAM-003', name: 'Grevillea Wing', wing: 'Grevillea', beds: 17, care_focus: 'dementia', team_leader_role: 'RN' },
  { id: 'TEAM-004', name: 'Acacia Wing', wing: 'Acacia', beds: 17, care_focus: 'dementia', team_leader_role: 'RN' },
  { id: 'TEAM-005', name: 'Boronia Wing', wing: 'Boronia', beds: 16, care_focus: 'high_care', team_leader_role: 'EN' },
  { id: 'TEAM-006', name: 'Waratah Wing', wing: 'Waratah', beds: 16, care_focus: 'high_care', team_leader_role: 'EN' },
  { id: 'TEAM-007', name: 'Flannel Wing Morning', wing: 'Flannel', beds: 17, shift: 'morning', care_focus: 'mixed', team_leader_role: 'RN' },
  { id: 'TEAM-008', name: 'Flannel Wing Evening', wing: 'Flannel', beds: 18, shift: 'evening', care_focus: 'mixed', team_leader_role: 'EN' },
  { id: 'TEAM-009', name: 'Home Care North', care_type: 'home_care', packages: 24, care_focus: 'sah_classification_5_8' },
  { id: 'TEAM-010', name: 'Home Care South', care_type: 'home_care', packages: 24, care_focus: 'sah_classification_1_4' },
];

// ============================================================
// WORKFORCE — AGGREGATE (de-identified, role-based)
// ============================================================

export const workforce_monthly = [
  // Oct 2025
  {
    period: '2025-10', facility_id: 'FAC-001',
    headcount: { rn: 28, en: 24, ain: 187, allied_health: 12, admin: 14, management: 8, total: 273 },
    employment_basis: { permanent_ft: 142, permanent_pt: 89, casual: 42 },
    agency_hours_pct: 0.11, // 11% of care hours — within target
    turnover_rolling_12m: 0.26,
    absenteeism_rate: 0.082,
    sick_leave_hours_by_role: { rn: 124, en: 98, ain: 687 },
    wc_hours: 0,
    training_compliance_pct: 0.94,
    credentials_expiring_30d: 2,
    new_starters: 4,
    separations: 3,
    open_vacancies: { rn: 1, en: 0, ain: 3 },
  },
  // Nov 2025
  {
    period: '2025-11', facility_id: 'FAC-001',
    headcount: { rn: 28, en: 24, ain: 186, allied_health: 12, admin: 14, management: 8, total: 272 },
    employment_basis: { permanent_ft: 141, permanent_pt: 89, casual: 42 },
    agency_hours_pct: 0.13,
    turnover_rolling_12m: 0.27,
    absenteeism_rate: 0.091, // rising — winter illness
    sick_leave_hours_by_role: { rn: 156, en: 112, ain: 743 },
    wc_hours: 0,
    training_compliance_pct: 0.93,
    credentials_expiring_30d: 3,
    new_starters: 3,
    separations: 4,
    open_vacancies: { rn: 1, en: 0, ain: 4 },
  },
  // Dec 2025
  {
    period: '2025-12', facility_id: 'FAC-001',
    headcount: { rn: 26, en: 24, ain: 185, allied_health: 11, admin: 14, management: 8, total: 268 },
    employment_basis: { permanent_ft: 138, permanent_pt: 88, casual: 42 },
    agency_hours_pct: 0.19, // spike — 2 RN exits
    turnover_rolling_12m: 0.29,
    absenteeism_rate: 0.089,
    sick_leave_hours_by_role: { rn: 98, en: 104, ain: 698 },
    wc_hours: 72, // one WC claim commences
    training_compliance_pct: 0.91,
    credentials_expiring_30d: 6, // AHPRA renewals due
    new_starters: 2,
    separations: 6, // 2 RN voluntary exits + 4 AIN
    open_vacancies: { rn: 3, en: 0, ain: 5 },
    notes: '2 RN voluntary exits (Wattle Wing). PSH_13 (Recognition) had been declining 4 cycles in Wattle Wing — CHRIS flags correlation.',
  },
  // Jan 2026
  {
    period: '2026-01', facility_id: 'FAC-001',
    headcount: { rn: 26, en: 24, ain: 184, allied_health: 11, admin: 14, management: 8, total: 267 },
    employment_basis: { permanent_ft: 136, permanent_pt: 88, casual: 43 },
    agency_hours_pct: 0.28, // high agency — RN vacancies unfilled
    turnover_rolling_12m: 0.30,
    absenteeism_rate: 0.094, // January blues
    sick_leave_hours_by_role: { rn: 134, en: 118, ain: 756 },
    wc_hours: 144,
    training_compliance_pct: 0.90,
    credentials_expiring_30d: 4,
    new_starters: 3, // 1 new RN starts late Jan
    separations: 2,
    open_vacancies: { rn: 2, en: 0, ain: 4 },
    notes: 'Agency RN dependency at 28% of RN hours. Care minutes at risk 6 days this month. PSH_08 (Traumatic Exposure) emerging in Wattle Wing.',
  },
  // Feb 2026
  {
    period: '2026-02', facility_id: 'FAC-001',
    headcount: { rn: 27, en: 24, ain: 184, allied_health: 12, admin: 14, management: 8, total: 269 },
    employment_basis: { permanent_ft: 137, permanent_pt: 88, casual: 44 },
    agency_hours_pct: 0.22,
    turnover_rolling_12m: 0.30,
    absenteeism_rate: 0.086,
    sick_leave_hours_by_role: { rn: 112, en: 102, ain: 712 },
    wc_hours: 144,
    training_compliance_pct: 0.91,
    credentials_expiring_30d: 3,
    new_starters: 4,
    separations: 3,
    open_vacancies: { rn: 1, en: 0, ain: 3 },
    notes: 'New RN settled in. Agency reducing. PSH convergence event: Wattle Wing PSH_01+PSH_08 both elevated — CHRIS generates convergence alert.',
  },
  // Mar 2026
  {
    period: '2026-03', facility_id: 'FAC-001',
    headcount: { rn: 27, en: 25, ain: 185, allied_health: 12, admin: 14, management: 8, total: 271 },
    employment_basis: { permanent_ft: 139, permanent_pt: 88, casual: 44 },
    agency_hours_pct: 0.18,
    turnover_rolling_12m: 0.29,
    absenteeism_rate: 0.081, // improving
    sick_leave_hours_by_role: { rn: 104, en: 94, ain: 688 },
    wc_hours: 72,
    training_compliance_pct: 0.94,
    credentials_expiring_30d: 2,
    new_starters: 5,
    separations: 2,
    open_vacancies: { rn: 1, en: 0, ain: 2 },
    notes: 'Workforce stabilising. PSH improving in Wattle Wing — PSH_01 from 0.81 to 0.71. Practice from Cycle 8 showing early effect.',
  },
  // Apr 2026
  {
    period: '2026-04', facility_id: 'FAC-001',
    headcount: { rn: 30, en: 25, ain: 190, allied_health: 12, admin: 14, management: 8, total: 279 },
    employment_basis: { permanent_ft: 148, permanent_pt: 93, casual: 38 },
    agency_hours_pct: 0.135, turnover_rolling_12m: 0.26, absenteeism_rate: 0.074,
    sick_leave_hours_by_role: { rn: 96, en: 88, ain: 652 },
    wc_hours: 40, training_compliance_pct: 0.95, credentials_expiring_30d: 1,
    new_starters: 4, separations: 2, open_vacancies: { rn: 0, en: 0, ain: 2 },
  },
  // May 2026
  {
    period: '2026-05', facility_id: 'FAC-001',
    headcount: { rn: 31, en: 25, ain: 192, allied_health: 12, admin: 14, management: 8, total: 282 },
    employment_basis: { permanent_ft: 151, permanent_pt: 94, casual: 37 },
    agency_hours_pct: 0.117, turnover_rolling_12m: 0.24, absenteeism_rate: 0.069,
    sick_leave_hours_by_role: { rn: 88, en: 82, ain: 624 },
    wc_hours: 24, training_compliance_pct: 0.96, credentials_expiring_30d: 0,
    new_starters: 3, separations: 1, open_vacancies: { rn: 0, en: 0, ain: 1 },
  },
  // Jun 2026
  {
    period: '2026-06', facility_id: 'FAC-001',
    headcount: { rn: 31, en: 26, ain: 193, allied_health: 13, admin: 14, management: 8, total: 285 },
    employment_basis: { permanent_ft: 154, permanent_pt: 95, casual: 36 },
    agency_hours_pct: 0.102, turnover_rolling_12m: 0.22, absenteeism_rate: 0.065,
    sick_leave_hours_by_role: { rn: 82, en: 78, ain: 598 },
    wc_hours: 16, training_compliance_pct: 0.97, credentials_expiring_30d: 0,
    new_starters: 3, separations: 1, open_vacancies: { rn: 0, en: 0, ain: 0 },
  },
  // Jul 2026
  {
    period: '2026-07', facility_id: 'FAC-001',
    headcount: { rn: 32, en: 26, ain: 194, allied_health: 13, admin: 14, management: 8, total: 287 },
    employment_basis: { permanent_ft: 156, permanent_pt: 96, casual: 35 },
    agency_hours_pct: 0.090, turnover_rolling_12m: 0.20, absenteeism_rate: 0.062,
    sick_leave_hours_by_role: { rn: 78, en: 74, ain: 578 },
    wc_hours: 8, training_compliance_pct: 0.97, credentials_expiring_30d: 1,
    new_starters: 2, separations: 1, open_vacancies: { rn: 0, en: 0, ain: 0 },
  },
  // Aug 2026
  {
    period: '2026-08', facility_id: 'FAC-001',
    headcount: { rn: 32, en: 26, ain: 195, allied_health: 13, admin: 14, management: 8, total: 288 },
    employment_basis: { permanent_ft: 158, permanent_pt: 96, casual: 34 },
    agency_hours_pct: 0.080, turnover_rolling_12m: 0.19, absenteeism_rate: 0.058,
    sick_leave_hours_by_role: { rn: 74, en: 70, ain: 558 },
    wc_hours: 0, training_compliance_pct: 0.98, credentials_expiring_30d: 0,
    new_starters: 2, separations: 0, open_vacancies: { rn: 0, en: 0, ain: 0 },
  },
  // Sep 2026
  {
    period: '2026-09', facility_id: 'FAC-001',
    headcount: { rn: 32, en: 27, ain: 196, allied_health: 13, admin: 14, management: 8, total: 290 },
    employment_basis: { permanent_ft: 160, permanent_pt: 97, casual: 33 },
    agency_hours_pct: 0.069, turnover_rolling_12m: 0.18, absenteeism_rate: 0.055,
    sick_leave_hours_by_role: { rn: 70, en: 66, ain: 538 },
    wc_hours: 0, training_compliance_pct: 0.98, credentials_expiring_30d: 0,
    new_starters: 2, separations: 1, open_vacancies: { rn: 0, en: 0, ain: 0 },
  },
];

// ============================================================
// CARE MINUTES — DAILY (weekly summary shown, daily available)
// ============================================================

export const care_minutes_weekly = [
  // Oct 2025 — generally compliant, some pressure
  { week: '2025-W40', avg_total: 218, avg_rn: 45.2, avg_ain: 172.8, compliant_days: 6, non_compliant_days: 1, rn_gap_days: 1 },
  { week: '2025-W41', avg_total: 213, avg_rn: 43.1, avg_ain: 169.9, compliant_days: 4, non_compliant_days: 3, rn_gap_days: 2, note: 'RN sick leave Mon/Tue' },
  { week: '2025-W42', avg_total: 220, avg_rn: 45.8, avg_ain: 174.2, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2025-W43', avg_total: 216, avg_rn: 44.3, avg_ain: 171.7, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  // Nov 2025 — more pressure
  { week: '2025-W44', avg_total: 211, avg_rn: 42.4, avg_ain: 168.6, compliant_days: 3, non_compliant_days: 4, rn_gap_days: 3, note: 'Flu season — multiple call-ins' },
  { week: '2025-W45', avg_total: 214, avg_rn: 43.8, avg_ain: 170.2, compliant_days: 5, non_compliant_days: 2, rn_gap_days: 1 },
  { week: '2025-W46', avg_total: 219, avg_rn: 45.1, avg_ain: 173.9, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2025-W47', avg_total: 217, avg_rn: 44.6, avg_ain: 172.4, compliant_days: 6, non_compliant_days: 1, rn_gap_days: 0 },
  // Dec 2025 — RN exits hit, agency surge
  { week: '2025-W48', avg_total: 215, avg_rn: 44.1, avg_ain: 170.9, compliant_days: 5, non_compliant_days: 2, rn_gap_days: 1 },
  { week: '2025-W49', avg_total: 209, avg_rn: 41.8, avg_ain: 167.2, compliant_days: 2, non_compliant_days: 5, rn_gap_days: 4, note: 'First RN exit effective — agency cover partial' },
  { week: '2025-W50', avg_total: 212, avg_rn: 42.9, avg_ain: 169.1, compliant_days: 3, non_compliant_days: 4, rn_gap_days: 3 },
  { week: '2025-W51', avg_total: 208, avg_rn: 41.2, avg_ain: 166.8, compliant_days: 2, non_compliant_days: 5, rn_gap_days: 4, note: 'Second RN exit. Christmas period. Agency scarce.' },
  { week: '2025-W52', avg_total: 211, avg_rn: 42.1, avg_ain: 168.9, compliant_days: 3, non_compliant_days: 4, rn_gap_days: 3 },
  // Jan 2026 — most challenging month
  { week: '2026-W01', avg_total: 206, avg_rn: 40.8, avg_ain: 165.2, compliant_days: 1, non_compliant_days: 6, rn_gap_days: 5, note: 'RN vacancies unfilled. Agency dependency at peak.' },
  { week: '2026-W02', avg_total: 209, avg_rn: 41.4, avg_ain: 167.6, compliant_days: 2, non_compliant_days: 5, rn_gap_days: 4 },
  { week: '2026-W03', avg_total: 213, avg_rn: 42.9, avg_ain: 170.1, compliant_days: 4, non_compliant_days: 3, rn_gap_days: 2, note: 'Agency RN becoming more reliable' },
  { week: '2026-W04', avg_total: 216, avg_rn: 44.2, avg_ain: 171.8, compliant_days: 6, non_compliant_days: 1, rn_gap_days: 1 },
  // Feb 2026 — improving
  { week: '2026-W05', avg_total: 218, avg_rn: 45.1, avg_ain: 172.9, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0, note: 'New RN settled in. Care minutes recovering.' },
  { week: '2026-W06', avg_total: 214, avg_rn: 43.4, avg_ain: 170.6, compliant_days: 5, non_compliant_days: 2, rn_gap_days: 1 },
  { week: '2026-W07', avg_total: 219, avg_rn: 45.8, avg_ain: 173.2, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W08', avg_total: 222, avg_rn: 46.3, avg_ain: 175.7, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  // Mar 2026 — stable, compliant
  { week: '2026-W09', avg_total: 220, avg_rn: 45.9, avg_ain: 174.1, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W10', avg_total: 218, avg_rn: 45.2, avg_ain: 172.8, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W11', avg_total: 221, avg_rn: 46.1, avg_ain: 174.9, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W12', avg_total: 219, avg_rn: 45.6, avg_ain: 173.4, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W13', avg_total: 216, avg_rn: 44.4, avg_ain: 171.6, compliant_days: 6, non_compliant_days: 1, rn_gap_days: 0 },
  // Apr 2026 — strong recovery
  { week: '2026-W14', avg_total: 222, avg_rn: 45.8, avg_ain: 176.2, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W15', avg_total: 224, avg_rn: 46.1, avg_ain: 177.9, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W16', avg_total: 221, avg_rn: 45.4, avg_ain: 175.6, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W17', avg_total: 226, avg_rn: 46.8, avg_ain: 179.2, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  // May 2026
  { week: '2026-W18', avg_total: 225, avg_rn: 46.4, avg_ain: 178.6, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W19', avg_total: 228, avg_rn: 47.2, avg_ain: 180.8, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W20', avg_total: 223, avg_rn: 45.9, avg_ain: 177.1, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W21', avg_total: 227, avg_rn: 46.6, avg_ain: 180.4, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W22', avg_total: 230, avg_rn: 47.8, avg_ain: 182.2, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  // Jun 2026
  { week: '2026-W23', avg_total: 229, avg_rn: 47.4, avg_ain: 181.6, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W24', avg_total: 231, avg_rn: 48.0, avg_ain: 183.0, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W25', avg_total: 228, avg_rn: 47.1, avg_ain: 180.9, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W26', avg_total: 232, avg_rn: 48.2, avg_ain: 183.8, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  // Jul 2026
  { week: '2026-W27', avg_total: 230, avg_rn: 47.6, avg_ain: 182.4, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W28', avg_total: 233, avg_rn: 48.4, avg_ain: 184.6, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W29', avg_total: 231, avg_rn: 48.0, avg_ain: 183.0, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W30', avg_total: 234, avg_rn: 48.8, avg_ain: 185.2, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  // Aug 2026
  { week: '2026-W31', avg_total: 232, avg_rn: 48.2, avg_ain: 183.8, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W32', avg_total: 235, avg_rn: 49.0, avg_ain: 186.0, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W33', avg_total: 233, avg_rn: 48.6, avg_ain: 184.4, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W34', avg_total: 236, avg_rn: 49.2, avg_ain: 186.8, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W35', avg_total: 234, avg_rn: 48.8, avg_ain: 185.2, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  // Sep 2026
  { week: '2026-W36', avg_total: 237, avg_rn: 49.4, avg_ain: 187.6, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W37', avg_total: 235, avg_rn: 49.0, avg_ain: 186.0, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W38', avg_total: 238, avg_rn: 49.6, avg_ain: 188.4, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
  { week: '2026-W39', avg_total: 236, avg_rn: 49.2, avg_ain: 186.8, compliant_days: 7, non_compliant_days: 0, rn_gap_days: 0 },
];

// ============================================================
// QUALITY INDICATORS — QUARTERLY
// ============================================================

export const quality_indicators = [
  // Q3 2024-25 (Apr-Jun 2025) — baseline
  {
    period: 'Q3_2024-25', quarter_label: 'Apr–Jun 2025',
    submitted: true, submitted_date: '2025-07-18', gpms_ref: 'GPMS-2025-Q3-00847',
    residents_assessed: 134,
    indicators: {
      QI_01_pressure_injuries: { numerator: 9, denominator: 134, rate: 6.7, benchmark: 7.8, status: 'below_benchmark' },
      QI_02_restrictive_practices: { numerator: 22, denominator: 134, rate: 16.4, benchmark: 15.1, status: 'above_benchmark' },
      QI_03_falls: { numerator: 55, denominator: 134, rate: 41.0, benchmark: 42.8, status: 'below_benchmark' },
      QI_04_falls_major_injury: { numerator: 4, denominator: 134, rate: 3.0, benchmark: 3.4, status: 'below_benchmark' },
      QI_05_polypharmacy: { numerator: 52, denominator: 134, rate: 38.8, benchmark: 39.2, status: 'below_benchmark' },
      QI_06_antipsychotics: { numerator: 31, denominator: 134, rate: 23.1, benchmark: 23.8, status: 'below_benchmark' },
      QI_07_adl_decline: { numerator: 47, denominator: 134, rate: 35.1, benchmark: 36.4, status: 'below_benchmark' },
      QI_08_incontinence: { numerator: 14, denominator: 134, rate: 10.4, benchmark: 10.9, status: 'below_benchmark' },
      QI_09_ed_presentations: { numerator: 27, denominator: 134, rate: 20.1, benchmark: 19.4, status: 'above_benchmark' },
      QI_10_hospitalisation: { numerator: 38, denominator: 134, rate: 28.4, benchmark: 27.1, status: 'above_benchmark' },
      QI_11_consumer_experience: { score: 78.4, benchmark: 76.2, status: 'above_benchmark', source: 'acqsc_survey' },
      QI_12_quality_of_life: { score: 74.1, benchmark: 72.8, status: 'above_benchmark' },
      QI_13_enrolled_nursing_hrs: { hrs_per_resident_day: 0.42, benchmark: null, status: 'new_indicator' },
      QI_14_allied_health_hrs: { hrs_per_resident_day: 0.38, benchmark: null, status: 'new_indicator' },
    },
  },
  // Q4 2024-25 (Jul-Sep 2025)
  {
    period: 'Q4_2024-25', quarter_label: 'Jul–Sep 2025',
    submitted: true, submitted_date: '2025-10-19', gpms_ref: 'GPMS-2025-Q4-00847',
    residents_assessed: 135,
    indicators: {
      QI_01_pressure_injuries: { numerator: 9, denominator: 135, rate: 6.7, benchmark: 7.8, status: 'below_benchmark' },
      QI_02_restrictive_practices: { numerator: 21, denominator: 135, rate: 15.6, benchmark: 15.1, status: 'above_benchmark' },
      QI_03_falls: { numerator: 57, denominator: 135, rate: 42.2, benchmark: 42.1, status: 'above_benchmark', note: 'Marginal — first quarter above benchmark' },
      QI_04_falls_major_injury: { numerator: 4, denominator: 135, rate: 3.0, benchmark: 3.3, status: 'below_benchmark' },
      QI_05_polypharmacy: { numerator: 52, denominator: 135, rate: 38.5, benchmark: 39.1, status: 'below_benchmark' },
      QI_06_antipsychotics: { numerator: 32, denominator: 135, rate: 23.7, benchmark: 23.8, status: 'below_benchmark' },
      QI_07_adl_decline: { numerator: 49, denominator: 135, rate: 36.3, benchmark: 36.4, status: 'below_benchmark' },
      QI_08_incontinence: { numerator: 15, denominator: 135, rate: 11.1, benchmark: 10.9, status: 'above_benchmark' },
      QI_09_ed_presentations: { numerator: 28, denominator: 135, rate: 20.7, benchmark: 19.4, status: 'above_benchmark' },
      QI_10_hospitalisation: { numerator: 39, denominator: 135, rate: 28.9, benchmark: 27.1, status: 'above_benchmark' },
      QI_11_consumer_experience: { score: 78.4, benchmark: 76.2, status: 'above_benchmark', source: 'acqsc_survey', note: 'Annual survey — same as Q3' },
      QI_12_quality_of_life: { score: 73.8, benchmark: 72.8, status: 'above_benchmark' },
      QI_13_enrolled_nursing_hrs: { hrs_per_resident_day: 0.41, benchmark: null, status: 'new_indicator' },
      QI_14_allied_health_hrs: { hrs_per_resident_day: 0.36, benchmark: null, status: 'new_indicator', note: 'Drop — allied health staff on leave' },
    },
  },
  // Q1 2025-26 (Oct-Dec 2025)
  {
    period: 'Q1_2025-26', quarter_label: 'Oct–Dec 2025',
    submitted: true, submitted_date: '2026-01-17', gpms_ref: 'GPMS-2026-Q1-00847',
    residents_assessed: 136,
    indicators: {
      QI_01_pressure_injuries: { numerator: 10, denominator: 136, rate: 7.4, benchmark: 7.8, status: 'below_benchmark' },
      QI_02_restrictive_practices: { numerator: 22, denominator: 136, rate: 16.2, benchmark: 15.1, status: 'above_benchmark', note: 'Dementia cohort driving this — documented' },
      QI_03_falls: { numerator: 58, denominator: 136, rate: 42.6, benchmark: 41.9, status: 'above_benchmark', note: '2nd consecutive quarter above benchmark' },
      QI_04_falls_major_injury: { numerator: 5, denominator: 136, rate: 3.7, benchmark: 3.3, status: 'above_benchmark', note: 'First quarter above benchmark for major injury' },
      QI_05_polypharmacy: { numerator: 53, denominator: 136, rate: 39.0, benchmark: 39.1, status: 'below_benchmark' },
      QI_06_antipsychotics: { numerator: 32, denominator: 136, rate: 23.5, benchmark: 23.8, status: 'below_benchmark' },
      QI_07_adl_decline: { numerator: 50, denominator: 136, rate: 36.8, benchmark: 36.4, status: 'above_benchmark' },
      QI_08_incontinence: { numerator: 14, denominator: 136, rate: 10.3, benchmark: 10.9, status: 'below_benchmark' },
      QI_09_ed_presentations: { numerator: 29, denominator: 136, rate: 21.3, benchmark: 19.4, status: 'above_benchmark' },
      QI_10_hospitalisation: { numerator: 40, denominator: 136, rate: 29.4, benchmark: 27.1, status: 'above_benchmark' },
      QI_11_consumer_experience: { score: 79.1, benchmark: 76.2, status: 'above_benchmark', source: 'acqsc_survey' },
      QI_12_quality_of_life: { score: 74.4, benchmark: 72.8, status: 'above_benchmark' },
      QI_13_enrolled_nursing_hrs: { hrs_per_resident_day: 0.43, benchmark: null, status: 'new_indicator' },
      QI_14_allied_health_hrs: { hrs_per_resident_day: 0.37, benchmark: null, status: 'new_indicator' },
    },
  },
  // Q2 2025-26 (Jan-Mar 2026) — CURRENT, not yet submitted
  {
    period: 'Q2_2025-26', quarter_label: 'Jan–Mar 2026',
    submitted: false, due_date: '2026-04-21',
    status: 'chris_draft_ready',
    residents_assessed: 135, // current count
    indicators: {
      QI_01_pressure_injuries: { numerator: 9, denominator: 135, rate: 6.7, benchmark: 7.8, status: 'below_benchmark', note: 'Wound care protocol changes Oct working' },
      QI_02_restrictive_practices: { numerator: 20, denominator: 135, rate: 14.8, benchmark: 15.1, status: 'below_benchmark', note: 'Improving — dementia care plan reviews completed' },
      QI_03_falls: { numerator: 57, denominator: 135, rate: 42.2, benchmark: 41.4, status: 'above_benchmark', note: '3rd consecutive quarter above benchmark. CHRIS flagged workforce link.' },
      QI_04_falls_major_injury: { numerator: 4, denominator: 135, rate: 3.0, benchmark: 3.3, status: 'below_benchmark', note: 'Major injury rate recovered' },
      QI_05_polypharmacy: { numerator: 52, denominator: 135, rate: 38.5, benchmark: 39.1, status: 'below_benchmark' },
      QI_06_antipsychotics: { numerator: 31, denominator: 135, rate: 23.0, benchmark: 23.8, status: 'below_benchmark' },
      QI_07_adl_decline: { numerator: 48, denominator: 135, rate: 35.6, benchmark: 36.4, status: 'below_benchmark' },
      QI_08_incontinence: { numerator: 14, denominator: 135, rate: 10.4, benchmark: 10.9, status: 'below_benchmark' },
      QI_09_ed_presentations: { numerator: 27, denominator: 135, rate: 20.0, benchmark: 19.4, status: 'above_benchmark' },
      QI_10_hospitalisation: { numerator: 37, denominator: 135, rate: 27.4, benchmark: 27.1, status: 'above_benchmark' },
      QI_11_consumer_experience: { score: 79.1, benchmark: 76.2, status: 'above_benchmark', source: 'acqsc_survey', note: 'Annual — 2025 result' },
      QI_12_quality_of_life: { score: 74.8, benchmark: 72.8, status: 'above_benchmark' },
      QI_13_enrolled_nursing_hrs: { hrs_per_resident_day: 0.44, benchmark: null, status: 'new_indicator' },
      QI_14_allied_health_hrs: { hrs_per_resident_day: 0.39, benchmark: null, status: 'new_indicator' },
    },
    chris_analysis: {
      went_well: 'Pressure injuries below benchmark for 4 consecutive quarters. Restrictive practices improving — below benchmark for first time. QI_04 (major injury falls) recovered after Q1 spike.',
      needs_attention: 'QI_03 (Falls) remains above benchmark — third consecutive quarter. CHRIS has identified a workforce-falls correlation: 78% of falls occurred on shifts with >30% agency coverage. This is a workforce stability issue presenting as a clinical metric.',
      cross_domain_signal: 'Agency dependency peaked at 28% in January following RN exits. Falls rate follows the agency dependency curve with a 2-4 week lag. As agency has reduced to 18%, falls rate is expected to begin improving in Q3.',
      submission_risk: 'Low. All 14 QIs have current data. No outliers outside normal range. Falls trend worth monitoring — ACQSC reviews facilities with sustained above-benchmark QI_03.',
    },
  },
];

// ============================================================
// PSH HAZARD SCORES — FORTNIGHTLY (Cycles 3-8, Oct-Mar)
// ============================================================

export const psh_cycles = [
  {
    cycle: 3, period: 'Oct 2025 (1st fortnight)',
    close_date: '2025-10-12', briefings_generated: '2025-10-13 04:47:00',
    facility_response_rate: 0.74,
    teams: {
      'TEAM-001': { // Wattle Wing — emerging pressure
        response_rate: 0.78,
        scores: {
          PSH_01_high_job_demands: 0.68, PSH_02_lack_of_support: 0.52,
          PSH_03_org_justice: 0.41, PSH_04_low_job_control: 0.49,
          PSH_05_poor_relationships: 0.38, PSH_06_role_conflict: 0.54,
          PSH_07_poor_change_mgmt: 0.43, PSH_08_traumatic_exposure: 0.44,
          PSH_09_remote_isolated: 0.31, PSH_10_violence_aggression: 0.42,
          PSH_11_harassment_bullying: 0.28, PSH_12_emotional_demands: 0.58,
          PSH_13_low_recognition: 0.61, PSH_14_poor_work_env: 0.39,
          PSH_15_job_insecurity: 0.33, PSH_16_work_life_imbalance: 0.52,
        },
        status: { elevated: ['PSH_01', 'PSH_13'], monitoring: ['PSH_06', 'PSH_12', 'PSH_16'] },
        convergence: null,
        practice_prescribed: 'MP_013', // Specific praise for observed behaviour
      },
      'TEAM-002': { // Banksia Wing — stable
        response_rate: 0.82,
        scores: {
          PSH_01: 0.54, PSH_02: 0.41, PSH_03: 0.38, PSH_04: 0.44,
          PSH_05: 0.31, PSH_06: 0.42, PSH_07: 0.36, PSH_08: 0.39,
          PSH_09: 0.28, PSH_10: 0.38, PSH_11: 0.24, PSH_12: 0.47,
          PSH_13: 0.44, PSH_14: 0.36, PSH_15: 0.31, PSH_16: 0.43,
        },
        status: { elevated: [], monitoring: ['PSH_01', 'PSH_12'] },
        convergence: null,
        practice_prescribed: 'MP_024',
      },
      'TEAM-003': { // Grevillea Wing (dementia) — elevated violence/aggression
        response_rate: 0.71,
        scores: {
          PSH_01: 0.71, PSH_02: 0.48, PSH_03: 0.44, PSH_04: 0.52,
          PSH_05: 0.41, PSH_06: 0.49, PSH_07: 0.42, PSH_08: 0.62,
          PSH_09: 0.31, PSH_10: 0.72, PSH_11: 0.31, PSH_12: 0.68,
          PSH_13: 0.48, PSH_14: 0.44, PSH_15: 0.36, PSH_16: 0.54,
        },
        status: { elevated: ['PSH_01', 'PSH_08', 'PSH_10', 'PSH_12'], monitoring: ['PSH_04', 'PSH_06'] },
        convergence: { type: 'AMPLIFYING', signals: ['PSH_01', 'PSH_08', 'PSH_10'], severity: 'moderate', note: 'Dementia wing — high demand + traumatic exposure + aggression. Expected pattern but warrants monitoring.' },
        practice_prescribed: 'MP_205', // Post-incident debrief protocol
      },
      'TEAM-004': { // Acacia Wing (dementia) — similar to Grevillea
        response_rate: 0.68,
        scores: {
          PSH_01: 0.69, PSH_02: 0.51, PSH_03: 0.43, PSH_04: 0.51,
          PSH_05: 0.44, PSH_06: 0.47, PSH_07: 0.41, PSH_08: 0.58,
          PSH_09: 0.33, PSH_10: 0.67, PSH_11: 0.29, PSH_12: 0.64,
          PSH_13: 0.52, PSH_14: 0.43, PSH_15: 0.35, PSH_16: 0.53,
        },
        status: { elevated: ['PSH_01', 'PSH_08', 'PSH_10'], monitoring: ['PSH_12', 'PSH_13'] },
        convergence: null,
        practice_prescribed: 'MP_089',
      },
      'TEAM-005': { response_rate: 0.79, scores: { PSH_01: 0.52, PSH_02: 0.43, PSH_03: 0.39, PSH_04: 0.46, PSH_05: 0.34, PSH_06: 0.44, PSH_07: 0.38, PSH_08: 0.41, PSH_09: 0.29, PSH_10: 0.41, PSH_11: 0.26, PSH_12: 0.49, PSH_13: 0.47, PSH_14: 0.38, PSH_15: 0.32, PSH_16: 0.45 }, status: { elevated: [], monitoring: ['PSH_01', 'PSH_12'] }, convergence: null, practice_prescribed: 'MP_041' },
      'TEAM-006': { response_rate: 0.76, scores: { PSH_01: 0.49, PSH_02: 0.41, PSH_03: 0.37, PSH_04: 0.43, PSH_05: 0.32, PSH_06: 0.41, PSH_07: 0.36, PSH_08: 0.38, PSH_09: 0.28, PSH_10: 0.39, PSH_11: 0.24, PSH_12: 0.46, PSH_13: 0.43, PSH_14: 0.37, PSH_15: 0.31, PSH_16: 0.44 }, status: { elevated: [], monitoring: [] }, convergence: null, practice_prescribed: 'MP_062' },
      'TEAM-007': { response_rate: 0.81, scores: { PSH_01: 0.58, PSH_02: 0.44, PSH_03: 0.41, PSH_04: 0.48, PSH_05: 0.36, PSH_06: 0.46, PSH_07: 0.39, PSH_08: 0.43, PSH_09: 0.31, PSH_10: 0.44, PSH_11: 0.27, PSH_12: 0.52, PSH_13: 0.48, PSH_14: 0.39, PSH_15: 0.33, PSH_16: 0.48 }, status: { elevated: [], monitoring: ['PSH_01', 'PSH_12'] }, convergence: null, practice_prescribed: 'MP_077' },
      'TEAM-008': { response_rate: 0.73, scores: { PSH_01: 0.62, PSH_02: 0.47, PSH_03: 0.42, PSH_04: 0.51, PSH_05: 0.38, PSH_06: 0.48, PSH_07: 0.41, PSH_08: 0.46, PSH_09: 0.32, PSH_10: 0.46, PSH_11: 0.29, PSH_12: 0.54, PSH_13: 0.51, PSH_14: 0.41, PSH_15: 0.34, PSH_16: 0.51 }, status: { elevated: ['PSH_01'], monitoring: ['PSH_12', 'PSH_16'] }, convergence: null, practice_prescribed: 'MP_033' },
    },
  },
  {
    cycle: 8, period: 'Mar 2026 (2nd fortnight)',
    close_date: '2026-03-29', briefings_generated: '2026-03-30 04:51:00',
    facility_response_rate: 0.79,
    teams: {
      'TEAM-001': { // Wattle Wing — improving after intervention, but not clear yet
        response_rate: 0.83,
        scores: {
          PSH_01_high_job_demands: 0.71, PSH_02_lack_of_support: 0.63,
          PSH_03_org_justice: 0.44, PSH_04_low_job_control: 0.52,
          PSH_05_poor_relationships: 0.41, PSH_06_role_conflict: 0.58,
          PSH_07_poor_change_mgmt: 0.47, PSH_08_traumatic_exposure: 0.68,
          PSH_09_remote_isolated: 0.34, PSH_10_violence_aggression: 0.44,
          PSH_11_harassment_bullying: 0.31, PSH_12_emotional_demands: 0.62,
          PSH_13_low_recognition: 0.54, PSH_14_poor_work_env: 0.42,
          PSH_15_job_insecurity: 0.36, PSH_16_work_life_imbalance: 0.57,
        },
        status: { elevated: ['PSH_01', 'PSH_08', 'PSH_02'], monitoring: ['PSH_06', 'PSH_12', 'PSH_16'] },
        convergence: {
          type: 'AMPLIFYING', signals: ['PSH_01', 'PSH_08'],
          severity: 'moderate',
          confidence: 'STRONG',
          cycles_persisting: 3,
          note: 'PSH_01 + PSH_08 co-elevated 3 cycles. RN exits in Dec correlate. Practice (MP_033 — acknowledge cumulative grief) showing early effect: PSH_08 down from 0.81 at peak (Jan). Not yet resolved.',
          wc_risk: { probability: 0.52, estimated_exposure_aud: 148000, window_weeks: '4-6' },
        },
        practice_prescribed: 'MP_033', // Acknowledge cumulative grief after resident deaths
        prior_cycle_outcome: { practice: 'MP_013', hazard: 'PSH_13', delta: -0.07, outcome: 'improved', note: 'PSH_13 down from 0.61 to 0.54 — recognition practices working' },
      },
      'TEAM-002': { // Banksia Wing — healthy
        response_rate: 0.88,
        scores: { PSH_01: 0.48, PSH_02: 0.38, PSH_03: 0.34, PSH_04: 0.41, PSH_05: 0.28, PSH_06: 0.39, PSH_07: 0.33, PSH_08: 0.36, PSH_09: 0.26, PSH_10: 0.35, PSH_11: 0.22, PSH_12: 0.43, PSH_13: 0.41, PSH_14: 0.33, PSH_15: 0.28, PSH_16: 0.40 },
        status: { elevated: [], monitoring: [] },
        convergence: null,
        practice_prescribed: 'MP_091',
        prior_cycle_outcome: { practice: 'MP_024', hazard: 'PSH_12', delta: -0.04, outcome: 'improved' },
      },
      'TEAM-003': { // Grevillea Wing — dementia, persistent PSH_08+PSH_10
        response_rate: 0.76,
        scores: { PSH_01: 0.69, PSH_02: 0.47, PSH_03: 0.43, PSH_04: 0.51, PSH_05: 0.42, PSH_06: 0.48, PSH_07: 0.43, PSH_08: 0.74, PSH_09: 0.33, PSH_10: 0.78, PSH_11: 0.33, PSH_12: 0.71, PSH_13: 0.51, PSH_14: 0.46, PSH_15: 0.38, PSH_16: 0.56 },
        status: { elevated: ['PSH_01', 'PSH_08', 'PSH_10', 'PSH_12'], monitoring: ['PSH_04', 'PSH_06', 'PSH_13'] },
        convergence: {
          type: 'AMPLIFYING', signals: ['PSH_01', 'PSH_08', 'PSH_10'],
          severity: 'high', confidence: 'STRONG', cycles_persisting: 6,
          note: '6 cycles of PSH_08+PSH_10 co-elevation in dementia wing. Level 4 practices insufficient. DON escalated. Specialist dementia behaviour review recommended (Level 2 intervention).',
        },
        practice_prescribed: 'MP_206', // HOC escalation — advocacy for Level 2 intervention
        prior_cycle_outcome: { practice: 'MP_205', hazard: 'PSH_08', delta: 0.02, outcome: 'worsening', note: 'Practice insufficient for this hazard combination — HOC escalation recommended' },
      },
      'TEAM-004': { // Acacia Wing — improving
        response_rate: 0.72,
        scores: { PSH_01: 0.61, PSH_02: 0.46, PSH_03: 0.41, PSH_04: 0.48, PSH_05: 0.39, PSH_06: 0.45, PSH_07: 0.40, PSH_08: 0.54, PSH_09: 0.31, PSH_10: 0.62, PSH_11: 0.28, PSH_12: 0.59, PSH_13: 0.48, PSH_14: 0.42, PSH_15: 0.34, PSH_16: 0.51 },
        status: { elevated: ['PSH_01', 'PSH_10'], monitoring: ['PSH_08', 'PSH_12'] },
        convergence: null,
        practice_prescribed: 'MP_089',
        prior_cycle_outcome: { practice: 'MP_089', hazard: 'PSH_08', delta: -0.04, outcome: 'improved' },
      },
      'TEAM-005': { response_rate: 0.82, scores: { PSH_01: 0.46, PSH_02: 0.39, PSH_03: 0.36, PSH_04: 0.43, PSH_05: 0.31, PSH_06: 0.41, PSH_07: 0.35, PSH_08: 0.38, PSH_09: 0.27, PSH_10: 0.38, PSH_11: 0.24, PSH_12: 0.44, PSH_13: 0.43, PSH_14: 0.35, PSH_15: 0.30, PSH_16: 0.42 }, status: { elevated: [], monitoring: [] }, convergence: null, practice_prescribed: 'MP_054', prior_cycle_outcome: { practice: 'MP_041', hazard: 'PSH_01', delta: -0.06, outcome: 'improved' } },
      'TEAM-006': { response_rate: 0.79, scores: { PSH_01: 0.44, PSH_02: 0.38, PSH_03: 0.35, PSH_04: 0.41, PSH_05: 0.30, PSH_06: 0.39, PSH_07: 0.34, PSH_08: 0.36, PSH_09: 0.26, PSH_10: 0.37, PSH_11: 0.23, PSH_12: 0.43, PSH_13: 0.41, PSH_14: 0.35, PSH_15: 0.29, PSH_16: 0.41 }, status: { elevated: [], monitoring: [] }, convergence: null, practice_prescribed: 'MP_071' },
      'TEAM-007': { response_rate: 0.84, scores: { PSH_01: 0.51, PSH_02: 0.41, PSH_03: 0.38, PSH_04: 0.45, PSH_05: 0.33, PSH_06: 0.43, PSH_07: 0.37, PSH_08: 0.41, PSH_09: 0.29, PSH_10: 0.41, PSH_11: 0.26, PSH_12: 0.48, PSH_13: 0.44, PSH_14: 0.37, PSH_15: 0.31, PSH_16: 0.46 }, status: { elevated: [], monitoring: ['PSH_01'] }, convergence: null, practice_prescribed: 'MP_099' },
      'TEAM-008': { response_rate: 0.76, scores: { PSH_01: 0.55, PSH_02: 0.44, PSH_03: 0.40, PSH_04: 0.48, PSH_05: 0.36, PSH_06: 0.46, PSH_07: 0.39, PSH_08: 0.44, PSH_09: 0.31, PSH_10: 0.43, PSH_11: 0.28, PSH_12: 0.51, PSH_13: 0.48, PSH_14: 0.40, PSH_15: 0.33, PSH_16: 0.49 }, status: { elevated: [], monitoring: ['PSH_01', 'PSH_12'] }, convergence: null, practice_prescribed: 'MP_033', prior_cycle_outcome: { practice: 'MP_033', hazard: 'PSH_08', delta: -0.02, outcome: 'stable' } },
    },
  },
];

// ============================================================
// SIRS REGISTER — 4 events (Oct 2025 – Mar 2026)
// ============================================================

export const sirs_events = [
  {
    id: 'SIRS-2025-0847-001',
    incident_date: '2025-10-22',
    incident_time: '14:15',
    detected_at: '2025-10-22 14:45:00',
    reported_to_don: '2025-10-22 15:00:00',
    category: 2,
    clock_start: '2025-10-22 14:45:00',
    deadline: '2025-11-21',
    incident_type: 'fall_with_injury',
    wing: 'Wing A',
    location: 'Bedroom',
    shift: 'afternoon',
    agency_shift: false,
    injury: 'Laceration to scalp requiring sutures. No fracture.',
    immediate_actions: ['Wound care administered', 'GP notified 15:10', 'Family notified 15:30', 'Hospital not required'],
    sirs_submitted: true,
    submitted_date: '2025-11-03',
    days_to_submit: 12,
    acqsc_reference: 'SIRS-2025-0847-001',
    corrective_actions: [
      { description: 'Non-slip mat audit Wing A bedrooms', status: 'completed', completed_date: '2025-11-10' },
      { description: 'Falls risk review for Wing A residents', status: 'completed', completed_date: '2025-11-08' },
    ],
    qi_impact: { QI_03: 1, QI_04: 0 },
    status: 'closed',
  },
  {
    id: 'SIRS-2025-0847-002',
    incident_date: '2025-12-08',
    incident_time: '09:30',
    detected_at: '2025-12-08 09:45:00',
    reported_to_don: '2025-12-08 10:00:00',
    category: 2,
    clock_start: '2025-12-08 09:45:00',
    deadline: '2026-01-07',
    incident_type: 'medication_error',
    wing: 'Wattle Wing',
    location: 'Medication room',
    shift: 'morning',
    agency_shift: false,
    description: 'Resident received incorrect dose of anticoagulant. Monitoring increased. No adverse outcome.',
    injury: 'No physical injury. Increased monitoring for 48 hours.',
    immediate_actions: ['GP notified immediately', 'Pharmacist consulted', 'Enhanced monitoring commenced', 'Family notified 10:30', 'Incident documented'],
    sirs_submitted: true,
    submitted_date: '2025-12-22',
    days_to_submit: 14,
    acqsc_reference: 'SIRS-2025-0847-002',
    corrective_actions: [
      { description: 'Medication administration process audit', status: 'completed', completed_date: '2025-12-20' },
      { description: 'Double-check protocol for high-risk medications', status: 'completed', completed_date: '2026-01-05' },
    ],
    qi_impact: { QI_05: 0, QI_06: 0 }, // medication error, not polypharmacy or antipsychotic
    status: 'closed',
    chris_insight: 'Medication error occurred during a morning shift in Wattle Wing during the period of RN transition (Dec). Agency staff not involved — permanent staff. Investigation found double-check protocol had lapsed. Systemic fix implemented.',
  },
  {
    id: 'SIRS-2026-0847-003',
    incident_date: '2026-01-27',
    incident_time: '22:15',
    detected_at: '2026-01-27 22:30:00',
    reported_to_don: '2026-01-27 22:45:00',
    category: 2,
    clock_start: '2026-01-27 22:30:00',
    deadline: '2026-02-26',
    incident_type: 'fall_with_injury',
    wing: 'Wing B',
    location: 'Bathroom',
    shift: 'night',
    agency_shift: true,
    agency_coverage_pct_that_shift: 0.42,
    injury: 'Hip fracture — confirmed by X-ray. Hospital transfer.',
    immediate_actions: ['Pain management administered', 'GP notified 22:50', 'Ambulance called 23:00', 'Transfer to Bowral Hospital 23:45', 'Family notified 23:10'],
    sirs_submitted: true,
    submitted_date: '2026-02-04',
    days_to_submit: 8,
    acqsc_reference: 'SIRS-2026-0847-003',
    corrective_actions: [
      { description: 'Environmental risk assessment Wing B bathrooms', status: 'completed', completed_date: '2026-02-10' },
      { description: 'Agency staff falls prevention orientation review', status: 'in_progress', due_date: '2026-04-30' },
      { description: 'High-risk resident handover brief for night agency staff', status: 'in_progress', due_date: '2026-04-15' },
    ],
    qi_impact: { QI_03: 1, QI_04: 1 },
    status: 'closed',
    chris_insight: 'Fall with major injury on a night shift with 42% agency coverage. Wing B bathroom falls pattern: 3 of 5 Wing B falls this quarter occurred in bathrooms on high-agency shifts. Workforce-falls correlation confirmed. Corrective actions address both environmental and workforce factors.',
  },
  {
    id: 'SIRS-2026-0847-004',
    incident_date: '2026-03-03',
    incident_time: '16:45',
    detected_at: '2026-03-03 17:00:00',
    reported_to_don: '2026-03-03 17:15:00',
    category: 2,
    clock_start: '2026-03-03 17:00:00',
    deadline: '2026-04-02',
    incident_type: 'fall_with_injury',
    wing: 'Wing A',
    location: 'Bedroom',
    shift: 'afternoon',
    agency_shift: true,
    agency_coverage_pct_that_shift: 0.31,
    injury: 'Wrist fracture — confirmed X-ray. Treated at hospital, returned same day.',
    immediate_actions: ['First aid', 'GP notified 17:20', 'Hospital attendance — not admitted', 'Family notified 17:30'],
    sirs_submitted: true,
    submitted_date: '2026-03-18',
    days_to_submit: 15,
    acqsc_reference: 'SIRS-2026-0847-004',
    corrective_actions: [
      { description: 'Wing A afternoon falls risk review', status: 'completed', completed_date: '2026-03-25' },
    ],
    qi_impact: { QI_03: 1, QI_04: 1 },
    status: 'closed',
    chris_insight: 'Second major-injury fall in Q2 2026. Both occurred on agency-covered shifts. Reinforces SIRS cluster pattern identified in Cycle 7 intelligence. Agency onboarding corrective action from SIRS-003 is still in progress.',
  },
];

// ============================================================
// CLINICAL AUDITS — 6 months of results
// ============================================================

export const clinical_audits = [
  // MEDICATION MANAGEMENT (monthly)
  { audit_type: 'medication_management', date: '2025-10-14', score_pct: 88, criteria_met: 42, criteria_total: 48, conducted_by: 'RN (role)', duration_min: 41, non_conformances: [ { domain: 'PRN documentation', finding: 'PRN administrations not documented within required timeframe (2 of 7 PRNs reviewed)', corrective_action: 'PRN documentation protocol reviewed at team meeting', status: 'completed', completed: '2025-10-28' } ] },
  { audit_type: 'medication_management', date: '2025-11-12', score_pct: 92, criteria_met: 44, criteria_total: 48, conducted_by: 'RN (role)', duration_min: 38, non_conformances: [ { domain: 'Storage', finding: 'Fridge temperature log incomplete — 2 dates missing', corrective_action: 'Temperature monitoring protocol reinforced', status: 'completed', completed: '2025-11-20' } ] },
  { audit_type: 'medication_management', date: '2025-12-10', score_pct: 94, criteria_met: 45, criteria_total: 48, conducted_by: 'DON (role)', duration_min: 44, non_conformances: [ { domain: 'Incident review', finding: 'Medication incidents not reviewed at weekly team meeting (SIRS-002 triggered enhanced review)', corrective_action: 'Incident review added to weekly meeting agenda', status: 'in_progress', due: '2026-01-15' }, { domain: 'Storage', finding: 'Fridge temperature log missing 3 Mar', corrective_action: 'See Nov corrective action — recurrence flagged', status: 'in_progress', due: '2026-01-20' } ] },
  { audit_type: 'medication_management', date: '2026-01-14', score_pct: 96, criteria_met: 46, criteria_total: 48, conducted_by: 'RN (role)', duration_min: 39, non_conformances: [ { domain: 'Storage', finding: 'One fridge temperature log missing — 3 Mar', corrective_action: 'Temperature log protocol update — digital log trialled', status: 'completed', completed: '2026-01-28' } ] },
  { audit_type: 'medication_management', date: '2026-02-11', score_pct: 98, criteria_met: 47, criteria_total: 48, conducted_by: 'RN (role)', duration_min: 36, non_conformances: [] },
  { audit_type: 'medication_management', date: '2026-03-12', score_pct: 100, criteria_met: 48, criteria_total: 48, conducted_by: 'RN (role)', duration_min: 34, non_conformances: [], note: 'First 100% — digital temperature log implemented in Jan has eliminated storage non-conformances' },

  // RESTRAINT REGISTER (monthly)
  { audit_type: 'restraint_register', date: '2025-10-20', score_pct: 96, criteria_met: 24, criteria_total: 25, non_conformances: [ { domain: 'Review frequency', finding: '1 resident restraint plan not reviewed within 3-month window', corrective_action: 'Review completed', status: 'completed' } ] },
  { audit_type: 'restraint_register', date: '2025-11-19', score_pct: 100, criteria_met: 25, criteria_total: 25, non_conformances: [] },
  { audit_type: 'restraint_register', date: '2025-12-17', score_pct: 100, criteria_met: 25, criteria_total: 25, non_conformances: [] },
  { audit_type: 'restraint_register', date: '2026-01-15', score_pct: 96, criteria_met: 24, criteria_total: 25, non_conformances: [ { domain: 'Consent documentation', finding: 'Consent documentation not current for 1 new resident', corrective_action: 'Consent obtained and documented', status: 'completed' } ] },
  { audit_type: 'restraint_register', date: '2026-02-12', score_pct: 100, criteria_met: 25, criteria_total: 25, non_conformances: [] },
  { audit_type: 'restraint_register', date: '2026-03-11', score_pct: 100, criteria_met: 25, criteria_total: 25, non_conformances: [] },

  // FALLS PREVENTION (quarterly)
  { audit_type: 'falls_prevention', date: '2025-10-28', score_pct: 91, criteria_met: 30, criteria_total: 33, non_conformances: [ { domain: 'Environmental assessment', finding: 'Wing B bathroom rail inspection overdue', corrective_action: 'Rail inspection and repairs completed', status: 'completed', completed: '2025-11-04' }, { domain: 'Post-fall assessment', finding: '2 post-fall assessments not completed within 24h', corrective_action: 'Post-fall protocol refresher for afternoon team', status: 'completed' } ] },
  { audit_type: 'falls_prevention', date: '2026-01-28', score_pct: 87, criteria_met: 29, criteria_total: 33, non_conformances: [ { domain: 'Environmental', finding: 'Wing B bathrooms — 2 areas identified as high risk following SIRS-003', corrective_action: 'Environmental risk assessment scheduled', status: 'in_progress', due: '2026-02-15' }, { domain: 'Agency handover', finding: 'High-risk resident information not consistently communicated to agency staff', corrective_action: 'Agency orientation checklist update', status: 'in_progress', due: '2026-02-28' } ], note: 'Falls Prevention score declined — SIRS-003 and SIRS-004 both occurred in period' },
  { audit_type: 'falls_prevention', date: '2026-04-15', score_pct: null, status: 'due_in_4_days', note: 'CHRIS will guide via voice' },

  // WOUND MANAGEMENT (monthly)
  { audit_type: 'wound_management', date: '2025-10-08', score_pct: 96, criteria_met: 23, criteria_total: 24, non_conformances: [] },
  { audit_type: 'wound_management', date: '2025-11-06', score_pct: 100, criteria_met: 24, criteria_total: 24, non_conformances: [] },
  { audit_type: 'wound_management', date: '2025-12-04', score_pct: 96, criteria_met: 23, criteria_total: 24, non_conformances: [ { domain: 'Referral', finding: '1 resident wound not referred to specialist within protocol timeframe', corrective_action: 'Referral pathway clarified', status: 'completed' } ] },
  { audit_type: 'wound_management', date: '2026-01-08', score_pct: 100, criteria_met: 24, criteria_total: 24, non_conformances: [] },
  { audit_type: 'wound_management', date: '2026-02-05', score_pct: 100, criteria_met: 24, criteria_total: 24, non_conformances: [], note: 'Wound care protocol changes from Oct 2025 sustained — correlates with QI_01 improvement' },
  { audit_type: 'wound_management', date: '2026-03-06', score_pct: 100, criteria_met: 24, criteria_total: 24, non_conformances: [] },

  // INFECTION CONTROL (monthly)
  { audit_type: 'infection_control', date: '2025-10-15', score_pct: 94, criteria_met: 32, criteria_total: 34, non_conformances: [ { domain: 'Hand hygiene', finding: 'Observed hand hygiene compliance 86% (target 95%)', corrective_action: 'Hand hygiene awareness campaign', status: 'completed' } ] },
  { audit_type: 'infection_control', date: '2025-11-12', score_pct: 97, criteria_met: 33, criteria_total: 34, non_conformances: [] },
  { audit_type: 'infection_control', date: '2025-12-10', score_pct: 91, criteria_met: 31, criteria_total: 34, non_conformances: [ { domain: 'PPE', finding: 'PPE stock low in Wattle Wing — resupply delayed', corrective_action: 'Stock management process updated', status: 'completed' }, { domain: 'Outbreak protocol', finding: 'Outbreak protocol documentation not current', corrective_action: 'Protocol updated', status: 'completed' } ] },
  { audit_type: 'infection_control', date: '2026-01-14', score_pct: 97, criteria_met: 33, criteria_total: 34, non_conformances: [] },
  { audit_type: 'infection_control', date: '2026-02-11', score_pct: 100, criteria_met: 34, criteria_total: 34, non_conformances: [] },
  { audit_type: 'infection_control', date: '2026-03-12', score_pct: 97, criteria_met: 33, criteria_total: 34, non_conformances: [ { domain: 'Vaccination', finding: '2 staff influenza vaccinations not yet completed for 2026', corrective_action: 'Vaccination campaign commenced', status: 'in_progress', due: '2026-04-30' } ] },

  // NUTRITIONAL CARE (quarterly)
  { audit_type: 'nutritional_care', date: '2025-11-05', score_pct: 88, criteria_met: 29, criteria_total: 33, non_conformances: [ { domain: 'Mealtime assistance', finding: '3 residents not receiving mealtime assistance within 10 min of serving', corrective_action: 'Mealtime staffing review', status: 'completed' }, { domain: 'Weight monitoring', finding: '4 residents overdue for monthly weight', corrective_action: 'Weight monitoring schedule updated', status: 'completed' } ] },
  { audit_type: 'nutritional_care', date: '2026-02-04', score_pct: 94, criteria_met: 31, criteria_total: 33, non_conformances: [ { domain: 'Dietitian review', finding: '2 residents with documented nutritional risk not reviewed by dietitian in quarter', corrective_action: 'Dietitian referral expedited', status: 'completed' } ] },

  // PAIN MANAGEMENT (quarterly)
  { audit_type: 'pain_management', date: '2025-10-30', score_pct: 94, criteria_met: 16, criteria_total: 17, non_conformances: [] },
  { audit_type: 'pain_management', date: '2026-01-29', score_pct: 94, criteria_met: 16, criteria_total: 17, non_conformances: [ { domain: 'Non-pharmacological', finding: 'Non-pharmacological pain management not documented for 3 residents', corrective_action: 'Care plan update completed', status: 'completed' } ] },
];

// ============================================================
// FINANCIAL DATA — MONTHLY
// ============================================================

export const financial_monthly = [
  // Oct 2025
  {
    period: '2025-10', facility_id: 'FAC-001',
    revenue: {
      annacc_residential: 1847200, support_at_home: 142800, other: 12400, total: 2002400,
      budget: 1988000, variance: 14400, variance_pct: 0.007,
    },
    expenditure: {
      direct_care_permanent: 892000, direct_care_agency: 98000,
      hotel_services: 187000, admin_management: 124000, capital: 22000,
      total: 1323000, budget: 1318000, variance: -5000,
    },
    care_ratio: 0.545, // (892000+98000)/2002400 — just above 55% threshold
    labour_cost_per_bed_day: 288.4,
    agency_cost_pct_of_care_workforce: 0.099,
    ebitda: 679400,
    budget_variance_pct: 0.007, // on budget
    annacc_classification_mix: { cat_A: 12, cat_B: 38, cat_C: 52, cat_D: 32 },
    occupancy_pct: 0.981,
  },
  // Nov 2025
  {
    period: '2025-11', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1839400, support_at_home: 142800, other: 11200, total: 1993400, budget: 1988000, variance: 5400, variance_pct: 0.003 },
    expenditure: { direct_care_permanent: 884000, direct_care_agency: 114000, hotel_services: 187000, admin_management: 124000, capital: 22000, total: 1331000, budget: 1318000, variance: -13000 },
    care_ratio: 0.501, // dropping — agency cost up, revenue stable
    labour_cost_per_bed_day: 291.2,
    agency_cost_pct_of_care_workforce: 0.114,
    ebitda: 662400,
    budget_variance_pct: -0.007,
    occupancy_pct: 0.978,
  },
  // Dec 2025 — RN exits impact
  {
    period: '2025-12', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1831600, support_at_home: 142800, other: 10800, total: 1985200, budget: 1988000, variance: -2800, variance_pct: -0.001 },
    expenditure: { direct_care_permanent: 863000, direct_care_agency: 169000, hotel_services: 187000, admin_management: 124000, capital: 22000, total: 1365000, budget: 1318000, variance: -47000 },
    care_ratio: 0.518, // agency surge hurts ratio
    labour_cost_per_bed_day: 304.1,
    agency_cost_pct_of_care_workforce: 0.164,
    ebitda: 620200,
    budget_variance_pct: -0.024, // adverse
    occupancy_pct: 0.971,
    notes: 'Agency cost $47K above budget. Direct consequence of 2 RN exits. CHRIS flags: PSH_13 decline in Wattle Wing preceded exits by 4 cycles.',
    chris_signal: { type: 'CAUSAL', confidence: 'STRONG', message: 'Agency cost spike is a culture signal. PSH_13 (Recognition) declining 4 cycles before RN exits. Estimated cost of exits + agency: $89K. Estimated cost of recognition practices: $0.' },
  },
  // Jan 2026 — worst month
  {
    period: '2026-01', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1823800, support_at_home: 142800, other: 11600, total: 1978200, budget: 1988000, variance: -9800, variance_pct: -0.005 },
    expenditure: { direct_care_permanent: 858000, direct_care_agency: 239000, hotel_services: 187000, admin_management: 124000, capital: 22000, total: 1430000, budget: 1318000, variance: -112000 },
    care_ratio: 0.554, // total care cost / revenue — agency dragging it down
    labour_cost_per_bed_day: 318.7,
    agency_cost_pct_of_care_workforce: 0.218,
    ebitda: 548200,
    budget_variance_pct: -0.056, // significantly adverse
    occupancy_pct: 0.964,
    notes: 'Highest agency spend on record. RN vacancies unresolved. Care minutes at risk. New RN starts late January.',
  },
  // Feb 2026 — recovering
  {
    period: '2026-02', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1839400, support_at_home: 142800, other: 12200, total: 1994400, budget: 1988000, variance: 6400, variance_pct: 0.003 },
    expenditure: { direct_care_permanent: 871000, direct_care_agency: 196000, hotel_services: 187000, admin_management: 124000, capital: 22000, total: 1400000, budget: 1318000, variance: -82000 },
    care_ratio: 0.535,
    labour_cost_per_bed_day: 308.2,
    agency_cost_pct_of_care_workforce: 0.184,
    ebitda: 594400,
    budget_variance_pct: -0.041,
    occupancy_pct: 0.971,
    notes: 'Agency reducing as new RN settles in. Revenue recovering. YTD variance still adverse.',
  },
  // Mar 2026 — stabilising
  {
    period: '2026-03', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1847200, support_at_home: 142800, other: 13400, total: 2003400, budget: 1988000, variance: 15400, variance_pct: 0.008 },
    expenditure: { direct_care_permanent: 879000, direct_care_agency: 161000, hotel_services: 187000, admin_management: 124000, capital: 22000, total: 1373000, budget: 1318000, variance: -55000 },
    care_ratio: 0.519,
    labour_cost_per_bed_day: 299.6,
    agency_cost_pct_of_care_workforce: 0.155,
    ebitda: 630400,
    budget_variance_pct: -0.028,
    occupancy_pct: 0.978,
    notes: 'Agency reducing month on month. Revenue above budget. Care ratio still below 55% target — projected to recover Q3 as agency normalises.',
    chris_signal: { type: 'PREDICTIVE', confidence: 'STRONG', message: 'If agency dependency returns to Oct 2025 levels (11%) by June 2026, care ratio recovers to 55%+ and FY EBITDA recovers $180K of $240K YTD adverse variance.' },
  },
  // Apr 2026 — recovery continues
  {
    period: '2026-04', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1855000, support_at_home: 145200, other: 14200, total: 2014400, budget: 1996000, variance: 18400, variance_pct: 0.009 },
    expenditure: { direct_care_permanent: 886000, direct_care_agency: 138000, hotel_services: 186000, admin_management: 123000, capital: 22000, total: 1355000, budget: 1322000, variance: -33000 },
    care_ratio: 0.509, labour_cost_per_bed_day: 296.1, agency_cost_pct_of_care_workforce: 0.135,
    ebitda: 659400, budget_variance_pct: -0.017, occupancy_pct: 0.985,
  },
  // May 2026
  {
    period: '2026-05', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1862800, support_at_home: 145600, other: 14800, total: 2023200, budget: 1996000, variance: 27200, variance_pct: 0.014 },
    expenditure: { direct_care_permanent: 893000, direct_care_agency: 118000, hotel_services: 185000, admin_management: 122000, capital: 22000, total: 1340000, budget: 1322000, variance: -18000 },
    care_ratio: 0.500, labour_cost_per_bed_day: 293.4, agency_cost_pct_of_care_workforce: 0.117,
    ebitda: 683200, budget_variance_pct: -0.009, occupancy_pct: 0.989,
  },
  // Jun 2026
  {
    period: '2026-06', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1870600, support_at_home: 146000, other: 15200, total: 2031800, budget: 2000000, variance: 31800, variance_pct: 0.016 },
    expenditure: { direct_care_permanent: 898000, direct_care_agency: 102000, hotel_services: 184000, admin_management: 121000, capital: 22000, total: 1327000, budget: 1326000, variance: -1000 },
    care_ratio: 0.492, labour_cost_per_bed_day: 290.8, agency_cost_pct_of_care_workforce: 0.102,
    ebitda: 704800, budget_variance_pct: 0.000, occupancy_pct: 0.993,
  },
  // Jul 2026
  {
    period: '2026-07', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1878400, support_at_home: 146400, other: 15600, total: 2040400, budget: 2004000, variance: 36400, variance_pct: 0.018 },
    expenditure: { direct_care_permanent: 904000, direct_care_agency: 89000, hotel_services: 183000, admin_management: 120000, capital: 22000, total: 1318000, budget: 1330000, variance: 12000 },
    care_ratio: 0.487, labour_cost_per_bed_day: 288.2, agency_cost_pct_of_care_workforce: 0.090,
    ebitda: 722400, budget_variance_pct: 0.009, occupancy_pct: 0.993,
  },
  // Aug 2026
  {
    period: '2026-08', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1886200, support_at_home: 146800, other: 16000, total: 2049000, budget: 2004000, variance: 45000, variance_pct: 0.022 },
    expenditure: { direct_care_permanent: 908000, direct_care_agency: 79000, hotel_services: 182000, admin_management: 119000, capital: 22000, total: 1310000, budget: 1330000, variance: 20000 },
    care_ratio: 0.482, labour_cost_per_bed_day: 286.4, agency_cost_pct_of_care_workforce: 0.080,
    ebitda: 739000, budget_variance_pct: 0.015, occupancy_pct: 0.996,
  },
  // Sep 2026
  {
    period: '2026-09', facility_id: 'FAC-001',
    revenue: { annacc_residential: 1894000, support_at_home: 147200, other: 16400, total: 2057600, budget: 2004000, variance: 53600, variance_pct: 0.027 },
    expenditure: { direct_care_permanent: 912000, direct_care_agency: 68000, hotel_services: 181000, admin_management: 118000, capital: 22000, total: 1301000, budget: 1330000, variance: 29000 },
    care_ratio: 0.476, labour_cost_per_bed_day: 284.6, agency_cost_pct_of_care_workforce: 0.069,
    ebitda: 756600, budget_variance_pct: 0.022, occupancy_pct: 0.996,
    chris_signal: { type: 'POSITIVE', confidence: 'STRONG', message: 'Agency dependency at 6.9% — below 10% benchmark for the first time since pre-crisis. Care ratio recovered to 47.6%. FY EBITDA on track to exceed budget.' },
  },
];

// ============================================================
// COMPLIANCE REGISTER — ACTIVE OBLIGATIONS
// ============================================================

export const compliance_obligations = [
  // 7 Strengthened Quality Standards (from 1 November 2025)
  { id: 'OBL-001', framework: 'Aged Care Act 2024', obligation: 'Standard 1 — The Individual', status: 'compliant', evidence_current: true, last_reviewed: '2026-03-01', next_review: '2026-09-01' },
  { id: 'OBL-002', framework: 'Aged Care Act 2024', obligation: 'Standard 2 — The Organisation (includes PSH safety)', status: 'compliant', evidence_current: true, last_reviewed: '2026-03-01' },
  { id: 'OBL-003', framework: 'Aged Care Act 2024', obligation: 'Standard 2 — Workforce Psychological Safety (PSH)', status: 'at_risk', evidence_current: false, gap: 'ISO 45003 worker consultation record needs updating — pulse participation data satisfies this requirement. CHRIS can update in 2 minutes.', last_reviewed: '2025-12-01', action_required: 'Update consultation evidence record', action_eta_min: 2 },
  { id: 'OBL-004', framework: 'Aged Care Act 2024', obligation: 'Standard 3 — The Care Environment', status: 'compliant', evidence_current: true },
  { id: 'OBL-005', framework: 'Aged Care Act 2024', obligation: 'Standard 4 — Services and Supports', status: 'compliant', evidence_current: true },
  { id: 'OBL-006', framework: 'Aged Care Act 2024', obligation: 'Standard 5 — Clinical Care', status: 'compliant', evidence_current: true, sub_status: { care_minutes: 'compliant_this_month', sirs: 'compliant', medication: 'compliant' } },
  { id: 'OBL-007', framework: 'Aged Care Act 2024', obligation: 'Standard 6 — Food and Nutrition', status: 'compliant', evidence_current: true },
  { id: 'OBL-008', framework: 'Aged Care Act 2024', obligation: 'Standard 7 — The Residential Community', status: 'compliant', evidence_current: true },

  // ISO 45003
  { id: 'OBL-010', framework: 'ISO 45003:2021', obligation: 'Hazard Identification — systematic fortnightly identification across 16 domains', status: 'compliant', evidence_current: true, evidence_cycles: 8, evidence_teams: 8 },
  { id: 'OBL-011', framework: 'ISO 45003:2021', obligation: 'Risk Assessment — convergence detection and severity classification', status: 'compliant', evidence_current: true },
  { id: 'OBL-012', framework: 'ISO 45003:2021', obligation: 'Control Measures — documented practices prescribed per elevated hazard', status: 'at_risk', evidence_current: false, gap: 'Grevillea Wing PSH_08+PSH_10 elevated 6 cycles — Level 4 practices documented but Level 2 escalation not yet formally documented', action_required: 'Document HOC escalation advocacy brief for Grevillea Wing' },
  { id: 'OBL-013', framework: 'ISO 45003:2021', obligation: 'Effectiveness Review — outcome measurement per intervention', status: 'compliant', evidence_current: true },
  { id: 'OBL-014', framework: 'ISO 45003:2021', obligation: 'Worker Consultation — documented fortnightly consultation', status: 'at_risk', evidence_current: false, gap: 'Same as OBL-003 — consultation record needs updating', action_required: 'Update ISO 45003 §5.4 consultation evidence', action_eta_min: 2 },

  // Regulatory reporting
  { id: 'OBL-015', framework: 'QI Program', obligation: 'Q2 2025-26 QI Submission — due 21 Apr 2026', status: 'pending', evidence_current: true, due_date: '2026-04-21', days_remaining: 9, chris_status: 'draft_ready', action_required: 'DON to review and submit' },
  { id: 'OBL-016', framework: 'QI Program', obligation: 'Q1 2025-26 QI Submission', status: 'compliant', submitted_date: '2026-01-17', gpms_ref: 'GPMS-2026-Q1-00847' },
  { id: 'OBL-017', framework: 'AN-ACC / Care Minutes', obligation: 'Care minutes monthly reporting', status: 'compliant', submitted_date: '2026-04-01', note: 'March 2026 — compliant' },
  { id: 'OBL-018', framework: 'SIRS', obligation: 'SIRS reporting — Priority 1 within 24h, Priority 2 within 30 days, final report within 60 days', status: 'compliant', ytd_events: 4, all_submitted_on_time: true, avg_days_to_submit: 12.3 },
  { id: 'OBL-019', framework: 'QFR', obligation: 'Q2 2025-26 Quarterly Financial Report', status: 'pending', due_date: '2026-04-21', chris_status: 'assembling', note: 'CHRIS compiling QFR data from TechOne' },

  // State WHS
  { id: 'OBL-020', framework: 'NSW WHS Regulation 2025 s.55C', obligation: 'Psychosocial risk management — ISO 45003-aligned documented controls', status: 'at_risk', evidence_current: false, gap: 'Same as OBL-012 — Grevillea Wing HOC escalation needs documenting' },
];

// ============================================================
// CORRECTIVE ACTIONS — OPEN AND RECENT
// ============================================================

export const corrective_actions = [
  // Open
  { id: 'CA-2026-001', source: 'sirs', sirs_ref: 'SIRS-2026-0847-003', description: 'Agency staff falls prevention orientation review — update orientation checklist to include high-risk resident identification', owner_role: 'DON', due_date: '2026-04-30', status: 'in_progress', priority: 'high', qi_link: 'QI_03' },
  { id: 'CA-2026-002', source: 'sirs', sirs_ref: 'SIRS-2026-0847-003', description: 'High-risk resident handover brief template for night agency staff', owner_role: 'Clinical Coordinator', due_date: '2026-04-15', status: 'in_progress', priority: 'high', qi_link: 'QI_03' },
  { id: 'CA-2026-003', source: 'audit', audit_type: 'infection_control', description: '2026 influenza vaccination campaign — 2 staff not yet vaccinated', owner_role: 'HR Manager', due_date: '2026-04-30', status: 'in_progress', priority: 'medium' },
  { id: 'CA-2026-004', source: 'audit', audit_type: 'falls_prevention', description: 'Wing B bathroom environmental risk assessment — grab rail heights and anti-slip surfaces', owner_role: 'Facility Manager', due_date: '2026-04-15', status: 'not_started', priority: 'high', qi_link: 'QI_03', note: 'OVERDUE — was due 2026-02-15, extended. CHRIS flagged.' },
  { id: 'CA-2026-005', source: 'compliance', obligation_id: 'OBL-003', description: 'Update ISO 45003 worker consultation evidence record from pulse participation data', owner_role: 'WHS Lead', due_date: '2026-04-15', status: 'not_started', priority: 'medium', note: 'CHRIS can complete this in 2 minutes — waiting for WHS Lead to initiate' },
  { id: 'CA-2026-006', source: 'psh', team: 'TEAM-003', description: 'Document HOC Level 2 escalation advocacy brief for Grevillea Wing — 6 cycles of PSH_08+PSH_10 co-elevation', owner_role: 'WHS Lead', due_date: '2026-04-20', status: 'not_started', priority: 'high' },

  // Recently completed
  { id: 'CA-2025-018', source: 'audit', description: 'Wing A non-slip mat audit and replacement', status: 'completed', completed_date: '2025-11-10' },
  { id: 'CA-2025-019', source: 'sirs', description: 'Medication double-check protocol for high-risk medications', status: 'completed', completed_date: '2026-01-05' },
  { id: 'CA-2025-020', source: 'audit', description: 'Digital temperature logging system for medication fridges', status: 'completed', completed_date: '2026-01-28' },
  { id: 'CA-2025-021', source: 'audit', description: 'Mealtime staffing review and schedule update', status: 'completed', completed_date: '2025-11-25' },
  { id: 'CA-2026-007', source: 'audit', description: 'Wing B bathroom environmental risk assessment (partial)', status: 'completed', completed_date: '2026-02-10', note: 'Initial assessment complete. Grab rail upgrade scheduled CA-2026-004.' },
];

// ============================================================
// GOVERNANCE PACKS — REPORTING CYCLE HISTORY
// ============================================================

export const governance_packs = [
  { id: 'PACK-001', type: 'daily_briefing', cycle: 8, period: 'Mar 2026 (2nd fortnight)', generated: '2026-03-30 04:51:00', delivered: '2026-03-30 05:02:00', read_at: '2026-03-30 06:28:00', approved: true, recipient: 'DON', signals: 3, actions: 3 },
  { id: 'PACK-002', type: 'clinical_governance', period: 'March 2026', generated: '2026-04-01 09:00:00', status: 'ready_for_review', sections: 6, est_review_min: 25, meeting_date: '2026-04-14', due_date: '2026-04-10' },
  { id: 'PACK-003', type: 'qr_committee', period: 'Q2 2025-26', generated: '2026-04-01 09:12:00', status: 'ready_for_review', sections: 7, est_review_min: 45, meeting_date: '2026-04-17', due_date: '2026-04-14' },
  { id: 'PACK-004', type: 'board_pack', period: 'Q2 2025-26', generated: '2026-04-05 08:00:00', status: 'awaiting_ceo_approval', sections: 8, est_review_min: 35, meeting_date: '2026-04-22', due_date: '2026-04-17', ceo_review_started: false },
  { id: 'PACK-005', type: 'clinical_governance', period: 'February 2026', generated: '2026-03-01 09:00:00', approved_at: '2026-03-05 14:22:00', approved_by: 'DON (role)', distributed_at: '2026-03-05 14:25:00', status: 'distributed' },
  { id: 'PACK-006', type: 'elt', period: 'March 2026', generated: '2026-04-01 09:00:00', status: 'ready_for_review', sections: 9, est_review_min: 20, meeting_date: '2026-04-16' },
];

// ============================================================
// TODAY'S PICTURE — CHRIS GENERATED (current state, Cycle 8)
// ============================================================

export const todays_picture = {
  generated_at: '2026-04-15 04:51:00',
  cycle: 9,
  chris_text: "The recovery from the January staffing crisis is holding. Care minutes at 226 this week — comfortably above the 215 target and the strongest sustained period since October. Agency is down to 13.5%, headed in the right direction. The Wattle Wing PSH intervention continues to work — PSH_08 dropped again this cycle, now at 0.52, well below the 0.60 threshold. Two things need your attention today: the Thursday night RN shift is unconfirmed and needs cover by 3pm, and the Board Pack for Q3 needs your approval before the 22nd. Falls remain above the national benchmark for a third quarter — but the trend is finally turning. April data shows a 12% reduction correlating directly with the decline in agency coverage. The Oracle has flagged 3 AN-ACC reclassification opportunities worth an estimated $11,400/month — the clinical reviews should be scheduled for next Tuesday when the ward has capacity.",
  domain_status: [
    { domain: 'Clinical', status: 'warning', summary: 'Care minutes compliant · QI_03 above benchmark 3rd quarter · 1 QI submission due 21 Apr' },
    { domain: 'Workforce', status: 'warning', summary: 'PSH improving in Wattle Wing · Grevillea Wing convergence persisting 6 cycles · Agency 18%' },
    { domain: 'Governance', status: 'ok', summary: 'Board Pack ready · Compliance 84 · 2 obligations at risk (fixable in minutes)' },
    { domain: 'Operations', status: 'ok', summary: 'RN confirmed tonight · 1 AIN gap · Briefing ready' },
    { domain: 'Financial', status: 'warning', summary: 'Care ratio 51.9% — below 55% target · Agency cost reducing month-on-month · YTD adverse $244K' },
  ],
  top_3_actions: [
    { rank: 1, priority: 'info', description: 'Q2 QI submission — review CHRIS draft and submit to GPMS', context: 'Due 21 Apr · 9 days · Draft ready · 14 QIs compiled', action_label: 'Review submission →', route: '/dashboard/quality-indicators/submission' },
    { rank: 2, priority: 'urgent', description: 'Board Pack approval — meeting in 8 days', context: 'CHRIS draft ready · 8 sections · Est. 35 min review', action_label: 'Start review →', route: '/dashboard/governance/board-pack' },
    { rank: 3, priority: 'immediate', description: 'Wing B bathroom corrective action — overdue 58 days', context: 'Falls prevention audit CA-2026-004 · Grab rail assessment not yet done', action_label: 'Assign now →', route: '/dashboard/governance/corrective-actions/CA-2026-004' },
  ],
  chris_intelligence_signal: {
    type: 'PREDICTIVE', confidence: 'EMERGING',
    domains: ['Workforce', 'PSH'],
    headline: 'Night team approaching burnout threshold',
    detail: 'PSH_01 (High Job Demands) and PSH_08 (Traumatic Exposure) co-elevated in Wattle Wing for 3 cycles. Pattern historically precedes voluntary turnover within 4-6 cycles in 71% of comparable teams. PSH_08 improved this cycle (0.08 drop) following practice — monitoring closely.',
    actions: ['Act', 'Monitor', 'Not relevant'],
  },
};

// ============================================================
// RESIDENT INTELLIGENCE — operational intelligence layer
// ============================================================

export const resident_intelligence = {
  facility_id: 'FAC-001',
  as_at: '2026-04-12',

  cohort: {
    total_residents: 135,
    residential: 133,
    respite: 2,
    occupancy_pct: 0.985,
    vacant_beds: 2,
    vacant_detail: [
      { wing: 'Wing A', bed: 'Bed 14', vacant_days: 18, revenue_lost: 7560 },
      { wing: 'Wing B', bed: 'Bed 7', vacant_days: 3, revenue_lost: 1260 },
    ],
    an_acc_mix: { class_1_3: 18, class_4_7: 52, class_8_13: 65 },
    supported_resident_ratio: 0.464,
    average_length_of_stay_days: 847,
    dementia_diagnosed: 58,
    admissions_pipeline: { enquiries: 3, assessments_in_progress: 2, offers_made: 1 },
    anticipated_departures_30d: 2,
  },

  care_plans: {
    current_within_90d: 133,
    overdue_90_180d: 2,
    overdue_180d_plus: 0,
    goals_not_progressed: 1,
    upcoming_reviews_14d: 9,
    annacc_reassessment_flags: 3,
    estimated_revenue_impact: 8200,
    overdue_detail: [
      { wing: 'Grevillea Wing', days_since_review: 97, trigger: '90-day cycle + PSH elevation in team' },
      { wing: 'Boronia Wing', days_since_review: 103, trigger: '90-day standard cycle' },
    ],
    goals_detail: [
      { wing: 'Waratah Wing', category: 'Social connection', goal: 'Attend weekly music activity', weeks_since_set: 8, progress: 'none', action_needed: 'Lifestyle referral' },
    ],
    upcoming_detail: [
      { wing: 'Wattle Wing', count: 3, due_within_days: 7 },
      { wing: 'Banksia Wing', count: 2, due_within_days: 14 },
      { wing: 'Flannel Wing', count: 4, due_within_days: 14 },
    ],
  },

  resident_voice: {
    cycle: 8,
    collection_period: '2026-03-24 to 2026-04-06',
    eligible: 135,
    cognitively_not_appropriate: 24,
    responses: 89,
    proxy_responses: 12,
    participation_rate: 0.66,
    not_collected: 10,

    overall_scores: {
      overall_feeling: 4.1,
      feel_listened_to: 4.3,
      feel_safe: 3.8,
      satisfied_with_care: 4.2,
      something_to_improve: 3.4,
    },

    by_wing: [
      { team_id: 'TEAM-001', name: 'Wattle Wing', responses: 12, overall: 4.2, listened: 4.4, safe: 4.3, satisfied: 4.3, improve: 3.6, trend: 'stable' as const },
      { team_id: 'TEAM-002', name: 'Banksia Wing', responses: 13, overall: 4.3, listened: 4.5, safe: 4.4, satisfied: 4.4, improve: 3.8, trend: 'improving' as const },
      { team_id: 'TEAM-003', name: 'Grevillea Wing', responses: 9, overall: 3.2, listened: 3.4, safe: 3.8, satisfied: 3.4, improve: 2.9, trend: 'declining' as const, flag: 'PSH_08 correlation' },
      { team_id: 'TEAM-004', name: 'Acacia Wing', responses: 10, overall: 3.3, listened: 3.5, safe: 3.9, satisfied: 3.3, improve: 3.1, trend: 'declining' as const, flag: 'PSH_08 correlation' },
      { team_id: 'TEAM-005', name: 'Boronia Wing', responses: 11, overall: 4.1, listened: 4.3, safe: 4.2, satisfied: 4.2, improve: 3.5, trend: 'stable' as const },
      { team_id: 'TEAM-006', name: 'Waratah Wing', responses: 12, overall: 4.2, listened: 4.4, safe: 4.3, satisfied: 4.3, improve: 3.6, trend: 'stable' as const },
      { team_id: 'TEAM-007', name: 'Flannel Morning', responses: 11, overall: 4.0, listened: 4.1, safe: 4.1, satisfied: 4.0, improve: 3.4, trend: 'stable' as const },
      { team_id: 'TEAM-008', name: 'Flannel Evening', responses: 11, overall: 3.9, listened: 4.0, safe: 4.0, satisfied: 3.9, improve: 3.3, trend: 'stable' as const },
    ],

    open_ended_themes: [
      { theme: 'More outdoor time / garden access', count: 14, wings: ['TEAM-005', 'TEAM-006'] },
      { theme: 'Music and activities', count: 11, wings: ['TEAM-003', 'TEAM-004'] },
      { theme: 'Staff consistency (same faces)', count: 9, wings: ['TEAM-001', 'TEAM-007', 'TEAM-008'], flag: 'agency_signal' as const },
      { theme: 'Better food variety', count: 8, wings: ['TEAM-001', 'TEAM-002'] },
      { theme: 'More family communication', count: 6, wings: ['TEAM-003', 'TEAM-004'] },
    ],

    six_cycle_trend: [
      { cycle: 3, overall: 4.2 },
      { cycle: 4, overall: 4.1 },
      { cycle: 5, overall: 4.0 },
      { cycle: 6, overall: 4.0 },
      { cycle: 7, overall: 3.9 },
      { cycle: 8, overall: 3.8 },
    ],
  },

  family_engagement: {
    total_registered_contacts: 247,
    engagement_rate: 0.74,
    residents_no_contact_30d: 18,
    residents_no_contact_90d: 3,
    no_contact_detail: [
      { wing: 'Grevillea Wing', days_since_contact: 94 },
      { wing: 'Acacia Wing', days_since_contact: 107 },
      { wing: 'Boronia Wing', days_since_contact: 91 },
    ],
    care_review_invitations_sent: 12,
    care_review_family_participated: 9,
    care_review_family_not_invited: 1,
    monthly_update_status: 'draft_ready' as const,
  },

  complaints: {
    open: 1,
    overdue_14d: 0,
    resolved_this_month: 2,
    escalated_to_acqsc_ytd: 0,
    avg_resolution_days_ytd: 6.5,

    open_items: [
      {
        id: 'COMP-2026-004',
        category: 'food_nutrition',
        subcategory: 'portion_size',
        received_date: '2026-04-04',
        channel: 'verbal_to_staff',
        wing: 'Wattle Wing',
        acknowledged_date: '2026-04-04',
        response_due: '2026-04-18',
        days_elapsed: 8,
        days_remaining: 6,
        status: 'under_review' as const,
        assigned_to: 'fm',
        pattern_flag: true,
        pattern_note: '3rd food quality complaint in 6 months — all Wattle Wing, all modified texture',
      },
    ],

    resolved_items: [
      { id: 'COMP-2026-002', category: 'activities', subcategory: 'preferred_activities', resolved_date: '2026-03-25', days_to_resolve: 7, resolution: 'Lifestyle team added bowls to weekly program' },
      { id: 'COMP-2026-003', category: 'staff_communication', subcategory: 'felt_rushed', resolved_date: '2026-03-28', days_to_resolve: 6, resolution: 'Care plan updated; team briefed on resident preferences' },
    ],

    twelve_month_trend: [
      { month: '2025-05', count: 1 }, { month: '2025-06', count: 0 },
      { month: '2025-07', count: 2 }, { month: '2025-08', count: 1 },
      { month: '2025-09', count: 0 }, { month: '2025-10', count: 1 },
      { month: '2025-11', count: 2 }, { month: '2025-12', count: 0 },
      { month: '2026-01', count: 1 }, { month: '2026-02', count: 0 },
      { month: '2026-03', count: 2 }, { month: '2026-04', count: 1 },
    ],
  },

  consumer_experience: {
    qi_11_score: 79.1,
    qi_11_benchmark: 76.2,
    qi_11_survey_year: 2025,
    qi_12_quality_of_life: 74.8,
    qi_12_benchmark: 72.8,
    star_rating_quality_measures: 4,
  },

  safety_signals: {
    high_fall_risk_residents: 12,
    high_pressure_injury_risk: 4,
    high_nutrition_risk: 6,
    eol_pathway_residents: 2,
    departure_risk_30d: 2,
  },
};

// ============================================================
// ============================================================
// HOME CARE SEED DATA — FAC-005 KHG Home Care Southern Highlands
// ============================================================

export const home_care_data = {
  facility_id: 'FAC-005',
  care_type: 'home_care' as const,
  name: 'KHG Home Care Southern Highlands',
  clients: 48,

  visit_schedule_today: {
    total_scheduled: 23,
    completed: 21,
    missed: 1,
    late: 1,
    in_progress: 0,
    compliance_rate: 0.91,
    visits: [
      { id: 'V-001', client_id: 'HC-012', worker: 'CSW (role)', time: '07:00', type: 'personal_care', status: 'completed' as const, duration_min: 45 },
      { id: 'V-002', client_id: 'HC-003', worker: 'CSW (role)', time: '08:00', type: 'domestic_assistance', status: 'completed' as const, duration_min: 60 },
      { id: 'V-003', client_id: 'HC-028', worker: 'CSW (role)', time: '09:30', type: 'personal_care', status: 'completed' as const, duration_min: 45 },
      { id: 'V-004', client_id: 'HC-015', worker: 'RN (role)', time: '10:00', type: 'nursing', status: 'completed' as const, duration_min: 30 },
      { id: 'V-005', client_id: 'HC-041', worker: 'CSW (role)', time: '11:00', type: 'social_support_individual', status: 'missed' as const, note: 'Client not home — documentation required within 24h' },
      { id: 'V-006', client_id: 'HC-007', worker: 'CSW (role)', time: '14:00', type: 'personal_care', status: 'late' as const, late_minutes: 35, note: 'Traffic delay — client notified' },
    ],
  },

  budget_summary: {
    total_monthly_budgets: 186400,
    claimed_to_date: 124200,
    unspent: 62200,
    unspent_pct: 0.334,
    care_management_revenue_pct: 0.19,
    claiming_deadline_days: 8,
    clients_above_threshold: 3,
    clients_by_utilisation: [
      { client_id: 'HC-012', budget: 4800, claimed: 4200, remaining_pct: 0.125, status: 'on_track' as const },
      { client_id: 'HC-003', budget: 3600, claimed: 1200, remaining_pct: 0.667, status: 'at_risk' as const },
      { client_id: 'HC-028', budget: 5200, claimed: 3800, remaining_pct: 0.269, status: 'on_track' as const },
      { client_id: 'HC-041', budget: 2400, claimed: 600, remaining_pct: 0.750, status: 'critical' as const },
    ],
  },

  lone_worker: {
    workers_active_now: 7,
    checkins_completed: 6,
    checkins_overdue: 1,
    high_risk_visits_today: 2,
    workers: [
      { id: 'W-001', role: 'CSW', current_client: 'HC-028', last_checkin: '2026-04-12 09:45:00', status: 'ok' as const },
      { id: 'W-002', role: 'CSW', current_client: 'HC-015', last_checkin: '2026-04-12 10:15:00', status: 'ok' as const },
      { id: 'W-003', role: 'CSW', current_client: 'HC-007', last_checkin: '2026-04-12 08:30:00', status: 'overdue' as const },
      { id: 'W-004', role: 'RN', current_client: 'HC-041', last_checkin: '2026-04-12 11:00:00', status: 'ok' as const },
    ],
  },

  psh_current: {
    elevated_domains: ['PSH_09', 'PSH_01'],
    PSH_09_lone_worker: 0.72,
    PSH_01_high_demands: 0.68,
    participation_rate: 0.72,
    note: 'PSH_09 (Lone Worker) elevated — home care specific risk. Travel time burden contributing to PSH_01.',
  },

  incidents: {
    open: 0,
    ytd: 1,
    last_incident: {
      type: 'missed_medication',
      date: '2026-03-15',
      reported_within: '24h',
      status: 'closed',
    },
  },
};

// AGENT ACTIVITY — seed data for Agent Activity screen + AgentPulse
// ============================================================

export type AgentStatus = 'active' | 'awaiting_action' | 'idle';

export interface AgentState {
  name: string;
  tagline: string;
  schedule: string;
  status: AgentStatus;
  last_action: string;
  last_action_at: string;
  next_run: string;
  next_run_label: string;
  documents_awaiting?: number;
  action_label?: string;
  action_route?: string;
  domains: string[];
}

export const agent_activity: AgentState[] = [
  {
    name: 'Sentinel',
    tagline: 'Always watching. Nothing slips through.',
    schedule: 'Always on · 2h cycle',
    status: 'active',
    last_action: 'Care minutes compliant · RN confirmed tonight · 0 immediate findings',
    last_action_at: '2026-04-12 06:47:00',
    next_run: '2026-04-12 08:47:00',
    next_run_label: 'In 1h 47m',
    domains: ['clinical', 'operations', 'workforce', 'governance', 'residents'],
  },
  {
    name: 'Oracle',
    tagline: 'Finding the revenue that\'s already there.',
    schedule: 'Weekly · Sunday 21:00',
    status: 'awaiting_action',
    last_action: '3 AN-ACC opportunities · $11.4K/month identified · CFO notified',
    last_action_at: '2026-04-06 21:04:00',
    next_run: '2026-04-13 21:00:00',
    next_run_label: 'Sunday 21:00 · 1 day',
    documents_awaiting: 1,
    action_label: 'View Oracle report →',
    action_route: '/dashboard/financial/revenue',
    domains: ['financial', 'clinical', 'residents'],
  },
  {
    name: 'Steward',
    tagline: 'Catching structural problems before they\'re crises.',
    schedule: 'Daily · 03:30 AEST',
    status: 'active',
    last_action: '2 structural findings · 1 episodic · Sunday PM RN gap confirmed',
    last_action_at: '2026-04-12 03:31:00',
    next_run: '2026-04-13 03:30:00',
    next_run_label: 'Tomorrow 03:30',
    domains: ['operations', 'financial', 'workforce'],
  },
  {
    name: 'Chronicler',
    tagline: 'Nothing goes undocumented.',
    schedule: 'Event-driven',
    status: 'awaiting_action',
    last_action: 'SIRS Cat 2 draft ready · awaiting DON review',
    last_action_at: '2026-04-12 06:03:00',
    next_run: 'On next trigger',
    next_run_label: 'On next event',
    documents_awaiting: 3,
    action_label: '3 documents awaiting review →',
    action_route: '/don/queue',
    domains: ['clinical', 'governance', 'residents', 'operations'],
  },
  {
    name: 'Keeper',
    tagline: 'Watching over the people who deliver the care.',
    schedule: 'Fortnightly + daily',
    status: 'awaiting_action',
    last_action: 'Turnover precursor detected — Wattle Wing · PSH_13 declining 4 cycles',
    last_action_at: '2026-04-06 21:30:00',
    next_run: '2026-04-20 21:00:00',
    next_run_label: 'Cycle close · 8 days',
    documents_awaiting: 1,
    action_label: 'View workforce signals →',
    action_route: '/dashboard/psh',
    domains: ['workforce', 'financial', 'operations'],
  },
  {
    name: 'Town Crier',
    tagline: 'Making sure they all talk to each other.',
    schedule: 'Continuous',
    status: 'active',
    last_action: 'Oracle + Steward merged — 1 coordinated recommendation delivered',
    last_action_at: '2026-04-12 05:48:00',
    next_run: 'Continuous',
    next_run_label: 'Always running',
    domains: ['operations', 'workforce', 'financial', 'clinical'],
  },
];

// Queue items — role-specific, aligned to data model
export interface QueueItem {
  id: string;
  severity: 'immediate' | 'urgent' | 'routine';
  title: string;
  source: string;
  route: string;
}

export const queue_items: Record<string, QueueItem[]> = {
  don: [
    { id: 'Q-001', severity: 'immediate', title: 'SIRS Cat 1 draft — review and submit to GPMS', source: 'Chronicler', route: '/dashboard/sirs/draft' },
    { id: 'Q-002', severity: 'urgent', title: 'Falls prevention audit — 4 days overdue', source: 'Sentinel', route: '/dashboard/governance/corrective-actions/CA-2026-004' },
    { id: 'Q-003', severity: 'urgent', title: '2 care plan reviews overdue — Grevillea & Boronia Wings', source: 'Sentinel', route: '/dashboard/residents/care-plans' },
    { id: 'Q-004', severity: 'routine', title: 'QI Q2 submission — CHRIS draft ready for review', source: 'Chronicler', route: '/dashboard/quality' },
    { id: 'Q-005', severity: 'routine', title: '3 AN-ACC reassessments — schedule clinical reviews', source: 'Oracle', route: '/dashboard/residents/care-plans' },
  ],
  facility_manager: [
    { id: 'Q-010', severity: 'urgent', title: 'Board Pack — approve before 17 Apr (8 days)', source: 'Chronicler', route: '/dashboard/reporting' },
    { id: 'Q-011', severity: 'urgent', title: 'Wing B bathroom corrective action — 58 days overdue', source: 'Sentinel', route: '/dashboard/compliance' },
    { id: 'Q-012', severity: 'urgent', title: 'Grevillea Wing PSH convergence — Level 2 escalation needed', source: 'Keeper', route: '/dashboard/psh' },
    { id: 'Q-013', severity: 'urgent', title: 'Structural RN gap — Sunday PM requires permanent hire', source: 'Steward', route: '/dashboard/workforce/roster' },
    { id: 'Q-014', severity: 'routine', title: 'Oracle + Steward recommendation — AN-ACC review scheduling', source: 'Town Crier', route: '/dashboard/agents' },
    { id: 'Q-015', severity: 'routine', title: 'Clinical Governance Pack — review before 14 Apr meeting', source: 'Chronicler', route: '/dashboard/reporting' },
    { id: 'Q-016', severity: 'routine', title: 'Monthly family update — review and distribute', source: 'Chronicler', route: '/dashboard/residents/families' },
  ],
  ceo: [
    { id: 'Q-020', severity: 'urgent', title: 'Board Pack Q2 — approve before 17 Apr Board meeting', source: 'Chronicler', route: '/dashboard/reporting' },
    { id: 'Q-021', severity: 'routine', title: 'ELT Pack — review cross-facility intelligence section', source: 'Chronicler', route: '/dashboard/reporting' },
  ],
  cfo: [
    { id: 'Q-030', severity: 'urgent', title: 'QFR Q2 — sign off capital expenditure and depreciation', source: 'Chronicler', route: '/dashboard/financial/budget' },
    { id: 'Q-031', severity: 'urgent', title: 'Oracle report — 3 AN-ACC opportunities ($11.4K/month)', source: 'Oracle', route: '/dashboard/financial/revenue' },
    { id: 'Q-032', severity: 'routine', title: 'ELT finance section — review P&L commentary draft', source: 'Chronicler', route: '/dashboard/reporting' },
  ],
  clinical_director: [
    { id: 'Q-040', severity: 'routine', title: 'Clinical Leadership Pack — review before meeting', source: 'Chronicler', route: '/dashboard/reporting' },
    { id: 'Q-041', severity: 'routine', title: 'AN-ACC portfolio review — 3 facilities with reassessment flags', source: 'Oracle', route: '/dashboard/residents/care-plans' },
  ],
  quality_lead: [
    { id: 'Q-050', severity: 'immediate', title: 'SIRS Cat 2 draft — co-review with DON before GPMS submission', source: 'Chronicler', route: '/dashboard/sirs' },
    { id: 'Q-051', severity: 'urgent', title: 'QS 2.8.2 evidence gap — CHRIS can fix in 2 minutes', source: 'Sentinel', route: '/dashboard/compliance' },
    { id: 'Q-052', severity: 'urgent', title: 'ISO 45003 worker consultation record — needs updating', source: 'Sentinel', route: '/dashboard/compliance' },
    { id: 'Q-053', severity: 'routine', title: 'Q&R Committee Pack — review before 17 Apr meeting', source: 'Chronicler', route: '/dashboard/reporting' },
  ],
  whs_lead: [
    { id: 'Q-060', severity: 'urgent', title: 'Grevillea Wing WC risk — prescribe Level 2 intervention', source: 'Keeper', route: '/dashboard/psh' },
    { id: 'Q-061', severity: 'routine', title: 'WHS Committee Pack — review PSH + WC section', source: 'Chronicler', route: '/dashboard/reporting' },
  ],
  hr_manager: [
    { id: 'Q-070', severity: 'urgent', title: '2 AHPRA registrations expiring within 30 days — send reminders', source: 'Steward', route: '/dashboard/training' },
    { id: 'Q-071', severity: 'routine', title: 'P&C Committee Pack — review workforce section', source: 'Chronicler', route: '/dashboard/reporting' },
  ],
  team_leader: [
    { id: 'Q-080', severity: 'routine', title: 'Team Briefing Cycle 8 — read before Monday huddle', source: 'Chronicler', route: '/team-loop/briefing' },
  ],
  board_member: [
    { id: 'Q-090', severity: 'routine', title: 'Q2 Board Pack — read before 17 Apr meeting', source: 'Chronicler', route: '/dashboard/reporting' },
  ],
};

// Derived summary for badge display
export const queue_summary = Object.fromEntries(
  Object.entries(queue_items).map(([role, items]) => {
    const severityOrder = { immediate: 0, urgent: 1, routine: 2 };
    const sorted = [...items].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    return [role, {
      count: items.length,
      highestSeverity: sorted[0]?.severity ?? null,
    }];
  })
) as Record<string, { count: number; highestSeverity: 'immediate' | 'urgent' | 'routine' | null }>;

// Sections with pending alerts (for dot indicator on collapsed sections)
export const section_alerts: Record<string, boolean> = {
  clinical: true,    // SIRS draft + audit overdue + QI submission
  operations: true,  // falls corrective action overdue
  governance: true,  // Board Pack + corrective action overdue
  workforce: true,   // PSH convergence + AHPRA expiry
  financial: false,
  residents: true,   // care plan overdue
  loops: false,
};

export const agent_activity_log = [
  { time: '07:30', agent: 'Sentinel', action: 'Flagged RN gap tonight — DON notified via iMessage', status: 'delivered' as const },
  { time: '06:47', agent: 'Sentinel', action: 'Morning scan complete — care minutes compliant, 0 immediate findings', status: 'success' as const },
  { time: '06:03', agent: 'Chronicler', action: 'SIRS Cat 2 draft prepared — awaiting DON review', status: 'awaiting' as const },
  { time: '05:58', agent: 'Chronicler', action: 'Medication management audit report auto-filed — 100% score, no non-conformances', status: 'success' as const },
  { time: '05:48', agent: 'Town Crier', action: 'Oracle + Steward findings merged — 1 coordinated recommendation for FM', status: 'success' as const },
  { time: '05:47', agent: 'Oracle', action: '3 AN-ACC reclassification opportunities identified — est. $11.4K/month', status: 'success' as const },
  { time: '05:31', agent: 'Steward', action: '2 structural roster gaps + 1 leave coverage gap identified', status: 'success' as const },
  { time: '05:12', agent: 'Sentinel', action: 'Morning briefings generated for 9 roles', status: 'success' as const },
  { time: '04:51', agent: 'Keeper', action: 'PSH Cycle 8 analysis — Wattle Wing turnover precursor confirmed', status: 'success' as const },
  { time: '03:31', agent: 'Steward', action: 'Daily capacity analysis — Sunday PM RN structural gap, 58 weeks of history', status: 'success' as const },
];

export const coordination_log = [
  {
    type: 'coordination' as const,
    agents: ['Oracle', 'Steward'],
    narrative: 'The Oracle spotted 3 AN-ACC reclassification opportunities worth $11.4K/month. The Steward found the optimal scheduling window — Tuesday morning shift has capacity. You received one recommendation instead of two alerts.',
    date: '2026-04-12',
    shift: 'Morning',
  },
  {
    type: 'safety' as const,
    agents: ['Sentinel', 'Town Crier'],
    narrative: 'The Sentinel flagged a care minutes safety obligation on Thursday. The Town Crier protected it automatically — the Oracle\'s AN-ACC review scheduling was deferred by one day. Safety always wins.',
    date: '2026-04-10',
    shift: 'No human decision needed',
  },
  {
    type: 'coordination' as const,
    agents: ['Keeper', 'Chronicler'],
    narrative: 'The Keeper identified a turnover precursor in Wattle Wing. The Chronicler prepared a leadership conversation brief for the FM. One signal, one prepared response.',
    date: '2026-04-07',
    shift: 'Following PSH cycle close',
  },
  {
    type: 'conflict' as const,
    agents: ['Oracle', 'Steward'],
    narrative: 'The Oracle wanted the Clinical Coordinator for AN-ACC assessments on Monday. The Steward needed them for the falls prevention audit. Both non-safety — CHRIS recommended the audit first (compliance deadline closer). FM confirmed.',
    date: '2026-04-04',
    shift: 'FM confirmed priority',
  },
];

// ── ROSTERING ─────────────────────────────────────────────────

export const roster_today = {
  date: '2026-04-13',
  weekly_agency_cost: 950,
  weekly_agency_pct: 0.18,
  next_7_days_gaps: 3,
  shifts: {
    morning: {
      time: '6:00am – 2:00pm',
      total_rostered: 8,
      gaps: 0,
      rn_confirmed: true,
      agency_count: 1,
      staff: [
        { role: 'RN' as const,  name: 'Sarah Chen',     agency: false },
        { role: 'RN' as const,  name: 'James Wu',       agency: false },
        { role: 'EN' as const,  name: 'Patricia Moore',  agency: false },
        { role: 'AIN' as const, name: 'Worker 1',       agency: false },
        { role: 'AIN' as const, name: 'Worker 2',       agency: false },
        { role: 'AIN' as const, name: 'Worker 3',       agency: false },
        { role: 'AIN' as const, name: 'Worker 4',       agency: false },
        { role: 'AIN' as const, name: 'Agency Worker',  agency: true  },
      ],
    },
    afternoon: {
      time: '2:00pm – 10:00pm',
      total_rostered: 7,
      gaps: 1,
      rn_confirmed: true,
      agency_count: 1,
      staff: [
        { role: 'RN' as const,  name: 'Michael Torres',       agency: true  },
        { role: 'EN' as const,  name: 'Linda Park',           agency: false },
        { role: 'AIN' as const, name: 'Worker 5',             agency: false },
        { role: 'AIN' as const, name: 'Worker 6',             agency: false },
        { role: 'AIN' as const, name: 'Worker 7',             agency: false },
        { role: 'AIN' as const, name: 'Worker 8',             agency: false },
        { role: 'AIN' as const, name: 'GAP — Grevillea Wing', agency: false, gap: true },
      ],
    },
    night: {
      time: '10:00pm – 6:00am',
      total_rostered: 5,
      gaps: 0,
      rn_confirmed: true,
      agency_count: 0,
      staff: [
        { role: 'RN' as const,  name: 'Night RN confirmed', agency: false },
        { role: 'EN' as const,  name: 'Night EN',           agency: false },
        { role: 'AIN' as const, name: 'Night AIN 1',        agency: false },
        { role: 'AIN' as const, name: 'Night AIN 2',        agency: false },
        { role: 'AIN' as const, name: 'Night AIN 3',        agency: false },
      ],
    },
  },
  week: [
    { day: 'Mon', shifts: 24, gaps: 0, agency: 1, cost: 120 },
    { day: 'Tue', shifts: 24, gaps: 0, agency: 2, cost: 240 },
    { day: 'Wed', shifts: 24, gaps: 1, agency: 1, cost: 120 },
    { day: 'Thu', shifts: 24, gaps: 0, agency: 1, cost: 120 },
    { day: 'Fri', shifts: 24, gaps: 0, agency: 2, cost: 240 },
    { day: 'Sat', shifts: 20, gaps: 0, agency: 1, cost: 110 },
    { day: 'Sun', shifts: 20, gaps: 1, agency: 2, cost: 480 },
  ],
};

// ── HANDOVERS ─────────────────────────────────────────────────

export const current_handover = {
  shift: 'afternoon' as const,
  date: '2026-04-13',
  last_completed: { shift: 'morning', time: '6:02am', date: '2026-04-13' },
  items: [
    {
      id: 'h1',
      priority: 'high' as const,
      title: 'Wing B resident: fall risk elevated',
      detail: 'Resident had unwitnessed fall yesterday. Care plan updated — bed rails now required. Confirm rails checked at start of shift.',
      source: 'AlayaCare incident log',
      generated_by: 'chronicler' as const,
      wing: 'Wing B',
      noted: false,
    },
    {
      id: 'h2',
      priority: 'medium' as const,
      title: 'Medication change — 3 residents',
      detail: 'PRN pain medication added for Rooms 14, 22, 31. First doses not yet administered. Monitor for effect and document response.',
      source: 'AlayaCare medication record',
      generated_by: 'chronicler' as const,
      wing: 'Wattle Wing',
      noted: false,
    },
    {
      id: 'h3',
      priority: 'low' as const,
      title: 'Care minutes — afternoon position',
      detail: '58 min delivered morning shift. Afternoon target: 58 min. 1 AIN gap in Grevillea Wing — source cover before 3pm.',
      source: 'Deputy + AlayaCare',
      generated_by: 'sentinel' as const,
      noted: false,
    },
    {
      id: 'h4',
      priority: 'low' as const,
      title: 'Grevillea Wing bathroom — wet floor',
      detail: 'Wet floor sign placed after mopping. Awaiting maintenance to check non-slip surface. Inform Grevillea Wing staff.',
      source: 'Manual entry',
      generated_by: 'manual' as const,
      wing: 'Grevillea Wing',
      noted: false,
    },
  ],
};

// ── INCIDENTS ─────────────────────────────────────────────────

export const incidents_closed_ytd = [
  { id: 'INC-2025-001', type: 'Fall with injury', date: '2025-10-22', wing: 'Wing A', status: 'closed' as const, sirs_category: 2 as number | null, days_to_close: 12, submitted: '2025-11-03', agency_shift: false },
  { id: 'INC-2025-002', type: 'Medication error', date: '2025-12-08', wing: 'Wattle Wing', status: 'closed' as const, sirs_category: 2 as number | null, days_to_close: 14, submitted: '2025-12-22', agency_shift: false },
  { id: 'INC-2026-001', type: 'Fall with injury', date: '2026-01-27', wing: 'Wing B', status: 'closed' as const, sirs_category: 1 as number | null, days_to_close: 8, submitted: '2026-02-04', agency_shift: true },
  { id: 'INC-2026-002', type: 'Fall with injury', date: '2026-03-03', wing: 'Wing A', status: 'closed' as const, sirs_category: null, days_to_close: 15, submitted: '2026-03-18', agency_shift: true },
];

export const steward_structural_finding = {
  finding: 'Sunday PM RN gap — structural',
  evidence: '6 of last 8 Sundays required agency RN cover',
  shift: 'Sunday afternoon (2pm–10pm)',
  agency_cost_per_shift: 480,
  permanent_equivalent: 290,
  premium_per_shift: 190,
  occurrences_last_8_weeks: 6,
  annualised_cost: 4940,
  recommendation: 'Direct-engage an RN for regular Sunday PM coverage at permanent rates. Break-even at 26 Sundays — achieved within 6 months.',
};

// ── HOLY GRAIL HOME CARE ──────────────────────────────────────
// Two services: Camelot (Inner West Sydney), Avalon (Northern Beaches Sydney)

export const holy_grail_home_care = {
  organisation: { id: 'holy-grail-hc', name: 'Knights of the Holy Grail', care_type: 'home_care' as const, location: 'Sydney NSW', program: 'Support at Home' },
  services: {
    camelot: { facility_id: 'camelot-hc-001', name: 'Camelot Home Care', suburb: 'Leichhardt', region: 'Inner West Sydney', active_clients: 134, active_workers: 48, care_coordinators: 3, service_manager: 'Guinevere Walsh' },
    avalon: { facility_id: 'avalon-hc-001', name: 'Avalon Home Care', suburb: 'Manly', region: 'Northern Beaches Sydney', active_clients: 113, active_workers: 41, care_coordinators: 3, service_manager: 'Arthur Pendragon' },
  },
  combined: {
    active_clients: 247, active_workers: 89, care_coordinators: 6,
    metrics: {
      visit_compliance_pct: 96.2, hours_utilised_pct: 88.4, unspent_funds_pct: 18.3,
      care_plans_current_pct: 94.1, sirs_open: 0, budget_statements_due: 3,
      travel_time_pct: 14.2, client_satisfaction: 81.3, lone_worker_overdue: 2,
      care_plans_overdue: 14, high_risk_clients: 18, complaints_open: 2,
    },
    financial: {
      revenue_per_client_per_day: 84.20, care_management_pct: 19.1, package_management_pct: 13.8,
      ebitda_return_pct: 6.8, npbt_per_client_per_day: 4.61,
      total_revenue_mtd: 1847000, total_cost_mtd: 1720000, unspent_liability: 521000,
      labour_cost_pct: 68.4, travel_cost_pct: 8.9, admin_cost_pct: 14.2,
    },
    workforce: {
      total_workers: 89, permanent: 54, casual: 28, agency: 7, agency_pct: 7.9,
      turnover_pct: 31.2, psh_composite: 3.1, psh_participation: 81,
      training_compliance: 88, rn_count: 12, wwvp_expiring_60d: 3,
    },
    visits_today: {
      scheduled: 47, completed: 38, in_progress: 6, not_started: 2, cancelled: 1,
      lone_worker_alerts: [
        { id: 'LW001', service: 'Camelot Home Care', worker_role: 'Support Worker', suburb: 'Leichhardt', expected_checkout: '11:30am', overdue_mins: 45, client_risk: 'high' as const },
        { id: 'LW002', service: 'Avalon Home Care', worker_role: 'Support Worker', suburb: 'Manly', expected_checkout: '12:00pm', overdue_mins: 15, client_risk: 'standard' as const },
      ],
    },
    packages: {
      total: 247, underspend_risk: 12, overspend_risk: 3,
      quarterly_budget: 2847000, unspent_this_quarter: 521000,
      by_service_category: [
        { category: 'Daily Living', delivered_pct: 91.2, budget_pct: 42 },
        { category: 'Independence', delivered_pct: 84.7, budget_pct: 18 },
        { category: 'Allied Health', delivered_pct: 79.3, budget_pct: 15 },
        { category: 'Clinical Nursing', delivered_pct: 96.1, budget_pct: 12 },
        { category: 'Assistive Technology', delivered_pct: 71.4, budget_pct: 8 },
        { category: 'Home Modifications', delivered_pct: 68.2, budget_pct: 5 },
      ],
    },
    by_coordinator: [
      { name: 'Priya Sharma', service: 'Camelot', clients: 45, compliance: 98.1, alerts: 0 },
      { name: 'Marcus Chen', service: 'Camelot', clients: 42, compliance: 94.7, alerts: 1 },
      { name: 'Anika Williams', service: 'Camelot', clients: 47, compliance: 97.8, alerts: 0 },
      { name: 'James Okonkwo', service: 'Avalon', clients: 38, compliance: 91.4, alerts: 1 },
      { name: 'Sandra Lee', service: 'Avalon', clients: 37, compliance: 96.3, alerts: 0 },
      { name: 'Tom Nguyen', service: 'Avalon', clients: 38, compliance: 97.1, alerts: 0 },
    ],
  },
};

// ── NDIS DATA ─────────────────────────────────────────────────

export const ndis_data = {
  participants: {
    total: 89,
    plan_reviews_due: 12,
    plans_expiring_30d: 3,
    new_participants_month: 4,
    exited_month: 1,
    satisfaction_score: 4.2,
  },
  plan_budgets: {
    core: { allocated: 1200000, spent: 876000, utilisation: 0.73 },
    capacity_building: { allocated: 340000, spent: 198000, utilisation: 0.58 },
    capital: { allocated: 89000, spent: 67000, utilisation: 0.75 },
    total: { allocated: 1629000, spent: 1141000, utilisation: 0.70 },
    claiming_deadline_days: 14,
    underclaimed_amount: 48000,
  },
  support_delivery: {
    this_week_hours: 156,
    target_hours: 200,
    utilisation: 0.78,
    workers_active: 24,
    workers_available: 28,
    cancelled_this_week: 4,
    rescheduled_this_week: 7,
  },
  worker_screening: {
    total_workers: 28,
    current_pct: 0.94,
    expiring_30d: 3,
    expiring_60d: 5,
    expired: 0,
    ndis_worker_check_current: 26,
    wwcc_current: 27,
  },
  incidents: {
    open: 0,
    ytd: 2,
    closed: [
      { id: 'NDIS-INC-001', type: 'Restrictive practice — environmental', date: '2026-01-15', participant_id: 'P-022', status: 'closed', days_to_close: 5 },
      { id: 'NDIS-INC-002', type: 'Injury during support', date: '2026-03-08', participant_id: 'P-045', status: 'closed', days_to_close: 8 },
    ],
  },
  goals: {
    total: 89,
    on_track: 67,
    at_risk: 14,
    behind: 8,
    sample: [
      { participant: 'P-001', goal: 'Independent meal preparation 3x/week', status: 'on_track', progress: 0.72, plan_end: '2026-09-30' },
      { participant: 'P-012', goal: 'Community access — attend social group weekly', status: 'at_risk', progress: 0.45, plan_end: '2026-07-15' },
      { participant: 'P-033', goal: 'Develop communication board proficiency', status: 'behind', progress: 0.28, plan_end: '2026-06-01' },
      { participant: 'P-045', goal: 'Reduce restrictive practices by 50%', status: 'on_track', progress: 0.61, plan_end: '2026-12-31' },
      { participant: 'P-067', goal: 'Employment readiness — resume + interview skills', status: 'on_track', progress: 0.85, plan_end: '2026-05-30' },
    ],
  },
  bsp: {
    active: 8,
    due_review: 2,
    restrictive_practices_authorised: 3,
    reportable_incidents_ytd: 1,
  },
};

// ── LEAVE ─────────────────────────────────────────────────────

export const leave_current = {
  approved: [
    { id: 'L001', worker_role: 'EN' as const, wing: 'Wattle Wing', leave_type: 'sick' as const, start_date: '2026-04-13', end_date: '2026-04-13', days: 1, status: 'approved' as const, creates_gap: false, care_minutes_impact: -11 },
    { id: 'L002', worker_role: 'RN' as const, wing: 'Wing A', leave_type: 'annual' as const, start_date: '2026-04-18', end_date: '2026-04-22', days: 5, status: 'approved' as const, creates_gap: true, care_minutes_impact: -44 },
    { id: 'L003', worker_role: 'AIN' as const, wing: 'Grevillea Wing', leave_type: 'annual' as const, start_date: '2026-04-19', end_date: '2026-04-19', days: 1, status: 'approved' as const, creates_gap: false, care_minutes_impact: -12 },
    { id: 'L004', worker_role: 'AIN' as const, wing: 'Grevillea Wing', leave_type: 'annual' as const, start_date: '2026-04-19', end_date: '2026-04-19', days: 1, status: 'approved' as const, creates_gap: false, care_minutes_impact: -12 },
    { id: 'L005', worker_role: 'AIN' as const, wing: 'Grevillea Wing', leave_type: 'annual' as const, start_date: '2026-04-19', end_date: '2026-04-19', days: 1, status: 'approved' as const, creates_gap: true, care_minutes_impact: -12 },
    { id: 'L006', worker_role: 'AIN' as const, wing: 'Wattle Wing', leave_type: 'training' as const, start_date: '2026-04-21', end_date: '2026-04-21', days: 1, status: 'approved' as const, creates_gap: false, care_minutes_impact: -12 },
  ],
  pending: [
    { id: 'L007', worker_role: 'RN' as const, wing: 'Night shift', leave_type: 'annual' as const, start_date: '2026-04-25', end_date: '2026-04-25', days: 1, status: 'pending' as const, creates_gap: false, care_minutes_impact: -44, impact_assessment: 'No coverage risk if approved' },
    { id: 'L008', worker_role: 'AIN' as const, wing: 'Wattle Wing', leave_type: 'annual' as const, start_date: '2026-05-03', end_date: '2026-05-07', days: 5, status: 'pending' as const, creates_gap: true, care_minutes_impact: -12, impact_assessment: 'Creates gap on Thursday 7 May afternoon shift' },
  ],
  accrued_liability: { total_dollars: 48000, staff_not_taken_leave_6m: 4, highest_accrual_role: 'RN', highest_accrual_days: 38 },
};

export default {
  facility,
  teams,
  workforce_monthly,
  care_minutes_weekly,
  quality_indicators,
  psh_cycles,
  sirs_events,
  clinical_audits,
  financial_monthly,
  compliance_obligations,
  corrective_actions,
  governance_packs,
  todays_picture,
  resident_intelligence,
  home_care_data,
  queue_items,
  queue_summary,
  section_alerts,
  agent_activity,
  agent_activity_log,
  coordination_log,
  roster_today,
  current_handover,
  incidents_closed_ytd,
  steward_structural_finding,
  leave_current,
  ndis_data,
  holy_grail_home_care,
};
