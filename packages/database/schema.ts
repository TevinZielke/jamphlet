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
} from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["free", "pro"]);
export const roleEnum = pgEnum("role", ["basic", "admin"]);

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  plan: planEnum("plan").default("free"),
});

export const organizationRelations = relations(organizations, ({ many }) => ({
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

export const projectRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  usersOnProjects: many(usersOnProjects),
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  kindeId: text("kindeId").unique(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),

  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  lastModified: timestamp("lastModified", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  usersOnOrganizations: many(usersOnOrganizations),
  usersOnProjects: many(usersOnProjects),
  clients: many(clients),
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
    id: serial("id").primaryKey(),
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

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  lastModified: timestamp("lastModified", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const clientRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  pamphlets: many(pamphlets),
}));

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

export const itemRelations = relations(items, ({ one, many }) => ({
  project: one(projects, {
    fields: [items.projectId],
    references: [projects.id],
  }),
  pamphletItems: many(itemsOnPamphlets),
}));

export const pamphlets = pgTable("pamphlets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id),
  personalMessage: text("personalMessage").default(
    "Welcome to your bespoke Jamphlet!"
  ),

  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  lastModified: timestamp("lastModified", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const pamphletRelations = relations(pamphlets, ({ one, many }) => ({
  user: one(users, {
    fields: [pamphlets.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [pamphlets.clientId],
    references: [clients.id],
  }),
  itemPamphlets: many(itemsOnPamphlets),
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
