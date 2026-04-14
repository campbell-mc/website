// lib/roles/config.ts
// Maintained by Ivan Sanchez and Campbell McGlynn
// Adding a new role = adding one entry to this file
// Changing what a role sees = changing one line

import type { CareType } from '@/lib/types';

export type RoleName =
  // Residential roles
  | 'facility_manager'
  | 'don'
  | 'ceo'
  | 'cfo'
  | 'clinical_director'
  | 'quality_lead'
  | 'whs_lead'
  | 'hr_manager'
  | 'board_member'
  | 'team_leader'
  | 'frontline_staff'
  | 'elt_member'
  | 'operator'
  // Home Care roles
  | 'home_care_manager'
  | 'care_coordinator'
  | 'support_coordinator_hc'
  | 'community_support_worker'
  // NDIS roles
  | 'ndis_manager'
  | 'support_coordinator_ndis'
  | 'behaviour_support_practitioner'
  | 'support_worker_ndis';

export type FeatureAccess = 'full' | 'read' | 'hidden';
export type DataScope = 'single_facility' | 'portfolio' | 'single_team' | 'aggregate';
export type NotificationType = 'imessage' | 'in_app' | 'both' | 'none';

export interface DomainStrip {
  residential: string[];
  home_care: string[];
  ndis: string[];
}

export interface BriefingConfig {
  morning: {
    enabled: boolean;
    system_prompt_key: string;
    data_inputs: string[];
    max_tokens: number;
    delivery: NotificationType;
  };
  evening: {
    enabled: boolean;
    system_prompt_key: string;
    data_inputs: string[];
    max_tokens: number;
    delivery: NotificationType;
  };
  team?: {
    enabled: boolean;
    system_prompt_key: string;
    data_inputs: string[];
    max_tokens: number;
    delivery: NotificationType;
  };
  leader?: {
    enabled: boolean;
    system_prompt_key: string;
    data_inputs: string[];
    max_tokens: number;
    delivery: NotificationType;
    requires_leader_loop: boolean;
  };
}

export interface CHRISCoachConfig {
  enabled: boolean;
  persona: string;
  model: 'claude-sonnet-4-20250514' | 'claude-opus-4-20250514';
  context_inputs: string[];
  suggested_prompts: Record<string, string[]>;
  escalation_threshold: 'low' | 'medium' | 'high';
}

export interface FinancialView {
  revenue_streams: FeatureAccess;
  care_ratio: FeatureAccess;
  agency_cost: FeatureAccess;
  budget: FeatureAccess;
  rad_liquidity: FeatureAccess;
  oracle_report: FeatureAccess;
  stewartbrown_benchmarks: FeatureAccess;
  qfr_workflow: FeatureAccess;
  penalty_exposure: FeatureAccess;
  wc_financial_risk: FeatureAccess;
  turnover_cost: FeatureAccess;
}

export interface PackReviewPermissions {
  daily_briefing: boolean;
  team_briefing: boolean;
  leader_briefing: boolean;
  clinical_governance: boolean;
  quality_and_risk: boolean;
  whs_committee: boolean;
  people_and_culture: boolean;
  finance_committee: boolean;
  board_pack: boolean;
  elt_pack: boolean;
  clinical_leadership: boolean;
  qfr: boolean;
}

export interface RoleConfig {
  display_name: string;
  data_scope: DataScope;
  home_route: string;
  nav_sections: string[];
  bottom_tabs: string[];
  domain_strip: DomainStrip;
  briefings: BriefingConfig;
  chris_coach: CHRISCoachConfig;
  financial_view: FinancialView;
  pack_review: PackReviewPermissions;
  notification_type: NotificationType;
  features: {
    care_minutes: FeatureAccess;
    sirs_register: FeatureAccess;
    clinical_audits: FeatureAccess;
    quality_indicators: FeatureAccess;
    psh_dashboard: FeatureAccess;
    financial_control_centre: FeatureAccess;
    operations_control_centre: FeatureAccess;
    residents: FeatureAccess;
    workforce: FeatureAccess;
    agent_activity: FeatureAccess;
    operator_dashboard: FeatureAccess;
    queue_management: FeatureAccess;
    corrective_actions: FeatureAccess;
    iso_45003_evidence: FeatureAccess;
    board_pack_reader: FeatureAccess;
  };
  allowed_actions: string[];
  reporting_cycles: string[];
}

export const ROLE_CONFIG: Record<RoleName, RoleConfig> = {

  // ── FACILITY MANAGER ──────────────────────────────────────
  facility_manager: {
    display_name: 'Facility Manager',
    data_scope: 'single_facility',
    home_route: '/dashboard/fm',
    nav_sections: ['operations', 'clinical', 'residents', 'workforce', 'financial', 'governance', 'loops', 'tools'],
    bottom_tabs: ['home', 'queue', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['Clinical', 'Workforce', 'Financial', 'Governance', 'Residents'],
      home_care:   ['Visits', 'Workforce', 'Budget', 'Compliance', 'Clients'],
      ndis:        ['Supports', 'Workforce', 'Plans', 'Quality', 'Participants'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'fm_morning',
        data_inputs: ['care_minutes_today', 'roster_gaps', 'sirs_open', 'corrective_actions_overdue', 'financial_position', 'occupancy', 'compliance_deadlines', 'psh_current', 'residents_attention', 'connector_health'],
        max_tokens: 600,
        delivery: 'both',
      },
      evening: {
        enabled: true,
        system_prompt_key: 'fm_evening',
        data_inputs: ['incidents_today', 'care_minutes_delivered', 'handovers_outstanding', 'tomorrow_roster', 'actions_completed_today', 'actions_outstanding'],
        max_tokens: 500,
        delivery: 'both',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Senior aged care operations advisor. Experienced in facility management, regulatory compliance, workforce leadership, and financial sustainability. Direct, practical, and deeply familiar with the complexity of running a residential aged care facility.',
      model: 'claude-opus-4-20250514',
      context_inputs: ['facility_profile', 'current_cycle_data', 'open_issues', 'financial_position', 'psh_summary'],
      suggested_prompts: {
        '/dashboard/fm': ['What should I focus on this morning?', 'What are my biggest risks this week?', 'Help me prepare for my team huddle'],
        '/dashboard/financial': ['How is our AN-ACC position tracking?', 'Where are we leaving revenue on the table?', 'Help me understand our care ratio'],
      },
      escalation_threshold: 'medium',
    },
    financial_view: {
      revenue_streams: 'full', care_ratio: 'full', agency_cost: 'full', budget: 'read',
      rad_liquidity: 'read', oracle_report: 'full', stewartbrown_benchmarks: 'read',
      qfr_workflow: 'hidden', penalty_exposure: 'full', wc_financial_risk: 'read', turnover_cost: 'read',
    },
    pack_review: {
      daily_briefing: true, team_briefing: true, leader_briefing: true,
      clinical_governance: true, quality_and_risk: true, whs_committee: true, people_and_culture: true,
      finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false,
    },
    notification_type: 'both',
    features: {
      care_minutes: 'full', sirs_register: 'full', clinical_audits: 'full', quality_indicators: 'full',
      psh_dashboard: 'full', financial_control_centre: 'full', operations_control_centre: 'full',
      residents: 'full', workforce: 'full', agent_activity: 'read', operator_dashboard: 'hidden',
      queue_management: 'full', corrective_actions: 'full', iso_45003_evidence: 'read', board_pack_reader: 'hidden',
    },
    allowed_actions: ['approve_briefings', 'approve_sirs_draft', 'approve_audit_report', 'approve_corrective_action', 'approve_complaint_response', 'schedule_clinical_review', 'manage_roster', 'approve_agency_cover'],
    reporting_cycles: ['daily', 'fortnightly', 'monthly', 'quarterly'],
  },

  // ── DIRECTOR OF NURSING ───────────────────────────────────
  don: {
    display_name: 'Director of Nursing',
    data_scope: 'single_facility',
    home_route: '/dashboard/don',
    nav_sections: ['clinical', 'operations', 'residents', 'workforce', 'financial_ops', 'governance', 'loops', 'tools'],
    bottom_tabs: ['home', 'queue', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['Clinical', 'Workforce', 'Operations', 'Governance', 'Residents'],
      home_care:   ['Clinical', 'Visits', 'Workforce', 'Compliance', 'Clients'],
      ndis:        ['Clinical', 'Supports', 'Workforce', 'Quality', 'Participants'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'don_morning',
        data_inputs: ['care_minutes_today', 'rn_coverage_tonight', 'sirs_open', 'corrective_actions_overdue', 'clinical_audits_overdue', 'care_plans_overdue', 'psh_alerts', 'incidents_last_24h', 'qi_data_currency', 'connector_health'],
        max_tokens: 600,
        delivery: 'both',
      },
      evening: {
        enabled: true,
        system_prompt_key: 'don_evening',
        data_inputs: ['care_minutes_delivered_today', 'incidents_today', 'sirs_deadlines_tomorrow', 'tomorrow_rn_coverage', 'handovers_outstanding', 'actions_completed_today'],
        max_tokens: 500,
        delivery: 'both',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Clinical leadership advisor for aged care. Expert in the Aged Care Act 2024, Quality Standards, SIRS obligations, care minutes requirements, and clinical governance. Warm, direct, and deeply experienced in the pressures of DON leadership.',
      model: 'claude-opus-4-20250514',
      context_inputs: ['facility_profile', 'care_minutes_current', 'sirs_open', 'clinical_alerts', 'psh_summary', 'qi_current'],
      suggested_prompts: {
        '/dashboard/don': ['What are my clinical priorities today?', "Talk me through tonight's care minutes risk", 'Help me prepare for a difficult conversation'],
        '/dashboard/sirs': ['Help me draft this SIRS narrative', 'What do I need to include in the corrective action?', 'Walk me through the Cat 1 requirements'],
      },
      escalation_threshold: 'low',
    },
    financial_view: {
      revenue_streams: 'hidden', care_ratio: 'read', agency_cost: 'read', budget: 'hidden',
      rad_liquidity: 'hidden', oracle_report: 'read', stewartbrown_benchmarks: 'hidden',
      qfr_workflow: 'hidden', penalty_exposure: 'read', wc_financial_risk: 'hidden', turnover_cost: 'hidden',
    },
    pack_review: {
      daily_briefing: true, team_briefing: false, leader_briefing: false,
      clinical_governance: true, quality_and_risk: true, whs_committee: false, people_and_culture: false,
      finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: true, qfr: false,
    },
    notification_type: 'both',
    features: {
      care_minutes: 'full', sirs_register: 'full', clinical_audits: 'full', quality_indicators: 'full',
      psh_dashboard: 'read', financial_control_centre: 'read', operations_control_centre: 'full',
      residents: 'full', workforce: 'read', agent_activity: 'read', operator_dashboard: 'hidden',
      queue_management: 'full', corrective_actions: 'full', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden',
    },
    allowed_actions: ['approve_sirs_draft', 'submit_sirs_notification', 'approve_audit_report', 'approve_corrective_action', 'approve_care_plan_review', 'approve_complaint_response', 'request_agency_cover'],
    reporting_cycles: ['daily', 'fortnightly', 'monthly', 'quarterly'],
  },

  // ── CEO ───────────────────────────────────────────────────
  ceo: {
    display_name: 'Chief Executive Officer',
    data_scope: 'portfolio',
    home_route: '/dashboard/ceo',
    nav_sections: ['portfolio', 'financial', 'governance', 'workforce', 'compliance', 'tools'],
    bottom_tabs: ['home', 'portfolio', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['Portfolio', 'Financial', 'Workforce', 'Compliance', 'Governance'],
      home_care:   ['Portfolio', 'Budget', 'Workforce', 'Compliance', 'Governance'],
      ndis:        ['Portfolio', 'Plans', 'Workforce', 'Quality', 'Governance'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'ceo_morning',
        data_inputs: ['portfolio_facility_scorecard', 'facilities_requiring_attention', 'significant_compliance_events', 'financial_position_portfolio', 'workforce_signals_portfolio', 'oracle_weekly_summary'],
        max_tokens: 600,
        delivery: 'both',
      },
      evening: {
        enabled: true,
        system_prompt_key: 'ceo_evening',
        data_inputs: ['significant_events_today', 'facilities_at_risk', 'tomorrow_priorities'],
        max_tokens: 400,
        delivery: 'in_app',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Strategic aged care advisor. Expert in sector strategy, regulatory environment, financial sustainability, board governance, and portfolio leadership. Thinks at the system level and helps CEOs navigate the complexity of multi-site aged care operations.',
      model: 'claude-opus-4-20250514',
      context_inputs: ['portfolio_summary', 'financial_position_portfolio', 'compliance_events', 'workforce_signals'],
      suggested_prompts: {
        '/dashboard/ceo': ['Which facilities need my attention this week?', 'Give me a portfolio risk summary', 'Help me prepare for the board meeting'],
      },
      escalation_threshold: 'high',
    },
    financial_view: {
      revenue_streams: 'read', care_ratio: 'read', agency_cost: 'read', budget: 'read',
      rad_liquidity: 'read', oracle_report: 'read', stewartbrown_benchmarks: 'read',
      qfr_workflow: 'hidden', penalty_exposure: 'read', wc_financial_risk: 'read', turnover_cost: 'read',
    },
    pack_review: {
      daily_briefing: false, team_briefing: false, leader_briefing: false,
      clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false,
      finance_committee: false, board_pack: true, elt_pack: true, clinical_leadership: false, qfr: false,
    },
    notification_type: 'both',
    features: {
      care_minutes: 'read', sirs_register: 'read', clinical_audits: 'read', quality_indicators: 'read',
      psh_dashboard: 'read', financial_control_centre: 'read', operations_control_centre: 'hidden',
      residents: 'read', workforce: 'read', agent_activity: 'read', operator_dashboard: 'hidden',
      queue_management: 'read', corrective_actions: 'read', iso_45003_evidence: 'hidden', board_pack_reader: 'full',
    },
    allowed_actions: ['approve_board_pack', 'approve_elt_pack'],
    reporting_cycles: ['weekly', 'monthly', 'quarterly', 'annual'],
  },

  // ── CFO ───────────────────────────────────────────────────
  cfo: {
    display_name: 'Chief Financial Officer',
    data_scope: 'portfolio',
    home_route: '/dashboard/cfo',
    nav_sections: ['financial', 'portfolio', 'governance', 'compliance', 'tools'],
    bottom_tabs: ['home', 'revenue', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['Revenue', 'Care Ratio', 'Accommodation', 'Benchmarks', 'Reporting'],
      home_care:   ['Budget', 'Care Management', 'Unspent Funds', 'Benchmarks', 'Reporting'],
      ndis:        ['Plan Budgets', 'Claiming', 'Benchmarks', 'Reporting', 'Compliance'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'cfo_morning',
        data_inputs: ['revenue_position_portfolio', 'an_acc_flags', 'occupancy_portfolio', 'oracle_weekly_report', 'rad_liquidity', 'qfr_deadlines', 'agency_cost_portfolio'],
        max_tokens: 600,
        delivery: 'both',
      },
      evening: {
        enabled: true,
        system_prompt_key: 'cfo_evening',
        data_inputs: ['financial_events_today', 'reporting_deadlines_tomorrow', 'oracle_flags_outstanding'],
        max_tokens: 400,
        delivery: 'in_app',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Aged care financial advisor. Expert in AN-ACC funding, accommodation pricing, RAD/DAP management, QFR and ACFR obligations, and StewartBrown benchmarking. Deeply familiar with the financial pressures facing residential aged care providers.',
      model: 'claude-opus-4-20250514',
      context_inputs: ['financial_position_portfolio', 'oracle_weekly_report', 'rad_liquidity', 'stewartbrown_benchmarks'],
      suggested_prompts: {
        '/dashboard/cfo': ['Walk me through our AN-ACC position', 'Where are we against StewartBrown benchmarks?', 'Help me understand our RAD liquidity risk'],
        '/dashboard/financial/revenue': ['What is the Oracle finding this week?', 'How is our accommodation revenue tracking?', 'Which facilities have the biggest AN-ACC gaps?'],
      },
      escalation_threshold: 'high',
    },
    financial_view: {
      revenue_streams: 'full', care_ratio: 'full', agency_cost: 'full', budget: 'full',
      rad_liquidity: 'full', oracle_report: 'full', stewartbrown_benchmarks: 'full',
      qfr_workflow: 'full', penalty_exposure: 'read', wc_financial_risk: 'read', turnover_cost: 'read',
    },
    pack_review: {
      daily_briefing: false, team_briefing: false, leader_briefing: false,
      clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false,
      finance_committee: true, board_pack: false, elt_pack: true, clinical_leadership: false, qfr: true,
    },
    notification_type: 'both',
    features: {
      care_minutes: 'read', sirs_register: 'read', clinical_audits: 'hidden', quality_indicators: 'read',
      psh_dashboard: 'hidden', financial_control_centre: 'full', operations_control_centre: 'hidden',
      residents: 'read', workforce: 'read', agent_activity: 'read', operator_dashboard: 'hidden',
      queue_management: 'read', corrective_actions: 'read', iso_45003_evidence: 'hidden', board_pack_reader: 'read',
    },
    allowed_actions: ['approve_qfr', 'approve_finance_pack', 'approve_elt_pack'],
    reporting_cycles: ['monthly', 'quarterly', 'annual'],
  },

  // ── CLINICAL DIRECTOR ─────────────────────────────────────
  clinical_director: {
    display_name: 'Clinical Director',
    data_scope: 'portfolio',
    home_route: '/dashboard/clinical-director',
    nav_sections: ['clinical', 'quality', 'residents', 'workforce', 'tools'],
    bottom_tabs: ['home', 'clinical', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['AN-ACC', 'Care Minutes', 'Quality Indicators', 'Clinical Audits', 'Residents'],
      home_care:   ['Clinical', 'Care Plans', 'Quality', 'Clients', 'Workforce'],
      ndis:        ['Clinical', 'Supports', 'Quality', 'Participants', 'Workforce'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'clinical_director_morning',
        data_inputs: ['an_acc_portfolio_health', 'care_minutes_portfolio', 'qi_portfolio', 'clinical_audits_portfolio', 'oracle_annacc_flags', 'sirs_portfolio'],
        max_tokens: 600,
        delivery: 'both',
      },
      evening: {
        enabled: true,
        system_prompt_key: 'clinical_director_evening',
        data_inputs: ['clinical_events_today', 'annacc_reassessment_upcoming'],
        max_tokens: 400,
        delivery: 'in_app',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Senior clinical aged care advisor. Expert in AN-ACC assessment and classification, care minutes requirements, Quality Standards, QI program, and clinical governance across multi-site residential aged care.',
      model: 'claude-opus-4-20250514',
      context_inputs: ['an_acc_portfolio', 'care_minutes_portfolio', 'qi_portfolio', 'clinical_alerts'],
      suggested_prompts: {
        '/dashboard/clinical-director': ['Which facilities have AN-ACC gaps?', 'Walk me through the care minutes position', 'What QI trends should I be watching?'],
      },
      escalation_threshold: 'medium',
    },
    financial_view: {
      revenue_streams: 'hidden', care_ratio: 'read', agency_cost: 'hidden', budget: 'hidden',
      rad_liquidity: 'hidden', oracle_report: 'read', stewartbrown_benchmarks: 'hidden',
      qfr_workflow: 'hidden', penalty_exposure: 'read', wc_financial_risk: 'hidden', turnover_cost: 'hidden',
    },
    pack_review: {
      daily_briefing: false, team_briefing: false, leader_briefing: false,
      clinical_governance: true, quality_and_risk: false, whs_committee: false, people_and_culture: false,
      finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: true, qfr: false,
    },
    notification_type: 'both',
    features: {
      care_minutes: 'full', sirs_register: 'read', clinical_audits: 'full', quality_indicators: 'full',
      psh_dashboard: 'read', financial_control_centre: 'hidden', operations_control_centre: 'hidden',
      residents: 'full', workforce: 'read', agent_activity: 'read', operator_dashboard: 'hidden',
      queue_management: 'read', corrective_actions: 'read', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden',
    },
    allowed_actions: ['approve_clinical_governance_pack', 'approve_clinical_leadership_pack', 'request_annacc_reassessment'],
    reporting_cycles: ['monthly', 'quarterly'],
  },

  // ── QUALITY LEAD ──────────────────────────────────────────
  quality_lead: {
    display_name: 'Quality and Risk Lead',
    data_scope: 'single_facility',
    home_route: '/dashboard/quality',
    nav_sections: ['compliance', 'quality', 'governance', 'residents', 'tools'],
    bottom_tabs: ['home', 'sirs', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['SIRS', 'Quality Indicators', 'Audits', 'Corrective Actions', 'Compliance'],
      home_care:   ['Incidents', 'Quality', 'Audits', 'Corrective Actions', 'Compliance'],
      ndis:        ['Incidents', 'Practice Standards', 'Audits', 'Corrective Actions', 'Compliance'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'quality_lead_morning',
        data_inputs: ['sirs_open', 'sirs_deadlines_7d', 'corrective_actions_overdue', 'audits_overdue', 'qi_currency', 'compliance_register', 'complaints_open'],
        max_tokens: 600,
        delivery: 'both',
      },
      evening: {
        enabled: true,
        system_prompt_key: 'quality_lead_evening',
        data_inputs: ['compliance_events_today', 'sirs_deadlines_tomorrow', 'chronicler_drafts_awaiting'],
        max_tokens: 400,
        delivery: 'in_app',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Aged care compliance and quality advisor. Expert in SIRS, Quality Standards, QI program, corrective action management, ACQSC audit preparation, and complaint resolution. Precise, practical, and regulatory-fluent.',
      model: 'claude-sonnet-4-20250514',
      context_inputs: ['sirs_open', 'compliance_register', 'corrective_actions', 'qi_current', 'audit_schedule'],
      suggested_prompts: {
        '/dashboard/quality': ['What are my compliance priorities today?', 'Walk me through the SIRS deadlines this week', 'Help me review this corrective action plan'],
        '/dashboard/sirs': ['Help me draft this SIRS response', 'What evidence do I need for this corrective action?', 'Walk me through the Cat 2 requirements'],
      },
      escalation_threshold: 'low',
    },
    financial_view: {
      revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'hidden',
      rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden',
      qfr_workflow: 'hidden', penalty_exposure: 'full', wc_financial_risk: 'hidden', turnover_cost: 'hidden',
    },
    pack_review: {
      daily_briefing: false, team_briefing: false, leader_briefing: false,
      clinical_governance: false, quality_and_risk: true, whs_committee: false, people_and_culture: false,
      finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false,
    },
    notification_type: 'both',
    features: {
      care_minutes: 'read', sirs_register: 'full', clinical_audits: 'full', quality_indicators: 'full',
      psh_dashboard: 'read', financial_control_centre: 'hidden', operations_control_centre: 'hidden',
      residents: 'read', workforce: 'hidden', agent_activity: 'read', operator_dashboard: 'hidden',
      queue_management: 'full', corrective_actions: 'full', iso_45003_evidence: 'read', board_pack_reader: 'hidden',
    },
    allowed_actions: ['approve_sirs_draft', 'submit_sirs_notification', 'approve_audit_report', 'approve_corrective_action', 'approve_complaint_response', 'approve_quality_risk_pack'],
    reporting_cycles: ['daily', 'monthly', 'quarterly'],
  },

  // ── WHS LEAD ──────────────────────────────────────────────
  whs_lead: {
    display_name: 'WHS Lead',
    data_scope: 'single_facility',
    home_route: '/dashboard/whs',
    nav_sections: ['psh', 'whs', 'compliance', 'workforce', 'tools'],
    bottom_tabs: ['home', 'psh', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['PSH Hazards', 'Incidents', 'ISO 45003', 'WC Risk', 'Corrective Actions'],
      home_care:   ['PSH Hazards', 'Lone Worker', 'Incidents', 'ISO 45003', 'Corrective Actions'],
      ndis:        ['PSH Hazards', 'Incidents', 'ISO 45003', 'WC Risk', 'Corrective Actions'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'whs_lead_morning',
        data_inputs: ['psh_current_cycle', 'psh_convergence_events', 'incidents_whs_open', 'wc_risk_signals', 'iso_45003_evidence_currency', 'corrective_actions_whs'],
        max_tokens: 500,
        delivery: 'both',
      },
      evening: {
        enabled: true,
        system_prompt_key: 'whs_lead_evening',
        data_inputs: ['whs_events_today', 'psh_alerts', 'iso_45003_updates'],
        max_tokens: 400,
        delivery: 'in_app',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Psychosocial safety and WHS advisor for aged care. Expert in ISO 45003:2021, the 16 PSH hazard domains, WHS Regulation 2025, worker consultation obligations, and workers compensation risk management. Evidence-focused and practically minded.',
      model: 'claude-sonnet-4-20250514',
      context_inputs: ['psh_current', 'psh_history', 'whs_incidents', 'iso_45003_evidence', 'wc_claims'],
      suggested_prompts: {
        '/dashboard/whs': ['What are our highest PSH risks this cycle?', 'Is our ISO 45003 evidence up to date?', 'Walk me through the WC risk signals'],
        '/dashboard/psh': ['Explain this convergence event to me', 'What intervention should I recommend?', 'Help me document this consultation'],
      },
      escalation_threshold: 'medium',
    },
    financial_view: {
      revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'hidden',
      rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden',
      qfr_workflow: 'hidden', penalty_exposure: 'hidden', wc_financial_risk: 'full', turnover_cost: 'hidden',
    },
    pack_review: {
      daily_briefing: false, team_briefing: false, leader_briefing: false,
      clinical_governance: false, quality_and_risk: false, whs_committee: true, people_and_culture: false,
      finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false,
    },
    notification_type: 'both',
    features: {
      care_minutes: 'hidden', sirs_register: 'read', clinical_audits: 'hidden', quality_indicators: 'hidden',
      psh_dashboard: 'full', financial_control_centre: 'hidden', operations_control_centre: 'hidden',
      residents: 'hidden', workforce: 'read', agent_activity: 'read', operator_dashboard: 'hidden',
      queue_management: 'full', corrective_actions: 'full', iso_45003_evidence: 'full', board_pack_reader: 'hidden',
    },
    allowed_actions: ['approve_whs_pack', 'approve_iso_45003_evidence', 'approve_whs_corrective_action'],
    reporting_cycles: ['fortnightly', 'monthly', 'quarterly'],
  },

  // ── HR MANAGER ────────────────────────────────────────────
  hr_manager: {
    display_name: 'HR Manager',
    data_scope: 'portfolio',
    home_route: '/dashboard/hr',
    nav_sections: ['workforce', 'financial_ops', 'loops', 'compliance', 'governance', 'tools'],
    bottom_tabs: ['home', 'workforce', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['Turnover Risk', 'Composition', 'Training', 'Award Compliance', 'Recruitment'],
      home_care:   ['Turnover Risk', 'Lone Worker', 'Training', 'Award Compliance', 'Recruitment'],
      ndis:        ['Turnover Risk', 'Worker Screening', 'Training', 'Award Compliance', 'Recruitment'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'hr_morning',
        data_inputs: ['keeper_weekly_report', 'turnover_precursors_portfolio', 'credential_expiry_30d', 'training_compliance_portfolio', 'composition_drift_alerts', 'award_compliance_flags'],
        max_tokens: 500,
        delivery: 'both',
      },
      evening: {
        enabled: true,
        system_prompt_key: 'hr_evening',
        data_inputs: ['workforce_events_today', 'credential_expiry_alerts'],
        max_tokens: 400,
        delivery: 'in_app',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Aged care HR advisor. Expert in workforce planning, the Aged Care Award, credential management, turnover prediction and prevention, psychosocial safety, and people and culture strategy for multi-site residential aged care.',
      model: 'claude-sonnet-4-20250514',
      context_inputs: ['keeper_report', 'workforce_composition', 'credential_register', 'training_compliance'],
      suggested_prompts: {
        '/dashboard/hr': ['Which teams are at turnover risk?', 'Walk me through the credential expiry outlook', 'Where is our composition drift most significant?'],
      },
      escalation_threshold: 'medium',
    },
    financial_view: {
      revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'read', budget: 'hidden',
      rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden',
      qfr_workflow: 'hidden', penalty_exposure: 'hidden', wc_financial_risk: 'read', turnover_cost: 'full',
    },
    pack_review: {
      daily_briefing: false, team_briefing: false, leader_briefing: false,
      clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: true,
      finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false,
    },
    notification_type: 'both',
    features: {
      care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'hidden', quality_indicators: 'hidden',
      psh_dashboard: 'read', financial_control_centre: 'hidden', operations_control_centre: 'hidden',
      residents: 'hidden', workforce: 'full', agent_activity: 'read', operator_dashboard: 'hidden',
      queue_management: 'read', corrective_actions: 'read', iso_45003_evidence: 'read', board_pack_reader: 'hidden',
    },
    allowed_actions: ['approve_people_culture_pack'],
    reporting_cycles: ['fortnightly', 'monthly', 'quarterly'],
  },

  // ── BOARD MEMBER ──────────────────────────────────────────
  board_member: {
    display_name: 'Board Member',
    data_scope: 'aggregate',
    home_route: '/dashboard/board',
    nav_sections: ['governance', 'financial', 'compliance', 'tools'],
    bottom_tabs: ['home', 'pack', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['EBITDA', 'Prudential', 'Compliance', 'Star Rating', 'Quality'],
      home_care:   ['Financial', 'Compliance', 'Quality', 'Governance'],
      ndis:        ['Financial', 'Compliance', 'Quality', 'Governance'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'board_morning',
        data_inputs: ['significant_compliance_events', 'financial_position_aggregate', 'star_rating_position'],
        max_tokens: 300,
        delivery: 'in_app',
      },
      evening: {
        enabled: false,
        system_prompt_key: 'board_evening',
        data_inputs: [],
        max_tokens: 200,
        delivery: 'none',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Aged care board governance advisor. Expert in aged care board obligations, prudential standards, EBITDA sustainability, regulatory compliance at the governance level, and director duties under the Aged Care Act 2024.',
      model: 'claude-sonnet-4-20250514',
      context_inputs: ['board_pack_summary', 'financial_position_aggregate', 'significant_events'],
      suggested_prompts: {
        '/dashboard/board': ['Summarise the current compliance position', 'Walk me through the financial sustainability indicators', 'What should I be asking management about?'],
      },
      escalation_threshold: 'high',
    },
    financial_view: {
      revenue_streams: 'read', care_ratio: 'read', agency_cost: 'read', budget: 'read',
      rad_liquidity: 'read', oracle_report: 'hidden', stewartbrown_benchmarks: 'read',
      qfr_workflow: 'hidden', penalty_exposure: 'read', wc_financial_risk: 'read', turnover_cost: 'read',
    },
    pack_review: {
      daily_briefing: false, team_briefing: false, leader_briefing: false,
      clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false,
      finance_committee: false, board_pack: true, elt_pack: false, clinical_leadership: false, qfr: false,
    },
    notification_type: 'in_app',
    features: {
      care_minutes: 'read', sirs_register: 'read', clinical_audits: 'hidden', quality_indicators: 'read',
      psh_dashboard: 'hidden', financial_control_centre: 'read', operations_control_centre: 'hidden',
      residents: 'hidden', workforce: 'hidden', agent_activity: 'hidden', operator_dashboard: 'hidden',
      queue_management: 'hidden', corrective_actions: 'hidden', iso_45003_evidence: 'hidden', board_pack_reader: 'full',
    },
    allowed_actions: [],
    reporting_cycles: ['quarterly', 'annual'],
  },

  // ── TEAM LEADER ───────────────────────────────────────────
  team_leader: {
    display_name: 'Team Leader',
    data_scope: 'single_team',
    home_route: '/dashboard/team-leader',
    nav_sections: ['team', 'loops', 'tools'],
    bottom_tabs: ['home', 'team', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['My Team', 'Pulse', 'Practice', 'Briefing', 'Coach'],
      home_care:   ['My Team', 'Pulse', 'Practice', 'Briefing', 'Coach'],
      ndis:        ['My Team', 'Pulse', 'Practice', 'Briefing', 'Coach'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'team_leader_morning',
        data_inputs: ['team_roster_today', 'team_psh_current', 'shift_context', 'handover_items_for_team'],
        max_tokens: 400,
        delivery: 'both',
      },
      evening: {
        enabled: true,
        system_prompt_key: 'team_leader_evening',
        data_inputs: ['team_events_today', 'tomorrow_shift_context'],
        max_tokens: 300,
        delivery: 'in_app',
      },
      team: {
        enabled: true,
        system_prompt_key: 'team_leader_team_briefing',
        data_inputs: ['team_pulse_cycle_results', 'team_psh_domain_scores', 'selected_micro_practice', 'practice_rationale', 'prior_practice_outcome', 'team_wellbeing_signals'],
        max_tokens: 800,
        delivery: 'both',
      },
      leader: {
        enabled: true,
        system_prompt_key: 'team_leader_leader_briefing',
        data_inputs: ['leader_loop_progress', 'prior_practice_reflection', 'coaching_focus_this_cycle', 'team_signals_for_leader', 'genos_ei_context'],
        max_tokens: 600,
        delivery: 'both',
        requires_leader_loop: true,
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Supportive leadership coach for frontline aged care team leaders. Warm, practical, and grounded in the reality of leading a care team. Expert in the Genos EI framework, psychosocial safety, difficult conversations, and the day-to-day challenges of aged care team leadership.',
      model: 'claude-opus-4-20250514',
      context_inputs: ['team_profile', 'team_pulse_current', 'team_psh_history', 'leader_loop_status', 'genos_ei_profile'],
      suggested_prompts: {
        '/dashboard/team-leader': ['How is my team doing this cycle?', 'Help me prepare for my huddle', 'I have a difficult situation with a team member'],
        '/dashboard/team-leader/briefing': ['Help me understand this practice', 'How do I introduce this to my team?', 'What worked well last fortnight?'],
      },
      escalation_threshold: 'low',
    },
    financial_view: {
      revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'hidden',
      rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden',
      qfr_workflow: 'hidden', penalty_exposure: 'hidden', wc_financial_risk: 'hidden', turnover_cost: 'hidden',
    },
    pack_review: {
      daily_briefing: false, team_briefing: true, leader_briefing: true,
      clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false,
      finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false,
    },
    notification_type: 'imessage',
    features: {
      care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'hidden', quality_indicators: 'hidden',
      psh_dashboard: 'read', financial_control_centre: 'hidden', operations_control_centre: 'hidden',
      residents: 'hidden', workforce: 'hidden', agent_activity: 'hidden', operator_dashboard: 'hidden',
      queue_management: 'hidden', corrective_actions: 'hidden', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden',
    },
    allowed_actions: ['complete_pulse_response', 'submit_huddle_notes', 'complete_leader_loop_reflection'],
    reporting_cycles: ['fortnightly'],
  },

  // ── FRONTLINE STAFF ───────────────────────────────────────
  frontline_staff: {
    display_name: 'Care Team Member',
    data_scope: 'single_team',
    home_route: '/dashboard/staff',
    nav_sections: ['pulse', 'coach'],
    bottom_tabs: ['home', 'pulse', 'coach'],
    domain_strip: {
      residential: ['Pulse', 'Coach'],
      home_care:   ['Pulse', 'Coach'],
      ndis:        ['Pulse', 'Coach'],
    },
    briefings: {
      morning: {
        enabled: false, system_prompt_key: 'staff_morning', data_inputs: [], max_tokens: 200, delivery: 'none',
      },
      evening: {
        enabled: false, system_prompt_key: 'staff_evening', data_inputs: [], max_tokens: 200, delivery: 'none',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Supportive wellbeing companion for aged care workers. Warm, non-clinical, and focused on the person. Available to listen, help with difficult moments at work, and connect to support if needed.',
      model: 'claude-sonnet-4-20250514',
      context_inputs: ['pulse_response_history'],
      suggested_prompts: {
        '/dashboard/staff': ['I had a tough shift today', 'How do I handle a difficult resident?', 'I need to talk to someone'],
      },
      escalation_threshold: 'low',
    },
    financial_view: {
      revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'hidden',
      rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden',
      qfr_workflow: 'hidden', penalty_exposure: 'hidden', wc_financial_risk: 'hidden', turnover_cost: 'hidden',
    },
    pack_review: {
      daily_briefing: false, team_briefing: false, leader_briefing: false,
      clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false,
      finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false,
    },
    notification_type: 'imessage',
    features: {
      care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'hidden', quality_indicators: 'hidden',
      psh_dashboard: 'hidden', financial_control_centre: 'hidden', operations_control_centre: 'hidden',
      residents: 'hidden', workforce: 'hidden', agent_activity: 'hidden', operator_dashboard: 'hidden',
      queue_management: 'hidden', corrective_actions: 'hidden', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden',
    },
    allowed_actions: ['complete_pulse_response'],
    reporting_cycles: ['fortnightly'],
  },

  // ── ELT MEMBER ───────────────────────────────────────────
  elt_member: {
    display_name: 'ELT Member',
    data_scope: 'portfolio',
    home_route: '/dashboard/elt',
    nav_sections: ['portfolio', 'financial', 'governance', 'compliance', 'tools'],
    bottom_tabs: ['home', 'portfolio', 'coach', 'briefing', 'more'],
    domain_strip: {
      residential: ['Portfolio', 'Compliance', 'Workforce', 'Financial', 'Governance'],
      home_care:   ['Portfolio', 'Compliance', 'Workforce', 'Budget', 'Governance'],
      ndis:        ['Portfolio', 'Compliance', 'Workforce', 'Plans', 'Governance'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'elt_morning',
        data_inputs: ['portfolio_summary', 'significant_events', 'domain_specific_signals'],
        max_tokens: 500,
        delivery: 'both',
      },
      evening: {
        enabled: true,
        system_prompt_key: 'elt_evening',
        data_inputs: ['significant_events_today', 'tomorrow_priorities'],
        max_tokens: 300,
        delivery: 'in_app',
      },
    },
    chris_coach: {
      enabled: true,
      persona: 'Senior aged care executive advisor. Broad strategic and operational perspective across all domains.',
      model: 'claude-sonnet-4-20250514',
      context_inputs: ['portfolio_summary', 'domain_signals'],
      suggested_prompts: {
        '/dashboard/elt': ['What needs my attention this week?', 'Give me a portfolio summary'],
      },
      escalation_threshold: 'high',
    },
    financial_view: {
      revenue_streams: 'read', care_ratio: 'read', agency_cost: 'read', budget: 'read',
      rad_liquidity: 'read', oracle_report: 'read', stewartbrown_benchmarks: 'read',
      qfr_workflow: 'hidden', penalty_exposure: 'read', wc_financial_risk: 'read', turnover_cost: 'read',
    },
    pack_review: {
      daily_briefing: false, team_briefing: false, leader_briefing: false,
      clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false,
      finance_committee: false, board_pack: false, elt_pack: true, clinical_leadership: false, qfr: false,
    },
    notification_type: 'both',
    features: {
      care_minutes: 'read', sirs_register: 'read', clinical_audits: 'read', quality_indicators: 'read',
      psh_dashboard: 'read', financial_control_centre: 'read', operations_control_centre: 'hidden',
      residents: 'read', workforce: 'read', agent_activity: 'read', operator_dashboard: 'hidden',
      queue_management: 'read', corrective_actions: 'read', iso_45003_evidence: 'hidden', board_pack_reader: 'read',
    },
    allowed_actions: ['approve_elt_pack'],
    reporting_cycles: ['monthly', 'quarterly'],
  },

  // ── OPERATOR ─────────────────────────────────────────────
  operator: {
    display_name: 'CHRIS Operator',
    data_scope: 'portfolio',
    home_route: '/dashboard/operator',
    nav_sections: ['operator', 'providers', 'agents', 'connectors'],
    bottom_tabs: ['home', 'agents', 'providers', 'settings'],
    domain_strip: {
      residential: ['Providers', 'Agents', 'Connectors', 'Costs', 'Health'],
      home_care:   ['Providers', 'Agents', 'Connectors', 'Costs', 'Health'],
      ndis:        ['Providers', 'Agents', 'Connectors', 'Costs', 'Health'],
    },
    briefings: {
      morning: {
        enabled: true,
        system_prompt_key: 'operator_morning',
        data_inputs: ['agent_health_all_providers', 'connector_health_all_providers', 'api_cost_yesterday', 'errors_last_24h', 'providers_requiring_attention'],
        max_tokens: 400,
        delivery: 'in_app',
      },
      evening: {
        enabled: false, system_prompt_key: 'operator_evening', data_inputs: [], max_tokens: 200, delivery: 'none',
      },
    },
    chris_coach: {
      enabled: false,
      persona: '',
      model: 'claude-sonnet-4-20250514',
      context_inputs: [],
      suggested_prompts: {},
      escalation_threshold: 'high',
    },
    financial_view: {
      revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'hidden',
      rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden',
      qfr_workflow: 'hidden', penalty_exposure: 'hidden', wc_financial_risk: 'hidden', turnover_cost: 'hidden',
    },
    pack_review: {
      daily_briefing: false, team_briefing: false, leader_briefing: false,
      clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false,
      finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false,
    },
    notification_type: 'in_app',
    features: {
      care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'hidden', quality_indicators: 'hidden',
      psh_dashboard: 'hidden', financial_control_centre: 'hidden', operations_control_centre: 'hidden',
      residents: 'hidden', workforce: 'hidden', agent_activity: 'full', operator_dashboard: 'full',
      queue_management: 'hidden', corrective_actions: 'hidden', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden',
    },
    allowed_actions: ['manage_providers', 'manage_connectors', 'view_api_costs', 'view_agent_health', 'configure_feature_flags'],
    reporting_cycles: ['daily'],
  },

  // ══════════════════════════════════════════════════════════════
  // HOME CARE ROLES
  // ══════════════════════════════════════════════════════════════

  // ── HOME CARE MANAGER ─────────────────────────────────────
  home_care_manager: {
    display_name: 'Home Care Manager',
    data_scope: 'single_facility',
    home_route: '/dashboard/home-care',
    nav_sections: ['hc_overview', 'care_management', 'clients', 'budget_management', 'hc_workforce', 'hc_financial', 'hc_compliance', 'loops', 'hc_tools'],
    bottom_tabs: ['home', 'queue', 'coach', 'briefing', 'more'],
    domain_strip: { residential: [], home_care: ['Visits', 'Workforce', 'Budget', 'Compliance', 'Clients'], ndis: [] },
    briefings: {
      morning: { enabled: true, system_prompt_key: 'hc_manager_morning', data_inputs: ['visit_schedule_today', 'missed_visits_yesterday', 'lone_worker_status', 'budget_utilisation_summary', 'claiming_deadline', 'incidents_open', 'worker_screening_expiry', 'connector_health'], max_tokens: 600, delivery: 'both' },
      evening: { enabled: true, system_prompt_key: 'hc_manager_evening', data_inputs: ['visits_completed_today', 'missed_visits_today', 'incidents_today', 'tomorrow_visit_schedule', 'budget_position_today'], max_tokens: 500, delivery: 'both' },
    },
    chris_coach: {
      enabled: true,
      persona: 'Senior home care operations advisor. Expert in the Support at Home program, individual client budgets, visit compliance, lone worker safety, workforce scheduling, and DSS reporting obligations. Practical and direct.',
      model: 'claude-opus-4-20250514',
      context_inputs: ['service_profile', 'client_budget_summary', 'visit_compliance_rate', 'workforce_composition', 'claiming_position'],
      suggested_prompts: { '/dashboard/hc-manager': ['What needs my attention this morning?', 'How is our budget utilisation tracking?', 'Walk me through our visit compliance rate'] },
      escalation_threshold: 'medium',
    },
    financial_view: { revenue_streams: 'full', care_ratio: 'hidden', agency_cost: 'read', budget: 'full', rad_liquidity: 'hidden', oracle_report: 'full', stewartbrown_benchmarks: 'hidden', qfr_workflow: 'hidden', penalty_exposure: 'read', wc_financial_risk: 'read', turnover_cost: 'read' },
    pack_review: { daily_briefing: true, team_briefing: true, leader_briefing: true, clinical_governance: false, quality_and_risk: true, whs_committee: true, people_and_culture: true, finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false },
    notification_type: 'both',
    features: { care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'read', quality_indicators: 'hidden', psh_dashboard: 'full', financial_control_centre: 'full', operations_control_centre: 'hidden', residents: 'full', workforce: 'full', agent_activity: 'read', operator_dashboard: 'hidden', queue_management: 'full', corrective_actions: 'full', iso_45003_evidence: 'read', board_pack_reader: 'hidden' },
    allowed_actions: ['approve_incident_report', 'approve_complaint_response', 'approve_corrective_action', 'approve_monthly_claim', 'approve_care_plan_review', 'manage_visit_schedule', 'approve_agency_cover'],
    reporting_cycles: ['daily', 'monthly'],
  },

  // ── CARE COORDINATOR ──────────────────────────────────────
  care_coordinator: {
    display_name: 'Care Coordinator',
    data_scope: 'single_facility',
    home_route: '/dashboard/care-coordinator',
    nav_sections: ['care_management', 'clients', 'workforce', 'compliance', 'lone_worker'],
    bottom_tabs: ['home', 'queue', 'coach', 'briefing', 'more'],
    domain_strip: { residential: [], home_care: ['Visits', 'Clients', 'Workforce', 'Compliance', 'Budget'], ndis: [] },
    briefings: {
      morning: { enabled: true, system_prompt_key: 'care_coordinator_morning', data_inputs: ['visit_schedule_today', 'worker_availability_today', 'lone_worker_checkins_due', 'client_alerts', 'incidents_open', 'care_plans_overdue_review', 'budget_flags_clients'], max_tokens: 600, delivery: 'both' },
      evening: { enabled: true, system_prompt_key: 'care_coordinator_evening', data_inputs: ['visits_completed_today', 'missed_visits_today', 'incidents_today', 'lone_worker_checkins_outstanding', 'tomorrow_schedule_gaps'], max_tokens: 500, delivery: 'both' },
    },
    chris_coach: {
      enabled: true,
      persona: 'Home care coordination advisor. Expert in visit scheduling, client budget management, worker-client matching, lone worker safety, Support at Home program obligations, and care plan management. Warm and practical.',
      model: 'claude-opus-4-20250514',
      context_inputs: ['visit_schedule_current', 'client_budget_flags', 'lone_worker_status', 'worker_availability', 'care_plans_status'],
      suggested_prompts: { '/dashboard/care-coordinator': ['Which clients need attention today?', 'Are there any lone worker check-in issues?', "Walk me through tomorrow's schedule gaps"] },
      escalation_threshold: 'low',
    },
    financial_view: { revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'read', rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden', qfr_workflow: 'hidden', penalty_exposure: 'read', wc_financial_risk: 'hidden', turnover_cost: 'hidden' },
    pack_review: { daily_briefing: true, team_briefing: false, leader_briefing: false, clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false, finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false },
    notification_type: 'both',
    features: { care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'hidden', quality_indicators: 'hidden', psh_dashboard: 'read', financial_control_centre: 'hidden', operations_control_centre: 'hidden', residents: 'full', workforce: 'read', agent_activity: 'read', operator_dashboard: 'hidden', queue_management: 'full', corrective_actions: 'read', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden' },
    allowed_actions: ['approve_incident_report', 'schedule_visit', 'reschedule_visit', 'approve_care_plan_review', 'assign_worker_to_client', 'lone_worker_checkin_override'],
    reporting_cycles: ['daily', 'monthly'],
  },

  // ── SUPPORT COORDINATOR (HOME CARE) ────────────────────────
  support_coordinator_hc: {
    display_name: 'Support Coordinator',
    data_scope: 'single_facility',
    home_route: '/dashboard/support-coordinator-hc',
    nav_sections: ['clients', 'budget_management', 'compliance'],
    bottom_tabs: ['home', 'clients', 'coach', 'briefing', 'more'],
    domain_strip: { residential: [], home_care: ['Clients', 'Budget', 'Plans', 'Compliance', 'Reports'], ndis: [] },
    briefings: {
      morning: { enabled: true, system_prompt_key: 'support_coordinator_hc_morning', data_inputs: ['client_budget_alerts', 'care_plan_reviews_due', 'unspent_funds_flags', 'claiming_deadline', 'client_incidents_open'], max_tokens: 500, delivery: 'both' },
      evening: { enabled: true, system_prompt_key: 'support_coordinator_hc_evening', data_inputs: ['client_events_today', 'budget_position_updates', 'tomorrow_priorities'], max_tokens: 400, delivery: 'in_app' },
    },
    chris_coach: {
      enabled: true,
      persona: 'Home care support coordination advisor. Expert in individual client budget management, Support at Home program navigation, care plan development, family communication, and DSS claiming obligations.',
      model: 'claude-sonnet-4-20250514',
      context_inputs: ['client_caseload', 'budget_utilisation_per_client', 'care_plans_status', 'claiming_position'],
      suggested_prompts: { '/dashboard/support-coordinator-hc': ['Which clients have budget concerns?', 'Who needs a care plan review this month?', 'Help me draft a family communication'] },
      escalation_threshold: 'medium',
    },
    financial_view: { revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'full', rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden', qfr_workflow: 'hidden', penalty_exposure: 'hidden', wc_financial_risk: 'hidden', turnover_cost: 'hidden' },
    pack_review: { daily_briefing: true, team_briefing: false, leader_briefing: false, clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false, finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false },
    notification_type: 'both',
    features: { care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'hidden', quality_indicators: 'hidden', psh_dashboard: 'hidden', financial_control_centre: 'hidden', operations_control_centre: 'hidden', residents: 'full', workforce: 'hidden', agent_activity: 'read', operator_dashboard: 'hidden', queue_management: 'full', corrective_actions: 'read', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden' },
    allowed_actions: ['approve_care_plan_review', 'approve_client_budget_adjustment', 'draft_family_communication', 'approve_monthly_claim'],
    reporting_cycles: ['monthly'],
  },

  // ── COMMUNITY SUPPORT WORKER ──────────────────────────────
  community_support_worker: {
    display_name: 'Community Support Worker',
    data_scope: 'single_team',
    home_route: '/dashboard/csw',
    nav_sections: ['pulse', 'coach'],
    bottom_tabs: ['home', 'visits', 'coach'],
    domain_strip: { residential: [], home_care: ['My Visits', 'Pulse', 'Coach'], ndis: [] },
    briefings: {
      morning: { enabled: true, system_prompt_key: 'csw_morning', data_inputs: ['my_visits_today', 'client_notes_today', 'travel_route_today'], max_tokens: 300, delivery: 'imessage' },
      evening: { enabled: false, system_prompt_key: 'csw_evening', data_inputs: [], max_tokens: 200, delivery: 'none' },
    },
    chris_coach: {
      enabled: true,
      persona: 'Supportive companion for community support workers. Warm, non-clinical, practical. Helps with difficult client situations, wellbeing check-ins, and work challenges. Aware of the isolated nature of home care work.',
      model: 'claude-sonnet-4-20250514',
      context_inputs: ['pulse_history', 'my_visits_today'],
      suggested_prompts: { '/dashboard/csw': ['I had a difficult visit today', 'I need to report something', "I'm feeling overwhelmed"] },
      escalation_threshold: 'low',
    },
    financial_view: { revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'hidden', rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden', qfr_workflow: 'hidden', penalty_exposure: 'hidden', wc_financial_risk: 'hidden', turnover_cost: 'hidden' },
    pack_review: { daily_briefing: false, team_briefing: false, leader_briefing: false, clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false, finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false },
    notification_type: 'imessage',
    features: { care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'hidden', quality_indicators: 'hidden', psh_dashboard: 'hidden', financial_control_centre: 'hidden', operations_control_centre: 'hidden', residents: 'hidden', workforce: 'hidden', agent_activity: 'hidden', operator_dashboard: 'hidden', queue_management: 'hidden', corrective_actions: 'hidden', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden' },
    allowed_actions: ['complete_pulse_response', 'lone_worker_checkin', 'log_visit_completed', 'log_visit_missed', 'log_incident'],
    reporting_cycles: ['daily', 'fortnightly'],
  },

  // ══════════════════════════════════════════════════════════════
  // NDIS ROLES
  // ══════════════════════════════════════════════════════════════

  // ── NDIS MANAGER ──────────────────────────────────────────
  ndis_manager: {
    display_name: 'NDIS Manager',
    data_scope: 'single_facility',
    home_route: '/dashboard/ndis-manager',
    nav_sections: ['participants', 'plan_budgets', 'supports', 'workforce', 'compliance', 'worker_screening', 'loops'],
    bottom_tabs: ['home', 'queue', 'coach', 'briefing', 'more'],
    domain_strip: { residential: [], home_care: [], ndis: ['Participants', 'Plans', 'Workforce', 'Quality', 'Compliance'] },
    briefings: {
      morning: { enabled: true, system_prompt_key: 'ndis_manager_morning', data_inputs: ['plan_budget_alerts', 'worker_screening_expiry', 'incident_reporting_deadlines', 'bsp_compliance_status', 'claiming_deadlines', 'participant_goal_progress', 'connector_health'], max_tokens: 600, delivery: 'both' },
      evening: { enabled: true, system_prompt_key: 'ndis_manager_evening', data_inputs: ['ndis_events_today', 'claiming_status', 'incidents_today', 'tomorrow_priorities'], max_tokens: 500, delivery: 'both' },
    },
    chris_coach: {
      enabled: true,
      persona: 'NDIS operations and compliance advisor. Expert in NDIS Practice Standards, the NDIS Quality and Safeguards Commission, behaviour support plans, worker screening, plan budget management, and myplace portal claiming. Direct and regulatory-fluent.',
      model: 'claude-opus-4-20250514',
      context_inputs: ['service_profile', 'plan_budget_summary', 'worker_screening_status', 'bsp_register', 'claiming_position'],
      suggested_prompts: { '/dashboard/ndis-manager': ['What are our NDIS compliance priorities today?', 'Walk me through our plan budget position', 'Which worker screenings are expiring?'] },
      escalation_threshold: 'medium',
    },
    financial_view: { revenue_streams: 'full', care_ratio: 'hidden', agency_cost: 'read', budget: 'full', rad_liquidity: 'hidden', oracle_report: 'full', stewartbrown_benchmarks: 'hidden', qfr_workflow: 'hidden', penalty_exposure: 'read', wc_financial_risk: 'read', turnover_cost: 'read' },
    pack_review: { daily_briefing: true, team_briefing: true, leader_briefing: true, clinical_governance: false, quality_and_risk: true, whs_committee: true, people_and_culture: true, finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false },
    notification_type: 'both',
    features: { care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'read', quality_indicators: 'hidden', psh_dashboard: 'full', financial_control_centre: 'full', operations_control_centre: 'hidden', residents: 'full', workforce: 'full', agent_activity: 'read', operator_dashboard: 'hidden', queue_management: 'full', corrective_actions: 'full', iso_45003_evidence: 'read', board_pack_reader: 'hidden' },
    allowed_actions: ['approve_incident_report', 'approve_bsp', 'approve_corrective_action', 'approve_worker_screening', 'submit_ndis_claim', 'approve_complaint_response'],
    reporting_cycles: ['daily', 'monthly', 'quarterly'],
  },

  // ── SUPPORT COORDINATOR (NDIS) ────────────────────────────
  support_coordinator_ndis: {
    display_name: 'Support Coordinator',
    data_scope: 'single_facility',
    home_route: '/dashboard/support-coordinator-ndis',
    nav_sections: ['participants', 'plan_budgets', 'supports', 'compliance'],
    bottom_tabs: ['home', 'participants', 'coach', 'briefing', 'more'],
    domain_strip: { residential: [], home_care: [], ndis: ['Participants', 'Plans', 'Supports', 'Goals', 'Compliance'] },
    briefings: {
      morning: { enabled: true, system_prompt_key: 'support_coordinator_ndis_morning', data_inputs: ['participant_plan_alerts', 'goal_progress_flags', 'plan_reviews_due', 'budget_utilisation_alerts', 'participant_incidents_open'], max_tokens: 500, delivery: 'both' },
      evening: { enabled: true, system_prompt_key: 'support_coordinator_ndis_evening', data_inputs: ['participant_events_today', 'plan_updates_today', 'tomorrow_priorities'], max_tokens: 400, delivery: 'in_app' },
    },
    chris_coach: {
      enabled: true,
      persona: 'NDIS support coordination advisor. Expert in NDIS participant planning, goal setting and progress, plan budget management across Core/Capacity Building/Capital categories, NDIA processes, and coordinating complex support arrangements. Person-centred and knowledgeable.',
      model: 'claude-opus-4-20250514',
      context_inputs: ['participant_caseload', 'plan_budget_by_participant', 'goal_progress', 'plan_review_schedule'],
      suggested_prompts: { '/dashboard/support-coordinator-ndis': ['Which participants need attention today?', 'Who has a plan review coming up?', 'Help me prepare for a planning meeting'] },
      escalation_threshold: 'medium',
    },
    financial_view: { revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'full', rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden', qfr_workflow: 'hidden', penalty_exposure: 'hidden', wc_financial_risk: 'hidden', turnover_cost: 'hidden' },
    pack_review: { daily_briefing: true, team_briefing: false, leader_briefing: false, clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false, finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false },
    notification_type: 'both',
    features: { care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'hidden', quality_indicators: 'hidden', psh_dashboard: 'hidden', financial_control_centre: 'hidden', operations_control_centre: 'hidden', residents: 'full', workforce: 'hidden', agent_activity: 'read', operator_dashboard: 'hidden', queue_management: 'full', corrective_actions: 'read', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden' },
    allowed_actions: ['approve_plan_review_note', 'log_goal_progress', 'draft_progress_report', 'request_plan_review', 'approve_support_arrangement'],
    reporting_cycles: ['monthly', 'quarterly'],
  },

  // ── BEHAVIOUR SUPPORT PRACTITIONER ─────────────────────────
  behaviour_support_practitioner: {
    display_name: 'Behaviour Support Practitioner',
    data_scope: 'single_facility',
    home_route: '/dashboard/bsp',
    nav_sections: ['participants', 'compliance'],
    bottom_tabs: ['home', 'bsp', 'coach', 'briefing', 'more'],
    domain_strip: { residential: [], home_care: [], ndis: ['Participants', 'BSP Register', 'Restrictive Practices', 'Compliance', 'Reports'] },
    briefings: {
      morning: { enabled: true, system_prompt_key: 'bsp_morning', data_inputs: ['bsp_review_deadlines', 'restrictive_practice_incidents', 'ndis_commission_reporting_due', 'participant_behaviour_alerts'], max_tokens: 500, delivery: 'both' },
      evening: { enabled: true, system_prompt_key: 'bsp_evening', data_inputs: ['bsp_events_today', 'restrictive_practice_incidents_today', 'tomorrow_priorities'], max_tokens: 400, delivery: 'in_app' },
    },
    chris_coach: {
      enabled: true,
      persona: 'NDIS behaviour support and positive behaviour support advisor. Expert in the NDIS Practice Standards for behaviour support, restrictive practice authorisation and reporting, BSP development and review, and the NDIS Commission regulatory framework. Specialist and precise.',
      model: 'claude-sonnet-4-20250514',
      context_inputs: ['bsp_register', 'restrictive_practice_register', 'ndis_commission_obligations', 'participant_behaviour_data'],
      suggested_prompts: { '/dashboard/bsp': ['Which BSPs are due for review?', 'Walk me through the restrictive practice reporting requirements', 'Help me document this behaviour incident'] },
      escalation_threshold: 'low',
    },
    financial_view: { revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'read', rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden', qfr_workflow: 'hidden', penalty_exposure: 'read', wc_financial_risk: 'hidden', turnover_cost: 'hidden' },
    pack_review: { daily_briefing: true, team_briefing: false, leader_briefing: false, clinical_governance: false, quality_and_risk: true, whs_committee: false, people_and_culture: false, finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false },
    notification_type: 'both',
    features: { care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'hidden', quality_indicators: 'hidden', psh_dashboard: 'read', financial_control_centre: 'hidden', operations_control_centre: 'hidden', residents: 'full', workforce: 'hidden', agent_activity: 'read', operator_dashboard: 'hidden', queue_management: 'full', corrective_actions: 'full', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden' },
    allowed_actions: ['approve_bsp', 'submit_restrictive_practice_report', 'approve_behaviour_incident_report', 'request_bsp_review'],
    reporting_cycles: ['monthly', 'quarterly'],
  },

  // ── SUPPORT WORKER (NDIS) ─────────────────────────────────
  support_worker_ndis: {
    display_name: 'Support Worker',
    data_scope: 'single_team',
    home_route: '/dashboard/support-worker-ndis',
    nav_sections: ['pulse', 'coach'],
    bottom_tabs: ['home', 'supports', 'coach'],
    domain_strip: { residential: [], home_care: [], ndis: ['My Supports', 'Pulse', 'Coach'] },
    briefings: {
      morning: { enabled: true, system_prompt_key: 'ndis_support_worker_morning', data_inputs: ['my_supports_today', 'participant_notes_today'], max_tokens: 300, delivery: 'imessage' },
      evening: { enabled: false, system_prompt_key: 'ndis_support_worker_evening', data_inputs: [], max_tokens: 200, delivery: 'none' },
    },
    chris_coach: {
      enabled: true,
      persona: 'Supportive companion for NDIS support workers. Warm, person-centred, practical. Helps navigate challenging support situations, participant behaviour, and the emotional demands of disability support work.',
      model: 'claude-sonnet-4-20250514',
      context_inputs: ['pulse_history', 'my_supports_today'],
      suggested_prompts: { '/dashboard/support-worker-ndis': ['I had a difficult shift today', 'I need help with a participant situation', 'I need to report something'] },
      escalation_threshold: 'low',
    },
    financial_view: { revenue_streams: 'hidden', care_ratio: 'hidden', agency_cost: 'hidden', budget: 'hidden', rad_liquidity: 'hidden', oracle_report: 'hidden', stewartbrown_benchmarks: 'hidden', qfr_workflow: 'hidden', penalty_exposure: 'hidden', wc_financial_risk: 'hidden', turnover_cost: 'hidden' },
    pack_review: { daily_briefing: false, team_briefing: false, leader_briefing: false, clinical_governance: false, quality_and_risk: false, whs_committee: false, people_and_culture: false, finance_committee: false, board_pack: false, elt_pack: false, clinical_leadership: false, qfr: false },
    notification_type: 'imessage',
    features: { care_minutes: 'hidden', sirs_register: 'hidden', clinical_audits: 'hidden', quality_indicators: 'hidden', psh_dashboard: 'hidden', financial_control_centre: 'hidden', operations_control_centre: 'hidden', residents: 'hidden', workforce: 'hidden', agent_activity: 'hidden', operator_dashboard: 'hidden', queue_management: 'hidden', corrective_actions: 'hidden', iso_45003_evidence: 'hidden', board_pack_reader: 'hidden' },
    allowed_actions: ['complete_pulse_response', 'log_support_delivered', 'log_incident', 'lone_worker_checkin'],
    reporting_cycles: ['daily', 'fortnightly'],
  },
};

// ── HELPER FUNCTIONS ─────────────────────────────────────────

export function getRoleConfig(role: RoleName): RoleConfig {
  return ROLE_CONFIG[role];
}

export function hasFeatureAccess(role: RoleName, feature: keyof RoleConfig['features']): FeatureAccess {
  return ROLE_CONFIG[role].features[feature];
}

export function canApprove(role: RoleName, packType: keyof PackReviewPermissions): boolean {
  return ROLE_CONFIG[role].pack_review[packType];
}

export function getBriefingConfig(role: RoleName, briefingType: keyof BriefingConfig): BriefingConfig[keyof BriefingConfig] | undefined {
  return ROLE_CONFIG[role].briefings[briefingType];
}

export function getDomainStrip(role: RoleName, careType: CareType): string[] {
  return ROLE_CONFIG[role].domain_strip[careType];
}

export function getRolesWithFeature(feature: keyof RoleConfig['features'], access: FeatureAccess = 'full'): RoleName[] {
  return (Object.keys(ROLE_CONFIG) as RoleName[]).filter(
    (role) => ROLE_CONFIG[role].features[feature] === access
  );
}

export function getRolesForBriefing(briefingType: keyof BriefingConfig): RoleName[] {
  return (Object.keys(ROLE_CONFIG) as RoleName[]).filter(
    (role) => ROLE_CONFIG[role].briefings[briefingType]?.enabled === true
  );
}

export default ROLE_CONFIG;
