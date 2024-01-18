"use server";
// import { revalidatePath } from "next/cache"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import {
  NewClient,
  NewPamphlet,
  clients,
  db,
  getClientsWithPamphletsByUserId,
  pamphlets,
} from "..";
import { eq } from "drizzle-orm/sql";

/**
 * GET
 */
// export async function getClients() {
//   const res = unstable_cache(
//     async (userId) => {
//       return getClientsWithPamphletsByUserId(userId);
//     },
//     ["clients"],
//     {
//       tags: ["clients"],
//     }
//   );
// }

export const getClients = async (userId: number) =>
  await getClientsWithPamphletsByUserId(userId);

export const getClientsCached = unstable_cache(
  async (userId) => {
    return getClientsWithPamphletsByUserId(userId);
  },
  ["clients"],
  {
    tags: ["clients"],
  }
);

// /**
//  * POST
//  */

export async function addClient(newClient: NewClient) {
  const insertedClient = await db
    .insert(clients)
    .values(newClient)
    .returning({ insertedId: clients.id });
  // revalidateTag("clients");
  revalidatePath("/");

  return insertedClient;
}

export async function deleteClient(clientId: number) {
  const deletedClient = await db
    .delete(clients)
    .where(eq(clients.id, clientId))
    .returning();
  // revalidateTag("clients");
  revalidatePath("/");

  return deletedClient;
}

// Update param type
export async function addPamphlet(userId: number, clientId: number) {
  const newPamphlet: NewPamphlet = {
    userId: userId,
    clientId: clientId,
  };
  const insertedPamphlet = await db.insert(pamphlets).values(newPamphlet);
  revalidatePath("/");
}

export async function updatePamphlet(newPamphlet: NewPamphlet) {
  const insertedPamphlet = await db
    .update(pamphlets)
    .set(newPamphlet)
    .where(eq(pamphlets.clientId, newPamphlet.clientId))
    .returning({
      updatedId: pamphlets.clientId,
    });
  revalidatePath("/");

  return insertedPamphlet;
}
