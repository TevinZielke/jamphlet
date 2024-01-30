"use server";
import { eq } from "drizzle-orm";
import { NewFeature, categories, db, features, projects } from "..";
import { revalidatePath } from "next/cache";

export async function getProjectFormSchemaAction(projectId: number) {
  const result = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      categories: {
        with: {
          features: true,
        },
      },
    },
  });

  return result;
}

export async function addFeatureAction(values: NewFeature) {
  const insertedFeature = await db.insert(features).values(values).returning({
    insertedName: features.name,
  });

  return insertedFeature;
}
