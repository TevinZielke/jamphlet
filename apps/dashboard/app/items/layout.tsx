import { ItemFormDialog } from "@/components/item-form-initial";
import { ItemPreviewSkeleton } from "@/components/item-preview";
import { ItemTable } from "@/components/item-table";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import { getUserByKindeId } from "@jamphlet/database";

import { Provider as JotaiProvider } from "jotai";
import { redirect } from "next/navigation";
import { Fragment, Suspense } from "react";

function Skeletons() {
  const containeHeight = 666;
  const skeletonHeight = 125;
  const skeletons = new Array(containeHeight % skeletonHeight).fill(
    <ItemPreviewSkeleton />
  );
  return (
    <>
      {skeletons.map((elem, index) => (
        <Fragment key={index}>{elem}</Fragment>
      ))}
    </>
  );
}

export default async function ItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const queryClient = new QueryClient();
  // const queryClient = getQueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ["items", projectId],
  //   queryFn: () => getItems(projectId),
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
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
          <div className=" flex justify-between items-center px-2 py-2">
            <h1 className="text-xl font-bold">Items</h1>
            <ItemFormDialog text="New item" />
          </div>
          <Separator />
          <div className=" flex-auto flex flex-col p-4">
            <Suspense fallback={<Skeletons />}>
              <ItemList />
            </Suspense>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50} maxSize={80}>
          <div className="h-full w-full p-2">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </JotaiProvider>
    // </HydrationBoundary>
  );
}

async function ItemList() {
  const projectId = 1;

  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  }

  const kindeUser = await getAuthenticatedUser();

  if (!kindeUser || kindeUser == null || !kindeUser.id || !kindeUser.email) {
    throw new Error("Authentication failed for: " + kindeUser);
  }

  const dbUser = await getUserByKindeId(kindeUser.id);
  if (!dbUser?.id) {
    throw new Error("Error fetching dbUser.");
  }

  return <ItemTable projectId={projectId} />;
}
