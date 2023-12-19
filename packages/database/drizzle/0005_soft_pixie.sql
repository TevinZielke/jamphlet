ALTER TABLE "users" ADD COLUMN "kindeId" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_kindeId_unique" UNIQUE("kindeId");