"use server";

import { revalidatePath } from "next/cache";
import { ItemPreview, NewItem, db, getItemById, items } from "..";
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

export async function getItemByIdAction(itemId: number) {
  const result = await getItemById(itemId);

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
