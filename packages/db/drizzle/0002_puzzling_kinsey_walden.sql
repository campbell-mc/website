CREATE TABLE "alert_loops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"alert_type" text NOT NULL,
	"urgency" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"recipient_role" text NOT NULL,
	"signal_label" text NOT NULL,
	"specific_fact" text NOT NULL,
	"consequence_of_inaction" text,
	"recommended_action" text,
	"response_options" jsonb,
	"delivered_at" timestamp with time zone,
	"delivery_method" text,
	"delivery_confirmed" boolean DEFAULT false,
	"read_at" timestamp with time zone,
	"responded_at" timestamp with time zone,
	"response_type" text,
	"response_content" text,
	"executed_at" timestamp with time zone,
	"executed_by" text,
	"execution_result" jsonb,
	"resolved_at" timestamp with time zone,
	"evidence_record_id" uuid,
	"escalated_at" timestamp with time zone,
	"escalated_to" text,
	"parent_alert_id" uuid,
	"suppressed_duplicate" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "autonomy_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"action_category" text NOT NULL,
	"default_tier" integer DEFAULT 2 NOT NULL,
	"ceiling_tier" integer DEFAULT 2 NOT NULL,
	"is_reversible" boolean DEFAULT true NOT NULL,
	"requires_saga" boolean DEFAULT false NOT NULL,
	"trust_threshold" numeric(5, 4) DEFAULT '0.8000',
	"hard_ceiling" boolean DEFAULT false,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "evidence_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"record_type" text NOT NULL,
	"action_category" text NOT NULL,
	"triggered_at" timestamp with time zone NOT NULL,
	"delivered_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"executed_at" timestamp with time zone,
	"triggered_by" text DEFAULT 'chris' NOT NULL,
	"executed_by" text,
	"approved_by" text,
	"signal_data" jsonb,
	"recommendation" text,
	"decision" text,
	"modification" text,
	"outcome" text,
	"compliance_ref" text,
	"clinical_ref" text,
	"external_ref" text,
	"superseded_by" uuid
);
--> statement-breakpoint
CREATE TABLE "trust_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"action_category" text NOT NULL,
	"score" numeric(5, 4) DEFAULT '0.2000' NOT NULL,
	"consecutive_approvals" integer DEFAULT 0,
	"total_approvals" integer DEFAULT 0,
	"total_modifications" integer DEFAULT 0,
	"total_rejections" integer DEFAULT 0,
	"last_activity_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "alert_loops" ADD CONSTRAINT "alert_loops_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "autonomy_config" ADD CONSTRAINT "autonomy_config_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_records" ADD CONSTRAINT "evidence_records_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trust_scores" ADD CONSTRAINT "trust_scores_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_alert_facility_status" ON "alert_loops" USING btree ("facility_id","status");--> statement-breakpoint
CREATE INDEX "ix_alert_type_created" ON "alert_loops" USING btree ("alert_type","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_autonomy_facility_action" ON "autonomy_config" USING btree ("facility_id","action_category");--> statement-breakpoint
CREATE INDEX "ix_evidence_facility_triggered" ON "evidence_records" USING btree ("facility_id","triggered_at");--> statement-breakpoint
CREATE INDEX "ix_evidence_action_category" ON "evidence_records" USING btree ("action_category");--> statement-breakpoint
CREATE INDEX "ix_evidence_record_type" ON "evidence_records" USING btree ("record_type");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_trust_facility_action" ON "trust_scores" USING btree ("facility_id","action_category");--> statement-breakpoint
CREATE INDEX "ix_trust_facility" ON "trust_scores" USING btree ("facility_id");