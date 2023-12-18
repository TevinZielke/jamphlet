import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { clients, items, pamphlets, users } from "./schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

export type Item = InferSelectModel<typeof items>;
export type NewItem = InferInsertModel<typeof items>;

export type Pamphlet = InferSelectModel<typeof pamphlets>;
export type NewPamphlet = InferInsertModel<typeof pamphlets>;
