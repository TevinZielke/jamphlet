import { eq } from "drizzle-orm";
import {
  organizations,
  pamphlets,
  projects,
  users,
  usersOnOrganizations,
  usersOnProjects,
} from ".";
import { db } from "./database";

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

export async function getPamphlets() {
  return await db
    .select()
    .from(users)
    .leftJoin(pamphlets, eq(users.id, pamphlets.userId));
}
