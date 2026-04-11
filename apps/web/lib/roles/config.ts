// ============================================================================
// Role Configuration — Single Source of Truth
// Every part of CHRIS reads from this config.
// Adding a role = adding one entry. Changing access = changing one line.
// ============================================================================

import type { Role, RoleConfig } from "./types";

// --- Shared nav sections ---
const NAV_OVERVIEW = { title: "OVERVIEW", items: [
  { label: "Home", href: "/dashboard", icon: "Home" },
  { label: "CHRIS Coach", href: "/dashboard/coach", icon: "Sparkles" },
]};

const NAV_OPERATIONS = { title: "OPERATIONS", href: "/dashboard/operations", items: [
  { label: "Today's Briefing", href: "/dashboard/briefing", icon: "FileText" },
  { label: "Review Queue", href: "/don/queue", icon: "ClipboardList" },
]};

const NAV_CLINICAL = { title: "CLINICAL", href: "/dashboard/clinical", items: [
  { label: "Care Minutes", href: "/dashboard/care-minutes", icon: "Activity" },
  { label: "Quality Indicators", href: "/dashboard/quality", icon: "BarChart2" },
  { label: "Clinical Audits", href: "/dashboard/audits", icon: "CheckSquare" },
  { label: "SIRS Register", href: "/dashboard/sirs", icon: "AlertTriangle" },
]};

const NAV_WORKFORCE = { title: "WORKFORCE", href: "/dashboard/workforce", items: [
  { label: "PSH Dashboard", href: "/dashboard/psh", icon: "Heart" },
  { label: "Training", href: "/dashboard/training", icon: "GraduationCap" },
]};

const NAV_FINANCIAL = { title: "FINANCIAL", href: "/dashboard/financial", items: [] };

const NAV_GOVERNANCE = { title: "GOVERNANCE", href: "/dashboard/compliance", items: [
  { label: "Reporting Cycles", href: "/dashboard/reporting", icon: "Calendar" },
  { label: "Corrective Actions", href: "/dashboard/compliance", icon: "CheckSquare" },
]};

const NAV_LOOPS = { title: "LOOPS", items: [
  { label: "Team Loop", href: "/team-loop/briefing", icon: "FileText" },
  { label: "Team Pulse", href: "/team-loop/pulse", icon: "Users" },
  { label: "Leader Loop", href: "/leader-loop/arrive", icon: "BarChart2" },
]};

// --- ALL features list with default hidden ---
const ALL_FEATURES_HIDDEN: Record<string, "hidden"> = {
  sirs_workflow: "hidden", care_minutes: "hidden", quality_indicators: "hidden",
  clinical_audits: "hidden", psh_heatmap: "hidden", iso_45003_evidence: "hidden",
  financial_dashboard: "hidden", annacc_revenue: "hidden", qfr_submission: "hidden",
  corrective_actions: "hidden", compliance_register: "hidden", risk_register: "hidden",
  governance_packs: "hidden", reporting_cycles: "hidden", board_pack_reader: "hidden",
  leader_loop_analytics: "hidden", training_compliance: "hidden", team_pulse: "hidden",
  chris_coach: "hidden", thrive_loop: "hidden", operator_dashboard: "hidden",
  portfolio_view: "hidden", team_briefing: "hidden", leader_loop: "hidden",
  practice_library: "hidden", convergence_events: "hidden", wc_monitor: "hidden",
};

function features(overrides: Record<string, "full" | "read">): Record<string, "full" | "read" | "hidden"> {
  return { ...ALL_FEATURES_HIDDEN, ...overrides };
}

// ============================================================================
// ROLE CONFIGS
// ============================================================================

const DON: RoleConfig = {
  role: "don", displayName: "Director of Nursing",
  nav: {
    sections: [NAV_OVERVIEW, NAV_OPERATIONS, NAV_CLINICAL, NAV_WORKFORCE, NAV_FINANCIAL, NAV_GOVERNANCE, NAV_LOOPS],
    bottomTabs: [
      { id: "home", label: "Home", href: "/dashboard" },
      { id: "clinical", label: "Clinical", href: "/dashboard/clinical" },
      { id: "workforce", label: "Workforce", href: "/dashboard/workforce" },
      { id: "governance", label: "Governance", href: "/dashboard/compliance" },
      { id: "coach", label: "CHRIS", href: "/dashboard/coach" },
    ],
    homeRoute: "/dashboard", defaultDomainRoute: "/dashboard/clinical",
  },
  dataScope: { facilityLevel: "single", canViewIndividualTeams: true, canViewFinancials: true, canViewPSHDetail: true, canViewGovernancePacks: true },
  todaysPicture: {
    enabled: true,
    systemPromptContext: "You are briefing a Director of Nursing at the start of their shift. Lead with the most critical clinical or operational signal. Be direct, specific, and include both risks and positives. Mention care minutes, SIRS status, roster, and any PSH signals.",
    dataInputs: ["care_minutes", "sirs", "roster", "psh", "compliance", "pulse", "workforce"],
    tone: "operational", maxLength: 80,
    regenerateTriggers: ["sirs_new", "care_minutes_breach", "rn_gap", "convergence_critical"],
  },
  domainStrip: [
    { name: "Clinical", dataKey: "clinical_summary", href: "/dashboard/clinical" },
    { name: "Workforce", dataKey: "workforce_summary", href: "/dashboard/workforce" },
    { name: "Governance", dataKey: "governance_summary", href: "/dashboard/compliance" },
    { name: "Operations", dataKey: "operations_summary", href: "/dashboard/operations" },
    { name: "Financial", dataKey: "financial_summary", href: "/dashboard/financial" },
  ],
  actionPriority: [
    { condition: "sirs_cat1_deadline_12h", actionType: "sirs_review", label: "Review SIRS Cat 1 draft", route: "/dashboard/sirs" },
    { condition: "care_minutes_breach", actionType: "care_minutes_fix", label: "Fix care minutes gap", route: "/dashboard/care-minutes" },
    { condition: "rn_gap_tonight", actionType: "roster_fix", label: "Find RN cover for tonight", route: "/dashboard/care-minutes" },
    { condition: "audit_overdue", actionType: "audit_start", label: "Start overdue audit", route: "/dashboard/audits" },
    { condition: "pack_approval_pending", actionType: "pack_review", label: "Review governance pack", route: "/dashboard/reporting" },
    { condition: "briefing_unread", actionType: "briefing_read", label: "Read Today's Briefing", route: "/team-loop/briefing" },
    { condition: "practice_outcome_positive", actionType: "practice_ack", label: "Acknowledge practice outcome", route: "/dashboard/psh" },
  ],
  chrisCoach: {
    persona: "operational",
    contextInputs: ["facility_context", "care_minutes", "sirs", "roster", "psh", "pulse", "team_dynamics"],
    suggestedPrompts: {
      "/dashboard": ["What should I focus on today?", "Help me prepare for a difficult conversation", "Why is care minutes at risk?"],
      "/dashboard/care-minutes": ["What's driving the RN shortfall?", "Help me draft the agency brief"],
      "/dashboard/sirs": ["Walk me through what to add", "Is this classification correct?"],
    },
    canAccessThriveLoop: true, voiceEnabled: true, canCreateQueueItems: true, canSendAlerts: true,
  },
  notifications: {
    iMessage: ["sirs_cat1", "sirs_cat2_deadline", "care_minutes_breach", "rn_coverage_gap", "psh_convergence_critical", "pack_ready", "connector_failure", "material_incident"],
    inApp: ["sirs_cat1", "sirs_cat2_deadline", "care_minutes_breach", "care_minutes_at_risk", "rn_coverage_gap", "psh_convergence_critical", "psh_convergence_elevated", "pack_ready", "compliance_at_risk", "training_expiry", "team_briefing_ready", "practice_outcome"],
    doNotDisturb: true,
  },
  packReview: {
    canReview: ["clinical_governance", "todays_briefing", "team_briefing"],
    canApprove: ["clinical_governance", "todays_briefing", "team_briefing"],
    canDistribute: ["clinical_governance", "team_briefing"],
    readOnly: ["board_pack", "elt_pack"],
  },
  features: features({
    sirs_workflow: "full", care_minutes: "full", quality_indicators: "full", clinical_audits: "full",
    psh_heatmap: "full", compliance_register: "full", corrective_actions: "full", risk_register: "full",
    governance_packs: "full", reporting_cycles: "full", training_compliance: "full", team_pulse: "full",
    chris_coach: "full", thrive_loop: "full", team_briefing: "full", leader_loop: "full",
    practice_library: "full", convergence_events: "full", financial_dashboard: "read",
    board_pack_reader: "read", leader_loop_analytics: "read",
  }),
  reportingCycles: ["clinical_governance", "todays_briefing", "team_briefing", "qr_committee"],
  allowedActions: ["sirs_category_1_draft", "sirs_category_2_draft", "care_minutes_alert", "corrective_action_creation", "practice_delivery", "don_escalation_routing"],
};

const CEO: RoleConfig = {
  role: "ceo", displayName: "Chief Executive Officer",
  nav: {
    sections: [NAV_OVERVIEW, { ...NAV_OPERATIONS, items: [{ label: "Review Queue", href: "/don/queue", icon: "ClipboardList" }] }, NAV_CLINICAL, NAV_WORKFORCE, NAV_FINANCIAL, NAV_GOVERNANCE],
    bottomTabs: [
      { id: "home", label: "Home", href: "/dashboard/ceo" },
      { id: "portfolio", label: "Portfolio", href: "/dashboard/portfolio" },
      { id: "approvals", label: "Approvals", href: "/dashboard/reporting" },
      { id: "cycles", label: "Cycles", href: "/dashboard/reporting" },
      { id: "coach", label: "CHRIS", href: "/dashboard/coach" },
    ],
    homeRoute: "/dashboard/ceo", defaultDomainRoute: "/dashboard/portfolio",
  },
  dataScope: { facilityLevel: "portfolio", canViewIndividualTeams: false, canViewFinancials: true, canViewPSHDetail: true, canViewGovernancePacks: true },
  todaysPicture: {
    enabled: true,
    systemPromptContext: "You are briefing a CEO about their aged care portfolio. Lead with the most critical cross-facility signal. Include facility health, any requiring CEO intervention, governance pack status. Be strategic, not operational.",
    dataInputs: ["portfolio_status", "cross_facility_signals", "financial_summary", "governance_status", "psh_portfolio"],
    tone: "strategic", maxLength: 100,
    regenerateTriggers: ["sirs_cat1_any", "convergence_critical_any", "pack_approval_overdue"],
  },
  domainStrip: [
    { name: "Clinical", dataKey: "clinical_portfolio", href: "/dashboard/clinical" },
    { name: "Workforce", dataKey: "workforce_portfolio", href: "/dashboard/workforce" },
    { name: "Governance", dataKey: "governance_portfolio", href: "/dashboard/compliance" },
    { name: "Financial", dataKey: "financial_portfolio", href: "/dashboard/financial" },
    { name: "PSH", dataKey: "psh_portfolio", href: "/dashboard/psh" },
  ],
  actionPriority: [
    { condition: "board_pack_pending", actionType: "pack_review", label: "Review Board Pack", route: "/dashboard/reporting" },
    { condition: "elt_pack_pending", actionType: "pack_review", label: "Review ELT Pack", route: "/dashboard/reporting" },
    { condition: "cross_facility_critical", actionType: "escalation", label: "Cross-facility alert — ELT response needed", route: "/dashboard/portfolio" },
    { condition: "facility_ceo_intervention", actionType: "escalation", label: "Facility requires CEO attention", route: "/dashboard/portfolio" },
  ],
  chrisCoach: {
    persona: "executive",
    contextInputs: ["portfolio_context", "cross_facility_signals", "governance_status", "financial_summary"],
    suggestedPrompts: {
      "/dashboard/ceo": ["What's the most important thing across the portfolio?", "Help me frame the Board discussion", "Which facility needs me most?"],
    },
    canAccessThriveLoop: false, voiceEnabled: true, canCreateQueueItems: true, canSendAlerts: true,
  },
  notifications: {
    iMessage: ["sirs_cat1", "material_incident", "pack_ready", "psh_convergence_critical", "star_rating_change"],
    inApp: ["sirs_cat1", "material_incident", "pack_ready", "pack_overdue", "psh_convergence_critical", "compliance_at_risk", "turnover_spike"],
    doNotDisturb: true,
  },
  packReview: {
    canReview: ["board_pack", "elt_pack"],
    canApprove: ["board_pack", "elt_pack"],
    canDistribute: ["board_pack", "elt_pack"],
    readOnly: ["clinical_governance", "qr_committee", "whs_committee", "pc_committee"],
  },
  features: features({
    portfolio_view: "full", governance_packs: "full", reporting_cycles: "full", compliance_register: "full",
    risk_register: "full", chris_coach: "full", board_pack_reader: "full", convergence_events: "full",
    care_minutes: "read", quality_indicators: "read", sirs_workflow: "read", psh_heatmap: "read",
    financial_dashboard: "read", training_compliance: "read",
  }),
  reportingCycles: ["board_pack", "elt_pack"],
  allowedActions: ["board_pack_distribution", "regulatory_correspondence_log"],
};

const CFO: RoleConfig = {
  role: "cfo", displayName: "Chief Financial Officer",
  nav: {
    sections: [NAV_OVERVIEW, NAV_FINANCIAL, NAV_GOVERNANCE],
    bottomTabs: [
      { id: "home", label: "Home", href: "/dashboard/cfo" },
      { id: "financial", label: "Financial", href: "/dashboard/financial" },
      { id: "reporting", label: "Reports", href: "/dashboard/reporting" },
      { id: "coach", label: "CHRIS", href: "/dashboard/coach" },
    ],
    homeRoute: "/dashboard/cfo", defaultDomainRoute: "/dashboard/financial",
  },
  dataScope: { facilityLevel: "portfolio", canViewIndividualTeams: false, canViewFinancials: true, canViewPSHDetail: false, canViewGovernancePacks: true },
  todaysPicture: {
    enabled: true,
    systemPromptContext: "You are briefing a CFO about financial performance. Lead with the most significant financial signal. Include AN-ACC revenue, care ratio, agency cost, budget variance. Include cross-domain context where financial metrics have non-financial drivers.",
    dataInputs: ["financial_dashboard", "annacc", "budget", "qfr_status", "cross_domain_financial"],
    tone: "financial", maxLength: 80,
    regenerateTriggers: ["qfr_deadline", "budget_breach", "annacc_risk"],
  },
  domainStrip: [
    { name: "Revenue", dataKey: "revenue", href: "/dashboard/financial" },
    { name: "Care Ratio", dataKey: "care_ratio", href: "/dashboard/financial" },
    { name: "Agency Cost", dataKey: "agency_cost", href: "/dashboard/financial" },
    { name: "Budget", dataKey: "budget", href: "/dashboard/cfo/budget" },
    { name: "QFR", dataKey: "qfr", href: "/dashboard/cfo/qfr" },
  ],
  actionPriority: [
    { condition: "qfr_due_7d", actionType: "qfr_review", label: "QFR submission due", route: "/dashboard/cfo/qfr" },
    { condition: "board_finance_pending", actionType: "pack_review", label: "Board finance section ready", route: "/dashboard/reporting" },
    { condition: "annacc_risk", actionType: "annacc_alert", label: "AN-ACC revenue at risk", route: "/dashboard/cfo/annacc" },
    { condition: "budget_adverse_5pct", actionType: "budget_review", label: "Budget variance requires commentary", route: "/dashboard/cfo/budget" },
  ],
  chrisCoach: {
    persona: "financial",
    contextInputs: ["financial_dashboard", "annacc", "budget", "cross_domain_financial"],
    suggestedPrompts: {
      "/dashboard/cfo": ["What's driving the care ratio decline?", "Help me draft the Board finance commentary", "Model the AN-ACC reassessment scenarios"],
    },
    canAccessThriveLoop: false, voiceEnabled: true, canCreateQueueItems: false, canSendAlerts: false,
  },
  notifications: {
    iMessage: ["pack_ready", "agency_spike"],
    inApp: ["pack_ready", "pack_overdue", "agency_spike", "compliance_at_risk"],
    doNotDisturb: true,
  },
  packReview: {
    canReview: ["finance_monthly", "qfr"],
    canApprove: ["finance_monthly", "qfr"],
    canDistribute: [],
    readOnly: ["board_pack", "elt_pack"],
  },
  features: features({
    financial_dashboard: "full", annacc_revenue: "full", qfr_submission: "full", governance_packs: "full",
    reporting_cycles: "full", chris_coach: "full", board_pack_reader: "read",
    care_minutes: "read", quality_indicators: "read", compliance_register: "read",
  }),
  reportingCycles: ["finance_monthly", "qfr", "board_pack", "elt_pack"],
  allowedActions: ["gpms_qfr_submission", "gpms_care_minutes_submission"],
};

const CLINICAL_DIRECTOR: RoleConfig = {
  role: "clinical_director", displayName: "Clinical Director",
  nav: {
    sections: [NAV_OVERVIEW, NAV_CLINICAL, NAV_GOVERNANCE],
    bottomTabs: [
      { id: "home", label: "Home", href: "/dashboard/clinical-director" },
      { id: "clinical", label: "Clinical", href: "/dashboard/clinical" },
      { id: "reporting", label: "Reports", href: "/dashboard/reporting" },
      { id: "coach", label: "CHRIS", href: "/dashboard/coach" },
    ],
    homeRoute: "/dashboard/clinical-director", defaultDomainRoute: "/dashboard/clinical",
  },
  dataScope: { facilityLevel: "portfolio", canViewIndividualTeams: false, canViewFinancials: false, canViewPSHDetail: true, canViewGovernancePacks: true },
  todaysPicture: {
    enabled: true,
    systemPromptContext: "You are briefing a Clinical Director about clinical governance across the portfolio. Lead with the most significant clinical signal. Include care minutes, QIs, SIRS, audits. Include cross-domain context where clinical metrics have non-clinical drivers.",
    dataInputs: ["care_minutes_portfolio", "qi_portfolio", "sirs_all", "clinical_risk", "audit_status"],
    tone: "clinical", maxLength: 80,
    regenerateTriggers: ["sirs_cat1_any", "qi_breach_cluster", "care_minutes_systemic"],
  },
  domainStrip: [
    { name: "Care Minutes", dataKey: "care_minutes_portfolio", href: "/dashboard/clinical-director/care-minutes" },
    { name: "Quality Indicators", dataKey: "qi_portfolio", href: "/dashboard/quality" },
    { name: "SIRS", dataKey: "sirs_portfolio", href: "/dashboard/sirs" },
    { name: "Clinical Audits", dataKey: "audit_portfolio", href: "/dashboard/audits" },
    { name: "Clinical Risk", dataKey: "clinical_risk", href: "/dashboard/quality" },
  ],
  actionPriority: [
    { condition: "sirs_cat1_any", actionType: "sirs_awareness", label: "SIRS Cat 1 — clinical director awareness", route: "/dashboard/sirs" },
    { condition: "qi_below_benchmark_cluster", actionType: "qi_review", label: "QI pattern — cross-facility response", route: "/dashboard/quality" },
    { condition: "clinical_pack_pending", actionType: "pack_review", label: "Clinical Leadership Pack ready", route: "/dashboard/reporting" },
    { condition: "audit_overdue_cluster", actionType: "audit_attention", label: "Audit cluster overdue", route: "/dashboard/audits" },
  ],
  chrisCoach: {
    persona: "clinical",
    contextInputs: ["clinical_portfolio", "qi_data", "sirs_status", "audit_results"],
    suggestedPrompts: {
      "/dashboard/clinical-director": ["Why is QI_04 elevated?", "Help me prepare for the Clinical Leadership meeting", "Is the care minutes issue structural?"],
    },
    canAccessThriveLoop: false, voiceEnabled: true, canCreateQueueItems: false, canSendAlerts: true,
  },
  notifications: {
    iMessage: ["sirs_cat1", "care_minutes_breach", "pack_ready"],
    inApp: ["sirs_cat1", "sirs_cat2_deadline", "care_minutes_breach", "pack_ready", "compliance_at_risk"],
    doNotDisturb: true,
  },
  packReview: {
    canReview: ["clinical_governance"],
    canApprove: ["clinical_governance"],
    canDistribute: ["clinical_governance"],
    readOnly: ["board_pack", "elt_pack", "qr_committee"],
  },
  features: features({
    care_minutes: "full", quality_indicators: "full", sirs_workflow: "full", clinical_audits: "full",
    compliance_register: "read", governance_packs: "full", reporting_cycles: "full", chris_coach: "full",
    psh_heatmap: "read", training_compliance: "read", board_pack_reader: "read", convergence_events: "read",
  }),
  reportingCycles: ["clinical_governance", "board_pack", "elt_pack"],
  allowedActions: ["sirs_category_1_draft", "corrective_action_creation"],
};

const QUALITY_LEAD: RoleConfig = {
  role: "quality_lead", displayName: "Quality Lead",
  nav: {
    sections: [NAV_OVERVIEW, NAV_CLINICAL, NAV_GOVERNANCE],
    bottomTabs: [
      { id: "home", label: "Home", href: "/dashboard/quality-lead" },
      { id: "compliance", label: "Compliance", href: "/dashboard/compliance" },
      { id: "sirs", label: "SIRS", href: "/dashboard/sirs" },
      { id: "reporting", label: "Cycles", href: "/dashboard/reporting" },
      { id: "coach", label: "CHRIS", href: "/dashboard/coach" },
    ],
    homeRoute: "/dashboard/quality-lead", defaultDomainRoute: "/dashboard/compliance",
  },
  dataScope: { facilityLevel: "single", canViewIndividualTeams: false, canViewFinancials: false, canViewPSHDetail: true, canViewGovernancePacks: true },
  todaysPicture: {
    enabled: true,
    systemPromptContext: "You are briefing a Quality Lead about compliance status. Lead with the compliance score and any gaps. Include SIRS deadlines, audit status, corrective actions. Reframe domain metrics with cross-domain context where available.",
    dataInputs: ["compliance_register", "sirs", "audits", "corrective_actions", "iso_45003"],
    tone: "compliance", maxLength: 80,
    regenerateTriggers: ["sirs_deadline_approaching", "compliance_non_compliant", "audit_overdue"],
  },
  domainStrip: [
    { name: "Compliance Score", dataKey: "compliance_score", href: "/dashboard/compliance" },
    { name: "SIRS", dataKey: "sirs_status", href: "/dashboard/sirs" },
    { name: "Audits", dataKey: "audit_status", href: "/dashboard/audits" },
    { name: "Corrective Actions", dataKey: "corrective_actions", href: "/dashboard/compliance" },
    { name: "ISO 45003", dataKey: "iso_45003", href: "/dashboard/risk" },
  ],
  actionPriority: [
    { condition: "sirs_deadline_approaching", actionType: "sirs_review", label: "SIRS deadline approaching", route: "/dashboard/sirs" },
    { condition: "compliance_evidence_gap", actionType: "compliance_fix", label: "Fix compliance evidence gap", route: "/dashboard/compliance" },
    { condition: "audit_overdue", actionType: "audit_start", label: "Start overdue audit", route: "/dashboard/audits" },
    { condition: "corrective_overdue", actionType: "corrective_chase", label: "Chase overdue corrective action", route: "/dashboard/compliance" },
    { condition: "qr_pack_pending", actionType: "pack_review", label: "Q&R Committee Pack ready", route: "/dashboard/reporting" },
  ],
  chrisCoach: {
    persona: "compliance",
    contextInputs: ["compliance_register", "sirs_status", "evidence_gaps", "audit_results"],
    suggestedPrompts: {
      "/dashboard/quality-lead": ["What's the fastest way to fix the QS 2.8.2 gap?", "Help me prepare for the ACQSC visit", "Summarise corrective action status"],
    },
    canAccessThriveLoop: false, voiceEnabled: true, canCreateQueueItems: true, canSendAlerts: false,
  },
  notifications: {
    iMessage: ["sirs_cat1", "sirs_cat2_deadline", "compliance_at_risk", "pack_ready"],
    inApp: ["sirs_cat1", "sirs_cat2_deadline", "compliance_at_risk", "pack_ready", "pack_overdue", "training_expiry"],
    doNotDisturb: true,
  },
  packReview: {
    canReview: ["qr_committee"],
    canApprove: ["qr_committee"],
    canDistribute: ["qr_committee"],
    readOnly: ["board_pack", "clinical_governance"],
  },
  features: features({
    sirs_workflow: "full", compliance_register: "full", corrective_actions: "full", clinical_audits: "full",
    quality_indicators: "full", iso_45003_evidence: "full", governance_packs: "full", reporting_cycles: "full",
    chris_coach: "full", risk_register: "full", care_minutes: "read", psh_heatmap: "read",
    board_pack_reader: "read",
  }),
  reportingCycles: ["qr_committee", "clinical_governance"],
  allowedActions: ["sirs_category_1_draft", "sirs_category_2_draft", "corrective_action_creation", "compliance_register_update"],
};

const WHS_LEAD: RoleConfig = {
  role: "whs_lead", displayName: "WHS Lead",
  nav: {
    sections: [NAV_OVERVIEW, NAV_WORKFORCE, NAV_GOVERNANCE],
    bottomTabs: [
      { id: "home", label: "Home", href: "/dashboard/whs" },
      { id: "psh", label: "PSH", href: "/dashboard/psh" },
      { id: "evidence", label: "ISO 45003", href: "/dashboard/risk" },
      { id: "reporting", label: "Cycles", href: "/dashboard/reporting" },
      { id: "coach", label: "CHRIS", href: "/dashboard/coach" },
    ],
    homeRoute: "/dashboard/whs", defaultDomainRoute: "/dashboard/psh",
  },
  dataScope: { facilityLevel: "single", canViewIndividualTeams: true, canViewFinancials: false, canViewPSHDetail: true, canViewGovernancePacks: true },
  todaysPicture: {
    enabled: true,
    systemPromptContext: "You are briefing a WHS Lead about psychosocial hazard status. Lead with the most significant PSH signal. State overall landscape, convergence events, WC risk. Include ISO 45003 evidence status.",
    dataInputs: ["psh_heatmap", "convergence_events", "iso_45003", "wc_risk", "whs_incidents"],
    tone: "compliance", maxLength: 80,
    regenerateTriggers: ["convergence_critical", "wc_predictive", "iso_evidence_gap"],
  },
  domainStrip: [
    { name: "Elevated Teams", dataKey: "elevated_teams", href: "/dashboard/psh" },
    { name: "Convergence", dataKey: "convergence", href: "/dashboard/psh" },
    { name: "ISO 45003", dataKey: "iso_45003", href: "/dashboard/risk" },
    { name: "WC Risk", dataKey: "wc_risk", href: "/dashboard/psh" },
    { name: "Interventions", dataKey: "interventions", href: "/dashboard/psh" },
  ],
  actionPriority: [
    { condition: "convergence_critical", actionType: "escalation", label: "Critical convergence — DON escalation", route: "/dashboard/psh" },
    { condition: "wc_predictive", actionType: "intervention", label: "WC risk — prescribe Level 3 control", route: "/dashboard/psh" },
    { condition: "iso_evidence_gap", actionType: "evidence_fix", label: "ISO 45003 evidence gap", route: "/dashboard/risk" },
    { condition: "whs_pack_pending", actionType: "pack_review", label: "WHS Committee Pack ready", route: "/dashboard/reporting" },
  ],
  chrisCoach: {
    persona: "compliance",
    contextInputs: ["psh_heatmap", "convergence_events", "hoc_analysis", "iso_45003", "wc_risk"],
    suggestedPrompts: {
      "/dashboard/whs": ["Build an advocacy brief for Level 2 intervention", "What's the WC exposure for the Cottage Team?", "Export the ISO 45003 evidence pack"],
    },
    canAccessThriveLoop: false, voiceEnabled: true, canCreateQueueItems: true, canSendAlerts: true,
  },
  notifications: {
    iMessage: ["psh_convergence_critical", "wc_predictive", "pack_ready"],
    inApp: ["psh_convergence_critical", "psh_convergence_elevated", "wc_predictive", "pack_ready"],
    doNotDisturb: true,
  },
  packReview: {
    canReview: ["whs_committee"],
    canApprove: ["whs_committee"],
    canDistribute: ["whs_committee"],
    readOnly: [],
  },
  features: features({
    psh_heatmap: "full", iso_45003_evidence: "full", convergence_events: "full", wc_monitor: "full",
    practice_library: "full", governance_packs: "full", reporting_cycles: "full", chris_coach: "full",
    compliance_register: "read", care_minutes: "read", quality_indicators: "read",
  }),
  reportingCycles: ["whs_committee"],
  allowedActions: ["practice_selection", "practice_delivery", "don_escalation_routing", "advocacy_prompt_generation"],
};

const HR_MANAGER: RoleConfig = {
  role: "hr_manager", displayName: "HR / People & Culture Manager",
  nav: {
    sections: [NAV_OVERVIEW, NAV_WORKFORCE, NAV_LOOPS, NAV_GOVERNANCE],
    bottomTabs: [
      { id: "home", label: "Home", href: "/dashboard/hr" },
      { id: "workforce", label: "Workforce", href: "/dashboard/workforce" },
      { id: "training", label: "Training", href: "/dashboard/training" },
      { id: "reporting", label: "Cycles", href: "/dashboard/reporting" },
      { id: "coach", label: "CHRIS", href: "/dashboard/coach" },
    ],
    homeRoute: "/dashboard/hr", defaultDomainRoute: "/dashboard/workforce",
  },
  dataScope: { facilityLevel: "portfolio", canViewIndividualTeams: false, canViewFinancials: false, canViewPSHDetail: true, canViewGovernancePacks: true },
  todaysPicture: {
    enabled: true,
    systemPromptContext: "You are briefing an HR Manager about workforce health. Lead with the most significant workforce signal. Include turnover with PSH root cause, training compliance, agency dependency, Leader Loop status. Frame turnover as a culture outcome, not a recruitment problem.",
    dataInputs: ["turnover", "absenteeism", "agency", "training", "leader_loop", "psh_aggregate"],
    tone: "operational", maxLength: 80,
    regenerateTriggers: ["turnover_spike", "training_expiry_risk", "agency_threshold"],
  },
  domainStrip: [
    { name: "Turnover", dataKey: "turnover", href: "/dashboard/workforce" },
    { name: "Agency", dataKey: "agency", href: "/dashboard/workforce" },
    { name: "Training", dataKey: "training", href: "/dashboard/training" },
    { name: "Leader Loop", dataKey: "leader_loop", href: "/dashboard/hr/leader-loop" },
    { name: "Absenteeism", dataKey: "absenteeism", href: "/dashboard/workforce" },
  ],
  actionPriority: [
    { condition: "credential_expiry_care_risk", actionType: "training_chase", label: "Credential expiry — care minutes at risk", route: "/dashboard/training" },
    { condition: "turnover_spike", actionType: "turnover_review", label: "Turnover spike — identify at-risk teams", route: "/dashboard/workforce" },
    { condition: "training_below_80", actionType: "training_chase", label: "Training compliance below 80%", route: "/dashboard/training" },
    { condition: "pc_pack_pending", actionType: "pack_review", label: "P&C Committee Pack ready", route: "/dashboard/reporting" },
  ],
  chrisCoach: {
    persona: "development",
    contextInputs: ["workforce_dashboard", "psh_aggregate", "leader_loop_analytics", "training_status"],
    suggestedPrompts: {
      "/dashboard/hr": ["What's driving AIN turnover?", "Which teams are at highest retention risk?", "How is the Leader Loop performing?"],
    },
    canAccessThriveLoop: false, voiceEnabled: true, canCreateQueueItems: false, canSendAlerts: true,
  },
  notifications: {
    iMessage: ["training_expiry", "turnover_spike", "pack_ready"],
    inApp: ["training_expiry", "turnover_spike", "agency_spike", "pack_ready", "leader_loop_due"],
    doNotDisturb: true,
  },
  packReview: {
    canReview: ["pc_committee"],
    canApprove: ["pc_committee"],
    canDistribute: ["pc_committee"],
    readOnly: [],
  },
  features: features({
    training_compliance: "full", leader_loop_analytics: "full", team_pulse: "full",
    psh_heatmap: "read", chris_coach: "full", governance_packs: "full", reporting_cycles: "full",
    compliance_register: "read", care_minutes: "read",
  }),
  reportingCycles: ["pc_committee"],
  allowedActions: [],
};

const BOARD_MEMBER: RoleConfig = {
  role: "board_member", displayName: "Board Member",
  nav: {
    sections: [],
    bottomTabs: [],
    homeRoute: "/dashboard/board", defaultDomainRoute: "/dashboard/board",
  },
  dataScope: { facilityLevel: "aggregate_only", canViewIndividualTeams: false, canViewFinancials: false, canViewPSHDetail: false, canViewGovernancePacks: true },
  todaysPicture: { enabled: false, systemPromptContext: "", dataInputs: [], tone: "strategic", maxLength: 0, regenerateTriggers: [] },
  domainStrip: [],
  actionPriority: [],
  chrisCoach: {
    persona: "readonly",
    contextInputs: [],
    suggestedPrompts: {},
    canAccessThriveLoop: false, voiceEnabled: false, canCreateQueueItems: false, canSendAlerts: false,
  },
  notifications: {
    iMessage: ["material_incident", "star_rating_change", "board_notification"],
    inApp: ["material_incident", "board_notification"],
    doNotDisturb: false,
  },
  packReview: { canReview: [], canApprove: [], canDistribute: [], readOnly: ["board_pack"] },
  features: features({ board_pack_reader: "read" }),
  reportingCycles: [],
  allowedActions: [],
};

const TEAM_LEADER: RoleConfig = {
  role: "team_leader", displayName: "Team Leader",
  nav: {
    sections: [NAV_OVERVIEW, NAV_LOOPS],
    bottomTabs: [
      { id: "home", label: "Home", href: "/dashboard/team-leader" },
      { id: "briefing", label: "Briefing", href: "/team-loop/briefing" },
      { id: "practice", label: "Practice", href: "/team-loop/briefing" },
      { id: "coach", label: "CHRIS", href: "/dashboard/coach" },
    ],
    homeRoute: "/dashboard/team-leader", defaultDomainRoute: "/team-loop/briefing",
  },
  dataScope: { facilityLevel: "single", canViewIndividualTeams: true, canViewFinancials: false, canViewPSHDetail: false, canViewGovernancePacks: false },
  todaysPicture: {
    enabled: true,
    systemPromptContext: "You are briefing a frontline team leader about their team's situation. Lead with the most important team-specific signal. Mention the current practice, pulse participation, and any facility context relevant to the team. Be warm, supportive, and specific.",
    dataInputs: ["team_pulse", "psh_team", "practice_status", "facility_context_summary"],
    tone: "operational", maxLength: 60,
    regenerateTriggers: ["team_briefing_ready", "practice_outcome", "pulse_closed"],
  },
  domainStrip: [
    { name: "Team PSH", dataKey: "psh_team", href: "/dashboard/risk" },
    { name: "Pulse", dataKey: "pulse_participation", href: "/team-loop/pulse" },
    { name: "Practice", dataKey: "practice_status", href: "/team-loop/briefing" },
    { name: "Leader Loop", dataKey: "leader_loop_status", href: "/leader-loop/arrive" },
  ],
  actionPriority: [
    { condition: "briefing_unread", actionType: "briefing_read", label: "Read Team Briefing", route: "/team-loop/briefing" },
    { condition: "leader_loop_due", actionType: "leader_loop", label: "Complete Leader Loop prompt", route: "/leader-loop/arrive" },
    { condition: "practice_outcome_positive", actionType: "practice_ack", label: "Acknowledge practice outcome", route: "/dashboard/psh" },
    { condition: "issue_to_flag", actionType: "don_flag", label: "Flag issue for DON", route: "/don/queue" },
  ],
  chrisCoach: {
    persona: "operational",
    contextInputs: ["team_data", "leader_genos_profile", "practice_history", "pulse_team"],
    suggestedPrompts: {
      "/dashboard/team-leader": ["Help me prepare for a difficult conversation", "What should I focus on this fortnight?", "I'm feeling overwhelmed"],
    },
    canAccessThriveLoop: true, voiceEnabled: true, canCreateQueueItems: true, canSendAlerts: false,
  },
  notifications: {
    iMessage: ["team_briefing_ready", "leader_loop_due", "practice_outcome"],
    inApp: ["team_briefing_ready", "leader_loop_due", "practice_outcome"],
    doNotDisturb: true,
  },
  packReview: { canReview: [], canApprove: [], canDistribute: [], readOnly: [] },
  features: features({
    team_briefing: "full", team_pulse: "full", leader_loop: "full", practice_library: "full",
    chris_coach: "full", thrive_loop: "full", care_minutes: "read",
  }),
  reportingCycles: ["team_briefing"],
  allowedActions: ["practice_delivery", "don_escalation_routing"],
};

const OPERATOR: RoleConfig = {
  role: "operator", displayName: "Operator",
  nav: {
    sections: [NAV_OVERVIEW, NAV_OPERATIONS, NAV_CLINICAL, NAV_WORKFORCE, NAV_FINANCIAL, NAV_GOVERNANCE, NAV_LOOPS],
    bottomTabs: [
      { id: "home", label: "Home", href: "/dashboard" },
      { id: "clinical", label: "Clinical", href: "/dashboard/clinical" },
      { id: "workforce", label: "Workforce", href: "/dashboard/workforce" },
      { id: "governance", label: "Governance", href: "/dashboard/compliance" },
      { id: "coach", label: "CHRIS", href: "/dashboard/coach" },
    ],
    homeRoute: "/dashboard", defaultDomainRoute: "/dashboard/clinical",
  },
  dataScope: { facilityLevel: "portfolio", canViewIndividualTeams: true, canViewFinancials: true, canViewPSHDetail: true, canViewGovernancePacks: true },
  todaysPicture: {
    enabled: true,
    systemPromptContext: "You are briefing the platform operator. Summarise platform health: provider count, connector health, any failures, ARR. Include any provider requiring attention.",
    dataInputs: ["platform_health", "connector_status", "provider_status", "commercial_pipeline"],
    tone: "operational", maxLength: 80,
    regenerateTriggers: ["connector_failure", "provider_churn_risk"],
  },
  domainStrip: [
    { name: "Clinical", dataKey: "clinical_summary", href: "/dashboard/clinical" },
    { name: "Workforce", dataKey: "workforce_summary", href: "/dashboard/workforce" },
    { name: "Governance", dataKey: "governance_summary", href: "/dashboard/compliance" },
    { name: "Operations", dataKey: "operations_summary", href: "/dashboard/operations" },
    { name: "Financial", dataKey: "financial_summary", href: "/dashboard/financial" },
  ],
  actionPriority: [],
  chrisCoach: {
    persona: "operational",
    contextInputs: ["all"],
    suggestedPrompts: {},
    canAccessThriveLoop: true, voiceEnabled: true, canCreateQueueItems: true, canSendAlerts: true,
  },
  notifications: {
    iMessage: ["connector_failure", "material_incident", "sirs_cat1"],
    inApp: ["connector_failure", "material_incident", "sirs_cat1", "sirs_cat2_deadline", "care_minutes_breach"],
    doNotDisturb: true,
  },
  packReview: {
    canReview: ["board_pack", "elt_pack", "clinical_governance", "qr_committee", "whs_committee", "pc_committee", "finance_monthly", "qfr"],
    canApprove: ["board_pack", "elt_pack", "clinical_governance", "qr_committee", "whs_committee", "pc_committee", "finance_monthly", "qfr"],
    canDistribute: ["board_pack", "elt_pack", "clinical_governance", "qr_committee", "whs_committee", "pc_committee"],
    readOnly: [],
  },
  features: features({
    sirs_workflow: "full", care_minutes: "full", quality_indicators: "full", clinical_audits: "full",
    psh_heatmap: "full", iso_45003_evidence: "full", financial_dashboard: "full", annacc_revenue: "full",
    qfr_submission: "full", corrective_actions: "full", compliance_register: "full", risk_register: "full",
    governance_packs: "full", reporting_cycles: "full", board_pack_reader: "full",
    leader_loop_analytics: "full", training_compliance: "full", team_pulse: "full",
    chris_coach: "full", thrive_loop: "full", operator_dashboard: "full",
    portfolio_view: "full", team_briefing: "full", leader_loop: "full",
    practice_library: "full", convergence_events: "full", wc_monitor: "full",
  }),
  reportingCycles: ["board_pack", "elt_pack", "clinical_governance", "qr_committee", "whs_committee", "pc_committee", "finance_monthly", "qfr"],
  allowedActions: ["provider_data_export", "provider_offboarding"],
};

// Facility GM mirrors DON
const FACILITY_GM: RoleConfig = { ...DON, role: "facility_gm", displayName: "Facility General Manager" };

// ELT Member mirrors CEO with read-only packs
const ELT_MEMBER: RoleConfig = {
  ...CEO, role: "elt_member", displayName: "ELT Member",
  packReview: { canReview: [], canApprove: [], canDistribute: [], readOnly: ["elt_pack", "board_pack"] },
};

// Frontline Staff — minimal, pulse only
const FRONTLINE_STAFF: RoleConfig = {
  role: "frontline_staff", displayName: "Frontline Staff",
  nav: { sections: [], bottomTabs: [], homeRoute: "/team-loop/pulse", defaultDomainRoute: "/team-loop/pulse" },
  dataScope: { facilityLevel: "single", canViewIndividualTeams: false, canViewFinancials: false, canViewPSHDetail: false, canViewGovernancePacks: false },
  todaysPicture: { enabled: false, systemPromptContext: "", dataInputs: [], tone: "operational", maxLength: 0, regenerateTriggers: [] },
  domainStrip: [], actionPriority: [],
  chrisCoach: {
    persona: "operational", contextInputs: ["team_data"],
    suggestedPrompts: { "/team-loop/pulse": ["I need help with something at work"] },
    canAccessThriveLoop: false, voiceEnabled: true, canCreateQueueItems: false, canSendAlerts: false,
  },
  notifications: { iMessage: [], inApp: [], doNotDisturb: false },
  packReview: { canReview: [], canApprove: [], canDistribute: [], readOnly: [] },
  features: features({ team_pulse: "full", chris_coach: "full" }),
  reportingCycles: [], allowedActions: [],
};

// ============================================================================
// CONFIG REGISTRY
// ============================================================================

const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  don: DON,
  facility_gm: FACILITY_GM,
  ceo: CEO,
  cfo: CFO,
  clinical_director: CLINICAL_DIRECTOR,
  quality_lead: QUALITY_LEAD,
  whs_lead: WHS_LEAD,
  hr_manager: HR_MANAGER,
  elt_member: ELT_MEMBER,
  board_member: BOARD_MEMBER,
  team_leader: TEAM_LEADER,
  frontline_staff: FRONTLINE_STAFF,
  operator: OPERATOR,
};

export function getRoleConfig(role: Role): RoleConfig {
  return ROLE_CONFIGS[role] ?? ROLE_CONFIGS.don;
}

export function getAllRoles(): Role[] {
  return Object.keys(ROLE_CONFIGS) as Role[];
}
