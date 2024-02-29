import { ClientView } from "@/components/client-view";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import { getClientAction, getUserByKindeId } from "@jamphlet/database";
import {
  HydrationBoundary,
  // QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import getQueryClient from "lib/getQueryClient";
import { redirect } from "next/navigation";

export default async function Client({
  params,
}: {
  params: { clientId: number };
}) {
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

  const clientId: number = +params.clientId;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientAction(clientId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientView clientId={clientId} projectId={projectId} />
    </HydrationBoundary>
  );
}
