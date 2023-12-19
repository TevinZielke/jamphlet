DO $$ BEGIN
 CREATE TYPE "invitation_status" AS ENUM('pending', 'accepted', 'declined');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients_projects" (
	"id" serial NOT NULL,
	"client_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	CONSTRAINT clients_projects_client_id_project_id_pk PRIMARY KEY("client_id","project_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"inviter_id" integer NOT NULL,
	"invitee_email" text NOT NULL,
	"token" text,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"lastModified" timestamp with time zone
);
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'users_projects'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "users_projects" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clients_projects" ADD CONSTRAINT "clients_projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clients_projects" ADD CONSTRAINT "clients_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
