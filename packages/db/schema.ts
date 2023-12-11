import { serial, pgTable, pgEnum, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["basic", "admin"]);

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
