CREATE TABLE "alert_cooldowns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"alert_type" text NOT NULL,
	"recipient_role" text NOT NULL,
	"cooldown_until" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "alert_rate_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"recipient_role" text NOT NULL,
	"date_key" date NOT NULL,
	"alert_count" integer DEFAULT 0 NOT NULL,
	"max_alerts" integer DEFAULT 15 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "beta_posteriors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"entity_type" text DEFAULT 'facility' NOT NULL,
	"entity_id" text NOT NULL,
	"issue_type" text NOT NULL,
	"action_type" text NOT NULL,
	"alpha" numeric(10, 4) DEFAULT '2.0000' NOT NULL,
	"beta_param" numeric(10, 4) DEFAULT '2.0000' NOT NULL,
	"total_observations" integer DEFAULT 0 NOT NULL,
	"last_updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "alert_cooldowns" ADD CONSTRAINT "alert_cooldowns_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_rate_limits" ADD CONSTRAINT "alert_rate_limits_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beta_posteriors" ADD CONSTRAINT "beta_posteriors_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_cooldown_facility_type" ON "alert_cooldowns" USING btree ("facility_id","alert_type");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_rate_limit" ON "alert_rate_limits" USING btree ("facility_id","recipient_role","date_key");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_beta_posteriors" ON "beta_posteriors" USING btree ("facility_id","entity_type","entity_id","issue_type","action_type");--> statement-breakpoint
CREATE INDEX "ix_beta_facility" ON "beta_posteriors" USING btree ("facility_id");