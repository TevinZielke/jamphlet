CREATE TABLE IF NOT EXISTS "features_items" (
	"feature_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	CONSTRAINT features_items_feature_id_item_id_pk PRIMARY KEY("feature_id","item_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "features_items" ADD CONSTRAINT "features_items_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "features_items" ADD CONSTRAINT "features_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
