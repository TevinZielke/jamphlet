import { InferSelectModel, InferInsertModel } from "drizzle-orm";
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

export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

export type Item = InferSelectModel<typeof items>;
export type NewItem = InferInsertModel<typeof items>;

export type Pamphlet = InferSelectModel<typeof pamphlets>;
export type NewPamphlet = InferInsertModel<typeof pamphlets>;
