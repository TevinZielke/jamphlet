"use server";

import { revalidatePath } from "next/cache";
import {
  ItemPreview,
  ItemWithImages,
  NewItem,
  NewItemImage,
  db,
  featuresOnItems,
  getItemById,
  itemImages,
  items,
} from "..";
import { eq } from "drizzle-orm";
import { ColumnSort, SortingState } from "@tanstack/react-table";

export async function addItem(newItem: NewItem) {
  const insertedItem = await db
    .insert(items)
    .values(newItem)
    .returning({ insertedId: items.name });
  revalidatePath("/");

  return insertedItem;
}

// export async function getItemsAction() {
//   const result = db.query.items.findMany({
//     where: eq()
//   })
// }

export async function getItemByIdAction(itemId: number) {
  const result = await db.query.items.findFirst({
    where: eq(items.id, itemId),
    with: {
      itemImages: true,
      featuresOnItems: true,
    },
  });

  return result;
}

export async function getItemsByProjectIdAction(projectId: number) {
  const result = await db.query.items.findMany({
    where: eq(items.projectId, projectId),
    with: {
      itemImages: true,
    },
  });

  return result;
}

export async function getItemPreviewsByProjectIdAction(
  projectId: number,
  start: number,
  size: number,
  sorting: SortingState
) {
  const result = await db.query.items.findMany({
    where: eq(items.projectId, projectId),
    with: {
      itemImages: true,
      featuresOnItems: true,
    },
  });

  if (sorting.length) {
    const sort = sorting[0] as ColumnSort;
    const { id, desc } = sort as {
      id: keyof ItemPreview;
      desc: boolean;
    };
    result.sort((a, b) => {
      if (desc) {
        return a[id]! < b[id]! ? 1 : -1;
      }
      return a[id]! > b[id]! ? 1 : -1;
    });
  }

  return {
    data: result.slice(start, start + size),
    meta: {
      totalRowCount: result.length,
    },
  };
}

export type NewItemFeature = {
  itemId: number;
  featureId: number;
  value: string;
  categoryId: number;
};

export async function updateItemFeatures(newItemFeatures: NewItemFeature[]) {
  const updatedItem = await db
    .insert(featuresOnItems)
    .values(newItemFeatures)
    .returning({
      updatedItem: featuresOnItems.itemId,
    });

  return updatedItem;
}

export async function addItemImage(newItemImage: NewItemImage) {
  const result = await db.insert(itemImages).values(newItemImage).returning();

  return result;
}
