"use server";
// import { revalidatePath } from "next/cache"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import {
  ClientWithPamphlet,
  NewClient,
  NewPamphlet,
  clients,
  db,
  getClientsWithPamphletsByUserId,
  getPamphletByClientId,
  pamphlets,
} from "..";
import { eq, sql } from "drizzle-orm/sql";
import { timestamp } from "drizzle-orm/pg-core";
import { ColumnSort, SortingState } from "@tanstack/react-table";

/**
 * GET
 */

export async function getClientAction(clientId: number) {
  const result = db.query.clients.findFirst({
    where: eq(clients.id, clientId),
    with: {
      pamphlets: {
        with: {
          itemsOnPamphlets: {
            with: {
              item: {
                with: {
                  itemImages: true,
                  featuresOnItems: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return result;
}

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

// export const getClients = async (userId: number) =>
//   await getClientsWithPamphletsByUserId(userId);

// export const getClientsCached = unstable_cache(
//   async (userId) => {
//     return getClientsWithPamphletsByUserId(userId);
//   },
//   ["clients"],
//   {
//     tags: ["clients"],
//   }
// );

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

export async function updateClientAction(newClient: NewClient) {
  const updatedClient = await db
    .update(clients)
    .set(newClient)
    .where(eq(clients.id, newClient.id!))
    .returning({ updatedClient: clients.name });

  revalidatePath("/");

  return updatedClient;
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

// export async function getPamphletByClientIdAction(clientId: number) {
//   const result = db.query.itemsOnPamphlets.findMany({
//     where: eq(pamphlets.clientId, clientId),
//     with: {
//       item: true,
//     },
//   });

//   return result;
// }

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
  const updatedRecord = await db.transaction(async (tx) => {
    await tx
      .update(pamphlets)
      .set(newPamphlet)
      .where(eq(pamphlets.clientId, newPamphlet.clientId));

    const [client] = await tx
      .update(clients)
      .set({
        lastModified: new Date(),
      })
      .where(eq(clients.id, newPamphlet.clientId))
      .returning({ upatedId: clients.id });

    return client?.upatedId;
  });

  revalidatePath("/");

  return updatedRecord;
}
// const insertedPamphlet = await db
//   .update(pamphlets)
//   .set(newPamphlet)
//   .where(eq(pamphlets.clientId, newPamphlet.clientId))
//   .returning({
//     updatedId: pamphlets.clientId,
//   });

/**
 * Keep as upserting ref
 */
// export async function upsertPamphlet(newPamphlet: NewPamphlet) {
//   console.log("upsertPamphletAction: ", newPamphlet);
//   // const upsertedPamphlet = await db
//   //   .insert(pamphlets)
//   //   .values(newPamphlet)
//   //   .onConflictDoUpdate({
//   //     target: pamphlets.clientId,
//   //     set: { ...newPamphlet },
//   //     // where: sql`${pamphlets.clientId} = ${newPamphlet.clientId}`,
//   //   })
//   //   .returning({
//   //     updatedId: pamphlets.clientId,
//   //   });

//   const upsertedRecord = await db.transaction(async (tx) => {
//     await tx.insert(pamphlets).values(newPamphlet).onConflictDoUpdate({
//       target: pamphlets.clientId,
//       set: newPamphlet,
//     });

//     const [client] = await tx
//       .update(clients)
//       .set({
//         lastModified: new Date(),
//       })
//       .where(eq(clients.id, newPamphlet.clientId))
//       .returning({ updatedClient: clients.name });

//     return client?.updatedClient;
//   });

//   revalidatePath("/");

//   return upsertedRecord;
// }

export async function getClientPreviewsByUserIdAction(
  userId: number,
  start: number,
  size: number,
  sorting: SortingState
) {
  const result = await db.query.clients.findMany({
    where: eq(clients.userId, userId),
    with: {
      pamphlets: {
        with: {
          itemsOnPamphlets: {
            with: {
              item: true,
            },
          },
        },
      },
    },
  });

  if (sorting.length) {
    const sort = sorting[0] as ColumnSort;
    const { id, desc } = sort as {
      id: keyof ClientWithPamphlet;
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
