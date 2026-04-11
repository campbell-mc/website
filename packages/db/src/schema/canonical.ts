import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  date,
  time,
  jsonb,
  uniqueIndex,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ============================================================================
// CHRIS Canonical Schema
// De-identification at the connector boundary: individual names, employee IDs,
// and personal identifiers NEVER enter the canonical store.
// ============================================================================

// --- providers ---
export const providers = pgTable("providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  name: text("name").notNull(),
  abn: text("abn").unique(),
  providerType: text("provider_type").notNull().default("residential"),
  primaryState: text("primary_state").notNull(),
  siteCount: integer("site_count").default(1),
  subscriptionTier: text("subscription_tier").notNull().default("workforce"),
  subscriptionActive: boolean("subscription_active").default(true),
  onboardedAt: timestamp("onboarded_at", { withTimezone: true }),
  config: jsonb("config").default({}),
});

// --- facilities ---
export const facilities = pgTable(
  "facilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => providers.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    facilityType: text("facility_type").notNull().default("residential"),
    state: text("state").notNull(),
    suburb: text("suburb"),
    postcode: text("postcode"),
    bedCount: integer("bed_count"),
    operationalBeds: integer("operational_beds"),
    dementiaSpecialist: boolean("dementia_specialist").default(false),
    rn24hrRequired: boolean("rn_24hr_required").default(true),
    anAccActive: boolean("an_acc_active").default(true),
    accreditationStatus: text("accreditation_status").default("accredited"),
    accreditationExpiry: date("accreditation_expiry"),
    starRating: integer("star_rating"),
    connectedSystems: jsonb("connected_systems").default([]),
    lastIngestionAt: timestamp("last_ingestion_at", { withTimezone: true }),
    operationalHealthScore: decimal("operational_health_score", {
      precision: 4,
      scale: 3,
    }),
    config: jsonb("config").default({}),
  },
  (table) => [
    index("ix_facilities_provider").on(table.providerId),
    index("ix_facilities_state").on(table.state),
  ]
);

// --- facility_workforce (append-only historical) ---
// Aggregated by role_category + employment_type. NEVER by individual.
export const facilityWorkforce = pgTable(
  "facility_workforce",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),
    periodStart: date("period_start").notNull(),
    periodEnd: date("period_end").notNull(),
    sourceSystem: text("source_system").notNull(),
    ingestedAt: timestamp("ingested_at", { withTimezone: true }).defaultNow(),
    roleCategory: text("role_category").notNull(),
    employmentType: text("employment_type").notNull(),
    headcount: integer("headcount").notNull(),
    fte: decimal("fte", { precision: 8, scale: 2 }),
    newStarters: integer("new_starters").default(0),
    terminations: integer("terminations").default(0),
    voluntaryTerminations: integer("voluntary_terminations").default(0),
    sickLeaveHours: decimal("sick_leave_hours", { precision: 10, scale: 2 }).default("0"),
    sickLeaveOccasions: integer("sick_leave_occasions").default(0),
    workersCompHours: decimal("workers_comp_hours", { precision: 10, scale: 2 }).default("0"),
    overtimeHours: decimal("overtime_hours", { precision: 10, scale: 2 }).default("0"),
    agencyHours: decimal("agency_hours", { precision: 10, scale: 2 }).default("0"),
    unfilledShifts: integer("unfilled_shifts").default(0),
    absenteeismRate: decimal("absenteeism_rate", { precision: 6, scale: 4 }),
    turnoverRate: decimal("turnover_rate", { precision: 6, scale: 4 }),
    agencyDependencyPct: decimal("agency_dependency_pct", { precision: 6, scale: 4 }),
    confidenceScore: decimal("confidence_score", { precision: 4, scale: 3 }).default("1.0"),
  },
  (table) => [
    uniqueIndex("uq_workforce").on(
      table.facilityId,
      table.periodStart,
      table.periodEnd,
      table.roleCategory,
      table.employmentType,
      table.sourceSystem
    ),
    index("ix_workforce_facility_period").on(table.facilityId, table.periodStart),
  ]
);

// --- facility_rostering (append-only historical) ---
// Hours by role category. NEVER by individual.
export const facilityRostering = pgTable(
  "facility_rostering",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),
    shiftDate: date("shift_date").notNull(),
    shiftType: text("shift_type").notNull(),
    sourceSystem: text("source_system").notNull(),
    ingestedAt: timestamp("ingested_at", { withTimezone: true }).defaultNow(),
    scheduledRnHours: decimal("scheduled_rn_hours", { precision: 8, scale: 2 }).default("0"),
    actualRnHours: decimal("actual_rn_hours", { precision: 8, scale: 2 }).default("0"),
    scheduledEnHours: decimal("scheduled_en_hours", { precision: 8, scale: 2 }).default("0"),
    actualEnHours: decimal("actual_en_hours", { precision: 8, scale: 2 }).default("0"),
    scheduledAinHours: decimal("scheduled_ain_hours", { precision: 8, scale: 2 }).default("0"),
    actualAinHours: decimal("actual_ain_hours", { precision: 8, scale: 2 }).default("0"),
    operationalBeds: integer("operational_beds"),
    requiredTotalMinutes: decimal("required_total_minutes", { precision: 10, scale: 2 }),
    requiredRnMinutes: decimal("required_rn_minutes", { precision: 10, scale: 2 }),
    actualTotalMinutes: decimal("actual_total_minutes", { precision: 10, scale: 2 }),
    actualRnMinutes: decimal("actual_rn_minutes", { precision: 10, scale: 2 }),
    careMinutesComplianceStatus: text("care_minutes_compliance_status"),
    agencyShifts: integer("agency_shifts").default(0),
    unfilledShifts: integer("unfilled_shifts").default(0),
    rnCoverageGap: boolean("rn_coverage_gap").default(false),
    rnCoverageGapHours: decimal("rn_coverage_gap_hours", { precision: 6, scale: 2 }).default("0"),
  },
  (table) => [
    uniqueIndex("uq_rostering").on(
      table.facilityId,
      table.shiftDate,
      table.shiftType,
      table.sourceSystem
    ),
    index("ix_rostering_facility_date").on(table.facilityId, table.shiftDate),
  ]
);

// --- facility_incidents (APPEND-ONLY: never updated, amendments are new records) ---
export const facilityIncidents = pgTable(
  "facility_incidents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),
    incidentDate: date("incident_date").notNull(),
    incidentTime: time("incident_time"),
    reportedAt: timestamp("reported_at", { withTimezone: true }).notNull(),
    sourceSystem: text("source_system").notNull(),
    sourceIncidentId: text("source_incident_id"),
    ingestedAt: timestamp("ingested_at", { withTimezone: true }).defaultNow(),
    incidentCategory: text("incident_category").notNull(),
    incidentSubcategory: text("incident_subcategory"),
    severity: text("severity").notNull().default("low"),
    sirsAssessed: boolean("sirs_assessed").default(false),
    sirsCategory: integer("sirs_category"),
    sirsClassificationConfidence: text("sirs_classification_confidence"),
    sirsClassificationRationale: text("sirs_classification_rationale"),
    sirsReportingDeadline: timestamp("sirs_reporting_deadline", { withTimezone: true }),
    sirsReportedAt: timestamp("sirs_reported_at", { withTimezone: true }),
    sirsSubmissionId: text("sirs_submission_id"),
    shiftType: text("shift_type"),
    locationArea: text("location_area"),
    roleCategoryInvolved: text("role_category_involved"),
    correctiveActionRequired: boolean("corrective_action_required").default(false),
    correctiveActionDue: date("corrective_action_due"),
    correctiveActionCompletedAt: timestamp("corrective_action_completed_at", {
      withTimezone: true,
    }),
    qiCategory: text("qi_category"),
    amendedBy: uuid("amended_by"),
  },
  (table) => [
    uniqueIndex("uq_incidents_source").on(
      table.facilityId,
      table.sourceSystem,
      table.sourceIncidentId
    ),
    index("ix_incidents_facility_date").on(table.facilityId, table.incidentDate),
  ]
);

// --- facility_hazard_scores (APPEND-ONLY: historical record, never updated) ---
export const facilityHazardScores = pgTable(
  "facility_hazard_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),
    teamId: text("team_id").notNull(),
    cycleId: integer("cycle_id").notNull(),
    cycleStart: date("cycle_start").notNull(),
    cycleEnd: date("cycle_end").notNull(),
    calculatedAt: timestamp("calculated_at", { withTimezone: true }).defaultNow(),
    // All 16 ISO 45003 PSH domains (0.0 = no elevation, 1.0 = maximum)
    psh01HighJobDemands: decimal("psh_01_high_job_demands", { precision: 5, scale: 4 }),
    psh02LackOfSupport: decimal("psh_02_lack_of_support", { precision: 5, scale: 4 }),
    psh03PoorOrgJustice: decimal("psh_03_poor_org_justice", { precision: 5, scale: 4 }),
    psh04LowJobControl: decimal("psh_04_low_job_control", { precision: 5, scale: 4 }),
    psh05PoorRelationships: decimal("psh_05_poor_relationships", { precision: 5, scale: 4 }),
    psh06RoleConflict: decimal("psh_06_role_conflict", { precision: 5, scale: 4 }),
    psh07ChangeManagement: decimal("psh_07_change_management", { precision: 5, scale: 4 }),
    psh08TraumaticExposure: decimal("psh_08_traumatic_exposure", { precision: 5, scale: 4 }),
    psh09RemoteIsolated: decimal("psh_09_remote_isolated", { precision: 5, scale: 4 }),
    psh10ViolenceAggression: decimal("psh_10_violence_aggression", { precision: 5, scale: 4 }),
    psh11HarassmentBullying: decimal("psh_11_harassment_bullying", { precision: 5, scale: 4 }),
    psh12EmotionalDemands: decimal("psh_12_emotional_demands", { precision: 5, scale: 4 }),
    psh13LowRecognition: decimal("psh_13_low_recognition", { precision: 5, scale: 4 }),
    psh14PoorEnvironment: decimal("psh_14_poor_environment", { precision: 5, scale: 4 }),
    psh15JobInsecurity: decimal("psh_15_job_insecurity", { precision: 5, scale: 4 }),
    psh16WorkLifeImbalance: decimal("psh_16_work_life_imbalance", { precision: 5, scale: 4 }),
    overallScore: decimal("overall_score", { precision: 5, scale: 4 }),
    pulseComponent: decimal("pulse_component", { precision: 5, scale: 4 }),
    operationalComponent: decimal("operational_component", { precision: 5, scale: 4 }),
    pulseParticipationRate: decimal("pulse_participation_rate", { precision: 5, scale: 4 }),
    eligibleRespondents: integer("eligible_respondents"),
    actualRespondents: integer("actual_respondents"),
    confidenceFlag: text("confidence_flag").default("normal"),
    convergenceDetected: boolean("convergence_detected").default(false),
    convergenceSeverity: text("convergence_severity"),
    convergencePairs: jsonb("convergence_pairs").default([]),
  },
  (table) => [
    uniqueIndex("uq_hazard_scores").on(table.facilityId, table.teamId, table.cycleId),
    index("ix_hazard_scores_facility_cycle").on(table.facilityId, table.cycleId),
  ]
);

// --- facility_interventions (APPEND-ONLY: historical evidence, never updated) ---
export const facilityInterventions = pgTable(
  "facility_interventions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),
    teamId: text("team_id").notNull(),
    cycleId: integer("cycle_id").notNull(),
    prescribedAt: timestamp("prescribed_at", { withTimezone: true }).defaultNow(),
    practiceId: text("practice_id").notNull(),
    practiceName: text("practice_name").notNull(),
    hazardDomain: text("hazard_domain").notNull(),
    targetHazardScore: decimal("target_hazard_score", { precision: 5, scale: 4 }),
    selectionRank: integer("selection_rank"),
    crossFacilitySuccessRate: decimal("cross_facility_success_rate", { precision: 5, scale: 4 }),
    teamLoopCompleted: boolean("team_loop_completed"),
    leaderConfidencePostLoop: integer("leader_confidence_post_loop"),
    outcomeMeasuredAt: timestamp("outcome_measured_at", { withTimezone: true }),
    outcomeHazardScore: decimal("outcome_hazard_score", { precision: 5, scale: 4 }),
    outcome: text("outcome"),
    outcomeDelta: decimal("outcome_delta", { precision: 6, scale: 4 }),
  },
  (table) => [
    uniqueIndex("uq_interventions").on(
      table.facilityId,
      table.teamId,
      table.cycleId,
      table.practiceId
    ),
    index("ix_interventions_facility_cycle").on(table.facilityId, table.cycleId),
  ]
);

// --- don_review_items (APPEND-ONLY: decisions are evidence, never deleted) ---
export const donReviewItems = pgTable(
  "don_review_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    itemType: text("item_type").notNull(),
    urgency: text("urgency").notNull().default("routine"),
    summary: text("summary").notNull(),
    fullContext: jsonb("full_context").notNull(),
    chrisRecommendation: text("chris_recommendation"),
    deadline: timestamp("deadline", { withTimezone: true }),
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    reminder1At: timestamp("reminder_1_at", { withTimezone: true }),
    escalatedAt: timestamp("escalated_at", { withTimezone: true }),
    status: text("status").notNull().default("pending"),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    decidedBy: text("decided_by"),
    donNote: text("don_note"),
    modifiedContent: jsonb("modified_content"),
    actionExecutedAt: timestamp("action_executed_at", { withTimezone: true }),
  },
  (table) => [
    index("ix_don_review_pending").on(
      table.facilityId,
      table.status,
      table.urgency,
      table.deadline
    ),
  ]
);

// --- facility_training_compliance (ELMO connector output) ---
export const facilityTrainingCompliance = pgTable(
  "facility_training_compliance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),
    periodStart: date("period_start").notNull(),
    periodEnd: date("period_end").notNull(),
    trainingType: text("training_type").notNull(),
    roleCategory: text("role_category").notNull(),
    eligibleStaff: integer("eligible_staff").notNull(),
    compliantStaff: integer("compliant_staff").notNull(),
    complianceRate: decimal("compliance_rate", { precision: 5, scale: 4 }).notNull(),
    expiringWithin30d: integer("expiring_within_30d").default(0),
    sourceSystem: text("source_system").notNull().default("elmo"),
    ingestedAt: timestamp("ingested_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_training_compliance").on(
      table.facilityId,
      table.periodStart,
      table.trainingType,
      table.roleCategory
    ),
    index("ix_training_facility_period").on(table.facilityId, table.periodStart),
  ]
);
