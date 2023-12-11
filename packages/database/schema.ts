import { serial, pgTable, pgEnum, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["basic", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
