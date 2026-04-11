// ============================================================================
// Quality Indicator Data — All 15 QIs per ACQSC Mandatory QI Program
// Since 1 April 2025: includes staffing QIs (QI_13, QI_14, QI_15)
// ============================================================================

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

export const QI_DATA: QIDefinition[] = [
  {
    code: "QI_01", name: "Pressure Injuries", category: "clinical",
    description: "% of eligible residents with a Stage 2+ pressure injury on the collection day.",
    collection: "Point prevalence — assessed on the same day each quarter.",
    higherIsBetter: false, source: "clinical", benchmark: 7.8, current: 6.4, prior: 9.1,
    numerator: 3, denominator: 47, trend: "improving", scrutiny: "high",
    chrisNote: "Dropped from 9.1% to 6.4% — below benchmark for the first time this year. Wound care audit changes from August appear to have made a difference.",
  },
  {
    code: "QI_02", name: "Restrictive Practices", category: "clinical",
    description: "% of eligible residents subject to a restrictive practice on the collection day.",
    collection: "Point prevalence. Includes physical, chemical, environmental, mechanical restraint and seclusion.",
    higherIsBetter: false, source: "clinical", benchmark: 15.0, current: 12.8, prior: 13.5,
    numerator: 6, denominator: 47, trend: "improving", scrutiny: "high",
  },
  {
    code: "QI_03", name: "Falls", category: "clinical",
    description: "% of eligible residents who experienced one or more falls during the quarter.",
    collection: "Retrospective review of care records for the full quarter.",
    higherIsBetter: false, source: "incident", benchmark: 42.1, current: 40.4, prior: 38.5,
    numerator: 19, denominator: 47, trend: "worsening", scrutiny: "medium",
    chrisNote: "Falls trending up 3 consecutive quarters. Allied health hours dropped 18% in the same period. Physio assessment completion fallen from 94% to 71%.",
  },
  {
    code: "QI_04", name: "Falls — Major Injury", category: "clinical",
    description: "% of eligible residents who experienced a fall resulting in major injury during the quarter.",
    collection: "Retrospective review. Major injury = fracture, dislocation, closed head injury, subdural haematoma.",
    higherIsBetter: false, source: "incident", benchmark: 3.5, current: 6.4, prior: 2.1,
    numerator: 3, denominator: 47, trend: "worsening", scrutiny: "high",
    chrisNote: "3 major-injury falls this quarter — up from 1. 2 of 3 occurred on night shifts with >40% agency coverage. SIRS review completed for all three.",
  },
  {
    code: "QI_05", name: "Polypharmacy", category: "clinical",
    description: "% of eligible residents prescribed 9 or more medications on the collection date.",
    collection: "Review of medication charts on a single date each quarter.",
    higherIsBetter: false, source: "medication", benchmark: 40.0, current: 38.3, prior: 39.1,
    numerator: 18, denominator: 47, trend: "improving", scrutiny: "low",
  },
  {
    code: "QI_06", name: "Antipsychotics", category: "clinical",
    description: "% of eligible residents prescribed antipsychotic medication without a psychosis diagnosis.",
    collection: "Review of medication charts on collection date. Excludes residents with documented psychosis.",
    higherIsBetter: false, source: "medication", benchmark: 24.1, current: 23.4, prior: 21.8,
    numerator: 11, denominator: 47, trend: "worsening", scrutiny: "high",
    chrisNote: "Within benchmark but rising. 3 residents have antipsychotic orders without a 90-day clinical review — flag for pharmacy review.",
  },
  {
    code: "QI_07", name: "Activities of Daily Living", category: "clinical",
    description: "% of eligible residents whose ADL score declined compared to the prior quarter.",
    collection: "Standardised ADL assessment tool each quarter.",
    higherIsBetter: false, source: "clinical", benchmark: 37.0, current: 34.0, prior: 36.2,
    numerator: 16, denominator: 47, trend: "improving", scrutiny: "low",
  },
  {
    code: "QI_08", name: "Incontinence Care", category: "clinical",
    description: "% of eligible residents with unplanned incontinence not addressed in their care plan.",
    collection: "Review of care records and care plan for collection period.",
    higherIsBetter: false, source: "clinical", benchmark: 11.0, current: 8.5, prior: 10.2,
    numerator: 4, denominator: 47, trend: "improving", scrutiny: "low",
  },
  {
    code: "QI_09", name: "ED Presentations", category: "clinical",
    description: "% of eligible residents who had one or more unplanned ED presentations during the quarter.",
    collection: "Hospital notifications / clinical system records.",
    higherIsBetter: false, source: "clinical", benchmark: 20.0, current: 17.0, prior: 19.1,
    numerator: 8, denominator: 47, trend: "improving", scrutiny: "medium",
  },
  {
    code: "QI_10", name: "Hospitalisation", category: "clinical",
    description: "% of eligible residents who had one or more unplanned ED presentations or hospital admissions during the quarter.",
    collection: "Hospital notifications / clinical system.",
    higherIsBetter: false, source: "clinical", benchmark: 27.0, current: 23.4, prior: 25.5,
    numerator: 11, denominator: 47, trend: "improving", scrutiny: "medium",
  },
  {
    code: "QI_11", name: "Consumer Experience", category: "experience",
    description: "Resident satisfaction score from the annual Residents' Experience Survey conducted by ACQSC.",
    collection: "Conducted by ACQSC directly — not by the provider.",
    higherIsBetter: true, source: "acqsc_survey", benchmark: 78.0, current: 82.0, prior: 80.0,
    trend: "improving", scrutiny: "medium",
  },
  {
    code: "QI_12", name: "Quality of Life", category: "experience",
    description: "Resident-reported quality of life using a standardised tool.",
    collection: "Providers collect using the Dementia Quality of Life tool or equivalent.",
    higherIsBetter: true, source: "clinical", benchmark: 72.0, current: 75.0, prior: 73.0,
    trend: "improving", scrutiny: "low",
  },
  {
    code: "QI_13", name: "Enrolled Nursing Hours", category: "staffing",
    description: "Enrolled nurse hours per resident per day. Sourced from QFR data.",
    collection: "QFR / rostering data.",
    higherIsBetter: true, source: "qfr", benchmark: 0.8, current: 0.9, prior: 0.85,
    trend: "improving", scrutiny: "low",
    chrisNote: "New QI from April 2025. National benchmarks still establishing.",
  },
  {
    code: "QI_14", name: "Allied Health Hours", category: "staffing",
    description: "Allied health professional hours per resident per day. Sourced from QFR data.",
    collection: "QFR / rostering data.",
    higherIsBetter: true, source: "qfr", benchmark: 0.3, current: 0.25, prior: 0.31,
    trend: "worsening", scrutiny: "medium",
    chrisNote: "Allied health hours dropped 18%. Correlates with QI_03 (falls) trend. Physio assessment completion also declining.",
  },
  {
    code: "QI_15", name: "Lifestyle Officer Hours", category: "staffing",
    description: "Lifestyle officer hours per resident per day. Sourced from QFR data.",
    collection: "QFR / rostering data.",
    higherIsBetter: true, source: "qfr", benchmark: 0.2, current: 0.22, prior: 0.21,
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
