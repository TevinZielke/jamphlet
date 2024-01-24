import { ClientView } from "@/components/client-view";
import { getClientById } from "@jamphlet/database";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function Item({
  params,
}: {
  params: { clientId: number };
}) {
  const clientId: number = +params.clientId;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientView clientId={clientId} />
    </HydrationBoundary>
  );
}
