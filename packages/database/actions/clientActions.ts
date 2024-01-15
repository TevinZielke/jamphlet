"use server";
import { NewClient, clients, db } from "..";

export async function addClient(newClient: NewClient) {
  await db.insert(clients).values(newClient);
}
