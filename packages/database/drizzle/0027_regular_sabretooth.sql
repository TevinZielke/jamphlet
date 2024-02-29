CREATE TABLE IF NOT EXISTS "components" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "components_projects" (
	"component_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	CONSTRAINT components_projects_component_id_project_id_pk PRIMARY KEY("component_id","project_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components_projects" ADD CONSTRAINT "components_projects_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components_projects" ADD CONSTRAINT "components_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
