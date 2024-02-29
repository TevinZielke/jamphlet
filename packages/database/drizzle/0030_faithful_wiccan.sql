ALTER TABLE "features_items" ADD COLUMN "category_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "features_items" ADD CONSTRAINT "features_items_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
