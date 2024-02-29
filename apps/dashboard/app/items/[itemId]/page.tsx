import { ItemView } from "@/components/item-view";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import { getItemByIdAction, getUserByKindeId } from "@jamphlet/database";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "lib/getQueryClient";
import { redirect } from "next/navigation";

export default async function Item({ params }: { params: { itemId: number } }) {
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

  const itemId: number = +params.itemId;

  // const queryClient = new QueryClient();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["item", itemId],
    queryFn: () => getItemByIdAction(itemId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemView itemId={itemId} projectId={projectId} />
    </HydrationBoundary>
  );
}
