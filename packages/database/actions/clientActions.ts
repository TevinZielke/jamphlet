"use server";
import { NewClient, clients, db } from "..";

export async function addClient(formData: FormData) {
  const newClient: NewClient = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    userId: 1,
  };

  await db.insert(clients).values(newClient);
}
