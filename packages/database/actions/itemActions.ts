import { revalidatePath } from "next/cache";
import { NewItem, db, items } from "..";

export async function addItem(newItem: NewItem) {
  const insertedItem = await db
    .insert(items)
    .values(newItem)
    .returning({ insertedId: items.name });
  revalidatePath("/");

  return insertedItem;
}
