// ============================================================================
// Execution Layer Types (Doc 17)
// Action registry, trust engine, evidence chain, alert loop
// ============================================================================

// --- Approval Tiers ---
export type ApprovalTier = 1 | 2 | 3;
// Tier 1: Autonomous — CHRIS acts, logs, notifies after
// Tier 2: Approval Queue — CHRIS prepares, human approves, CHRIS executes
// Tier 3: Human Initiates — CHRIS supports, human executes

// --- Action Categories (Complete Registry from Doc 17) ---
export type ActionCategory =
  // Intelligence & briefing
  | "monday_briefing_delivery"
  | "team_briefing_delivery"
  | "leader_loop_delivery"
  | "elt_pack_distribution"
  | "qr_committee_pack"
  | "finance_committee_pack"
  | "board_pack_distribution"
  | "board_pack_to_board"
  // iMessage alerts
  | "care_minutes_alert"
  | "sirs_deadline_reminder"
  | "rn_coverage_gap_alert"
  | "psh_convergence_alert"
  | "governance_pack_ready_alert"
  | "regulatory_deadline_alert"
  | "board_material_incident_alert"
  | "connector_failure_alert"
  | "individual_welfare_flag_alert"
  // Clinical documentation
  | "incident_report_draft"
  | "incident_canonical_record"
  | "sirs_pre_screening"
  | "handover_note_draft"
  | "clinical_audit_record"
  | "care_plan_update_draft"
  | "clinical_write_back"
  | "medication_reference_query"
  // Compliance & regulatory
  | "sirs_category_1_draft"
  | "sirs_category_2_draft"
  | "sirs_submission"
  | "gpms_qi_submission"
  | "gpms_care_minutes_submission"
  | "gpms_qfr_submission"
  | "compliance_register_update"
  | "compliance_obligation_alert"
  | "regulatory_correspondence_log"
  | "corrective_action_creation"
  // Intervention & practice
  | "practice_selection"
  | "practice_delivery"
  | "intervention_record_creation"
  | "practice_outcome_measurement"
  | "don_escalation_routing"
  | "advocacy_prompt_generation"
  // Data & system
  | "connector_data_pull"
  | "canonical_data_write"
  | "hazard_score_calculation"
  | "convergence_detection"
  | "bayesian_reliability_update"
  | "cross_facility_pattern_update"
  | "provider_data_export"
  | "provider_offboarding";

// --- Hard Ceilings (can NEVER be fully autonomous) ---
export const HARD_CEILING_ACTIONS: ActionCategory[] = [
  "sirs_submission",
  "gpms_qi_submission",
  "gpms_care_minutes_submission",
  "gpms_qfr_submission",
  "board_pack_to_board",
  "regulatory_correspondence_log",
  "individual_welfare_flag_alert",
  "provider_data_export",
  "provider_offboarding",
];

// Actions that are ALWAYS Tier 3 (human executes)
export const ALWAYS_TIER_3: ActionCategory[] = [
  "gpms_qfr_submission",
  "provider_data_export",
  "provider_offboarding",
];

// --- Action Registry Entry ---
export interface ActionRegistryEntry {
  category: ActionCategory;
  defaultTier: ApprovalTier;
  ceilingTier: ApprovalTier;
  isReversible: boolean;
  requiresSaga: boolean;
  description: string;
}

// --- Evidence Record Types ---
export type EvidenceRecordType = "alert" | "queue_item" | "action" | "outcome";
export type EvidenceDecision = "approve" | "modify" | "reject";

// --- Alert Loop Types ---
export type AlertUrgency = "immediate" | "urgent" | "routine";
export type AlertStatus = "open" | "responded" | "executing" | "resolved" | "escalated";
export type AlertResponseType = "button" | "text" | "no_response";
export type DeliveryMethod = "imessage" | "sms" | "in_app";

// --- Trust Engine Types ---
export type TrustPhase = "observe" | "assist" | "operate" | "manage" | "autonomous";

export function getTrustPhase(score: number): TrustPhase {
  if (score >= 0.9) return "autonomous";
  if (score >= 0.7) return "manage";
  if (score >= 0.5) return "operate";
  if (score >= 0.3) return "assist";
  return "observe";
}

// --- Default Action Registry ---
export const ACTION_REGISTRY: ActionRegistryEntry[] = [
  // Intelligence outputs
  { category: "monday_briefing_delivery", defaultTier: 2, ceilingTier: 1, isReversible: true, requiresSaga: false, description: "Deliver Monday Briefing to DON" },
  { category: "team_briefing_delivery", defaultTier: 2, ceilingTier: 1, isReversible: true, requiresSaga: false, description: "Deliver Team Briefing to team leader" },
  { category: "leader_loop_delivery", defaultTier: 2, ceilingTier: 1, isReversible: true, requiresSaga: false, description: "Deliver Leader Loop to team leader" },
  { category: "board_pack_distribution", defaultTier: 2, ceilingTier: 2, isReversible: true, requiresSaga: true, description: "Distribute governance pack internally" },
  { category: "board_pack_to_board", defaultTier: 2, ceilingTier: 2, isReversible: false, requiresSaga: true, description: "Send Board Pack to Board members" },
  // iMessage alerts (all Tier 1 — autonomous notifications)
  { category: "care_minutes_alert", defaultTier: 1, ceilingTier: 1, isReversible: false, requiresSaga: false, description: "Alert DON about care minutes breach" },
  { category: "sirs_deadline_reminder", defaultTier: 1, ceilingTier: 1, isReversible: false, requiresSaga: false, description: "Remind DON of approaching SIRS deadline" },
  { category: "rn_coverage_gap_alert", defaultTier: 1, ceilingTier: 1, isReversible: false, requiresSaga: false, description: "Alert DON about RN coverage gap" },
  { category: "psh_convergence_alert", defaultTier: 1, ceilingTier: 1, isReversible: false, requiresSaga: false, description: "Alert DON about PSH convergence event" },
  { category: "connector_failure_alert", defaultTier: 1, ceilingTier: 1, isReversible: false, requiresSaga: false, description: "Alert about connector failure" },
  // Compliance
  { category: "sirs_submission", defaultTier: 3, ceilingTier: 2, isReversible: false, requiresSaga: true, description: "Submit SIRS report to ACQSC" },
  { category: "gpms_qi_submission", defaultTier: 2, ceilingTier: 2, isReversible: false, requiresSaga: true, description: "Submit QI data to GPMS" },
  { category: "gpms_qfr_submission", defaultTier: 3, ceilingTier: 3, isReversible: false, requiresSaga: true, description: "Submit QFR to GPMS (human always)" },
  { category: "compliance_register_update", defaultTier: 1, ceilingTier: 1, isReversible: false, requiresSaga: false, description: "Update compliance register (append-only)" },
  { category: "corrective_action_creation", defaultTier: 2, ceilingTier: 1, isReversible: true, requiresSaga: false, description: "Create corrective action item" },
  // Interventions
  { category: "practice_selection", defaultTier: 1, ceilingTier: 1, isReversible: true, requiresSaga: false, description: "Select practice from library" },
  { category: "practice_delivery", defaultTier: 2, ceilingTier: 1, isReversible: true, requiresSaga: false, description: "Deliver practice in Team Briefing" },
  { category: "don_escalation_routing", defaultTier: 1, ceilingTier: 1, isReversible: false, requiresSaga: false, description: "Route escalation to DON queue" },
  // System
  { category: "connector_data_pull", defaultTier: 1, ceilingTier: 1, isReversible: false, requiresSaga: false, description: "Pull data from source system" },
  { category: "canonical_data_write", defaultTier: 1, ceilingTier: 1, isReversible: false, requiresSaga: false, description: "Write to canonical data layer" },
  { category: "hazard_score_calculation", defaultTier: 1, ceilingTier: 1, isReversible: false, requiresSaga: false, description: "Calculate PSH hazard scores" },
  { category: "provider_data_export", defaultTier: 3, ceilingTier: 3, isReversible: false, requiresSaga: true, description: "Export provider data (human always)" },
  { category: "provider_offboarding", defaultTier: 3, ceilingTier: 3, isReversible: false, requiresSaga: true, description: "Offboard provider (operator only)" },
];
