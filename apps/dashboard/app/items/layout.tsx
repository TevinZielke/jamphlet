import { ItemTable } from "@/components/item-table";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { getItems } from "@jamphlet/database";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { Provider as JotaiProvider } from "jotai";

export default async function ItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projectId = 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["items", projectId],
    queryFn: () => getItems(projectId),
  });

  console.log("first", projectId);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JotaiProvider>
        <ResizablePanelGroup
          direction="horizontal"
          className=" min-h-full w-full"
        >
          <ResizablePanel
            defaultSize={35}
            minSize={20}
            maxSize={50}
            className=" flex flex-col"
          >
            <div className="items-start px-4 py-2">
              <h1 className="text-xl font-bold">Items</h1>
            </div>
            <Separator />
            <div className=" flex-auto flex flex-col p-4">
              <ItemTable />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65} minSize={50} maxSize={80}>
            <div className="h-full w-full p-2">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </JotaiProvider>
    </HydrationBoundary>
  );
}
