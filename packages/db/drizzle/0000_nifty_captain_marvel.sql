CREATE TABLE "don_review_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"item_type" text NOT NULL,
	"urgency" text DEFAULT 'routine' NOT NULL,
	"summary" text NOT NULL,
	"full_context" jsonb NOT NULL,
	"chris_recommendation" text,
	"deadline" timestamp with time zone,
	"notified_at" timestamp with time zone,
	"reminder_1_at" timestamp with time zone,
	"escalated_at" timestamp with time zone,
	"status" text DEFAULT 'pending' NOT NULL,
	"decided_at" timestamp with time zone,
	"decided_by" text,
	"don_note" text,
	"modified_content" jsonb,
	"action_executed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"provider_id" uuid NOT NULL,
	"name" text NOT NULL,
	"facility_type" text DEFAULT 'residential' NOT NULL,
	"state" text NOT NULL,
	"suburb" text,
	"postcode" text,
	"bed_count" integer,
	"operational_beds" integer,
	"dementia_specialist" boolean DEFAULT false,
	"rn_24hr_required" boolean DEFAULT true,
	"an_acc_active" boolean DEFAULT true,
	"accreditation_status" text DEFAULT 'accredited',
	"accreditation_expiry" date,
	"star_rating" integer,
	"connected_systems" jsonb DEFAULT '[]'::jsonb,
	"last_ingestion_at" timestamp with time zone,
	"operational_health_score" numeric(4, 3),
	"config" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "facility_hazard_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"team_id" text NOT NULL,
	"cycle_id" integer NOT NULL,
	"cycle_start" date NOT NULL,
	"cycle_end" date NOT NULL,
	"calculated_at" timestamp with time zone DEFAULT now(),
	"psh_01_high_job_demands" numeric(5, 4),
	"psh_02_lack_of_support" numeric(5, 4),
	"psh_03_poor_org_justice" numeric(5, 4),
	"psh_04_low_job_control" numeric(5, 4),
	"psh_05_poor_relationships" numeric(5, 4),
	"psh_06_role_conflict" numeric(5, 4),
	"psh_07_change_management" numeric(5, 4),
	"psh_08_traumatic_exposure" numeric(5, 4),
	"psh_09_remote_isolated" numeric(5, 4),
	"psh_10_violence_aggression" numeric(5, 4),
	"psh_11_harassment_bullying" numeric(5, 4),
	"psh_12_emotional_demands" numeric(5, 4),
	"psh_13_low_recognition" numeric(5, 4),
	"psh_14_poor_environment" numeric(5, 4),
	"psh_15_job_insecurity" numeric(5, 4),
	"psh_16_work_life_imbalance" numeric(5, 4),
	"overall_score" numeric(5, 4),
	"pulse_component" numeric(5, 4),
	"operational_component" numeric(5, 4),
	"pulse_participation_rate" numeric(5, 4),
	"eligible_respondents" integer,
	"actual_respondents" integer,
	"confidence_flag" text DEFAULT 'normal',
	"convergence_detected" boolean DEFAULT false,
	"convergence_severity" text,
	"convergence_pairs" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "facility_incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"incident_date" date NOT NULL,
	"incident_time" time,
	"reported_at" timestamp with time zone NOT NULL,
	"source_system" text NOT NULL,
	"source_incident_id" text,
	"ingested_at" timestamp with time zone DEFAULT now(),
	"incident_category" text NOT NULL,
	"incident_subcategory" text,
	"severity" text DEFAULT 'low' NOT NULL,
	"sirs_assessed" boolean DEFAULT false,
	"sirs_category" integer,
	"sirs_classification_confidence" text,
	"sirs_classification_rationale" text,
	"sirs_reporting_deadline" timestamp with time zone,
	"sirs_reported_at" timestamp with time zone,
	"sirs_submission_id" text,
	"shift_type" text,
	"location_area" text,
	"role_category_involved" text,
	"corrective_action_required" boolean DEFAULT false,
	"corrective_action_due" date,
	"corrective_action_completed_at" timestamp with time zone,
	"qi_category" text,
	"amended_by" uuid
);
--> statement-breakpoint
CREATE TABLE "facility_interventions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"team_id" text NOT NULL,
	"cycle_id" integer NOT NULL,
	"prescribed_at" timestamp with time zone DEFAULT now(),
	"practice_id" text NOT NULL,
	"practice_name" text NOT NULL,
	"hazard_domain" text NOT NULL,
	"target_hazard_score" numeric(5, 4),
	"selection_rank" integer,
	"cross_facility_success_rate" numeric(5, 4),
	"team_loop_completed" boolean,
	"leader_confidence_post_loop" integer,
	"outcome_measured_at" timestamp with time zone,
	"outcome_hazard_score" numeric(5, 4),
	"outcome" text,
	"outcome_delta" numeric(6, 4)
);
--> statement-breakpoint
CREATE TABLE "facility_rostering" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"shift_date" date NOT NULL,
	"shift_type" text NOT NULL,
	"source_system" text NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now(),
	"scheduled_rn_hours" numeric(8, 2) DEFAULT '0',
	"actual_rn_hours" numeric(8, 2) DEFAULT '0',
	"scheduled_en_hours" numeric(8, 2) DEFAULT '0',
	"actual_en_hours" numeric(8, 2) DEFAULT '0',
	"scheduled_ain_hours" numeric(8, 2) DEFAULT '0',
	"actual_ain_hours" numeric(8, 2) DEFAULT '0',
	"operational_beds" integer,
	"required_total_minutes" numeric(10, 2),
	"required_rn_minutes" numeric(10, 2),
	"actual_total_minutes" numeric(10, 2),
	"actual_rn_minutes" numeric(10, 2),
	"care_minutes_compliance_status" text,
	"agency_shifts" integer DEFAULT 0,
	"unfilled_shifts" integer DEFAULT 0,
	"rn_coverage_gap" boolean DEFAULT false,
	"rn_coverage_gap_hours" numeric(6, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "facility_workforce" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"source_system" text NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now(),
	"role_category" text NOT NULL,
	"employment_type" text NOT NULL,
	"headcount" integer NOT NULL,
	"fte" numeric(8, 2),
	"new_starters" integer DEFAULT 0,
	"terminations" integer DEFAULT 0,
	"voluntary_terminations" integer DEFAULT 0,
	"sick_leave_hours" numeric(10, 2) DEFAULT '0',
	"sick_leave_occasions" integer DEFAULT 0,
	"workers_comp_hours" numeric(10, 2) DEFAULT '0',
	"overtime_hours" numeric(10, 2) DEFAULT '0',
	"agency_hours" numeric(10, 2) DEFAULT '0',
	"unfilled_shifts" integer DEFAULT 0,
	"absenteeism_rate" numeric(6, 4),
	"turnover_rate" numeric(6, 4),
	"agency_dependency_pct" numeric(6, 4),
	"confidence_score" numeric(4, 3) DEFAULT '1.0'
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL,
	"abn" text,
	"provider_type" text DEFAULT 'residential' NOT NULL,
	"primary_state" text NOT NULL,
	"site_count" integer DEFAULT 1,
	"subscription_tier" text DEFAULT 'workforce' NOT NULL,
	"subscription_active" boolean DEFAULT true,
	"onboarded_at" timestamp with time zone,
	"config" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "providers_abn_unique" UNIQUE("abn")
);
--> statement-breakpoint
ALTER TABLE "don_review_items" ADD CONSTRAINT "don_review_items_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility_hazard_scores" ADD CONSTRAINT "facility_hazard_scores_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility_incidents" ADD CONSTRAINT "facility_incidents_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility_interventions" ADD CONSTRAINT "facility_interventions_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility_rostering" ADD CONSTRAINT "facility_rostering_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility_workforce" ADD CONSTRAINT "facility_workforce_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_don_review_pending" ON "don_review_items" USING btree ("facility_id","status","urgency","deadline");--> statement-breakpoint
CREATE INDEX "ix_facilities_provider" ON "facilities" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "ix_facilities_state" ON "facilities" USING btree ("state");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_hazard_scores" ON "facility_hazard_scores" USING btree ("facility_id","team_id","cycle_id");--> statement-breakpoint
CREATE INDEX "ix_hazard_scores_facility_cycle" ON "facility_hazard_scores" USING btree ("facility_id","cycle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_incidents_source" ON "facility_incidents" USING btree ("facility_id","source_system","source_incident_id");--> statement-breakpoint
CREATE INDEX "ix_incidents_facility_date" ON "facility_incidents" USING btree ("facility_id","incident_date");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_interventions" ON "facility_interventions" USING btree ("facility_id","team_id","cycle_id","practice_id");--> statement-breakpoint
CREATE INDEX "ix_interventions_facility_cycle" ON "facility_interventions" USING btree ("facility_id","cycle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_rostering" ON "facility_rostering" USING btree ("facility_id","shift_date","shift_type","source_system");--> statement-breakpoint
CREATE INDEX "ix_rostering_facility_date" ON "facility_rostering" USING btree ("facility_id","shift_date");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_workforce" ON "facility_workforce" USING btree ("facility_id","period_start","period_end","role_category","employment_type","source_system");--> statement-breakpoint
CREATE INDEX "ix_workforce_facility_period" ON "facility_workforce" USING btree ("facility_id","period_start");