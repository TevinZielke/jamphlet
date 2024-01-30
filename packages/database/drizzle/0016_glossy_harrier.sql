CREATE TABLE IF NOT EXISTS "item_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_url" text,
	"path" text,
	"alt" text,
	"item_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_url" text,
	"path" text,
	"alt" text,
	"project_id" integer
);
