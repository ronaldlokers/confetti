CREATE TABLE "domain_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"version" integer NOT NULL,
	"actor_id" text NOT NULL,
	"project_id" uuid NOT NULL,
	"aggregate_type" text NOT NULL,
	"aggregate_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "domain_event_type_not_blank" CHECK (length(trim("domain_event"."type")) > 0),
	CONSTRAINT "domain_event_version_positive" CHECK ("domain_event"."version" > 0),
	CONSTRAINT "domain_event_aggregate_type_not_blank" CHECK (length(trim("domain_event"."aggregate_type")) > 0),
	CONSTRAINT "domain_event_aggregate_id_not_blank" CHECK (length(trim("domain_event"."aggregate_id")) > 0),
	CONSTRAINT "domain_event_payload_is_object" CHECK (jsonb_typeof("domain_event"."payload") = 'object')
);
--> statement-breakpoint
ALTER TABLE "domain_event" ADD CONSTRAINT "domain_event_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_event" ADD CONSTRAINT "domain_event_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "domain_event_project_occurred_at_idx" ON "domain_event" USING btree ("project_id","occurred_at");--> statement-breakpoint
CREATE INDEX "domain_event_aggregate_occurred_at_idx" ON "domain_event" USING btree ("project_id","aggregate_type","aggregate_id","occurred_at");--> statement-breakpoint
CREATE FUNCTION "prevent_domain_event_mutation"() RETURNS trigger AS $$
BEGIN
	RAISE EXCEPTION 'domain events are immutable' USING ERRCODE = '55000';
	RETURN OLD;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE TRIGGER "domain_event_immutable" BEFORE UPDATE OR DELETE ON "domain_event"
FOR EACH ROW EXECUTE FUNCTION "prevent_domain_event_mutation"();
