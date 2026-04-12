// Maintained by Ivan Sanchez — update when regulations change
//
// ============================================================================
// CHRIS Aged Care Knowledge Base — Constants Only
//
// The canonical reference for all Australian aged care regulatory thresholds,
// financial benchmarks, clinical standards, and operational parameters.
// Every agent, engine, and UI component that references a regulatory number
// should import from here — not hardcode.
//
// Sources:
//   Aged Care Act 2024
//   ACQSC QI Program Manual v4.0
//   StewartBrown Aged Care Financial Performance Survey FY24-25
//   ISO 45003:2021
//   NSW WHS Regulation 2025
//   AN-ACC Pricing Framework Oct 2025
// ============================================================================

export const AGED_CARE_KNOWLEDGE = {

  legislation: {
    primary: 'Aged Care Act 2024',
    commenced: '2025-11-01',
    regulator: 'Aged Care Quality and Safety Commission (ACQSC)',
    reporting_system: 'GPMS (Government Provider Management System)',
    star_rating_system: true,
    star_rating_components: [
      'Compliance',
      'Quality Measures',
      'Residents Experience',
      'Workforce',
    ],
  },

  care_minutes: {
    total_minutes_per_resident_day: 200,
    rn_minutes_per_resident_day: 40,
    en_can_substitute_rn_pct: 0.10,
    rn_24_7_requirement: true,
    reporting_frequency: 'monthly',
    reporting_system: 'GPMS',
    an_acc_starting_price_oct_2025: 295.64,
    hotelling_supplement_sep_2025: 22.15,
    funding_linkage_mm1_from: '2026-04-01',
    funding_linkage_applies_to: 'MM1 metropolitan facilities only',
    chris_alert_threshold_pct: 0.95,
    chris_critical_threshold_pct: 0.90,
  },

  sirs: {
    cat1_notification_hours: 24,
    cat2_notification_days: 30,
    followup_report_days: 84,
    max_penalty_per_breach: 783000,
    submission_system: 'GPMS',
    cat1_triggers: [
      'unexpected_death',
      'missing_resident',
      'abuse_physical',
      'abuse_sexual',
      'abuse_psychological',
      'abuse_financial',
      'neglect',
      'unexplained_serious_injury',
      'unauthorised_restrictive_practice',
      'sexual_misconduct_staff',
      'unexpected_absence_without_consent',
    ],
    cat2_triggers: [
      'deterioration_in_cognitive_function',
      'significant_weight_loss',
      'falls_with_injury',
      'medication_error_with_harm',
      'wound_deterioration',
      'transfer_to_hospital',
      'infection_outbreak',
      'absconding',
    ],
    chris_alert_thresholds: {
      cat1_hours_remaining_urgent: 6,
      cat1_hours_remaining_warning: 12,
      cat2_days_remaining_urgent: 3,
      cat2_days_remaining_warning: 7,
      followup_days_remaining_warning: 14,
    },
  },

  quality_indicators: {
    program: 'National Aged Care Mandatory QI Program',
    manual_version: '4.0',
    total_indicators: 14,
    submission_deadline_days_after_quarter_end: 21,
    submission_system: 'GPMS',
    publicly_reported: true,
    star_rating_component: 'Quality Measures',
    quarters: {
      Q1: { period: 'Jul-Sep', due: 'Oct 21' },
      Q2: { period: 'Oct-Dec', due: 'Jan 21' },
      Q3: { period: 'Jan-Mar', due: 'Apr 21' },
      Q4: { period: 'Apr-Jun', due: 'Jul 21' },
    },
    indicators: {
      QI_01: { name: 'Pressure Injuries', direction: 'lower_is_better', benchmark_pct: 7.8, acqsc_scrutiny: 'high' },
      QI_02: { name: 'Restrictive Practices', direction: 'lower_is_better', benchmark_pct: 15.1 },
      QI_03: { name: 'Falls', direction: 'lower_is_better', benchmark_pct: 42.1 },
      QI_04: { name: 'Falls with Major Injury', direction: 'lower_is_better', benchmark_pct: 3.3, sirs_link: true },
      QI_05: { name: 'Medication Management - Polypharmacy', direction: 'lower_is_better', benchmark_pct: 39.1, threshold: 9 },
      QI_06: { name: 'Medication Management - Antipsychotics', direction: 'lower_is_better', benchmark_pct: 23.8 },
      QI_07: { name: 'Activities of Daily Living', direction: 'lower_is_better', benchmark_pct: 36.4 },
      QI_08: { name: 'Incontinence Care', direction: 'lower_is_better', benchmark_pct: 10.9 },
      QI_09: { name: 'Hospitalisation - ED Presentations', direction: 'lower_is_better', benchmark_pct: 19.4 },
      QI_10: { name: 'Hospitalisation - ED or Admission', direction: 'lower_is_better', benchmark_pct: 27.1 },
      QI_11: { name: 'Consumer Experience', direction: 'higher_is_better', benchmark: 76.2, source: 'acqsc_direct' },
      QI_12: { name: 'Quality of Life', direction: 'higher_is_better', benchmark: 72.8 },
      QI_13: { name: 'Enrolled Nursing Hours', direction: 'higher_is_better', commenced: '2025-04-01' },
      QI_14: { name: 'Allied Health Hours', direction: 'higher_is_better', commenced: '2025-04-01' },
    },
  },

  quality_standards: {
    framework: 'Strengthened Aged Care Quality Standards',
    commenced: '2025-11-01',
    standards: {
      QS1: 'Consumer Dignity and Choice',
      QS2: 'Ongoing Assessment and Planning',
      QS3: 'Care Environment',
      QS4: 'Services and Supports',
      QS5: 'Clinical Care',
      QS6: 'Food and Nutrition',
      QS7: 'Residential Community',
      QS8: 'Organisational Governance',
    },
  },

  financial: {
    stewartbrown: {
      survey_homes: 1100,
      ebitda_per_bed_day_sector_avg: 18.68,
      ebitda_per_bed_year_sector_avg: 6817,
      ebitda_per_bed_year_investment_grade: 20000,
      npbt_per_resident_day: 20.69,
      labour_cost_pct_revenue: 0.70,
      direct_care_labour_per_bed_day: 223.48,
      total_staff_cost_per_bed_day: 235.88,
      occupancy_mature_homes: 0.944,
      supported_resident_ratio: 0.464,
      avg_rad_fy25: 516770,
      mpir_jun25: 0.0817,
      food_cost_per_bed_day: 15.49,
      depreciation_per_bed_day: 22.55,
      direct_care_margin_per_bed_day: 10.32,
    },
    an_acc: {
      starting_price_oct_2025: 295.64,
      class_count: 13,
      components: ['base_care_tariff', 'class_nwau'],
      location_loadings: ['MM1', 'MM2', 'MM3', 'MM4', 'MM5', 'MM6', 'MM7'],
      assessment_tool: 'AN-ACC Assessment Tool',
      max_assessment_interval_days: 365,
      chris_flag_days_since_assessment: 335,
    },
    hotelling: {
      basic_daily_fee_2025: 63.57,
      hotelling_supplement_sep_2025: 22.15,
      indexed_annually_from: '2026-01-01',
    },
    accommodation: {
      rad_price_cap: 750000,
      rad_retention_pct: 0.02,
      rad_retention_max_years: 5,
      rad_retention_commenced: '2025-11-01',
      rad_refund_days: 14,
      mpir_jun25: 0.0817,
      helf_commenced: '2025-11-01',
      helf_note: 'Higher Everyday Living Fee — provider set, for residents entering after Nov 2025',
    },
    workforce_cost_benchmarks: {
      ain_exit_cost_low: 8000,
      ain_exit_cost_high: 12000,
      en_exit_cost_low: 20000,
      en_exit_cost_high: 40000,
      rn_exit_cost_low: 40000,
      rn_exit_cost_high: 80000,
      agency_rn_cost_per_shift: 480,
      permanent_rn_cost_per_shift: 290,
      agency_rn_premium_per_shift: 190,
      agency_ain_cost_per_shift: 280,
      permanent_ain_cost_per_shift: 195,
      agency_ain_premium_per_shift: 85,
    },
    penalty_exposures: {
      sirs_cat1_max: 783000,
      care_minutes_non_compliance_funding_risk: true,
      whs_regulation_max_combined: 1000000,
    },
  },

  psh: {
    framework: 'ISO 45003:2021',
    domains_count: 16,
    collection_frequency: 'fortnightly',
    pulse_questions_per_cycle: 5,
    domains: {
      PSH_01: { name: 'High Job Demands', category: 'job_design', turnover_predictor: false },
      PSH_02: { name: 'Lack of Support', category: 'relationships', turnover_predictor: false },
      PSH_03: { name: 'Organisational Justice', category: 'leadership', turnover_predictor: false },
      PSH_04: { name: 'Low Job Control', category: 'job_design', turnover_predictor: false },
      PSH_05: { name: 'Poor Relationships', category: 'relationships', turnover_predictor: false },
      PSH_06: { name: 'Role Conflict', category: 'job_design', turnover_predictor: false },
      PSH_07: { name: 'Poor Change Management', category: 'leadership', turnover_predictor: false },
      PSH_08: { name: 'Traumatic Exposure', category: 'care_environment', turnover_predictor: false, wc_correlation: true },
      PSH_09: { name: 'Remote or Isolated Work', category: 'environment', turnover_predictor: false },
      PSH_10: { name: 'Violence and Aggression', category: 'care_environment', turnover_predictor: false, wc_correlation: true },
      PSH_11: { name: 'Harassment and Bullying', category: 'relationships', turnover_predictor: false },
      PSH_12: { name: 'Emotional Demands', category: 'care_environment', turnover_predictor: false },
      PSH_13: { name: 'Low Recognition', category: 'leadership', turnover_predictor: true, turnover_correlation: 0.71 },
      PSH_14: { name: 'Poor Work Environment', category: 'environment', turnover_predictor: false },
      PSH_15: { name: 'Job Insecurity', category: 'job_design', turnover_predictor: false, succession_signal: true },
      PSH_16: { name: 'Work-Life Imbalance', category: 'job_design', turnover_predictor: false },
    },
    thresholds: {
      elevated: 0.65,
      monitoring: 0.55,
      low: 0.45,
    },
    convergence: {
      domains_required: 2,
      cycles_required: 2,
      chris_alert: true,
    },
    wc_correlations: {
      PSH_08_and_PSH_10: {
        claim_probability: 0.68,
        window_weeks: '4-6',
        avg_claim_cost_low: 45000,
        avg_claim_cost_high: 290000,
      },
    },
    turnover_precursors: {
      PSH_13_consecutive_decline_cycles: 3,
      exit_correlation: 0.71,
      exit_window_cycles: '4-6',
    },
  },

  whs: {
    legislation: 'NSW WHS Regulation 2025 s.55C',
    iso_standard: 'ISO 45003:2021',
    evidence_categories: 4,
    iso_45003_sections: [
      '5.4 Consultation and participation',
      '6.1 Risk assessment',
      '8.1 Operational planning and control',
      '9.1 Monitoring measurement analysis and evaluation',
    ],
    chris_consultation_evidence: 'Auto-generated from fortnightly pulse participation data',
  },

  reporting_cycles: {
    qi_submission_deadline_days: 21,
    qfr_submission_deadline_days: 21,
    acfr_annual: true,
    sirs_cat1_hours: 24,
    sirs_cat2_days: 30,
    sirs_followup_days: 84,
    care_plan_review_days: 90,
    care_minutes_reporting: 'monthly',
    pulse_fortnightly: true,
    board_pack_quarterly: true,
    an_acc_max_assessment_interval_days: 365,
  },

  connector_source_systems: {
    rostering: ['Deputy', 'Humanforce', 'Kronos', 'Roster Ready'],
    clinical: ['AlayaCare', 'Leecare', 'Civica Care', 'iCare'],
    hr_payroll: ['ELMO', 'Employment Hero', 'Chris21', 'Frontier Software'],
    finance_erp: ['TechnologyOne', 'MYOB', 'Xero', 'Epicor'],
    incident_whs: ['RiskMan', 'Riskware', 'SafeSys'],
    government: ['ACQSC GPMS'],
  },

} as const;

export type AgedCareKnowledge = typeof AGED_CARE_KNOWLEDGE;
export default AGED_CARE_KNOWLEDGE;
