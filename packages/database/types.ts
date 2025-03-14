import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import {
  categories,
  clients,
  features,
  featuresOnItems,
  invitations,
  itemImages,
  items,
  itemsOnPamphlets,
  organizations,
  pamphlets,
  projectImages,
  projects,
  users,
  usersOnOrganizations,
  usersOnProjects,
} from "./schema";
import {
  getCategoriesWithFeatures,
  getClientAction,
  getClientPreviewsByUserIdAction,
  getClientsWithPamphletsByUserId,
  getItemsByProjectId,
  getItemsByProjectIdAction,
  getItemsOnPamphlet,
} from ".";

export { invitationStatusEnum as InvitationStatus } from "./schema";
export { featureTypeEnum as FeatureType } from "./schema";

export type Organization = InferSelectModel<typeof organizations>;
export type NewOrganization = InferInsertModel<typeof organizations>;

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;
export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1, { message: "Name must be at least one character." }),
});

export type CategoriesWithFeatures = Awaited<
  ReturnType<typeof getCategoriesWithFeatures>
>;
export type CategoryWithFeatures = Array<CategoriesWithFeatures>[0][0];

export type Feature = InferSelectModel<typeof features>;
export type NewFeature = InferInsertModel<typeof features>;
export const insertFeatureSchema = createInsertSchema(features, {
  name: z.string().min(1, { message: "Name must be at least one character." }),
  value: z
    .string()
    .min(1, { message: "Value must be at least one character." }),
  // type: z.enum(FeatureType.enumValues).Enum
});

export type FeaturesOnItems = InferSelectModel<typeof featuresOnItems>;
export type NewFeaturesOnItems = InferInsertModel<typeof featuresOnItems>;

/**
 * User
 */

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
});
// Full client (for Jamphlet app)
export type ClientData = Awaited<ReturnType<typeof getClientAction>>;

// Full clients
export type ClientsWithPamphlet = Awaited<
  ReturnType<typeof getClientsWithPamphletsByUserId>
>;
export type ClientWithPamphlet = Array<ClientsWithPamphlet>[0][0];

export type ClientApiResponse = {
  data: ClientWithPamphlet[];
  meta: {
    totalRowCount: number;
  };
};
// Preview client
export type ClientPreviews = Awaited<
  ReturnType<typeof getClientPreviewsByUserIdAction>
>;

/** Pamphlet */
export type ItemOnPamphlet = InferSelectModel<typeof itemsOnPamphlets>;
export type NewItemOnPamphlet = InferInsertModel<typeof itemsOnPamphlets>;
export type ItemsOnPamphlet = Awaited<ReturnType<typeof getItemsOnPamphlet>>;
export type ItemSelection = Array<ItemsOnPamphlet>[0];

/* Item */
export type Item = InferSelectModel<typeof items>;
export type NewItem = InferInsertModel<typeof items>;
export const insertItemSchema = createInsertSchema(items, {
  name: z.string().min(1, { message: "Name must be at least one character." }),
  code: z.string().min(1, { message: "Code must be at least one character." }),
});

// Todo: switch to union of types
export type ItemsWithImages = Awaited<ReturnType<typeof getItemsByProjectId>>;
export type ItemWithImages = Array<ItemsWithImages>[0][0];

// Item Previews
export type ItemPreviews = Awaited<
  ReturnType<typeof getItemsByProjectIdAction>
>;
export type ItemPreview = Array<ItemPreviews>[0][0];

export type ItemPreviewApiResponse = {
  data: ItemPreview[];
  meta: {
    totalRowCount: number;
  };
};

// Images
export type ProjectImage = InferSelectModel<typeof projectImages>;
export type NewProjectImage = InferInsertModel<typeof projectImages>;
// export const insertProjectImageSchema = createInsertSchema(projectImages, {
//   caption: z
//     .string()
//     .min(1, { message: "Caption must be at least one character." })
//     .max(64, { message: "Caption must be 64 characters or fewer." }),
//   alt: z
//     .string()
//     .min(1, { message: "Alt text must be at least one character." })
//     .max(140, { message: "Alt text must be 140 characters of fewer." }),
//   itemId: z.number().nonnegative(),
//   path: z.string(),
//   publicUrl: z.string(),
// });
export type ItemImage = InferSelectModel<typeof itemImages>;
export type NewItemImage = InferInsertModel<typeof itemImages>;
export const insertItemImageSchema = createInsertSchema(itemImages, {
  caption: z
    .string()
    .min(1, { message: "Caption must be at least one character." })
    .max(64, { message: "Caption must be 64 characters or fewer." }),
  alt: z
    .string()
    .min(1, { message: "Alt text must be at least one character." })
    .max(140, { message: "Alt text must be 140 characters of fewer." }),
  itemId: z.number().nonnegative(),
  path: z.string(),
  publicUrl: z.string(),
});

export type Pamphlet = InferSelectModel<typeof pamphlets>;
export type NewPamphlet = InferInsertModel<typeof pamphlets>;
export const insertPamphletSchema = createInsertSchema(pamphlets, {});

/**
 * Project Structure
 */

export type ProjectStructureConfig = {
  sections: Section[];
};

export type Section = {
  name: string;
  subtitle: string;
  order: number;
  components: Component[];
};

export type Component =
  | ItemsComponent
  | ComparisonComponent
  | ImageComponent
  | StickyTextComponent
  | TextImageComponent
  | ImageComponent
  | TextComponent;

export type ComparisonComponent = {
  type: "comparisonComponent";
  order: number;
  data?: ItemSelection;
};

export type ItemsComponent = {
  type: "itemsComponent";
  order: number;
  data?: ItemSelection;
};

export type StickyTextComponent = {
  type: "stickyTextComponent";
  text: string;
  order: number;
  images: ImageComponent[];
};

export type TextImageComponent = {
  type: "textImageComponent";
  order: number;
  title: string;
  text: string;
  textRightImageLeft: boolean;
  image: ImageComponent;
};

export type ImageComponent = {
  type: "imageComponent";
  order: number;
  publicUrl: string;
  //   path: string;
  alt: string;
  caption: string;
  //   id?: number | undefined;
};

export type TextComponent = {
  type: "textComponent";
  text: string;
  order: number;
};
