import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  clients,
  invitations,
  items,
  organizations,
  pamphlets,
  projects,
  users,
  usersOnOrganizations,
  usersOnProjects,
} from "./schema";
import { getClientsWithPamphletsByUserId } from ".";

export { invitationStatusEnum as InvitationStatus } from "./schema";

export type Organization = InferSelectModel<typeof organizations>;
export type NewOrganization = InferInsertModel<typeof organizations>;

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;

export type Invitation = InferSelectModel<typeof invitations>;
export type NewInvitation = InferInsertModel<typeof invitations>;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type UsersOnOrganizations = InferSelectModel<
  typeof usersOnOrganizations
>;
export type NewUsersOnOrganizations = InferInsertModel<
  typeof usersOnOrganizations
>;

export type UsersOnProjects = InferSelectModel<typeof usersOnProjects>;
export type NewUsersOnProjects = InferInsertModel<typeof usersOnProjects>;

/**
 * Client
 */
export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;
export const insertClientSchema = createInsertSchema(clients, {
  name: z.string().min(1, { message: "Name must be at least one character." }),
  email: z.string().email(),
  notes: z
    .string()
    .max(500, { message: "Note can't be longer than 500 characters." }),
  // .optional(),
});
export type ClientsWithPamphlet = Awaited<
  ReturnType<typeof getClientsWithPamphletsByUserId>
>;

export type Item = InferSelectModel<typeof items>;
export type NewItem = InferInsertModel<typeof items>;

export type Pamphlet = InferSelectModel<typeof pamphlets>;
export type NewPamphlet = InferInsertModel<typeof pamphlets>;
export const insertedPamphletSchema = createInsertSchema(pamphlets, {
  // personalMessage: z
  //   .string()
  //   .max(500, { message: "Personal message must be 500 characters or fewer." }),
});
