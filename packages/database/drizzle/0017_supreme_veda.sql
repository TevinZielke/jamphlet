ALTER TABLE "item_images" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_images" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_images" ADD CONSTRAINT "item_images_item_id_projects_id_fk" FOREIGN KEY ("item_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
