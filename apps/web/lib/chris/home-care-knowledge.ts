// lib/chris/home-care-knowledge.ts
// Maintained by Ivan Sanchez
// Support at Home Program — commenced 1 November 2025
// Replaces: Home Care Packages (HCP)

export const HOME_CARE_KNOWLEDGE = {

  program: {
    name: 'Support at Home',
    commenced: '2025-11-01',
    replaces: 'Home Care Packages (HCP)',
    administrator: 'Department of Social Services (DSS)',
    regulator: 'ACQSC',
    legislation: 'Aged Care Act 2024',
  },

  language: {
    person: 'client', people: 'clients',
    service: 'visit', services: 'visits',
    place: 'home', funding: 'budget', plan: 'support plan',
  },

  classifications: {
    count: 8,
    model: 'ongoing_classifications',
    budget_types: ['care_and_support', 'assistive_technology', 'home_modifications'],
    special_pathways: ['assistive_technology_home_modification', 'restorative_care', 'end_of_life'],
  },

  funding: {
    model: 'individual_client_budget',
    care_management_revenue_pct: 0.186,
    unspent_funds_sector_avg_per_client: 14517,
    unspent_funds_chris_flag_threshold_pct: 0.25,
    claiming_system: 'Support at Home Portal (DSS)',
    claiming_frequency: 'monthly',
    claiming_deadline_days_after_month_end: 21,
  },

  compliance: {
    no_sirs: true,
    no_care_minutes: true,
    no_qi_program: true,
    incident_reporting_system: 'DSS Support at Home Portal',
    incident_serious_hours: 24,
    incident_other_business_days: 5,
    care_plan_review_frequency: 'on_significant_change_or_annually',
    quality_standards: 'Strengthened Aged Care Quality Standards',
  },

  visits: {
    types: ['personal_care', 'domestic_assistance', 'social_support_individual', 'social_support_group', 'transport', 'allied_health', 'nursing', 'meal_preparation', 'garden_and_home_maintenance', 'respite_in_home'],
    missed_visit_documentation_hours: 24,
    late_visit_threshold_minutes: 30,
    worker_continuity_target: 'same_worker_where_possible',
  },

  workforce: {
    primary_role: 'community_support_worker',
    lone_worker_psh_domain: 'PSH_09',
    lone_worker_checkin_required: true,
    target_travel_time_pct_of_paid_hours: 0.15,
  },

  financial_benchmarks: {
    care_management_pct: 0.186,
    unspent_funds_per_client: 14517,
    profitability_margin: 0.035,
    labour_cost_pct_revenue: 0.65,
    travel_cost_pct_revenue: 0.08,
  },

  sentinel_priorities: [
    'missed_scheduled_visits', 'unspent_budget_above_threshold',
    'lone_worker_checkin_failure', 'care_plan_overdue_review',
    'incident_reporting_deadline', 'worker_screening_expiry', 'claiming_deadline_approaching',
  ],

  oracle_priorities: [
    'budget_utilisation_per_client', 'unspent_funds_management',
    'care_management_revenue_optimisation', 'visit_compliance_rate',
  ],
} as const;

export type HomeCareKnowledge = typeof HOME_CARE_KNOWLEDGE;
export default HOME_CARE_KNOWLEDGE;
