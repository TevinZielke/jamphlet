import { ItemFormCard } from "@/components/item-form-initial";
import { Separator } from "@/components/ui/separator";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import { getUserByKindeId } from "@jamphlet/database";
import { redirect } from "next/navigation";

export default async function ItemsPage() {
  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  }

  const kindeUser = await getAuthenticatedUser();

  if (!kindeUser || kindeUser == null || !kindeUser.id || !kindeUser.email) {
    throw new Error("Authentication failed for: " + kindeUser);
  }

  const dbUser = await getUserByKindeId(kindeUser.id);
  const projectId = dbUser?.currentProjectId;

  if (!dbUser?.id) {
    throw new Error("Error fetching dbUser.");
  } else if (!projectId) {
    throw new Error("Error fetching project.");
  }

  return (
    <main className=" flex flex-row justify-center items-center h-full">
      <div className=" flex flex-col gap-4 items-center">
        <div className=" flex flex-col gap-4">
          <p className=" font-semibold">Select an item from the list, or...</p>
          <Separator />
        </div>
        <div className=" flex flex-row justify-center p-2">
          <ItemFormCard projectId={projectId} />
        </div>
      </div>
    </main>
  );
}
