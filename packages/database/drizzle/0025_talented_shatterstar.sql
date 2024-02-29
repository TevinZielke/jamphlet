ALTER TABLE "features_items" ADD COLUMN "display_text" text;--> statement-breakpoint
ALTER TABLE "features" DROP COLUMN IF EXISTS "display_text";