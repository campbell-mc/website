// lib/chris/home-care-knowledge.ts
// Home Care Knowledge Base — Support at Home program (commenced November 2025)
// Replaces Home Care Packages. Individual budget model.
// Every home care screen, agent, and narrative references this.

export const HOME_CARE_KNOWLEDGE = {

  program: {
    name: 'Support at Home',
    commenced: '2025-11-01',
    replaced: 'Home Care Packages Program',
    authority: 'Department of Health and Aged Care',
    regulator: 'ACQSC',
    legislation: 'Aged Care Act 2024',
  },

  funding: {
    model: 'individual_budget',
    service_categories: [
      'Daily Living', 'Independence', 'Allied Health',
      'Clinical Nursing Care', 'Assistive Technology and Equipment', 'Home Modifications',
    ],
    unspent_funds: {
      treatment: 'Return to government at end of quarter',
      chris_alert_threshold_pct: 0.25,
      chris_critical_threshold_pct: 0.40,
    },
    budget_statement: {
      frequency: 'quarterly',
      chris_monitoring: true,
      deadline_days_after_quarter: 14,
    },
  },

  compliance: {
    sirs: {
      applies: true,      // SIRS extended to Support at Home from 1 Nov 2025
      priority1_notification_hours: 24,
      priority2_notification_days: 30,
      final_report_days: 60,
      reportable_incident_types: 9,
      max_civil_penalty_corporate: 1650000,  // Up to $1.65M body corporates
      penalty_unit_value: 330,               // $330 from 7 Nov 2024
    },
    quality_standards_count: 7,  // 7 Strengthened Quality Standards from 1 Nov 2025
    care_plan_review: 'annual_or_needs_change',
    care_plan_alert_days_overdue: 30,
    care_plan_critical_days_overdue: 60,
    qfr_frequency: 'quarterly',
    qfr_deadline_days: 42,
    qfr_penalty: 1650000,  // Max civil penalty for body corporates
  },

  metrics: {
    visit_compliance: { target: 0.97, chris_alert: 0.93, chris_critical: 0.90 },
    hours_utilisation: { target: 0.92, chris_alert: 0.85, chris_critical: 0.80 },
    travel_time_pct: { target: 0.12, chris_alert: 0.18, chris_critical: 0.25 },
    care_plan_currency: { target: 1.0, chris_alert: 0.95, chris_critical: 0.90 },
    budget_utilisation: { target_min: 0.80, target_max: 0.95, underspend_alert: 0.75, overspend_alert: 0.97 },
    client_satisfaction: { sector_average: 79.1, top_quartile: 88.0, chris_alert: 72.0 },
    unspent_funds_pct: { sector_average: 0.187, chris_alert: 0.25, chris_critical: 0.35 },
  },

  benchmarks: {
    source: 'StewartBrown ACFPS FY25',
    revenue_per_client_per_day: { sector_average: 84.89, prior_year: 78.44 },
    care_management_pct: { sector_average: 0.187, minimum_compliant: 0.10, chris_alert_below: 0.14 },
    package_management_pct: { sector_average: 0.132 },
    unspent_funds_per_client: { sector_average: 14517 },
    npbt_per_client_per_day: { sector_average: 4.33 },
    ebitda_return_pct: { sector_average: 0.064 },
  },

  lone_worker: {
    check_in_overdue_alert_mins: 30,
    high_risk_visit_pre_post_contact: true,
    psh_elevated_domains: ['PSH_09', 'PSH_10', 'PSH_01'],
  },

  language: {
    person: 'client', service_unit: 'visit', schedule: 'run',
    team_leader: 'coordinator', worker: 'support worker',
    manager: 'Home Care Manager', funding_unit: 'package',
    funding_amount: 'budget', care_plan: 'care plan',
    unspent: 'unspent funds', delivered: 'delivered hours',
  },

} as const;

export type HomeCareKnowledge = typeof HOME_CARE_KNOWLEDGE;
export default HOME_CARE_KNOWLEDGE;
