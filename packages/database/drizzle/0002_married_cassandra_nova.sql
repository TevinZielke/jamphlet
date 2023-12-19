DO $$ BEGIN
 CREATE TYPE "plan" AS ENUM('free', 'pro');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"project_id" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"lastModified" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items_pamphlets" (
	"item_id" integer NOT NULL,
	"pamphlet_id" integer NOT NULL,
	"seenByClient" boolean DEFAULT false,
	"seenAt" timestamp with time zone,
	"comment" varchar(256),
	"createdAt" timestamp with time zone DEFAULT now(),
	"lastModified" timestamp with time zone DEFAULT now(),
	CONSTRAINT items_pamphlets_pamphlet_id_item_id_pk PRIMARY KEY("pamphlet_id","item_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"plan" "plan" DEFAULT 'free'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pamphlets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"client_id" integer NOT NULL,
	"personalMessage" text DEFAULT 'Welcome to your bespoke Jamphlet!',
	"createdAt" timestamp with time zone DEFAULT now(),
	"lastModified" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organization_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_organizations" (
	"user_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"role" "role" DEFAULT 'basic',
	CONSTRAINT users_organizations_user_id_organization_id_pk PRIMARY KEY("user_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_projects" (
	"user_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"role" "role" DEFAULT 'basic',
	CONSTRAINT users_projects_user_id_project_id_pk PRIMARY KEY("user_id","project_id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastModified" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items_pamphlets" ADD CONSTRAINT "items_pamphlets_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items_pamphlets" ADD CONSTRAINT "items_pamphlets_pamphlet_id_pamphlets_id_fk" FOREIGN KEY ("pamphlet_id") REFERENCES "pamphlets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pamphlets" ADD CONSTRAINT "pamphlets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pamphlets" ADD CONSTRAINT "pamphlets_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_organizations" ADD CONSTRAINT "users_organizations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_organizations" ADD CONSTRAINT "users_organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_projects" ADD CONSTRAINT "users_projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_projects" ADD CONSTRAINT "users_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
