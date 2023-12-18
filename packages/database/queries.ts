import { eq } from "drizzle-orm";
import {
  Project,
  clients,
  pamphlets,
  users,
  usersOnOrganizations,
  usersOnProjects,
} from ".";
import { db } from "./database";

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
export async function getClientsByUserId(userId: number) {
  const result = db.query.clients.findMany({
    where: eq(clients.userId, userId),
  });

  return result;
}

// Pamphlets
export async function getPamphlets() {
  return await db
    .select()
    .from(users)
    .leftJoin(pamphlets, eq(users.id, pamphlets.userId));
}
