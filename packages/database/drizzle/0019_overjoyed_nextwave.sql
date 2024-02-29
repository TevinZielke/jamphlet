DO $$ BEGIN
 CREATE TYPE "feature_type" AS ENUM('quantity', 'currency', 'text', 'boolean');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"project_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "features" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"type" "feature_type" DEFAULT 'text' NOT NULL,
	"categoryId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "features" ADD CONSTRAINT "features_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
