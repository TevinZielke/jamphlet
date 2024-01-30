import { ClientFormDialog } from "@/components/client-form";
import { ClientTable } from "@/components/client-table";
import { ItemPreviewSkeleton } from "@/components/item-preview";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import {
  ClientApiResponse,
  ItemPreviewApiResponse,
  NewUser,
  addKindeUser,
  getClientPreviewsByUserIdAction,
  getItemPreviewsByProjectIdAction,
  getItemsByProjectIdAction,
  getUserByKindeId,
} from "@jamphlet/database";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";

import { Provider as JotaiProvider } from "jotai";
import getQueryClient from "lib/getQueryClient";
import { redirect } from "next/navigation";
import { Fragment, Suspense } from "react";

// const fetchSize = 15;

// async function getClients() {
//   const projectId = 1;
//   const organizationId = 1;

//   const isLoggedIn = await authenticateUser();

//   if (!isLoggedIn) {
//     redirect("/api/auth/login");
//   }

//   const kindeUser = await getAuthenticatedUser();

//   if (!kindeUser || kindeUser == null || !kindeUser.id || !kindeUser.email) {
//     throw new Error("Authentication failed for: " + kindeUser);
//   }

//   const dbUser = await getUserByKindeId(kindeUser.id);

//   if (!dbUser) {
//     const newUser: NewUser = {
//       kindeId: kindeUser.id,
//       name: kindeUser.given_name + " " + kindeUser.family_name,
//       email: kindeUser.email,
//     };
//     addKindeUser(newUser, projectId, organizationId);
//   }

//   if (!dbUser?.id) {
//     throw new Error("Error fetching dbUser.");
//   }

//   // const queryClient = new QueryClient();
//   const queryClient = getQueryClient();

//   const sorting: SortingState = [
//     {
//       id: "lastModified",
//       desc: true,
//     },
//   ];

//   await queryClient.prefetchInfiniteQuery<ClientApiResponse>({
//     queryKey: ["clients", dbUser.id, sorting],
//     queryFn: () =>
//       getClientPreviewsByUserIdAction(dbUser.id, 0, fetchSize, sorting),
//     initialPageParam: 0,
//     getNextPageParam: (
//       _lastGroup: ClientApiResponse,
//       groups: ClientApiResponse[]
//     ) => groups.length,
//   });

//   await queryClient.prefetchInfiniteQuery<ItemPreviewApiResponse>({
//     queryKey: ["items", 1, sorting],
//     queryFn: () => getItemPreviewsByProjectIdAction(1, 0, fetchSize, sorting),
//     initialPageParam: 0,
//     getNextPageParam: (
//       _lastGroup: ItemPreviewApiResponse,
//       groups: ItemPreviewApiResponse[]
//     ) => groups.length,
//   });

//   // await queryClient.prefetchQuery({
//   //   queryKey: ["items", projectId],
//   //   queryFn: () => getItemsByProjectIdAction(projectId),
//   // });

//   return dbUser;
// }

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

export default async function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <HydrationBoundary state={dehydrate(getQueryClient())}>
    <JotaiProvider>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          maxSize={50}
          className=" flex flex-col"
        >
          <div className=" flex justify-between items-center px-2 py-2">
            <h1 className="text-xl font-bold">Clients</h1>
            <ClientFormDialog text="New client" />
          </div>
          <Separator />
          <div className=" flex-auto flex flex-col p-2  max-h-full">
            <Suspense fallback={<Skeletons />}>
              <ClientList />
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

async function ClientList() {
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

  return <ClientTable userId={dbUser.id} />;
}
