import { ItemView } from "@/components/item-view";
import { getItemById } from "@jamphlet/database";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function Item({ params }: { params: { itemId: number } }) {
  const itemId: number = +params.itemId;

  const queryClient = new QueryClient();

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
