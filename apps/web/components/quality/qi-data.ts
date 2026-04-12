// ============================================================================
// Quality Indicator Data — All 15 QIs per ACQSC Mandatory QI Program
// Since 1 April 2025: includes staffing QIs (QI_13, QI_14, QI_15)
// Data sourced from seed-data.ts — Q2 2025-26 (Jan–Mar 2026, current quarter)
// ============================================================================

import { quality_indicators } from "@/lib/seed-data";

export interface QIDefinition {
  code: string;
  name: string;
  description: string;
  collection: string;
  higherIsBetter: boolean;
  source: "clinical" | "incident" | "medication" | "acqsc_survey" | "qfr";
  category: "clinical" | "staffing" | "experience";
  benchmark: number;
  current: number;
  prior: number;
  numerator?: number;
  denominator?: number;
  trend: "improving" | "stable" | "worsening";
  scrutiny: "high" | "medium" | "low";
  chrisNote?: string;
}

// Current quarter = Q2 2025-26 (index 3), prior = Q1 2025-26 (index 2)
const currentQ = quality_indicators[3]; // Q2 2025-26
const priorQ = quality_indicators[2];   // Q1 2025-26
const ci = currentQ.indicators;
const pi = priorQ.indicators;

function trend(current: number, prior: number, higherIsBetter: boolean): "improving" | "stable" | "worsening" {
  const delta = current - prior;
  if (Math.abs(delta) < 0.3) return "stable";
  if (higherIsBetter) return delta > 0 ? "improving" : "worsening";
  return delta < 0 ? "improving" : "worsening";
}

export const QI_DATA: QIDefinition[] = [
  {
    code: "QI_01", name: "Pressure Injuries", category: "clinical",
    description: "% of eligible residents with a Stage 2+ pressure injury on the collection day.",
    collection: "Point prevalence — assessed on the same day each quarter.",
    higherIsBetter: false, source: "clinical",
    benchmark: ci.QI_01_pressure_injuries.benchmark, current: ci.QI_01_pressure_injuries.rate, prior: pi.QI_01_pressure_injuries.rate,
    numerator: ci.QI_01_pressure_injuries.numerator, denominator: ci.QI_01_pressure_injuries.denominator,
    trend: trend(ci.QI_01_pressure_injuries.rate, pi.QI_01_pressure_injuries.rate, false), scrutiny: "high",
    chrisNote: ci.QI_01_pressure_injuries.note || "Below benchmark for 4 consecutive quarters. Wound care protocol changes from October 2025 are sustaining.",
  },
  {
    code: "QI_02", name: "Restrictive Practices", category: "clinical",
    description: "% of eligible residents subject to a restrictive practice on the collection day.",
    collection: "Point prevalence. Includes physical, chemical, environmental, mechanical restraint and seclusion.",
    higherIsBetter: false, source: "clinical",
    benchmark: ci.QI_02_restrictive_practices.benchmark, current: ci.QI_02_restrictive_practices.rate, prior: pi.QI_02_restrictive_practices.rate,
    numerator: ci.QI_02_restrictive_practices.numerator, denominator: ci.QI_02_restrictive_practices.denominator,
    trend: trend(ci.QI_02_restrictive_practices.rate, pi.QI_02_restrictive_practices.rate, false), scrutiny: "high",
    chrisNote: ci.QI_02_restrictive_practices.note,
  },
  {
    code: "QI_03", name: "Falls", category: "clinical",
    description: "% of eligible residents who experienced one or more falls during the quarter.",
    collection: "Retrospective review of care records for the full quarter.",
    higherIsBetter: false, source: "incident",
    benchmark: ci.QI_03_falls.benchmark, current: ci.QI_03_falls.rate, prior: pi.QI_03_falls.rate,
    numerator: ci.QI_03_falls.numerator, denominator: ci.QI_03_falls.denominator,
    trend: trend(ci.QI_03_falls.rate, pi.QI_03_falls.rate, false), scrutiny: "high",
    chrisNote: ci.QI_03_falls.note || "Falls above benchmark for 3rd consecutive quarter. CHRIS has identified workforce-falls correlation: 78% of falls on shifts with >30% agency coverage.",
  },
  {
    code: "QI_04", name: "Falls — Major Injury", category: "clinical",
    description: "% of eligible residents who experienced a fall resulting in major injury during the quarter.",
    collection: "Retrospective review. Major injury = fracture, dislocation, closed head injury, subdural haematoma.",
    higherIsBetter: false, source: "incident",
    benchmark: ci.QI_04_falls_major_injury.benchmark, current: ci.QI_04_falls_major_injury.rate, prior: pi.QI_04_falls_major_injury.rate,
    numerator: ci.QI_04_falls_major_injury.numerator, denominator: ci.QI_04_falls_major_injury.denominator,
    trend: trend(ci.QI_04_falls_major_injury.rate, pi.QI_04_falls_major_injury.rate, false), scrutiny: "high",
    chrisNote: ci.QI_04_falls_major_injury.note || "Major injury rate recovered after Q1 spike. Both major-injury falls occurred on high-agency shifts.",
  },
  {
    code: "QI_05", name: "Polypharmacy", category: "clinical",
    description: "% of eligible residents prescribed 9 or more medications on the collection date.",
    collection: "Review of medication charts on a single date each quarter.",
    higherIsBetter: false, source: "medication",
    benchmark: ci.QI_05_polypharmacy.benchmark, current: ci.QI_05_polypharmacy.rate, prior: pi.QI_05_polypharmacy.rate,
    numerator: ci.QI_05_polypharmacy.numerator, denominator: ci.QI_05_polypharmacy.denominator,
    trend: trend(ci.QI_05_polypharmacy.rate, pi.QI_05_polypharmacy.rate, false), scrutiny: "low",
  },
  {
    code: "QI_06", name: "Antipsychotics", category: "clinical",
    description: "% of eligible residents prescribed antipsychotic medication without a psychosis diagnosis.",
    collection: "Review of medication charts on collection date. Excludes residents with documented psychosis.",
    higherIsBetter: false, source: "medication",
    benchmark: ci.QI_06_antipsychotics.benchmark, current: ci.QI_06_antipsychotics.rate, prior: pi.QI_06_antipsychotics.rate,
    numerator: ci.QI_06_antipsychotics.numerator, denominator: ci.QI_06_antipsychotics.denominator,
    trend: trend(ci.QI_06_antipsychotics.rate, pi.QI_06_antipsychotics.rate, false), scrutiny: "high",
  },
  {
    code: "QI_07", name: "Activities of Daily Living", category: "clinical",
    description: "% of eligible residents whose ADL score declined compared to the prior quarter.",
    collection: "Standardised ADL assessment tool each quarter.",
    higherIsBetter: false, source: "clinical",
    benchmark: ci.QI_07_adl_decline.benchmark, current: ci.QI_07_adl_decline.rate, prior: pi.QI_07_adl_decline.rate,
    numerator: ci.QI_07_adl_decline.numerator, denominator: ci.QI_07_adl_decline.denominator,
    trend: trend(ci.QI_07_adl_decline.rate, pi.QI_07_adl_decline.rate, false), scrutiny: "low",
  },
  {
    code: "QI_08", name: "Incontinence Care", category: "clinical",
    description: "% of eligible residents with unplanned incontinence not addressed in their care plan.",
    collection: "Review of care records and care plan for collection period.",
    higherIsBetter: false, source: "clinical",
    benchmark: ci.QI_08_incontinence.benchmark, current: ci.QI_08_incontinence.rate, prior: pi.QI_08_incontinence.rate,
    numerator: ci.QI_08_incontinence.numerator, denominator: ci.QI_08_incontinence.denominator,
    trend: trend(ci.QI_08_incontinence.rate, pi.QI_08_incontinence.rate, false), scrutiny: "low",
  },
  {
    code: "QI_09", name: "ED Presentations", category: "clinical",
    description: "% of eligible residents who had one or more unplanned ED presentations during the quarter.",
    collection: "Hospital notifications / clinical system records.",
    higherIsBetter: false, source: "clinical",
    benchmark: ci.QI_09_ed_presentations.benchmark, current: ci.QI_09_ed_presentations.rate, prior: pi.QI_09_ed_presentations.rate,
    numerator: ci.QI_09_ed_presentations.numerator, denominator: ci.QI_09_ed_presentations.denominator,
    trend: trend(ci.QI_09_ed_presentations.rate, pi.QI_09_ed_presentations.rate, false), scrutiny: "medium",
  },
  {
    code: "QI_10", name: "Hospitalisation", category: "clinical",
    description: "% of eligible residents who had one or more unplanned ED presentations or hospital admissions during the quarter.",
    collection: "Hospital notifications / clinical system.",
    higherIsBetter: false, source: "clinical",
    benchmark: ci.QI_10_hospitalisation.benchmark, current: ci.QI_10_hospitalisation.rate, prior: pi.QI_10_hospitalisation.rate,
    numerator: ci.QI_10_hospitalisation.numerator, denominator: ci.QI_10_hospitalisation.denominator,
    trend: trend(ci.QI_10_hospitalisation.rate, pi.QI_10_hospitalisation.rate, false), scrutiny: "medium",
  },
  {
    code: "QI_11", name: "Consumer Experience", category: "experience",
    description: "Resident satisfaction score from the annual Residents' Experience Survey conducted by ACQSC.",
    collection: "Conducted by ACQSC directly — not by the provider.",
    higherIsBetter: true, source: "acqsc_survey",
    benchmark: ci.QI_11_consumer_experience.benchmark, current: ci.QI_11_consumer_experience.score, prior: pi.QI_11_consumer_experience.score,
    trend: trend(ci.QI_11_consumer_experience.score, pi.QI_11_consumer_experience.score, true), scrutiny: "medium",
  },
  {
    code: "QI_12", name: "Quality of Life", category: "experience",
    description: "Resident-reported quality of life using a standardised tool.",
    collection: "Providers collect using the Dementia Quality of Life tool or equivalent.",
    higherIsBetter: true, source: "clinical",
    benchmark: ci.QI_12_quality_of_life.benchmark, current: ci.QI_12_quality_of_life.score, prior: pi.QI_12_quality_of_life.score,
    trend: trend(ci.QI_12_quality_of_life.score, pi.QI_12_quality_of_life.score, true), scrutiny: "low",
  },
  {
    code: "QI_13", name: "Enrolled Nursing Hours", category: "staffing",
    description: "Enrolled nurse hours per resident per day. Sourced from QFR data.",
    collection: "QFR / rostering data.",
    higherIsBetter: true, source: "qfr",
    benchmark: 0.40, current: ci.QI_13_enrolled_nursing_hrs.hrs_per_resident_day, prior: pi.QI_13_enrolled_nursing_hrs.hrs_per_resident_day,
    trend: trend(ci.QI_13_enrolled_nursing_hrs.hrs_per_resident_day, pi.QI_13_enrolled_nursing_hrs.hrs_per_resident_day, true), scrutiny: "low",
    chrisNote: "New QI from April 2025. National benchmarks still establishing.",
  },
  {
    code: "QI_14", name: "Allied Health Hours", category: "staffing",
    description: "Allied health professional hours per resident per day. Sourced from QFR data.",
    collection: "QFR / rostering data.",
    higherIsBetter: true, source: "qfr",
    benchmark: 0.35, current: ci.QI_14_allied_health_hrs.hrs_per_resident_day, prior: pi.QI_14_allied_health_hrs.hrs_per_resident_day,
    trend: trend(ci.QI_14_allied_health_hrs.hrs_per_resident_day, pi.QI_14_allied_health_hrs.hrs_per_resident_day, true), scrutiny: "medium",
    chrisNote: ci.QI_14_allied_health_hrs.note || "New QI from April 2025. National benchmarks still establishing.",
  },
  {
    code: "QI_15", name: "Lifestyle Officer Hours", category: "staffing",
    description: "Lifestyle officer hours per resident per day. Sourced from QFR data.",
    collection: "QFR / rostering data.",
    higherIsBetter: true, source: "qfr",
    benchmark: 0.20, current: 0.22, prior: 0.21,
    trend: "improving", scrutiny: "low",
    chrisNote: "New QI from April 2025. National benchmarks still establishing.",
  },
];

export function getQIStatus(qi: QIDefinition): "good" | "watch" | "bad" {
  if (qi.higherIsBetter) {
    return qi.current >= qi.benchmark ? "good" : qi.current >= qi.benchmark * 0.9 ? "watch" : "bad";
  }
  return qi.current <= qi.benchmark ? "good" : qi.current <= qi.benchmark * 1.1 ? "watch" : "bad";
}

export function getQIByCode(code: string): QIDefinition | undefined {
  return QI_DATA.find((qi) => qi.code === code);
}
