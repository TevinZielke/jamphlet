import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

export const migrateDB = async () => {
  console.log("migrating db...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("...migration finished!");
};

migrateDB();
