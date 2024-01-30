"use server";
import { eq } from "drizzle-orm";
import {
  NewUser,
  users,
  db,
  usersOnProjects,
  NewUsersOnProjects,
  NewUsersOnOrganizations,
  usersOnOrganizations,
  NewInvitation,
  Invitation,
  invitations,
  InvitationStatus,
} from "..";

export async function addKindeUser(
  newUser: NewUser,
  projectId: number,
  organizationId: number
) {
  const insertedUsers = await db
    .insert(users)
    .values(newUser)
    .returning({ userId: users.id });

  const userId = insertedUsers[0]?.userId;

  if (!userId) {
    throw new Error("Error inserting new user: " + insertedUsers[0]);
  }

  const newUsersOnProjects: NewUsersOnProjects = {
    userId: userId,
    projectId: projectId,
  };

  await db.insert(usersOnProjects).values(newUsersOnProjects);

  const NewUsersOnOrganizations: NewUsersOnOrganizations = {
    userId: userId,
    organizationId: organizationId,
  };

  return await db
    .insert(usersOnOrganizations)
    .values(NewUsersOnOrganizations)
    .returning();
  // .execute();

  //   const result = await db.query.users.findFirst({
  //     where: eq(users.id, userId),
  //     columns: {
  //       name: true,
  //     },
  //     with: {
  //       usersOnProjects: {
  //         columns: {},
  //         with: {
  //           project: {
  //             columns: {
  //               name: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
}

export async function createInvitation(newInvitation: NewInvitation) {
  const result = db.insert(invitations).values(newInvitation).returning();

  return result;
}

// export async function updateInvitation(invitationId: number, newStatus: string) {
//   const updatedInvitation: { updatedId: number }[] = await db.update(invitations).set({ status: newStatus}).where( eq(invitations.id, invitationId)).returning({ updatedId: invitations.id })
//   return updatedInvitation;
//  }
