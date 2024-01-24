import { revalidatePath } from "next/cache";
import { NewItem, db, getItemById, items } from "..";

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
