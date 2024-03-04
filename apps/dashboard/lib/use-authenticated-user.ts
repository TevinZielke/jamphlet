"use server";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import { getUserByKindeId, NewUser, addKindeUser } from "@jamphlet/database";
import { redirect } from "next/navigation";

export async function useAuthenticatedUser() {
  const organizationId = 1;

  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  }

  const kindeUser = await getAuthenticatedUser();

  if (!kindeUser || kindeUser == null || !kindeUser.id || !kindeUser.email) {
    throw new Error("Authentication failed for: " + kindeUser);
  }

  let dbUser = await getUserByKindeId(kindeUser.id);
  const projectId = dbUser?.currentProjectId || 1;

  if (projectId && !dbUser) {
    const newUser: NewUser = {
      kindeId: kindeUser.id,
      name: kindeUser.given_name + " " + kindeUser.family_name,
      email: kindeUser.email,
      currentProjectId: projectId,
    };
    await addKindeUser(newUser, projectId, organizationId);
  }

  return dbUser;
}
