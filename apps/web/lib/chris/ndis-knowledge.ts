// lib/chris/ndis-knowledge.ts
// Maintained by Ivan Sanchez
// National Disability Insurance Scheme

export const NDIS_KNOWLEDGE = {

  scheme: {
    name: 'National Disability Insurance Scheme',
    acronym: 'NDIS',
    administrator: 'National Disability Insurance Agency (NDIA)',
    regulator: 'NDIS Quality and Safeguards Commission',
    legislation: 'National Disability Insurance Scheme Act 2013',
    price_guide: 'NDIS Support Catalogue — updated annually July',
  },

  language: {
    person: 'participant', people: 'participants',
    service: 'support', services: 'supports',
    place: 'community', funding: 'plan budget', plan: 'NDIS plan',
  },

  plans: {
    set_by: 'NDIA_planner_or_local_area_coordinator',
    review_triggers: ['annual_review', 'significant_change', 'participant_request'],
    management_types: {
      agency_managed: 'NDIA pays registered providers via myplace portal',
      plan_managed: 'Plan manager pays providers on participant behalf',
      self_managed: 'Participant pays providers directly',
    },
    budget_categories: {
      core: 'Daily activities, transport, consumables',
      capacity_building: 'Therapy, development goals, coordination',
      capital: 'Equipment, home modifications',
    },
  },

  compliance: {
    regulator: 'NDIS Quality and Safeguards Commission',
    practice_standards: 'NDIS Practice Standards 2018',
    claiming_system: 'NDIS myplace provider portal',
    incident_reporting: 'NDIS Commission',
    worker_screening: 'NDIS Worker Screening Check',
    restrictive_practices_require_bsp: true,
    no_sirs: true,
    no_care_minutes: true,
    no_aged_care_qi: true,
    price_controls: true,
  },

  workforce: {
    primary_role: 'support_worker',
    specialist_roles: ['behaviour_support_practitioner', 'support_coordinator', 'allied_health'],
    worker_screening_required: true,
    lone_worker_psh_domain: 'PSH_09',
  },

  sentinel_priorities: [
    'ndis_plan_budget_utilisation', 'support_delivery_vs_plan_goals',
    'incident_reporting_deadline', 'worker_screening_expiry',
    'behaviour_support_plan_compliance', 'claiming_deadlines', 'participant_goal_progress',
  ],

  oracle_priorities: [
    'plan_budget_burn_rate', 'claiming_compliance',
    'support_coordination_revenue', 'capacity_building_utilisation',
  ],
} as const;

export type NDISKnowledge = typeof NDIS_KNOWLEDGE;
export default NDIS_KNOWLEDGE;
