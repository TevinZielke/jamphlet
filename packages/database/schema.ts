import { relations } from "drizzle-orm";
import {
  serial,
  pgTable,
  pgEnum,
  text,
  timestamp,
  integer,
  boolean,
  primaryKey,
  varchar,
  index,
  json,
} from "drizzle-orm/pg-core";
import { number } from "zod";

export const planEnum = pgEnum("plan", ["free", "pro"]);
export const roleEnum = pgEnum("role", ["basic", "admin"]);
export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "declined",
]);
export const featureTypeEnum = pgEnum("feature_type", [
  "quantity",
  "currency",
  "text",
  "boolean",
]);

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  plan: planEnum("plan").default("free"),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  usersOnOrganizations: many(usersOnOrganizations),
  projects: many(projects),
}));

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: integer("organization_id")
    .notNull()
    .references(() => organizations.id),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  projectStructure: one(projectStructures),
  categories: many(categories),
  usersOnProjects: many(usersOnProjects),
  clientsOnProjects: many(clientsOnProjects),
  projectImages: many(projectImages),
  componentsOnProjects: many(componentsOnProjects),
  // sections: many(sections),
}));

export const projectStructures = pgTable("project_structures", {
  id: serial("id").primaryKey(),
  // json: json("json").$type<{foo: string}>(),
  json: json("json"),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
});

export const projectStructuresRelations = relations(
  projectStructures,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectStructures.projectId],
      references: [projects.id],
    }),
  })
);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  project: one(projects, {
    fields: [categories.projectId],
    references: [projects.id],
  }),
  features: many(features),
  featuresOnItems: many(featuresOnItems),
}));

export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  type: featureTypeEnum("type").notNull().default("text"),
  mainFact: boolean("is_main_fact").default(false),
  categoryId: integer("categoryId")
    .notNull()
    .references(() => categories.id),
});

export const featuresRelations = relations(features, ({ one, many }) => ({
  category: one(categories, {
    fields: [features.categoryId],
    references: [categories.id],
  }),
  featuresOnItems: many(featuresOnItems),
}));

export const featuresOnItems = pgTable(
  "features_items",
  {
    featureId: integer("feature_id")
      .notNull()
      .references(() => features.id),
    itemId: integer("item_id")
      .notNull()
      .references(() => items.id),
    value: text("value").notNull().default(""),
    displayText: text("display_text"),
    isMainFact: boolean("is_main_fact").default(false),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.featureId, table.itemId],
    }),
  })
);

export const featuresOnItemsRelations = relations(
  featuresOnItems,
  ({ one }) => ({
    feature: one(features, {
      fields: [featuresOnItems.featureId],
      references: [features.id],
    }),
    item: one(items, {
      fields: [featuresOnItems.itemId],
      references: [items.id],
    }),
    category: one(categories, {
      fields: [featuresOnItems.itemId],
      references: [categories.id],
    }),
  })
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  kindeId: text("kindeId").unique(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  currentProjectId: integer("current_project_id").references(() => projects.id),

  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  lastModified: timestamp("lastModified", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  usersOnOrganizations: many(usersOnOrganizations),
  usersOnProjects: many(usersOnProjects),
  clients: many(clients),
  invitations: many(invitations),
  projects: one(projects),
}));

export const usersOnOrganizations = pgTable(
  "users_organizations",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id),
    role: roleEnum("role").default("basic"),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.userId, table.organizationId],
      }),
    };
  }
);

export const usersOnOrganizationsRelations = relations(
  usersOnOrganizations,
  ({ one }) => ({
    user: one(users, {
      fields: [usersOnOrganizations.userId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [usersOnOrganizations.organizationId],
      references: [organizations.id],
    }),
  })
);
export const usersOnProjects = pgTable(
  "users_projects",
  {
    id: serial("id"),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id),
    role: roleEnum("role").default("basic"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.projectId],
    }),
  })
);

export const usersOnProjectsRelations = relations(
  usersOnProjects,
  ({ one }) => ({
    user: one(users, {
      fields: [usersOnProjects.userId],
      references: [users.id],
    }),
    project: one(projects, {
      fields: [usersOnProjects.projectId],
      references: [projects.id],
    }),
  })
);

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  inviterId: integer("inviter_id")
    .notNull()
    .references(() => users.id),
  inviteeEmail: text("invitee_email").notNull(),
  token: text("token"),
  status: invitationStatusEnum("status").notNull().default("pending"),

  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  lastModified: timestamp("lastModified", {
    mode: "date",
    withTimezone: true,
  }),
});

export const invitationsRelations = relations(invitations, ({ one }) => ({
  inviter: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
  }),
}));

export const clients = pgTable(
  "clients",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    notes: text("notes").notNull().default(""),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
    lastModified: timestamp("lastModified", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => {
    return {
      userIdIndex: index("clientsAuthUserIdIdx").on(table.userId),
    };
  }
);

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  pamphlets: many(pamphlets),
  clientsOnProjects: many(clientsOnProjects),
}));

export const clientsOnProjects = pgTable(
  "clients_projects",
  {
    id: serial("id"),
    clientId: integer("client_id")
      .notNull()
      .references(() => clients.id),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.clientId, table.projectId],
    }),
  })
);

export const clientsOnProjectsRelations = relations(
  clientsOnProjects,
  ({ one }) => ({
    client: one(clients, {
      fields: [clientsOnProjects.clientId],
      references: [clients.id],
    }),
    project: one(projects, {
      fields: [clientsOnProjects.projectId],
      references: [projects.id],
    }),
  })
);

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),

  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  lastModified: timestamp("lastModified", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const itemsRelations = relations(items, ({ one, many }) => ({
  project: one(projects, {
    fields: [items.projectId],
    references: [projects.id],
  }),
  itemsOnPamphlets: many(itemsOnPamphlets),
  itemImages: many(itemImages),
  featuresOnItems: many(featuresOnItems),
}));

export const itemImages = pgTable("item_images", {
  id: serial("id").primaryKey(),
  publicUrl: text("public_url").notNull(),
  path: text("path").notNull(),
  alt: text("alt").notNull(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id),
  caption: text("caption").notNull(),
});

export const itemImagesRelations = relations(itemImages, ({ one }) => ({
  item: one(items, {
    fields: [itemImages.itemId],
    references: [items.id],
  }),
}));

export const pamphlets = pgTable("pamphlets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  clientId: integer("client_id")
    .notNull()
    .unique()
    .references(() => clients.id),
  personalMessage: text("personalMessage")
    .notNull()
    .default("Welcome to your bespoke Jamphlet!"),

  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  lastModified: timestamp("lastModified", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const pamphletsRelations = relations(pamphlets, ({ one, many }) => ({
  user: one(users, {
    fields: [pamphlets.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [pamphlets.clientId],
    references: [clients.id],
  }),
  itemsOnPamphlets: many(itemsOnPamphlets),
}));

export const itemsOnPamphlets = pgTable(
  "items_pamphlets",
  {
    itemId: integer("item_id")
      .notNull()
      .references(() => items.id),
    pamphletId: integer("pamphlet_id")
      .notNull()
      .references(() => pamphlets.id),
    seenByClient: boolean("seenByClient").default(false),
    seenAt: timestamp("seenAt", {
      mode: "date",
      withTimezone: true,
    }),
    comment: varchar("comment", { length: 256 }),

    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
    lastModified: timestamp("lastModified", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.pamphletId, table.itemId],
      }),
    };
  }
);

export const itemsOnPamphletsRelations = relations(
  itemsOnPamphlets,
  ({ one }) => ({
    item: one(items, {
      fields: [itemsOnPamphlets.itemId],
      references: [items.id],
    }),
    pamphlet: one(pamphlets, {
      fields: [itemsOnPamphlets.pamphletId],
      references: [pamphlets.id],
    }),
  })
);

export const projectImages = pgTable("project_images", {
  id: serial("id").primaryKey(),
  publicUrl: text("public_url"),
  path: text("path"),
  alt: text("alt"),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
});

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}));

export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const componentsRelations = relations(components, ({ many }) => ({
  componentsOnProjects: many(componentsOnProjects),
}));

export const componentsOnProjects = pgTable(
  "components_projects",
  {
    componentId: integer("component_id")
      .notNull()
      .references(() => components.id),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.componentId, table.projectId],
      }),
    };
  }
);

export const componentsOnProjectsRelations = relations(
  componentsOnProjects,
  ({ one }) => ({
    component: one(components, {
      fields: [componentsOnProjects.componentId],
      references: [components.id],
    }),
    project: one(projects, {
      fields: [componentsOnProjects.projectId],
      references: [projects.id],
    }),
  })
);
