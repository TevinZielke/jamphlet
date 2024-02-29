import { ClientView } from "@/components/client-view";
import { getClientAction } from "@jamphlet/database";
import {
  HydrationBoundary,
  // QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import getQueryClient from "lib/getQueryClient";

export default async function Client({
  params,
}: {
  params: { clientId: number };
}) {
  const clientId: number = +params.clientId;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientAction(clientId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientView clientId={clientId} />
    </HydrationBoundary>
  );
}
