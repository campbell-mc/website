// lib/agents/oracle.ts
// Maintained by Ivan Sanchez
// The Oracle — weekly revenue and funding intelligence agent for CHRIS
//
// Runs Sunday 21:00 AEST after PSH cycle close.
// Scans the facility's funding architecture for revenue that is
// already there but not being captured. Identifies, quantifies, alerts.
// The CFO and FM wake up Monday morning with the Oracle report waiting.
//
// Triggered by calling runOracle(facilityId, data)
// Ivan wires to the Sunday 21:00 AEST cron schedule.

import { callClaudeText } from '@/lib/anthropic/client';
import { getOraclePrompt, ORACLE_SYNTHESIS_PROMPT } from '@/lib/agents/prompts/oracle';
import AGED_CARE_KNOWLEDGE from '@/lib/chris/aged-care-knowledge';

// ── TYPES ─────────────────────────────────────────────────────

export interface OracleOpportunity {
  type: string;
  category: 'annacc' | 'accommodation' | 'occupancy' | 'hotelling';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  resident_count?: number;
  monthly_uplift?: number;
  weekly_cost_of_delay?: number;
  wing?: string;
  confidence: 'high' | 'medium' | 'low';
  recommended_action: string;
  route?: string;
}

export interface OracleScanResult {
  opportunities: OracleOpportunity[];
  total_monthly_uplift: number;
  interpretation: string;
}

export interface OracleResident {
  id: string;
  wing: string;
  annacc_class: number;
  last_annacc_assessment_date?: string;
  admission_date: string;
  is_supported_resident: boolean;
  helf_enrolled: boolean;
  medication_count: number;
  incidents_last_90_days: number;
  adl_score_declining: boolean;
  adl_improving: boolean;
  allied_health_visits_increased: boolean;
  hospitalised_last_90_days: boolean;
}

export interface OracleFinancials {
  avg_rad_received?: number;
  nccc_potential?: number;
  nccc_collected?: number;
  food_cost_per_bed_day?: number;
}

export interface OracleContext {
  facility_name: string;
  total_beds: number;
  care_type: 'residential' | 'home_care' | 'ndis';
  residents: OracleResident[];
  financials?: OracleFinancials;
  admissions_pipeline: Array<{ status: string }>;
}

export interface OracleReport {
  opportunities: OracleOpportunity[];
  total_monthly_uplift: number;
  narrative: string;
  annacc_scan: OracleScanResult;
  accommodation_scan: OracleScanResult;
  occupancy_scan: OracleScanResult;
  hotelling_scan: OracleScanResult;
}

// ── MAIN RUNNER ───────────────────────────────────────────────

export async function runOracle(
  facilityId: string,
  context: OracleContext
): Promise<OracleReport> {

  const startTime = Date.now();

  // Run all four scans in parallel
  const [annaccScan, accommodationScan, occupancyScan, hotellingScan] = await Promise.all([
    scanANACC(facilityId, context),
    scanAccommodation(facilityId, context),
    scanOccupancy(facilityId, context),
    scanHotelling(facilityId, context),
  ]);

  const allOpportunities = [
    ...annaccScan.opportunities,
    ...accommodationScan.opportunities,
    ...occupancyScan.opportunities,
    ...hotellingScan.opportunities,
  ];

  const totalMonthlyUplift = calculateTotalUplift(allOpportunities);

  // Synthesise weekly narrative
  const narrative = await synthesiseReport(facilityId, context, {
    annaccScan, accommodationScan, occupancyScan, hotellingScan, totalMonthlyUplift,
  });

  const durationMs = Date.now() - startTime;
  console.log(`[Oracle] ${facilityId} | ${allOpportunities.length} opportunities | ${formatCurrency(totalMonthlyUplift)}/month | ${durationMs}ms`);

  // TODO: Ivan — write to oracle_reports table
  // TODO: Ivan — deliver queue items to CFO/CEO/FM
  // TODO: Ivan — publish oracle.weekly_scan_complete event for Town Crier

  return {
    opportunities: allOpportunities,
    total_monthly_uplift: totalMonthlyUplift,
    narrative,
    annacc_scan: annaccScan,
    accommodation_scan: accommodationScan,
    occupancy_scan: occupancyScan,
    hotelling_scan: hotellingScan,
  };
}

// ── AN-ACC SCAN ───────────────────────────────────────────────

async function scanANACC(facilityId: string, context: OracleContext): Promise<OracleScanResult> {
  if (context.care_type !== 'residential') {
    return { opportunities: [], total_monthly_uplift: 0, interpretation: 'Non-residential — AN-ACC scan not applicable.' };
  }

  const opportunities: OracleOpportunity[] = [];
  const maxAssessmentDays = AGED_CARE_KNOWLEDGE.financial.an_acc.max_assessment_interval_days;
  const flagDays = AGED_CARE_KNOWLEDGE.financial.an_acc.chris_flag_days_since_assessment;

  for (const resident of context.residents) {
    const daysSinceAssessment = resident.last_annacc_assessment_date
      ? Math.round((Date.now() - new Date(resident.last_annacc_assessment_date).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    // Assessment approaching or overdue
    if (daysSinceAssessment >= flagDays) {
      opportunities.push({
        type: 'annacc_assessment_due',
        category: 'annacc',
        severity: daysSinceAssessment >= maxAssessmentDays ? 'high' : 'medium',
        title: daysSinceAssessment >= maxAssessmentDays ? 'AN-ACC assessment overdue' : 'AN-ACC assessment due soon',
        description: `Resident in ${resident.wing} has not been assessed in ${daysSinceAssessment} days. Assessment required within ${maxAssessmentDays} days. Current class: ${resident.annacc_class}.`,
        resident_count: 1,
        wing: resident.wing,
        confidence: 'high',
        recommended_action: 'Schedule AN-ACC assessment — The Chronicler will prepare the evidence package',
        route: '/dashboard/residents/care-plans?filter=annacc',
      });
    }

    // Clinical signals suggest upward reclassification
    const signals = analyseClinicalSignals(resident);
    if (signals.suggests_higher_class && signals.estimated_uplift_per_day > 0) {
      opportunities.push({
        type: 'annacc_upward_reclassification',
        category: 'annacc',
        severity: 'high',
        title: 'AN-ACC reclassification opportunity',
        description: `Resident in ${resident.wing} has documented care needs consistent with a higher classification. Current class: ${resident.annacc_class}. Signals: ${signals.signals.join(', ')}.`,
        resident_count: 1,
        monthly_uplift: signals.estimated_uplift_per_day * 30,
        weekly_cost_of_delay: signals.estimated_uplift_per_day * 7,
        wing: resident.wing,
        confidence: signals.confidence,
        recommended_action: 'Request AN-ACC reassessment — The Steward will find the optimal scheduling window',
        route: '/dashboard/residents/care-plans?filter=annacc',
      });
    }

    // Downward reclassification risk
    if (assessDownwardRisk(resident)) {
      opportunities.push({
        type: 'annacc_downward_risk',
        category: 'annacc',
        severity: 'medium',
        title: 'AN-ACC downward reclassification risk',
        description: `Resident in ${resident.wing} shows signals that may indicate a lower classification at next assessment. Ensure care plan accurately reflects current care needs.`,
        resident_count: 1,
        wing: resident.wing,
        confidence: 'medium',
        recommended_action: 'Review care plan documentation to ensure care needs are fully captured before next assessment',
        route: '/dashboard/residents/care-plans',
      });
    }
  }

  const interpretation = opportunities.length > 0
    ? await callClaudeText({
        system: getOraclePrompt('residential'),
        messages: [{
          role: 'user',
          content: `Write a 2-3 sentence AN-ACC intelligence briefing for the CFO.\n\nOpportunities: ${JSON.stringify(opportunities)}\nTotal residents: ${context.residents.length}\nEstimated monthly uplift: ${formatCurrency(calculateTotalUplift(opportunities))}\n\nBe specific. No bullet points.`,
        }],
        maxTokens: 300,
        facilityId,
        agentName: 'oracle',
        callType: 'annacc_scan',
      })
    : 'No AN-ACC opportunities identified this week. All assessments current.';

  return { opportunities, total_monthly_uplift: calculateTotalUplift(opportunities), interpretation };
}

// ── ACCOMMODATION SCAN ────────────────────────────────────────

async function scanAccommodation(facilityId: string, context: OracleContext): Promise<OracleScanResult> {
  const opportunities: OracleOpportunity[] = [];
  const mpir = AGED_CARE_KNOWLEDGE.financial.accommodation.mpir_jun25;
  const sectorAvgRAD = AGED_CARE_KNOWLEDGE.financial.stewartbrown.avg_rad_fy25;

  // RAD pricing vs sector
  const nonSupported = context.residents.filter((r) => !r.is_supported_resident);
  if (context.financials?.avg_rad_received && context.financials.avg_rad_received < sectorAvgRAD * 0.90) {
    const gap = sectorAvgRAD - context.financials.avg_rad_received;
    const annualDAP = gap * mpir * nonSupported.length;
    opportunities.push({
      type: 'rad_pricing_below_market',
      category: 'accommodation',
      severity: 'medium',
      title: 'RAD pricing below sector average',
      description: `Average RAD received is ${formatCurrency(context.financials.avg_rad_received)} against sector average ${formatCurrency(sectorAvgRAD)}. At MPIR ${(mpir * 100).toFixed(2)}%, each $50K increase generates ${formatCurrency(50000 * mpir * nonSupported.length)}/year in DAP revenue across ${nonSupported.length} non-supported residents.`,
      monthly_uplift: annualDAP / 12,
      confidence: 'medium',
      recommended_action: 'Review accommodation pricing strategy for new admissions',
      route: '/dashboard/financial/revenue',
    });
  }

  // HELF adoption
  const helfEligible = context.residents.filter((r) => r.admission_date >= '2025-11-01');
  const helfEnrolled = helfEligible.filter((r) => r.helf_enrolled).length;
  const helfRate = helfEligible.length > 0 ? helfEnrolled / helfEligible.length : 0;

  if (helfEligible.length > 0 && helfRate < 0.25) {
    const unenrolled = helfEligible.length - helfEnrolled;
    opportunities.push({
      type: 'helf_adoption_opportunity',
      category: 'accommodation',
      severity: 'medium',
      title: 'HELF adoption below benchmark',
      description: `${helfEnrolled} of ${helfEligible.length} eligible residents (${Math.round(helfRate * 100)}%) enrolled in HELF. Sector benchmark ~25%. ${unenrolled} eligible residents not yet enrolled.`,
      resident_count: unenrolled,
      monthly_uplift: unenrolled * 15 * 30,
      confidence: 'medium',
      recommended_action: 'Review HELF conversations with families of eligible residents admitted after November 2025',
      route: '/dashboard/residents/families',
    });
  }

  const interpretation = opportunities.length > 0
    ? await callClaudeText({
        system: getOraclePrompt(context.care_type),
        messages: [{ role: 'user', content: `Write a 2-sentence accommodation revenue briefing.\n\nFindings: ${JSON.stringify(opportunities)}\nMPIR: ${(mpir * 100).toFixed(2)}%\nSector avg RAD: ${formatCurrency(sectorAvgRAD)}\n\nBe specific. No bullet points.` }],
        maxTokens: 200,
        facilityId,
        agentName: 'oracle',
        callType: 'accommodation_scan',
      })
    : 'No accommodation revenue opportunities identified this week.';

  return { opportunities, total_monthly_uplift: calculateTotalUplift(opportunities), interpretation };
}

// ── OCCUPANCY SCAN ────────────────────────────────────────────

async function scanOccupancy(facilityId: string, context: OracleContext): Promise<OracleScanResult> {
  const opportunities: OracleOpportunity[] = [];
  const occupiedBeds = context.residents.length;
  const vacantBeds = context.total_beds - occupiedBeds;
  const avgRevPerBedDay = AGED_CARE_KNOWLEDGE.financial.an_acc.starting_price_oct_2025 + AGED_CARE_KNOWLEDGE.financial.hotelling.hotelling_supplement_sep_2025;

  if (vacantBeds > 0) {
    const dailyLost = vacantBeds * avgRevPerBedDay;
    opportunities.push({
      type: 'vacant_bed_revenue_loss',
      category: 'occupancy',
      severity: vacantBeds > 3 ? 'high' : 'medium',
      title: `${vacantBeds} vacant bed${vacantBeds > 1 ? 's' : ''} — ${formatCurrency(dailyLost * 30)}/month`,
      description: `${vacantBeds} vacant at ${formatCurrency(avgRevPerBedDay)}/bed/day = ${formatCurrency(dailyLost)}/day lost. Occupancy: ${Math.round((occupiedBeds / context.total_beds) * 100)}% vs sector ${Math.round(AGED_CARE_KNOWLEDGE.financial.stewartbrown.occupancy_mature_homes * 100)}%.`,
      monthly_uplift: dailyLost * 30,
      weekly_cost_of_delay: dailyLost * 7,
      confidence: 'high',
      recommended_action: 'Review admissions pipeline — The Steward can identify capacity for new admissions',
      route: '/dashboard/financial/revenue',
    });
  }

  // Pipeline conversion
  const totalEnquiries = context.admissions_pipeline.length;
  const converted = context.admissions_pipeline.filter((p) => p.status === 'converted').length;
  const conversionRate = totalEnquiries > 0 ? converted / totalEnquiries : 0;

  if (totalEnquiries > 0 && conversionRate < 0.65 && vacantBeds > 0) {
    opportunities.push({
      type: 'admissions_conversion_below_target',
      category: 'occupancy',
      severity: 'medium',
      title: 'Admissions conversion below target',
      description: `Enquiry to admission conversion: ${Math.round(conversionRate * 100)}% vs 65% target. With ${vacantBeds} vacant bed${vacantBeds > 1 ? 's' : ''}, improving conversion reduces vacancy cost.`,
      confidence: 'medium',
      recommended_action: 'Review admissions process — follow up on unconverted enquiries within 48 hours',
      route: '/dashboard/operations',
    });
  }

  return { opportunities, total_monthly_uplift: calculateTotalUplift(opportunities), interpretation: '' };
}

// ── HOTELLING SCAN ────────────────────────────────────────────

async function scanHotelling(facilityId: string, context: OracleContext): Promise<OracleScanResult> {
  const opportunities: OracleOpportunity[] = [];
  const foodBenchmark = AGED_CARE_KNOWLEDGE.financial.stewartbrown.food_cost_per_bed_day;
  const occupiedBeds = context.residents.length;

  // NCCC collection gap
  if (context.financials?.nccc_potential && context.financials?.nccc_collected) {
    const gap = context.financials.nccc_potential - context.financials.nccc_collected;
    if (gap > 500) {
      opportunities.push({
        type: 'nccc_collection_gap',
        category: 'hotelling',
        severity: 'medium',
        title: `NCCC collection gap — ${formatCurrency(gap)}/month`,
        description: `Potential: ${formatCurrency(context.financials.nccc_potential)}/month, collected: ${formatCurrency(context.financials.nccc_collected)}/month. Gap of ${formatCurrency(gap)}. Some residents may lack current Services Australia assessments.`,
        monthly_uplift: gap,
        confidence: 'medium',
        recommended_action: 'Audit means-tested fee assessment currency — follow up with Services Australia',
        route: '/dashboard/financial/revenue',
      });
    }
  }

  // Food cost vs benchmark
  if (context.financials?.food_cost_per_bed_day && context.financials.food_cost_per_bed_day > foodBenchmark * 1.10) {
    const excess = context.financials.food_cost_per_bed_day - foodBenchmark;
    const monthlySaving = excess * occupiedBeds * 30;
    opportunities.push({
      type: 'food_cost_above_benchmark',
      category: 'hotelling',
      severity: 'low',
      title: 'Food cost above StewartBrown benchmark',
      description: `${formatCurrency(context.financials.food_cost_per_bed_day)}/bed/day vs benchmark ${formatCurrency(foodBenchmark)}. Across ${occupiedBeds} beds: ${formatCurrency(monthlySaving)}/month potential saving.`,
      monthly_uplift: monthlySaving,
      confidence: 'medium',
      recommended_action: 'Review food service contract and procurement',
      route: '/dashboard/financial/budget',
    });
  }

  return { opportunities, total_monthly_uplift: calculateTotalUplift(opportunities), interpretation: '' };
}

// ── SYNTHESIS ─────────────────────────────────────────────────

async function synthesiseReport(
  facilityId: string,
  context: OracleContext,
  scans: {
    annaccScan: OracleScanResult;
    accommodationScan: OracleScanResult;
    occupancyScan: OracleScanResult;
    hotellingScan: OracleScanResult;
    totalMonthlyUplift: number;
  }
): Promise<string> {

  const allOpportunities = [
    ...scans.annaccScan.opportunities,
    ...scans.accommodationScan.opportunities,
    ...scans.occupancyScan.opportunities,
    ...scans.hotellingScan.opportunities,
  ];

  return callClaudeText({
    system: ORACLE_SYNTHESIS_PROMPT,
    messages: [{
      role: 'user',
      content: `Generate the weekly Oracle Report.

Total estimated monthly uplift: ${formatCurrency(scans.totalMonthlyUplift)}

AN-ACC: ${scans.annaccScan.interpretation}
Accommodation: ${scans.accommodationScan.interpretation}
Occupancy: ${scans.occupancyScan.opportunities.length} opportunities
Hotelling: ${scans.hotellingScan.opportunities.length} opportunities

All opportunities: ${JSON.stringify(allOpportunities)}

Facility: ${context.facility_name}
Total residents: ${context.residents.length}
Vacant beds: ${context.total_beds - context.residents.length}
Occupancy: ${Math.round((context.residents.length / context.total_beds) * 100)}%`,
    }],
    maxTokens: 500,
    facilityId,
    agentName: 'oracle',
    callType: 'weekly_synthesis',
  });
}

// ── CLINICAL SIGNAL ANALYSIS ──────────────────────────────────

function analyseClinicalSignals(resident: OracleResident): {
  suggests_higher_class: boolean;
  estimated_uplift_per_day: number;
  signals: string[];
  confidence: 'high' | 'medium' | 'low';
} {
  const signals: string[] = [];
  let score = 0;

  if (resident.medication_count >= 9) { signals.push('polypharmacy (9+ medications)'); score += 2; }
  if (resident.incidents_last_90_days >= 3) { signals.push('3+ incidents in 90 days'); score += 2; }
  if (resident.adl_score_declining) { signals.push('ADL score declining'); score += 2; }
  if (resident.allied_health_visits_increased) { signals.push('increased allied health involvement'); score += 1; }
  if (resident.hospitalised_last_90_days) { signals.push('hospitalisation in last 90 days'); score += 2; }

  const suggests_higher_class = score >= 3;
  const confidence = score >= 5 ? 'high' as const : score >= 3 ? 'medium' as const : 'low' as const;
  const estimated_uplift_per_day = suggests_higher_class ? 15 : 0;

  return { suggests_higher_class, estimated_uplift_per_day, signals, confidence };
}

function assessDownwardRisk(resident: OracleResident): boolean {
  return resident.adl_improving && resident.medication_count < 5 && resident.incidents_last_90_days === 0;
}

// ── HELPERS ───────────────────────────────────────────────────

function calculateTotalUplift(opportunities: OracleOpportunity[]): number {
  return opportunities.reduce((sum, o) => sum + (o.monthly_uplift ?? 0), 0);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
