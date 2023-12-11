import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

// migrate(db, { migrationsFolder: "drizzle" })
//   .then(() => {
//     console.log("migrations finished!");
//     process.exit();
//   })
//   .catch((err) => {
//     console.log(err);
//     process.exit();
//   });

export const migrateDB = async () => {
  console.log("migrating db...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("...miration finished!");
};

migrateDB();
