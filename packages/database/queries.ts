import { eq } from "drizzle-orm";
import {
  Client,
  ClientWithPamphlet,
  Pamphlet,
  Project,
  clients,
  items,
  pamphlets,
  users,
  usersOnOrganizations,
  usersOnProjects,
} from ".";
import { db } from "./database";

import { ColumnSort, SortingState } from "@tanstack/react-table";
import { boolean } from "drizzle-orm/mysql-core";

export async function getUserByKindeId(kindeId: string) {
  // return await db.select().from(users).where(eq(users.kindeId, kindeId));
  return await db.query.users.findFirst({
    where: eq(users.kindeId, kindeId),
  });
}

export async function getProjectsByOrganizationId() {}

export async function getProjectsByUserId(userId: number) {
  const result = await db.query.users.findMany({
    where: eq(users.id, userId),
    columns: {},
    with: {
      usersOnProjects: {
        columns: {},
        with: {
          project: true,
        },
      },
    },
  });

  const projects: Project[] = [];

  result[0]?.usersOnProjects.map((entry) => {
    projects.push(entry.project);
  });

  return projects;
}

export async function getOrganizationUsers(organizationId: number) {
  return await db
    .select()
    .from(usersOnOrganizations)
    .where(eq(usersOnOrganizations.organizationId, organizationId))
    .rightJoin(users, eq(usersOnOrganizations, users.id));
}

export async function getProjectUsers(projectId: number) {
  return await db
    .select()
    .from(usersOnProjects)
    .where(eq(usersOnProjects.projectId, projectId))
    .rightJoin(users, eq(usersOnProjects.userId, users.id));
}

// Clients
export async function getClientById(
  clientId: number
): Promise<Client | undefined> {
  const result = db.query.clients.findFirst({
    where: eq(clients.id, clientId),
  });

  return result;
}

export async function getClientsByUserId(userId: number) {
  const result = db.query.clients.findMany({
    where: eq(clients.userId, userId),
  });

  return result;
}

// export async function getClientsByProjectId(projectId: number): Promise<Client[] | undefined> {
//   const result = db.query.clients.findMany({
//     where: eq(clients)
//   })
// }

// Pamphlets
export async function getPamphlets() {
  return await db
    .select()
    .from(users)
    .leftJoin(pamphlets, eq(users.id, pamphlets.userId));
}

export async function getPamphletByClientId(clientId: number) {
  const result = db.query.pamphlets.findFirst({
    where: eq(pamphlets.clientId, clientId),
    with: {
      itemsOnPamphlets: {
        with: {
          item: true,
        },
      },
    },
  });

  return result;
}

/**
 * Clients
 */

export async function getClientPreviewsByUserId(
  userId: number,
  // start: number,
  start: number,
  size: number,
  sorting: SortingState
) {
  // const range = (start: number, stop: number, step: number) =>
  //   Array.from(
  //     { length: (stop - start) / step + 1 },
  //     (_, index) => start + index * stop
  //   );
  // return { data: range(cursor, cursor + 10, 1), nextCursor: cursor + 10 + 1 };

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
  // return result;
}

export async function getClientsWithPamphletsByUserId(userId: number) {
  const result = db.query.clients.findMany({
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

  return result;
}

/**
 * Items
 */
export async function getItemsByProjectId(projectId: number) {
  const result = db.query.items.findMany({
    where: eq(items.projectId, projectId),
    with: {
      itemImages: true,
    },
  });

  return result;
}

export async function getItems(projectId: number) {
  const result = db.query.items.findMany({
    where: eq(items.projectId, projectId),
  });

  return result;
}

export async function getItemById(itemId: number) {
  const result = await db.query.items.findFirst({
    where: eq(items.id, itemId),
    with: {
      itemImages: true,
    },
  });

  return result;
}
