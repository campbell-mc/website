// ============================================================================
// CHRIS Canonical Types
// These types are the source of truth for all domain values in CHRIS.
// ============================================================================

export type ProviderType = "residential" | "home_care" | "ndis" | "respite" | "day_therapy";

export type SubscriptionTier = "workforce" | "intelligence" | "comply" | "benchmarks";

export type RoleCategory =
  | "rn"
  | "en"
  | "ain"
  | "allied_health"
  | "admin"
  | "management"
  | "cleaning_catering"
  | "other";

export type EmploymentType = "permanent_ft" | "permanent_pt" | "casual" | "agency" | "contract";

export type ShiftType = "morning" | "afternoon" | "night" | "split";

export type CareMinutesStatus = "compliant" | "at_risk" | "non_compliant";

export type IncidentCategory =
  | "fall"
  | "medication_error"
  | "pressure_injury"
  | "skin_tear"
  | "aggression"
  | "missing_resident"
  | "unexpected_death"
  | "choking"
  | "other_clinical"
  | "whs_injury"
  | "near_miss"
  | "environmental";

export type IncidentSeverity = "low" | "moderate" | "serious" | "critical" | "sentinel";

export type SIRSCategory = 1 | 2;

export type ConfidenceFlag = "normal" | "low_participation" | "stale_data" | "partial_data";

export type ConvergenceSeverity = "elevated" | "high" | "critical";

export type InterventionOutcome =
  | "hazard_reduced"
  | "no_change"
  | "hazard_worsened"
  | "not_measured";

export type DONReviewType =
  | "sirs_classification"
  | "welfare_escalation"
  | "pack_approval"
  | "regulatory_correspondence"
  | "rn_coverage_response"
  | "care_minutes_breach";

export type DONReviewUrgency = "immediate" | "urgent" | "routine";

export type DONReviewStatus = "pending" | "approved" | "modified" | "rejected";

export type LeaderRole = "team_leader" | "don" | "facility_gm" | "quality_lead" | "ceo";

export type PSHDomain =
  | "PSH_01"
  | "PSH_02"
  | "PSH_03"
  | "PSH_04"
  | "PSH_05"
  | "PSH_06"
  | "PSH_07"
  | "PSH_08"
  | "PSH_09"
  | "PSH_10"
  | "PSH_11"
  | "PSH_12"
  | "PSH_13"
  | "PSH_14"
  | "PSH_15"
  | "PSH_16";

export const PSH_DOMAIN_LABELS: Record<PSHDomain, string> = {
  PSH_01: "High Job Demands",
  PSH_02: "Lack of Support",
  PSH_03: "Poor Organisational Justice",
  PSH_04: "Low Job Control",
  PSH_05: "Poor Relationships",
  PSH_06: "Role Conflict",
  PSH_07: "Change Management",
  PSH_08: "Traumatic Exposure",
  PSH_09: "Remote / Isolated Work",
  PSH_10: "Violence & Aggression",
  PSH_11: "Harassment & Bullying",
  PSH_12: "Emotional Demands",
  PSH_13: "Low Recognition",
  PSH_14: "Poor Physical Environment",
  PSH_15: "Job Insecurity",
  PSH_16: "Work-Life Imbalance",
};
