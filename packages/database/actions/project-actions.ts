"use server";
import { eq } from "drizzle-orm";
import {
  NewCategory,
  NewFeature,
  categories,
  db,
  features,
  projects,
} from "..";
import { revalidatePath } from "next/cache";

export async function getProjectFormSchemaAction(projectId: number) {
  const result = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    columns: {},
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

export async function getProjectAction(projectId: number) {
  const result = db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      projectImages: true,
      usersOnProjects: true,
    },
  });

  return result;
}

/**
 * Categories
 */

export async function addCategoryAction(values: NewCategory) {
  const insertedCategory = await db
    .insert(categories)
    .values(values)
    .returning({
      insertedCategoryName: categories.name,
    });

  revalidatePath("/project");

  return insertedCategory;
}

export async function deleteCategoryAction(categoryId: number) {
  const deletedCategory = await db
    .delete(categories)
    .where(eq(categories.id, categoryId))
    .returning({
      categoryName: categories.name,
    });

  revalidatePath("/project");

  return deletedCategory;
}

/**
 * Features
 */
export async function addFeatureAction(values: NewFeature) {
  const insertedFeature = await db.insert(features).values(values).returning({
    insertedName: features.name,
  });

  return insertedFeature;
}

export async function deleteFeatureAction(featureId: number) {
  const deletedFeature = await db
    .delete(features)
    .where(eq(features.id, featureId))
    .returning({
      deletedFeatureName: features.name,
    });

  return deletedFeature;
}