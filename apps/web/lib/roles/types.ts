// ============================================================================
// Role Configuration Types
// Single source of truth for all role behaviour in CHRIS.
// ============================================================================

export type Role =
  | "don" | "facility_gm" | "ceo" | "cfo" | "clinical_director"
  | "quality_lead" | "whs_lead" | "hr_manager" | "elt_member"
  | "board_member" | "team_leader" | "frontline_staff" | "operator";

export type FeatureAccess = "full" | "read" | "hidden";
export type DataScope = "single" | "multi" | "portfolio" | "aggregate_only";
export type CoachPersona = "operational" | "executive" | "clinical" | "financial" | "compliance" | "development" | "readonly";
export type PictureTone = "operational" | "strategic" | "clinical" | "financial" | "compliance";

export type AlertType =
  | "sirs_cat1" | "sirs_cat2_deadline" | "sirs_submitted"
  | "care_minutes_breach" | "care_minutes_at_risk" | "rn_coverage_gap"
  | "psh_convergence_critical" | "psh_convergence_elevated" | "wc_predictive"
  | "pack_ready" | "pack_overdue" | "compliance_at_risk"
  | "training_expiry" | "turnover_spike" | "agency_spike"
  | "connector_failure" | "material_incident" | "star_rating_change"
  | "team_briefing_ready" | "leader_loop_due" | "practice_outcome"
  | "board_notification";

export type PackType =
  | "board_pack" | "elt_pack" | "clinical_governance" | "qr_committee"
  | "whs_committee" | "pc_committee" | "finance_monthly" | "qfr"
  | "team_briefing" | "todays_briefing";

export type ActionCategory = string; // from @chris/db execution types

export interface NavSection {
  title: string;
  href?: string;
  items: Array<{ label: string; href: string; icon: string }>;
}

export interface BottomTab {
  id: string;
  label: string;
  href: string;
}

export interface DomainStripItem {
  name: string;
  dataKey: string; // which canonical data to query
  href: string;
}

export interface ActionPriorityRule {
  condition: string; // e.g., "sirs_cat1_open", "care_minutes_breach"
  actionType: string;
  label: string;
  route: string;
}

export interface RoleConfig {
  role: Role;
  displayName: string;

  nav: {
    sections: NavSection[];
    bottomTabs: BottomTab[];
    homeRoute: string;
    defaultDomainRoute: string;
  };

  dataScope: {
    facilityLevel: DataScope;
    canViewIndividualTeams: boolean;
    canViewFinancials: boolean;
    canViewPSHDetail: boolean;
    canViewGovernancePacks: boolean;
  };

  todaysPicture: {
    enabled: boolean;
    systemPromptContext: string;
    dataInputs: string[];
    tone: PictureTone;
    maxLength: number;
    regenerateTriggers: string[];
  };

  domainStrip: DomainStripItem[];

  actionPriority: ActionPriorityRule[];

  chrisCoach: {
    persona: CoachPersona;
    contextInputs: string[];
    suggestedPrompts: Record<string, string[]>;
    canAccessThriveLoop: boolean;
    voiceEnabled: boolean;
    canCreateQueueItems: boolean;
    canSendAlerts: boolean;
  };

  notifications: {
    iMessage: AlertType[];
    inApp: AlertType[];
    doNotDisturb: boolean;
  };

  packReview: {
    canReview: PackType[];
    canApprove: PackType[];
    canDistribute: PackType[];
    readOnly: PackType[];
  };

  features: Record<string, FeatureAccess>;

  reportingCycles: PackType[];

  allowedActions: ActionCategory[];
}
