
/**
 * CHRIS Platform — Expanded Synthetic Data Generator
 * 12 months: October 2025 – September 2026
 *
 * Facility: Mt Gib Gardens Bowral (FAC-001)
 * Self-contained — no imports from seed-data.ts
 *
 * Narrative arc (extended):
 * Oct-Nov 2025: Care minutes pressure, PSH_01 elevated, early turnover signals
 * Dec 2025: Holiday staffing crisis begins, 2 RN exits, agency surge
 * Jan 2026: Peak agency dependency, care minutes dip below target, falls spike
 * Feb 2026: New hires settling, agency starting to reduce, PSH convergence detected
 * Mar 2026: Intervention working, agency declining, falls still above benchmark
 * Apr-Jun 2026: Steady recovery, agency normalises, training compliance climbs
 * Jul-Sep 2026: Stable operations, care ratio recovers, preparation for star rating review
 */

// ============================================================
// 1. FINANCIAL DATA — 12 months
// ============================================================

export function generateFinancialMonthly() {
  return [
    {
      period: '2025-10', label: 'Oct 2025',
      revenue: { annacc_residential: 1847200, support_at_home: 142800, other: 12400, total: 2002400, budget: 1988000, variance: 14400, variance_pct: 0.007 },
      expenditure: { direct_care_permanent: 892000, direct_care_agency: 98000, nursing_management: 124000, food: 68000, cleaning: 52000, maintenance: 38000, administration: 89000, depreciation: 22000 },
      care_ratio: 0.54, occupancy_pct: 0.981, budget_variance_pct: 0.007, agency_cost_pct_of_care_workforce: 0.099,
    },
    {
      period: '2025-11', label: 'Nov 2025',
      revenue: { annacc_residential: 1839400, support_at_home: 143200, other: 11200, total: 1993800, budget: 1988000, variance: 5800, variance_pct: 0.003 },
      expenditure: { direct_care_permanent: 884000, direct_care_agency: 114000, nursing_management: 124000, food: 69000, cleaning: 52000, maintenance: 37000, administration: 89000, depreciation: 22000 },
      care_ratio: 0.545, occupancy_pct: 0.978, budget_variance_pct: -0.007, agency_cost_pct_of_care_workforce: 0.114,
    },
    {
      period: '2025-12', label: 'Dec 2025',
      revenue: { annacc_residential: 1831600, support_at_home: 143600, other: 10800, total: 1986000, budget: 1988000, variance: -2000, variance_pct: -0.001 },
      expenditure: { direct_care_permanent: 863000, direct_care_agency: 169000, nursing_management: 126000, food: 72000, cleaning: 53000, maintenance: 36000, administration: 91000, depreciation: 22000 },
      care_ratio: 0.565, occupancy_pct: 0.971, budget_variance_pct: -0.024, agency_cost_pct_of_care_workforce: 0.164,
    },
    {
      period: '2026-01', label: 'Jan 2026',
      revenue: { annacc_residential: 1823800, support_at_home: 144000, other: 11600, total: 1979400, budget: 1988000, variance: -8600, variance_pct: -0.004 },
      expenditure: { direct_care_permanent: 858000, direct_care_agency: 239000, nursing_management: 128000, food: 71000, cleaning: 54000, maintenance: 35000, administration: 92000, depreciation: 22000 },
      care_ratio: 0.580, occupancy_pct: 0.964, budget_variance_pct: -0.056, agency_cost_pct_of_care_workforce: 0.218,
    },
    {
      period: '2026-02', label: 'Feb 2026',
      revenue: { annacc_residential: 1839400, support_at_home: 144400, other: 12200, total: 1996000, budget: 1992000, variance: 4000, variance_pct: 0.002 },
      expenditure: { direct_care_permanent: 871000, direct_care_agency: 196000, nursing_management: 126000, food: 70000, cleaning: 53000, maintenance: 37000, administration: 90000, depreciation: 22000 },
      care_ratio: 0.555, occupancy_pct: 0.971, budget_variance_pct: -0.041, agency_cost_pct_of_care_workforce: 0.184,
    },
    {
      period: '2026-03', label: 'Mar 2026',
      revenue: { annacc_residential: 1847200, support_at_home: 144800, other: 13400, total: 2005400, budget: 1992000, variance: 13400, variance_pct: 0.007 },
      expenditure: { direct_care_permanent: 879000, direct_care_agency: 161000, nursing_management: 125000, food: 69000, cleaning: 52000, maintenance: 38000, administration: 89000, depreciation: 22000 },
      care_ratio: 0.540, occupancy_pct: 0.978, budget_variance_pct: -0.028, agency_cost_pct_of_care_workforce: 0.155,
    },
    {
      period: '2026-04', label: 'Apr 2026',
      revenue: { annacc_residential: 1855000, support_at_home: 145200, other: 14200, total: 2014400, budget: 1996000, variance: 18400, variance_pct: 0.009 },
      expenditure: { direct_care_permanent: 891000, direct_care_agency: 132000, nursing_management: 124000, food: 68000, cleaning: 52000, maintenance: 39000, administration: 88000, depreciation: 22000 },
      care_ratio: 0.530, occupancy_pct: 0.985, budget_variance_pct: -0.016, agency_cost_pct_of_care_workforce: 0.129,
    },
    {
      period: '2026-05', label: 'May 2026',
      revenue: { annacc_residential: 1862800, support_at_home: 145600, other: 14800, total: 2023200, budget: 1996000, variance: 27200, variance_pct: 0.014 },
      expenditure: { direct_care_permanent: 898000, direct_care_agency: 108000, nursing_management: 123000, food: 67000, cleaning: 52000, maintenance: 38000, administration: 87000, depreciation: 22000 },
      care_ratio: 0.525, occupancy_pct: 0.985, budget_variance_pct: -0.006, agency_cost_pct_of_care_workforce: 0.107,
    },
    {
      period: '2026-06', label: 'Jun 2026',
      revenue: { annacc_residential: 1870600, support_at_home: 146000, other: 15200, total: 2031800, budget: 2000000, variance: 31800, variance_pct: 0.016 },
      expenditure: { direct_care_permanent: 904000, direct_care_agency: 89000, nursing_management: 122000, food: 68000, cleaning: 51000, maintenance: 37000, administration: 87000, depreciation: 22000 },
      care_ratio: 0.520, occupancy_pct: 0.989, budget_variance_pct: 0.004, agency_cost_pct_of_care_workforce: 0.090,
    },
    {
      period: '2026-07', label: 'Jul 2026',
      revenue: { annacc_residential: 1878400, support_at_home: 146400, other: 15600, total: 2040400, budget: 2000000, variance: 40400, variance_pct: 0.020 },
      expenditure: { direct_care_permanent: 910000, direct_care_agency: 78000, nursing_management: 121000, food: 69000, cleaning: 52000, maintenance: 38000, administration: 86000, depreciation: 22000 },
      care_ratio: 0.515, occupancy_pct: 0.989, budget_variance_pct: 0.012, agency_cost_pct_of_care_workforce: 0.079,
    },
    {
      period: '2026-08', label: 'Aug 2026',
      revenue: { annacc_residential: 1886200, support_at_home: 146800, other: 16000, total: 2049000, budget: 2004000, variance: 45000, variance_pct: 0.022 },
      expenditure: { direct_care_permanent: 916000, direct_care_agency: 72000, nursing_management: 120000, food: 68000, cleaning: 51000, maintenance: 37000, administration: 86000, depreciation: 22000 },
      care_ratio: 0.515, occupancy_pct: 0.993, budget_variance_pct: 0.018, agency_cost_pct_of_care_workforce: 0.073,
    },
    {
      period: '2026-09', label: 'Sep 2026',
      revenue: { annacc_residential: 1894000, support_at_home: 147200, other: 16400, total: 2057600, budget: 2004000, variance: 53600, variance_pct: 0.027 },
      expenditure: { direct_care_permanent: 922000, direct_care_agency: 66000, nursing_management: 119000, food: 67000, cleaning: 51000, maintenance: 38000, administration: 85000, depreciation: 22000 },
      care_ratio: 0.520, occupancy_pct: 0.993, budget_variance_pct: 0.024, agency_cost_pct_of_care_workforce: 0.067,
    },
  ] as const;
}

// ============================================================
// 2. WORKFORCE DATA — 12 months
// ============================================================

export function generateWorkforceMonthly() {
  return [
    {
      period: '2025-10', total_staff: 273, fte: 218.4, turnover_rolling_12m: 0.26,
      vacancy_rate: 0.015, sick_leave_pct: 0.082, agency_hours_pct: 0.11,
      training_compliance_pct: 0.94, avg_tenure_years: 3.8, new_starters: 4, exits: 3,
      exit_reasons: { resignation: 2, end_of_contract: 1, retirement: 0, termination: 0 },
    },
    {
      period: '2025-11', total_staff: 272, fte: 217.6, turnover_rolling_12m: 0.27,
      vacancy_rate: 0.019, sick_leave_pct: 0.091, agency_hours_pct: 0.13,
      training_compliance_pct: 0.93, avg_tenure_years: 3.7, new_starters: 3, exits: 4,
      exit_reasons: { resignation: 3, end_of_contract: 0, retirement: 1, termination: 0 },
    },
    {
      period: '2025-12', total_staff: 268, fte: 214.4, turnover_rolling_12m: 0.31,
      vacancy_rate: 0.030, sick_leave_pct: 0.098, agency_hours_pct: 0.17,
      training_compliance_pct: 0.91, avg_tenure_years: 3.6, new_starters: 2, exits: 6,
      exit_reasons: { resignation: 4, end_of_contract: 1, retirement: 0, termination: 1 },
    },
    {
      period: '2026-01', total_staff: 265, fte: 212.0, turnover_rolling_12m: 0.34,
      vacancy_rate: 0.038, sick_leave_pct: 0.105, agency_hours_pct: 0.22,
      training_compliance_pct: 0.89, avg_tenure_years: 3.5, new_starters: 1, exits: 4,
      exit_reasons: { resignation: 3, end_of_contract: 0, retirement: 0, termination: 1 },
    },
    {
      period: '2026-02', total_staff: 267, fte: 213.6, turnover_rolling_12m: 0.33,
      vacancy_rate: 0.034, sick_leave_pct: 0.094, agency_hours_pct: 0.19,
      training_compliance_pct: 0.90, avg_tenure_years: 3.4, new_starters: 5, exits: 3,
      exit_reasons: { resignation: 2, end_of_contract: 1, retirement: 0, termination: 0 },
    },
    {
      period: '2026-03', total_staff: 270, fte: 216.0, turnover_rolling_12m: 0.31,
      vacancy_rate: 0.026, sick_leave_pct: 0.088, agency_hours_pct: 0.16,
      training_compliance_pct: 0.92, avg_tenure_years: 3.4, new_starters: 6, exits: 3,
      exit_reasons: { resignation: 2, end_of_contract: 0, retirement: 1, termination: 0 },
    },
    {
      period: '2026-04', total_staff: 274, fte: 219.2, turnover_rolling_12m: 0.28,
      vacancy_rate: 0.019, sick_leave_pct: 0.079, agency_hours_pct: 0.13,
      training_compliance_pct: 0.94, avg_tenure_years: 3.5, new_starters: 6, exits: 2,
      exit_reasons: { resignation: 1, end_of_contract: 1, retirement: 0, termination: 0 },
    },
    {
      period: '2026-05', total_staff: 276, fte: 220.8, turnover_rolling_12m: 0.26,
      vacancy_rate: 0.015, sick_leave_pct: 0.074, agency_hours_pct: 0.11,
      training_compliance_pct: 0.95, avg_tenure_years: 3.5, new_starters: 4, exits: 2,
      exit_reasons: { resignation: 1, end_of_contract: 0, retirement: 1, termination: 0 },
    },
    {
      period: '2026-06', total_staff: 277, fte: 221.6, turnover_rolling_12m: 0.24,
      vacancy_rate: 0.011, sick_leave_pct: 0.071, agency_hours_pct: 0.09,
      training_compliance_pct: 0.96, avg_tenure_years: 3.6, new_starters: 3, exits: 2,
      exit_reasons: { resignation: 1, end_of_contract: 1, retirement: 0, termination: 0 },
    },
    {
      period: '2026-07', total_staff: 278, fte: 222.4, turnover_rolling_12m: 0.22,
      vacancy_rate: 0.011, sick_leave_pct: 0.068, agency_hours_pct: 0.08,
      training_compliance_pct: 0.96, avg_tenure_years: 3.7, new_starters: 3, exits: 2,
      exit_reasons: { resignation: 1, end_of_contract: 0, retirement: 1, termination: 0 },
    },
    {
      period: '2026-08', total_staff: 279, fte: 223.2, turnover_rolling_12m: 0.21,
      vacancy_rate: 0.007, sick_leave_pct: 0.065, agency_hours_pct: 0.07,
      training_compliance_pct: 0.97, avg_tenure_years: 3.8, new_starters: 2, exits: 1,
      exit_reasons: { resignation: 1, end_of_contract: 0, retirement: 0, termination: 0 },
    },
    {
      period: '2026-09', total_staff: 280, fte: 224.0, turnover_rolling_12m: 0.20,
      vacancy_rate: 0.007, sick_leave_pct: 0.062, agency_hours_pct: 0.07,
      training_compliance_pct: 0.97, avg_tenure_years: 3.9, new_starters: 3, exits: 2,
      exit_reasons: { resignation: 1, end_of_contract: 0, retirement: 1, termination: 0 },
    },
  ] as const;
}

// ============================================================
// 3. CARE MINUTES — 52 weeks
// ============================================================

export function generateCareMinutesWeekly() {
  // Targets: 215 total, 44 RN
  const weeks: Array<{
    week: string; week_ending: string;
    avg_total: number; avg_rn: number; avg_en: number; avg_ain: number;
    compliant: boolean; rn_gap_days: number; agency_cover_pct: number;
  }> = [];

  const startDate = new Date('2025-10-05'); // First Sunday of Oct 2025

  // Weekly story arcs encoded as [total, rn, agency_cover_pct]
  const arcs: Array<[number, number, number]> = [
    // Oct 2025 — weeks 1-4: shaky start, hovering around target
    [212, 44, 0.10], [216, 45, 0.11], [214, 43, 0.11], [218, 46, 0.10],
    // Nov 2025 — weeks 5-9: pressure building
    [215, 44, 0.12], [213, 43, 0.13], [211, 42, 0.14], [216, 45, 0.13], [210, 43, 0.14],
    // Dec 2025 — weeks 10-13: staffing crisis begins
    [209, 42, 0.16], [206, 41, 0.18], [204, 40, 0.19], [208, 42, 0.17],
    // Jan 2026 — weeks 14-17: worst period, dipping below target
    [201, 39, 0.22], [198, 38, 0.24], [203, 40, 0.22], [207, 41, 0.20],
    // Feb 2026 — weeks 18-22: recovery starting
    [210, 42, 0.18], [213, 43, 0.17], [215, 44, 0.16], [216, 44, 0.15], [218, 45, 0.14],
    // Mar 2026 — weeks 23-26: back above target
    [219, 45, 0.14], [221, 46, 0.13], [220, 45, 0.12], [222, 46, 0.12],
    // Apr 2026 — weeks 27-30: solid recovery
    [223, 46, 0.11], [224, 47, 0.10], [222, 46, 0.10], [225, 47, 0.09],
    // May 2026 — weeks 31-35: consistently above target
    [226, 47, 0.09], [224, 46, 0.08], [227, 48, 0.08], [225, 47, 0.08], [228, 48, 0.07],
    // Jun 2026 — weeks 36-39: strong performance
    [226, 47, 0.07], [229, 48, 0.07], [227, 47, 0.06], [230, 49, 0.06],
    // Jul 2026 — weeks 40-44: stable excellence
    [228, 48, 0.06], [231, 49, 0.06], [229, 48, 0.05], [230, 49, 0.05], [232, 49, 0.05],
    // Aug 2026 — weeks 45-48: maintaining
    [230, 48, 0.05], [231, 49, 0.05], [229, 48, 0.04], [233, 50, 0.04],
    // Sep 2026 — weeks 49-52: year-end strong
    [231, 49, 0.04], [232, 49, 0.04], [230, 48, 0.04], [234, 50, 0.04],
  ];

  for (let i = 0; i < arcs.length; i++) {
    const [total, rn, agencyCover] = arcs[i];
    const en = Math.round(total * 0.22);
    const ain = total - rn - en;
    const weekEnd = new Date(startDate.getTime() + i * 7 * 86400000);
    const weekLabel = `W${String(i + 1).padStart(2, '0')}`;
    const dateStr = weekEnd.toISOString().split('T')[0];

    // RN gap days: more likely during crisis period (weeks 10-18)
    let rnGapDays = 0;
    if (i >= 9 && i <= 17) {
      rnGapDays = rn < 42 ? 2 : 1;
    } else if (i >= 5 && i <= 8) {
      rnGapDays = rn < 43 ? 1 : 0;
    }

    weeks.push({
      week: weekLabel,
      week_ending: dateStr,
      avg_total: total,
      avg_rn: rn,
      avg_en: en,
      avg_ain: ain,
      compliant: total >= 215 && rn >= 44,
      rn_gap_days: rnGapDays,
      agency_cover_pct: agencyCover,
    });
  }

  return weeks;
}

// ============================================================
// 4. INCIDENTS — 24 over 12 months
// ============================================================

export function generateIncidents() {
  return [
    { id: 'INC-001', type: 'fall', date: '2025-10-08', wing: 'Acacia Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 4, submitted: '2025-10-08', agency_shift: false, severity: 'low' as const, root_cause: 'Unassisted transfer attempt — mobility reassessment required' },
    { id: 'INC-002', type: 'skin_tear', date: '2025-10-22', wing: 'Wattle Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 3, submitted: '2025-10-22', agency_shift: false, severity: 'low' as const, root_cause: 'Fragile skin during personal care — technique refresher issued' },
    { id: 'INC-003', type: 'medication_error', date: '2025-11-05', wing: 'Grevillea Wing', status: 'closed' as const, sirs_priority: 2, days_to_close: 7, submitted: '2025-11-05', agency_shift: true, severity: 'moderate' as const, root_cause: 'Agency nurse unfamiliar with medication chart layout — orientation gap' },
    { id: 'INC-004', type: 'aggressive_behaviour', date: '2025-11-18', wing: 'Grevillea Wing', status: 'closed' as const, sirs_priority: 2, days_to_close: 5, submitted: '2025-11-18', agency_shift: false, severity: 'moderate' as const, root_cause: 'Resident with advanced dementia — behaviour management plan updated' },
    { id: 'INC-005', type: 'fall', date: '2025-12-02', wing: 'Boronia Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 3, submitted: '2025-12-02', agency_shift: false, severity: 'low' as const, root_cause: 'Slip in bathroom — non-slip mat replaced' },
    { id: 'INC-006', type: 'fall', date: '2025-12-14', wing: 'Grevillea Wing', status: 'closed' as const, sirs_priority: 2, days_to_close: 6, submitted: '2025-12-14', agency_shift: true, severity: 'moderate' as const, root_cause: 'Agency AIN unfamiliar with resident fall risk profile — handover deficiency' },
    { id: 'INC-007', type: 'medication_error', date: '2025-12-21', wing: 'Wattle Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 4, submitted: '2025-12-21', agency_shift: true, severity: 'low' as const, root_cause: 'Dose timing error — agency worker unfamiliar with PRN protocols' },
    { id: 'INC-008', type: 'near_miss', date: '2025-12-28', wing: 'Flannel Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 2, submitted: '2025-12-28', agency_shift: true, severity: 'low' as const, root_cause: 'Wrong resident identified for medication — caught by permanent EN' },
    { id: 'INC-009', type: 'fall', date: '2026-01-05', wing: 'Grevillea Wing', status: 'closed' as const, sirs_priority: 2, days_to_close: 8, submitted: '2026-01-05', agency_shift: true, severity: 'high' as const, root_cause: 'Unwitnessed fall resulting in hip fracture — hospital transfer. Agency staffing ratio contributed.' },
    { id: 'INC-010', type: 'fall', date: '2026-01-12', wing: 'Acacia Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 5, submitted: '2026-01-12', agency_shift: true, severity: 'moderate' as const, root_cause: 'Resident attempted to stand without call bell — supervision gap during agency transition' },
    { id: 'INC-011', type: 'unexplained_absence', date: '2026-01-19', wing: 'Grevillea Wing', status: 'closed' as const, sirs_priority: 1, days_to_close: 1, submitted: '2026-01-19', agency_shift: false, severity: 'high' as const, root_cause: 'Dementia resident found in car park — door sensor malfunction. Fixed same day.' },
    { id: 'INC-012', type: 'medication_error', date: '2026-01-25', wing: 'Grevillea Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 4, submitted: '2026-01-25', agency_shift: true, severity: 'low' as const, root_cause: 'Duplicate dose administered — agency worker did not check eMAR fully' },
    { id: 'INC-013', type: 'skin_tear', date: '2026-02-08', wing: 'Waratah Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 3, submitted: '2026-02-08', agency_shift: false, severity: 'low' as const, root_cause: 'Wheelchair transfer — padding adjusted on armrest' },
    { id: 'INC-014', type: 'fall', date: '2026-02-18', wing: 'Wattle Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 4, submitted: '2026-02-18', agency_shift: false, severity: 'low' as const, root_cause: 'Resident tripped on rug edge — rug removed from room' },
    { id: 'INC-015', type: 'aggressive_behaviour', date: '2026-03-01', wing: 'Grevillea Wing', status: 'closed' as const, sirs_priority: 2, days_to_close: 5, submitted: '2026-03-01', agency_shift: false, severity: 'moderate' as const, root_cause: 'Resident sundowning — debrief completed, PSH_08 support activated for team' },
    { id: 'INC-016', type: 'near_miss', date: '2026-03-12', wing: 'Banksia Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 2, submitted: '2026-03-12', agency_shift: false, severity: 'low' as const, root_cause: 'Wet floor not signed — housekeeping reminded of protocol' },
    { id: 'INC-017', type: 'fall', date: '2026-03-28', wing: 'Acacia Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 3, submitted: '2026-03-28', agency_shift: false, severity: 'low' as const, root_cause: 'Low-impact fall from chair — no injury, care plan reviewed' },
    { id: 'INC-018', type: 'medication_error', date: '2026-04-05', wing: 'Grevillea Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 4, submitted: '2026-04-05', agency_shift: false, severity: 'low' as const, root_cause: 'Omitted dose — staff distracted during round. Competency review completed.' },
    { id: 'INC-019', type: 'fall', date: '2026-04-12', wing: 'Grevillea Wing', status: 'open' as const, sirs_priority: 2, days_to_close: null, submitted: '2026-04-12', agency_shift: false, severity: 'moderate' as const, root_cause: 'Fall with minor laceration — investigation in progress' },
    { id: 'INC-020', type: 'skin_tear', date: '2026-05-02', wing: 'Boronia Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 2, submitted: '2026-05-02', agency_shift: false, severity: 'low' as const, root_cause: 'Skin tear during repositioning — technique coaching completed' },
    { id: 'INC-021', type: 'fall', date: '2026-06-10', wing: 'Flannel Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 3, submitted: '2026-06-10', agency_shift: false, severity: 'low' as const, root_cause: 'Low bed fall — sensor mat was not activated by night staff' },
    { id: 'INC-022', type: 'near_miss', date: '2026-07-15', wing: 'Wattle Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 1, submitted: '2026-07-15', agency_shift: false, severity: 'low' as const, root_cause: 'IV fluid bag labelled incorrectly — caught at bedside check' },
    { id: 'INC-023', type: 'aggressive_behaviour', date: '2026-08-20', wing: 'Grevillea Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 4, submitted: '2026-08-20', agency_shift: false, severity: 'low' as const, root_cause: 'Verbal aggression during personal care — behavioural trigger documented' },
    { id: 'INC-024', type: 'fall', date: '2026-09-08', wing: 'Acacia Wing', status: 'closed' as const, sirs_priority: null, days_to_close: 3, submitted: '2026-09-08', agency_shift: false, severity: 'low' as const, root_cause: 'Mechanical fall from standing — physiotherapy review scheduled' },
  ] as const;
}

// ============================================================
// 5. PSH DATA — 8 fortnightly cycles, 8 teams, 16 domains
// ============================================================

const PSH_DOMAINS = [
  'PSH_01', 'PSH_02', 'PSH_03', 'PSH_04', 'PSH_05', 'PSH_06', 'PSH_07', 'PSH_08',
  'PSH_09', 'PSH_10', 'PSH_11', 'PSH_12', 'PSH_13', 'PSH_14', 'PSH_15', 'PSH_16',
] as const;

const PSH_TEAM_IDS = [
  'Wattle Wing', 'Grevillea Wing', 'Acacia Wing', 'Round Table Wing',
  'Excalibur Wing', 'Avalon Kitchen', 'Home Care North', 'Home Care South',
] as const;

type PshScores = Record<(typeof PSH_DOMAINS)[number], number>;

interface PshTeamCycle {
  team: string;
  response_rate: number;
  scores: PshScores;
  elevated: string[];
  convergence: { signals: string[]; severity: string } | null;
}

interface PshCycle {
  cycle: number;
  period: string;
  close_date: string;
  teams: PshTeamCycle[];
}

export function generatePshCycles(): PshCycle[] {
  // Base profiles for each team — these evolve over cycles
  // Grevillea: persistent PSH_01 + PSH_08 co-elevation
  // Wattle: starts elevated, improves after cycle 5
  // Avalon Kitchen: always clean
  // Home Care: PSH_09 primary hazard

  const cycleData: PshCycle[] = [];

  const cyclePeriods = [
    { cycle: 1, period: 'Oct 2025 (1st fortnight)', close_date: '2025-10-12' },
    { cycle: 2, period: 'Nov 2025 (1st fortnight)', close_date: '2025-11-09' },
    { cycle: 3, period: 'Dec 2025 (1st fortnight)', close_date: '2025-12-07' },
    { cycle: 4, period: 'Jan 2026 (1st fortnight)', close_date: '2026-01-11' },
    { cycle: 5, period: 'Feb 2026 (1st fortnight)', close_date: '2026-02-08' },
    { cycle: 6, period: 'Mar 2026 (1st fortnight)', close_date: '2026-03-08' },
    { cycle: 7, period: 'Apr 2026 (1st fortnight)', close_date: '2026-04-12' },
    { cycle: 8, period: 'May 2026 (1st fortnight)', close_date: '2026-05-10' },
  ];

  // Generate team scores per cycle
  // Key: [PSH_01, PSH_02, ..., PSH_16] base scores, then adjusted per cycle
  const teamProfiles: Record<string, number[]> = {
    'Wattle Wing':      [0.68, 0.52, 0.41, 0.49, 0.38, 0.54, 0.43, 0.44, 0.31, 0.42, 0.28, 0.58, 0.61, 0.39, 0.33, 0.52],
    'Grevillea Wing':   [0.72, 0.48, 0.44, 0.52, 0.41, 0.49, 0.42, 0.71, 0.31, 0.72, 0.31, 0.68, 0.48, 0.44, 0.36, 0.54],
    'Acacia Wing':      [0.62, 0.46, 0.40, 0.48, 0.37, 0.45, 0.39, 0.55, 0.32, 0.58, 0.27, 0.56, 0.44, 0.40, 0.34, 0.48],
    'Round Table Wing': [0.51, 0.40, 0.37, 0.43, 0.33, 0.41, 0.36, 0.39, 0.28, 0.38, 0.24, 0.46, 0.42, 0.36, 0.31, 0.43],
    'Excalibur Wing':   [0.54, 0.42, 0.38, 0.44, 0.34, 0.43, 0.37, 0.41, 0.29, 0.40, 0.25, 0.48, 0.44, 0.37, 0.32, 0.45],
    'Avalon Kitchen':   [0.38, 0.32, 0.30, 0.35, 0.28, 0.33, 0.29, 0.28, 0.22, 0.24, 0.18, 0.34, 0.36, 0.31, 0.28, 0.38],
    'Home Care North':  [0.58, 0.44, 0.39, 0.46, 0.35, 0.42, 0.38, 0.42, 0.74, 0.38, 0.26, 0.52, 0.46, 0.41, 0.34, 0.56],
    'Home Care South':  [0.56, 0.43, 0.38, 0.45, 0.34, 0.41, 0.37, 0.40, 0.72, 0.36, 0.25, 0.50, 0.45, 0.40, 0.33, 0.54],
  };

  // Cycle adjustments: negative = improvement, positive = worsening
  // [cycle_index][team_name] => adjustment multiplier for all scores
  const cycleAdjustments: Record<number, Record<string, number>> = {
    0: {}, // cycle 1 — baseline
    1: { 'Wattle Wing': 0.03, 'Grevillea Wing': 0.02 }, // worsening
    2: { 'Wattle Wing': 0.06, 'Grevillea Wing': 0.03 }, // Dec crisis
    3: { 'Wattle Wing': 0.08, 'Grevillea Wing': 0.04 }, // Jan peak
    4: { 'Wattle Wing': 0.04, 'Grevillea Wing': 0.03 }, // Feb — intervention starts
    5: { 'Wattle Wing': -0.02, 'Grevillea Wing': 0.02 }, // Mar — Wattle improving
    6: { 'Wattle Wing': -0.06, 'Grevillea Wing': 0.01 }, // Apr — Wattle clearly better
    7: { 'Wattle Wing': -0.08, 'Grevillea Wing': 0.01 }, // May — Wattle near baseline
  };

  for (let ci = 0; ci < cyclePeriods.length; ci++) {
    const cp = cyclePeriods[ci];
    const teams: PshTeamCycle[] = [];

    for (const teamName of PSH_TEAM_IDS) {
      const base = teamProfiles[teamName];
      const adj = cycleAdjustments[ci]?.[teamName] ?? 0;

      const scores: Record<string, number> = {};
      for (let d = 0; d < 16; d++) {
        const val = Math.min(1, Math.max(0, base[d] + adj));
        scores[PSH_DOMAINS[d]] = Math.round(val * 100) / 100;
      }

      const elevated = PSH_DOMAINS.filter(d => scores[d] >= 0.65);
      let convergence: { signals: string[]; severity: string } | null = null;

      // Grevillea always has PSH_01 + PSH_08 convergence
      if (teamName === 'Grevillea Wing' && scores.PSH_01 >= 0.65 && scores.PSH_08 >= 0.65) {
        convergence = {
          signals: ['PSH_01', 'PSH_08', ...(scores.PSH_10 >= 0.65 ? ['PSH_10'] : [])],
          severity: scores.PSH_01 >= 0.72 ? 'high' : 'moderate',
        };
      }

      // Wattle convergence in cycles 3-4
      if (teamName === 'Wattle Wing' && ci >= 2 && ci <= 3 && scores.PSH_01 >= 0.65 && scores.PSH_13 >= 0.65) {
        convergence = {
          signals: ['PSH_01', 'PSH_13', ...(scores.PSH_12 >= 0.65 ? ['PSH_12'] : [])],
          severity: ci === 3 ? 'high' : 'moderate',
        };
      }

      const responseRate = teamName === 'Avalon Kitchen'
        ? 0.88 + Math.random() * 0.06
        : teamName.startsWith('Home Care')
          ? 0.68 + Math.random() * 0.08
          : 0.72 + Math.random() * 0.10;

      teams.push({
        team: teamName,
        response_rate: Math.round(responseRate * 100) / 100,
        scores: scores as PshScores,
        elevated,
        convergence,
      });
    }

    cycleData.push({
      cycle: cp.cycle,
      period: cp.period,
      close_date: cp.close_date,
      teams,
    });
  }

  return cycleData;
}

// ============================================================
// 6. COMPLIANCE OBLIGATIONS — 20
// ============================================================

export function generateComplianceObligations() {
  return [
    // 7 Strengthened Quality Standards
    { id: 'OBL-001', framework: 'Aged Care Act 2024', obligation: 'Standard 1 — The Individual', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-03-15', next_review: '2026-09-15', corrective_action: null },
    { id: 'OBL-002', framework: 'Aged Care Act 2024', obligation: 'Standard 2 — The Organisation', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-03-15', next_review: '2026-09-15', corrective_action: null },
    { id: 'OBL-003', framework: 'Aged Care Act 2024', obligation: 'Standard 3 — The Care Environment', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-03-15', next_review: '2026-09-15', corrective_action: null },
    { id: 'OBL-004', framework: 'Aged Care Act 2024', obligation: 'Standard 4 — Services and Supports for Daily Living', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-03-15', next_review: '2026-09-15', corrective_action: null },
    { id: 'OBL-005', framework: 'Aged Care Act 2024', obligation: 'Standard 5 — Clinical Care', status: 'at_risk' as const, evidence_current: false, last_reviewed: '2026-02-01', next_review: '2026-05-01', corrective_action: { id: 'CA-001', description: 'Falls above benchmark 3 consecutive quarters — clinical governance review required', due: '2026-04-30', status: 'in_progress' as const } },
    { id: 'OBL-006', framework: 'Aged Care Act 2024', obligation: 'Standard 6 — Food and Nutrition', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-03-15', next_review: '2026-09-15', corrective_action: null },
    { id: 'OBL-007', framework: 'Aged Care Act 2024', obligation: 'Standard 7 — The Workforce', status: 'at_risk' as const, evidence_current: false, last_reviewed: '2026-01-15', next_review: '2026-04-15', corrective_action: { id: 'CA-002', description: 'Agency dependency exceeded 15% for 3 months — workforce sustainability plan required', due: '2026-04-20', status: 'in_progress' as const } },

    // ISO 45003 — 4 elements
    { id: 'OBL-008', framework: 'ISO 45003', obligation: 'Clause 6.1 — Psychosocial risk assessment', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-03-30', next_review: '2026-06-30', corrective_action: null },
    { id: 'OBL-009', framework: 'ISO 45003', obligation: 'Clause 6.2 — Worker consultation on PSH', status: 'at_risk' as const, evidence_current: false, last_reviewed: '2025-12-01', next_review: '2026-04-30', corrective_action: null },
    { id: 'OBL-010', framework: 'ISO 45003', obligation: 'Clause 8.1 — Elimination and control of PSH risks', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-03-30', next_review: '2026-06-30', corrective_action: null },
    { id: 'OBL-011', framework: 'ISO 45003', obligation: 'Clause 9.1 — Monitoring and evaluation', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-03-30', next_review: '2026-06-30', corrective_action: null },

    // SIRS reporting
    { id: 'OBL-012', framework: 'SIRS (Aged Care Act)', obligation: 'Priority 1 SIRS — report within 24 hours', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-04-01', next_review: '2026-07-01', corrective_action: null },
    { id: 'OBL-013', framework: 'SIRS (Aged Care Act)', obligation: 'Priority 2 SIRS — report within 30 days', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-04-01', next_review: '2026-07-01', corrective_action: null },

    // Care minutes
    { id: 'OBL-014', framework: 'Care Minutes Target', obligation: 'Deliver 215 total / 44 RN minutes per resident per day', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-04-07', next_review: '2026-04-14', corrective_action: null },

    // QFR
    { id: 'OBL-015', framework: 'Quarterly Financial Reporting', obligation: 'QFR submission — Q3 FY2026', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-04-05', next_review: '2026-07-05', corrective_action: null },

    // QI
    { id: 'OBL-016', framework: 'Quality Indicators', obligation: 'QI Program — quarterly data submission', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-04-01', next_review: '2026-07-01', corrective_action: null },

    // 24/7 RN
    { id: 'OBL-017', framework: 'Aged Care Act 2024', obligation: '24/7 Registered Nurse on site', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-04-14', next_review: '2026-04-15', corrective_action: null },

    // Star ratings
    { id: 'OBL-018', framework: 'Star Ratings', obligation: 'Maintain 4+ star overall rating', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-03-01', next_review: '2026-06-01', corrective_action: null },

    // Additional
    { id: 'OBL-019', framework: 'WHS Act 2011 (NSW)', obligation: 'Psychosocial hazard duty of care — s19 PCBU obligations', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-03-15', next_review: '2026-09-15', corrective_action: null },
    { id: 'OBL-020', framework: 'Aged Care Act 2024', obligation: 'Restrictive practices — reporting and minimisation', status: 'compliant' as const, evidence_current: true, last_reviewed: '2026-04-01', next_review: '2026-07-01', corrective_action: null },
  ] as const;
}

// ============================================================
// 7. ROSTER WEEK — 7 days x 3 shifts
// ============================================================

export function generateRosterWeek() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
  const shifts = ['morning', 'afternoon', 'night'] as const;

  // Base date: week of 14 Apr 2026 (Monday)
  const baseDate = new Date('2026-04-14');

  const roster: Array<{
    day: string; date: string; shift: string;
    total_rostered: number; gaps: number; rn_confirmed: boolean;
    agency_count: number; staff_names: string[];
  }> = [];

  const staffPool = {
    morning: {
      rn: ['Sarah Chen', 'James Wu', 'Priya Sharma'],
      en: ['Patricia Moore', 'David Nguyen'],
      ain: ['Worker A1', 'Worker A2', 'Worker A3', 'Worker A4', 'Worker A5'],
    },
    afternoon: {
      rn: ['Michael Torres', 'Angela Kim'],
      en: ['Linda Park', 'Tom Bradley'],
      ain: ['Worker B1', 'Worker B2', 'Worker B3', 'Worker B4'],
    },
    night: {
      rn: ['Night RN Rodriguez', 'Night RN Patel'],
      en: ['Night EN Williams'],
      ain: ['Night AIN 1', 'Night AIN 2', 'Night AIN 3'],
    },
  };

  for (let d = 0; d < 7; d++) {
    const dateObj = new Date(baseDate.getTime() + d * 86400000);
    const dateStr = dateObj.toISOString().split('T')[0];
    const day = days[d];
    const isWeekend = d >= 5;

    for (const shift of shifts) {
      let totalRostered: number;
      let gaps = 0;
      let rnConfirmed = true;
      let agencyCount = 0;
      const names: string[] = [];

      if (shift === 'morning') {
        totalRostered = isWeekend ? 6 : 8;
        agencyCount = d === 1 || d === 4 ? 1 : 0; // Tue + Fri agency
        names.push(staffPool.morning.rn[0], staffPool.morning.en[0]);
        names.push(...staffPool.morning.ain.slice(0, isWeekend ? 3 : 5));
        if (agencyCount) names.push('Agency AIN');
      } else if (shift === 'afternoon') {
        totalRostered = isWeekend ? 5 : 7;
        // Sunday PM has a gap
        if (day === 'Sunday') {
          gaps = 1;
          totalRostered = 4;
        }
        agencyCount = d === 2 ? 1 : 0; // Wed agency
        names.push(staffPool.afternoon.rn[0], staffPool.afternoon.en[0]);
        names.push(...staffPool.afternoon.ain.slice(0, isWeekend ? 2 : 4));
        if (agencyCount) names.push('Agency EN Torres');
      } else {
        // Night
        totalRostered = 5;
        // Thursday night — unconfirmed RN
        if (day === 'Thursday') {
          rnConfirmed = false;
          names.push('RN TBC');
        } else {
          names.push(staffPool.night.rn[d % 2]);
        }
        names.push(staffPool.night.en[0]);
        names.push(...staffPool.night.ain);
      }

      roster.push({
        day,
        date: dateStr,
        shift,
        total_rostered: totalRostered,
        gaps,
        rn_confirmed: rnConfirmed,
        agency_count: agencyCount,
        staff_names: names,
      });
    }
  }

  return roster;
}

// ============================================================
// 8. AGENT ACTIVITY LOG — 50 entries
// ============================================================

export function generateAgentActivity() {
  // Current date context: 14 April 2026
  return [
    // Sentinel — latest, runs every 2h
    { timestamp: '2026-04-14T06:47:00', agent: 'Sentinel', action: 'Care minutes compliant — 224 avg total, 47 RN. 0 immediate findings.', status: 'completed' as const, finding_type: 'routine_check', severity: 'info' as const },
    { timestamp: '2026-04-14T04:47:00', agent: 'Sentinel', action: 'Night RN confirmed on site. Grevillea Wing resident fall at 02:15 — Chronicler notified.', status: 'completed' as const, finding_type: 'incident_detected', severity: 'moderate' as const },
    { timestamp: '2026-04-14T02:47:00', agent: 'Sentinel', action: 'Night shift handover validated. All wings staffed. 0 findings.', status: 'completed' as const, finding_type: 'routine_check', severity: 'info' as const },
    { timestamp: '2026-04-13T22:47:00', agent: 'Sentinel', action: 'Night shift commenced. RN Rodriguez on site. 0 gaps.', status: 'completed' as const, finding_type: 'routine_check', severity: 'info' as const },
    { timestamp: '2026-04-13T20:47:00', agent: 'Sentinel', action: 'Afternoon shift — all rostered staff checked in. Agency EN on Grevillea.', status: 'completed' as const, finding_type: 'routine_check', severity: 'info' as const },
    { timestamp: '2026-04-13T18:47:00', agent: 'Sentinel', action: 'Medication round compliance check — 99.2% adherence. 1 late administration Wattle Wing.', status: 'completed' as const, finding_type: 'compliance_check', severity: 'low' as const },
    { timestamp: '2026-04-13T16:47:00', agent: 'Sentinel', action: 'Afternoon handover validated. Sunday PM gap in Grevillea Wing flagged to Steward.', status: 'completed' as const, finding_type: 'gap_detected', severity: 'moderate' as const },
    { timestamp: '2026-04-13T14:47:00', agent: 'Sentinel', action: 'Morning shift concluding. 0 incidents. Care minutes on track.', status: 'completed' as const, finding_type: 'routine_check', severity: 'info' as const },
    { timestamp: '2026-04-13T12:47:00', agent: 'Sentinel', action: 'Mid-shift check. All wings staffed. Deputy connector sync confirmed.', status: 'completed' as const, finding_type: 'routine_check', severity: 'info' as const },
    { timestamp: '2026-04-13T10:47:00', agent: 'Sentinel', action: 'Morning medication round — 100% on time. 0 findings.', status: 'completed' as const, finding_type: 'routine_check', severity: 'info' as const },

    // Oracle — weekly Sunday 21:00
    { timestamp: '2026-04-13T21:04:00', agent: 'Oracle', action: '3 AN-ACC reclassification opportunities identified — $11.4K/month potential. CFO briefing queued.', status: 'awaiting_action' as const, finding_type: 'revenue_opportunity', severity: 'moderate' as const },
    { timestamp: '2026-04-06T21:02:00', agent: 'Oracle', action: 'QFR pre-submission analysis — Q3 variance explained. Agency surge accounted for $312K YTD adverse.', status: 'completed' as const, finding_type: 'financial_analysis', severity: 'info' as const },
    { timestamp: '2026-03-30T21:01:00', agent: 'Oracle', action: '2 AN-ACC downgrades detected — residents improving beyond current classification. Revenue adjustment: -$3.2K/month.', status: 'completed' as const, finding_type: 'revenue_adjustment', severity: 'low' as const },
    { timestamp: '2026-03-23T21:03:00', agent: 'Oracle', action: 'Home Care unspent budget alert — 4 clients above 60% unspent. Care management review recommended.', status: 'completed' as const, finding_type: 'budget_alert', severity: 'moderate' as const },
    { timestamp: '2026-03-16T21:01:00', agent: 'Oracle', action: 'Agency cost trend analysis: $239K peak (Jan) declining to projected $132K (Apr). Recovery on track.', status: 'completed' as const, finding_type: 'cost_trend', severity: 'info' as const },

    // Steward — daily 03:30
    { timestamp: '2026-04-14T03:31:00', agent: 'Steward', action: '2 structural findings: (1) Thursday night RN unconfirmed, (2) Sunday PM gap persists 3rd consecutive week.', status: 'active' as const, finding_type: 'structural_pattern', severity: 'moderate' as const },
    { timestamp: '2026-04-13T03:30:00', agent: 'Steward', action: '1 episodic finding: agency EN rostered for Grevillea 3 days running — continuity risk.', status: 'completed' as const, finding_type: 'episodic_pattern', severity: 'low' as const },
    { timestamp: '2026-04-12T03:31:00', agent: 'Steward', action: '0 structural findings. Agency dependency week-on-week: 13% → 11%. Improving.', status: 'completed' as const, finding_type: 'trend_analysis', severity: 'info' as const },
    { timestamp: '2026-04-11T03:30:00', agent: 'Steward', action: 'Credential expiry warning: 1 EN First Aid certificate expires in 14 days.', status: 'completed' as const, finding_type: 'credential_alert', severity: 'low' as const },
    { timestamp: '2026-04-10T03:31:00', agent: 'Steward', action: '1 structural finding: Wattle Wing overtime hours 18% above facility average — fatigue risk.', status: 'completed' as const, finding_type: 'structural_pattern', severity: 'moderate' as const },
    { timestamp: '2026-04-09T03:30:00', agent: 'Steward', action: '0 findings. Roster healthy. All credentials current.', status: 'completed' as const, finding_type: 'routine_check', severity: 'info' as const },
    { timestamp: '2026-04-08T03:31:00', agent: 'Steward', action: 'Weekly summary: 3 structural, 2 episodic findings. Top concern: Sunday PM gap.', status: 'completed' as const, finding_type: 'weekly_summary', severity: 'moderate' as const },

    // Chronicler — event-driven
    { timestamp: '2026-04-14T03:12:00', agent: 'Chronicler', action: 'SIRS Priority 2 draft prepared for Grevillea Wing fall (INC-019). Awaiting DON review.', status: 'awaiting_action' as const, finding_type: 'sirs_draft', severity: 'moderate' as const },
    { timestamp: '2026-04-12T14:22:00', agent: 'Chronicler', action: 'Governance pack Q3 assembled — 14 attachments. Distributed to board portal.', status: 'completed' as const, finding_type: 'governance_pack', severity: 'info' as const },
    { timestamp: '2026-04-10T09:15:00', agent: 'Chronicler', action: 'Clinical audit report formatted — medication management non-conformance noted. DON briefed.', status: 'completed' as const, finding_type: 'audit_report', severity: 'low' as const },
    { timestamp: '2026-04-05T11:30:00', agent: 'Chronicler', action: 'Incident report INC-018 closed — documentation complete, root cause archived.', status: 'completed' as const, finding_type: 'incident_closure', severity: 'info' as const },
    { timestamp: '2026-04-01T08:00:00', agent: 'Chronicler', action: 'QI quarterly submission prepared — 14 indicators, 4 quarters. Ready for DON sign-off.', status: 'completed' as const, finding_type: 'qi_submission', severity: 'info' as const },
    { timestamp: '2026-03-28T16:45:00', agent: 'Chronicler', action: 'Incident report INC-017 drafted — fall in Acacia Wing. Low severity, no SIRS required.', status: 'completed' as const, finding_type: 'incident_report', severity: 'low' as const },

    // Keeper — fortnightly + daily checks
    { timestamp: '2026-04-14T05:00:00', agent: 'Keeper', action: 'Daily PSH pulse: 78% response rate. No new elevations detected. Wattle Wing improving.', status: 'completed' as const, finding_type: 'psh_pulse', severity: 'info' as const },
    { timestamp: '2026-04-12T21:30:00', agent: 'Keeper', action: 'Cycle 7 close — Grevillea Wing PSH_01+PSH_08 convergence persists. Practice MP_205 re-prescribed.', status: 'awaiting_action' as const, finding_type: 'psh_convergence', severity: 'moderate' as const },
    { timestamp: '2026-04-11T05:00:00', agent: 'Keeper', action: 'Daily PSH pulse: 74% response rate. Wattle Wing PSH_13 now below threshold — intervention working.', status: 'completed' as const, finding_type: 'psh_improvement', severity: 'info' as const },
    { timestamp: '2026-04-10T05:00:00', agent: 'Keeper', action: 'Turnover precursor scan — 0 new signals. Rolling 12m turnover: 28%, improving from 34% peak.', status: 'completed' as const, finding_type: 'turnover_scan', severity: 'info' as const },
    { timestamp: '2026-04-08T05:00:00', agent: 'Keeper', action: 'Training compliance at 94%. 2 mandatory refreshers due this week — notifications sent.', status: 'completed' as const, finding_type: 'training_check', severity: 'low' as const },
    { timestamp: '2026-04-06T05:00:00', agent: 'Keeper', action: 'Weekend PSH pulse: participation lower (68%). Home Care North PSH_09 stable at 0.74.', status: 'completed' as const, finding_type: 'psh_pulse', severity: 'low' as const },
    { timestamp: '2026-04-04T05:00:00', agent: 'Keeper', action: 'Sick leave trending down — 7.9% vs 10.5% peak in Jan. Agency hours correlating with reduction.', status: 'completed' as const, finding_type: 'absence_trend', severity: 'info' as const },

    // Town Crier — continuous coordination
    { timestamp: '2026-04-14T06:50:00', agent: 'Town Crier', action: 'Sentinel fall detection + Chronicler SIRS draft — coordinated notification to DON.', status: 'completed' as const, finding_type: 'coordination', severity: 'moderate' as const },
    { timestamp: '2026-04-14T03:35:00', agent: 'Town Crier', action: 'Steward structural finding + Keeper PSH data — merged insight: Sunday PM gap correlates with PSH_01 elevation.', status: 'active' as const, finding_type: 'merged_insight', severity: 'moderate' as const },
    { timestamp: '2026-04-13T21:10:00', agent: 'Town Crier', action: 'Oracle revenue opportunity + Chronicler governance pack — cross-referenced for board.', status: 'completed' as const, finding_type: 'coordination', severity: 'info' as const },
    { timestamp: '2026-04-12T07:00:00', agent: 'Town Crier', action: 'Monday briefing compiled — 4 agents contributed findings. Distributed to leadership team.', status: 'completed' as const, finding_type: 'briefing', severity: 'info' as const },
    { timestamp: '2026-04-11T15:30:00', agent: 'Town Crier', action: 'Steward overtime alert + Keeper fatigue PSH signal — escalated to DON as combined risk.', status: 'completed' as const, finding_type: 'merged_insight', severity: 'moderate' as const },
    { timestamp: '2026-04-10T09:20:00', agent: 'Town Crier', action: 'Chronicler audit report + Oracle cost analysis — linked medication errors to agency dependency narrative.', status: 'completed' as const, finding_type: 'merged_insight', severity: 'low' as const },

    // Curator — library and practice management
    { timestamp: '2026-04-14T04:00:00', agent: 'Curator', action: 'Practice library check — 48 active practices, 3 prescribed this cycle. All references current.', status: 'completed' as const, finding_type: 'library_check', severity: 'info' as const },
    { timestamp: '2026-04-12T04:00:00', agent: 'Curator', action: 'MP_205 (post-incident debrief) effectiveness review — Grevillea Wing adoption rate 72%. Benchmark: 80%.', status: 'completed' as const, finding_type: 'practice_review', severity: 'low' as const },
    { timestamp: '2026-04-10T04:00:00', agent: 'Curator', action: 'New evidence indexed: Safe Work Australia psychosocial code of practice update (Mar 2026).', status: 'completed' as const, finding_type: 'evidence_update', severity: 'info' as const },
    { timestamp: '2026-04-08T04:00:00', agent: 'Curator', action: 'Practice MP_013 (specific praise) — Wattle Wing completion rate improved from 34% to 71% over 4 cycles.', status: 'completed' as const, finding_type: 'practice_effectiveness', severity: 'info' as const },
    { timestamp: '2026-04-06T04:00:00', agent: 'Curator', action: 'Compliance evidence mapping updated — 20 obligations, 47 evidence artefacts linked.', status: 'completed' as const, finding_type: 'evidence_mapping', severity: 'info' as const },
    { timestamp: '2026-04-04T04:00:00', agent: 'Curator', action: 'Quarterly practice library audit — 0 expired references, 2 practices flagged for review (low adoption).', status: 'completed' as const, finding_type: 'library_audit', severity: 'low' as const },
  ] as const;
}

// ============================================================
// 9. QUALITY INDICATORS — 14 QIs, 4 quarters
// ============================================================

export function generateQualityIndicators() {
  return [
    {
      id: 'QI-01', name: 'Pressure injuries', category: 'clinical',
      benchmark: 0.08,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.07, status: 'below_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.06, status: 'below_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.05, status: 'below_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.05, status: 'below_benchmark' as const },
      ],
    },
    {
      id: 'QI-02', name: 'Physical restraint', category: 'clinical',
      benchmark: 0.02,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.01, status: 'below_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.01, status: 'below_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.01, status: 'below_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.00, status: 'below_benchmark' as const },
      ],
    },
    {
      id: 'QI-03', name: 'Chemical restraint (antipsychotic)', category: 'clinical',
      benchmark: 0.18,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.16, status: 'below_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.15, status: 'below_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.14, status: 'below_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.13, status: 'below_benchmark' as const },
      ],
    },
    {
      id: 'QI-04', name: 'Unplanned weight loss', category: 'clinical',
      benchmark: 0.10,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.09, status: 'below_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.08, status: 'below_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.07, status: 'below_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.07, status: 'below_benchmark' as const },
      ],
    },
    {
      id: 'QI-05', name: 'Falls', category: 'clinical',
      benchmark: 0.28,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.31, status: 'above_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.34, status: 'above_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.32, status: 'above_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.29, status: 'above_benchmark' as const },
      ],
    },
    {
      id: 'QI-06', name: 'Fall-related fractures', category: 'clinical',
      benchmark: 0.02,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.01, status: 'below_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.02, status: 'at_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.01, status: 'below_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.01, status: 'below_benchmark' as const },
      ],
    },
    {
      id: 'QI-07', name: 'Medication management incidents', category: 'clinical',
      benchmark: 0.04,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.03, status: 'below_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.05, status: 'above_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.04, status: 'at_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.03, status: 'below_benchmark' as const },
      ],
    },
    {
      id: 'QI-08', name: 'Unplanned hospitalisation', category: 'clinical',
      benchmark: 0.06,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.05, status: 'below_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.06, status: 'at_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.05, status: 'below_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.04, status: 'below_benchmark' as const },
      ],
    },
    {
      id: 'QI-09', name: 'Healthcare-associated infections', category: 'clinical',
      benchmark: 0.05,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.04, status: 'below_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.04, status: 'below_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.03, status: 'below_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.03, status: 'below_benchmark' as const },
      ],
    },
    {
      id: 'QI-10', name: 'Consumer experience — quality of life', category: 'experience',
      benchmark: 0.80,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.82, status: 'above_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.81, status: 'above_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.83, status: 'above_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.84, status: 'above_benchmark' as const },
      ],
    },
    {
      id: 'QI-11', name: 'Consumer experience — service delivery', category: 'experience',
      benchmark: 0.78,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.79, status: 'above_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.78, status: 'at_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.80, status: 'above_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.81, status: 'above_benchmark' as const },
      ],
    },
    {
      id: 'QI-12', name: 'Consumer experience — food satisfaction', category: 'experience',
      benchmark: 0.75,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.78, status: 'above_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.77, status: 'above_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.79, status: 'above_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.80, status: 'above_benchmark' as const },
      ],
    },
    {
      id: 'QI-13', name: 'Care minutes delivered', category: 'workforce',
      benchmark: 215,
      quarters: [
        { quarter: 'Q1 2025-26', value: 215, status: 'at_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 204, status: 'below_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 219, status: 'above_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 230, status: 'above_benchmark' as const },
      ],
    },
    {
      id: 'QI-14', name: 'Staff turnover (rolling 12m)', category: 'workforce',
      benchmark: 0.25,
      quarters: [
        { quarter: 'Q1 2025-26', value: 0.27, status: 'above_benchmark' as const },
        { quarter: 'Q2 2025-26', value: 0.34, status: 'above_benchmark' as const },
        { quarter: 'Q3 2025-26', value: 0.28, status: 'above_benchmark' as const },
        { quarter: 'Q4 2025-26', value: 0.21, status: 'below_benchmark' as const },
      ],
    },
  ] as const;
}

// ============================================================
// 10. HOME CARE EXPANDED
// ============================================================

export function generateHomeCareExpanded() {
  // Support at Home 8 classifications (1 Jul 2025 framework)
  const classificationBudgets: Record<number, number> = {
    1: 10731, 2: 17891, 3: 25052, 4: 35893,
    5: 42874, 6: 53714, 7: 64555, 8: 78106,
  };

  const clients = [
    { id: 'HC-001', initials: 'M.T.', age: 82, classification: 3, utilisation_pct: 0.78, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-002', initials: 'J.W.', age: 76, classification: 2, utilisation_pct: 0.92, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-003', initials: 'R.P.', age: 88, classification: 5, utilisation_pct: 0.34, risk_level: 'high' as const, care_plan_status: 'review_due' as const },
    { id: 'HC-004', initials: 'S.K.', age: 79, classification: 4, utilisation_pct: 0.85, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-005', initials: 'A.N.', age: 91, classification: 7, utilisation_pct: 0.71, risk_level: 'moderate' as const, care_plan_status: 'current' as const },
    { id: 'HC-006', initials: 'D.L.', age: 85, classification: 6, utilisation_pct: 0.45, risk_level: 'high' as const, care_plan_status: 'review_due' as const },
    { id: 'HC-007', initials: 'P.M.', age: 73, classification: 1, utilisation_pct: 0.88, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-008', initials: 'E.B.', age: 87, classification: 8, utilisation_pct: 0.62, risk_level: 'moderate' as const, care_plan_status: 'current' as const },
    { id: 'HC-009', initials: 'G.H.', age: 80, classification: 4, utilisation_pct: 0.90, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-010', initials: 'F.C.', age: 94, classification: 6, utilisation_pct: 0.56, risk_level: 'moderate' as const, care_plan_status: 'current' as const },
    { id: 'HC-011', initials: 'L.R.', age: 78, classification: 3, utilisation_pct: 0.81, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-012', initials: 'B.S.', age: 86, classification: 5, utilisation_pct: 0.88, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-013', initials: 'N.V.', age: 71, classification: 2, utilisation_pct: 0.95, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-014', initials: 'H.D.', age: 89, classification: 7, utilisation_pct: 0.38, risk_level: 'high' as const, care_plan_status: 'review_due' as const },
    { id: 'HC-015', initials: 'W.A.', age: 83, classification: 4, utilisation_pct: 0.76, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-016', initials: 'C.F.', age: 77, classification: 3, utilisation_pct: 0.82, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-017', initials: 'T.G.', age: 92, classification: 8, utilisation_pct: 0.25, risk_level: 'high' as const, care_plan_status: 'escalated' as const },
    { id: 'HC-018', initials: 'I.J.', age: 81, classification: 5, utilisation_pct: 0.69, risk_level: 'moderate' as const, care_plan_status: 'current' as const },
    { id: 'HC-019', initials: 'K.O.', age: 74, classification: 1, utilisation_pct: 0.91, risk_level: 'low' as const, care_plan_status: 'current' as const },
    { id: 'HC-020', initials: 'V.U.', age: 84, classification: 6, utilisation_pct: 0.52, risk_level: 'moderate' as const, care_plan_status: 'review_due' as const },
  ].map(c => ({
    ...c,
    annual_budget: classificationBudgets[c.classification],
    monthly_budget: Math.round(classificationBudgets[c.classification] / 12),
  }));

  // 12 weeks of visit compliance
  const visitCompliance = Array.from({ length: 12 }, (_, i) => {
    const weekStart = new Date('2026-01-26');
    weekStart.setDate(weekStart.getDate() + i * 7);
    const dateStr = weekStart.toISOString().split('T')[0];
    // Compliance improves over time: starts ~88%, ends ~95%
    const baseRate = 0.88 + (i / 12) * 0.07;
    const scheduled = 140 + Math.floor(Math.random() * 10);
    const completed = Math.round(scheduled * baseRate);
    const missed = Math.round(scheduled * (1 - baseRate) * 0.4);
    const late = scheduled - completed - missed;

    return {
      week_starting: dateStr,
      total_scheduled: scheduled,
      completed,
      missed,
      late,
      compliance_rate: Math.round(baseRate * 1000) / 1000,
    };
  });

  // 8 worker profiles
  const workers = [
    { id: 'W-001', role: 'CSW' as const, qualifications: ['Cert III Individual Support'], credential_status: 'current' as const, first_aid_expiry: '2027-02-15', wwcc_expiry: '2027-08-01', clients_assigned: 6 },
    { id: 'W-002', role: 'CSW' as const, qualifications: ['Cert III Individual Support', 'Cert IV Ageing Support'], credential_status: 'current' as const, first_aid_expiry: '2026-11-30', wwcc_expiry: '2027-05-15', clients_assigned: 5 },
    { id: 'W-003', role: 'CSW' as const, qualifications: ['Cert III Individual Support'], credential_status: 'expiring_soon' as const, first_aid_expiry: '2026-05-01', wwcc_expiry: '2027-03-20', clients_assigned: 6 },
    { id: 'W-004', role: 'RN' as const, qualifications: ['Bachelor of Nursing', 'AHPRA registered'], credential_status: 'current' as const, first_aid_expiry: '2027-06-10', wwcc_expiry: '2027-12-01', clients_assigned: 8 },
    { id: 'W-005', role: 'CSW' as const, qualifications: ['Cert III Individual Support'], credential_status: 'current' as const, first_aid_expiry: '2026-09-15', wwcc_expiry: '2027-01-30', clients_assigned: 5 },
    { id: 'W-006', role: 'EN' as const, qualifications: ['Diploma of Nursing', 'AHPRA registered'], credential_status: 'current' as const, first_aid_expiry: '2027-04-20', wwcc_expiry: '2027-10-15', clients_assigned: 7 },
    { id: 'W-007', role: 'CSW' as const, qualifications: ['Cert III Individual Support', 'Manual Handling'], credential_status: 'current' as const, first_aid_expiry: '2026-12-01', wwcc_expiry: '2027-07-10', clients_assigned: 4 },
    { id: 'W-008', role: 'CSW' as const, qualifications: ['Cert III Individual Support'], credential_status: 'expiring_soon' as const, first_aid_expiry: '2026-04-28', wwcc_expiry: '2027-02-15', clients_assigned: 5 },
  ];

  // 6 open complaints/feedback
  const complaints = [
    { id: 'FB-001', type: 'complaint' as const, date: '2026-04-10', client_id: 'HC-003', category: 'missed_visit', description: 'Client reports 2 missed visits in March — care plan delivery concern', status: 'investigating' as const, assigned_to: 'Care Coordinator', priority: 'high' as const },
    { id: 'FB-002', type: 'complaint' as const, date: '2026-04-08', client_id: 'HC-017', category: 'budget_transparency', description: 'Family requests detailed breakdown of care management charges', status: 'in_progress' as const, assigned_to: 'Finance Officer', priority: 'moderate' as const },
    { id: 'FB-003', type: 'feedback' as const, date: '2026-04-07', client_id: 'HC-012', category: 'positive', description: 'Client commended worker W-004 for exceptional wound care support', status: 'acknowledged' as const, assigned_to: null, priority: 'low' as const },
    { id: 'FB-004', type: 'complaint' as const, date: '2026-04-03', client_id: 'HC-006', category: 'timeliness', description: 'Consistently late afternoon visits — client reports 4 occasions in 2 weeks', status: 'investigating' as const, assigned_to: 'Team Leader', priority: 'moderate' as const },
    { id: 'FB-005', type: 'feedback' as const, date: '2026-03-28', client_id: 'HC-009', category: 'positive', description: 'Family grateful for proactive care plan review following hospital discharge', status: 'acknowledged' as const, assigned_to: null, priority: 'low' as const },
    { id: 'FB-006', type: 'complaint' as const, date: '2026-03-22', client_id: 'HC-014', category: 'unspent_budget', description: 'Family concerned about low utilisation — requests reassessment of service plan', status: 'in_progress' as const, assigned_to: 'Care Coordinator', priority: 'high' as const },
  ];

  return {
    clients,
    classification_budgets: classificationBudgets,
    visit_compliance: visitCompliance,
    workers,
    complaints,
  };
}
