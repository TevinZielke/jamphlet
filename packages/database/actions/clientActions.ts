"use server";
// import { revalidatePath } from "next/cache"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import { NewClient, clients, db, getClientsWithPamphletsByUserId } from "..";

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
export const getClients = unstable_cache(
  async (userId) => {
    return getClientsWithPamphletsByUserId(userId);
  },
  ["clients"],
  {
    tags: ["clients"],
  }
);

/**
 * POST
 */

export async function addClient(newClient: NewClient) {
  await db.insert(clients).values(newClient);
  revalidateTag("clients");

  // revalidatePath;
}
