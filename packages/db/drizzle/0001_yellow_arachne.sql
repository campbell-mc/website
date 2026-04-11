CREATE TABLE "facility_training_compliance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"training_type" text NOT NULL,
	"role_category" text NOT NULL,
	"eligible_staff" integer NOT NULL,
	"compliant_staff" integer NOT NULL,
	"compliance_rate" numeric(5, 4) NOT NULL,
	"expiring_within_30d" integer DEFAULT 0,
	"source_system" text DEFAULT 'elmo' NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "facility_training_compliance" ADD CONSTRAINT "facility_training_compliance_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_training_compliance" ON "facility_training_compliance" USING btree ("facility_id","period_start","training_type","role_category");--> statement-breakpoint
CREATE INDEX "ix_training_facility_period" ON "facility_training_compliance" USING btree ("facility_id","period_start");