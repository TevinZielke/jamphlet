ALTER TABLE "features_items" DROP CONSTRAINT "features_items_feature_id_item_id_pk";--> statement-breakpoint
ALTER TABLE "features_items" ADD CONSTRAINT "featuresOnItemsId" PRIMARY KEY("feature_id","item_id");