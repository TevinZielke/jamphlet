import { ItemView } from "@/components/item-view";
import { getItemById } from "@jamphlet/database";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "lib/getQueryClient";

export default async function Item({ params }: { params: { itemId: number } }) {
  const itemId: number = +params.itemId;

  // const queryClient = new QueryClient();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["item", itemId],
    queryFn: () => getItemById(itemId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemView itemId={itemId} />
    </HydrationBoundary>
  );
}
