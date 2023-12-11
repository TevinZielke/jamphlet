import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users } from "./schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
