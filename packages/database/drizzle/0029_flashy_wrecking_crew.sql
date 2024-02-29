CREATE TABLE IF NOT EXISTS "project_structures" (
	"id" serial PRIMARY KEY NOT NULL,
	"json" json,
	"project_id" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "sections";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_structures" ADD CONSTRAINT "project_structures_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
