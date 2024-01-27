import { ClientFormDialog } from "@/components/client-form";
import { ClientTable } from "@/components/client-table";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import {
  ClientApiResponse,
  NewUser,
  addKindeUser,
  getClientPreviewsByUserIdAction,
  getUserByKindeId,
} from "@jamphlet/database";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";

import { Provider as JotaiProvider } from "jotai";
import { redirect } from "next/navigation";

const fetchSize = 15;

export default async function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projectId = 1;
  const organizationId = 1;

  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  }

  const kindeUser = await getAuthenticatedUser();

  if (!kindeUser || kindeUser == null || !kindeUser.id || !kindeUser.email) {
    throw new Error("Authentication failed for: " + kindeUser);
  }

  const dbUser = await getUserByKindeId(kindeUser.id);

  if (!dbUser) {
    const newUser: NewUser = {
      kindeId: kindeUser.id,
      name: kindeUser.given_name + " " + kindeUser.family_name,
      email: kindeUser.email,
    };
    addKindeUser(newUser, projectId, organizationId);
  }

  if (!dbUser?.id) {
    throw new Error("Error fetching dbUser.");
  }

  const queryClient = new QueryClient();

  const sorting: SortingState = [
    {
      id: "lastModified",
      desc: true,
    },
  ];

  await queryClient.prefetchInfiniteQuery<ClientApiResponse>({
    queryKey: ["clients", dbUser.id, sorting],
    queryFn: () =>
      getClientPreviewsByUserIdAction(dbUser.id, 0, fetchSize, sorting),
    initialPageParam: 0,
    getNextPageParam: (
      _lastGroup: ClientApiResponse,
      groups: ClientApiResponse[]
    ) => groups.length,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JotaiProvider>
        <ResizablePanelGroup
          direction="horizontal"
          // className=" min-h-full w-full"
        >
          <ResizablePanel
            defaultSize={35}
            minSize={20}
            maxSize={50}
            className=" flex flex-col"
          >
            <div className=" flex justify-between items-center px-4 py-2">
              <h1 className="text-xl font-bold">Items</h1>
              <ClientFormDialog text="New client" />
            </div>
            <Separator />
            <div className=" flex-auto flex flex-col p-4">
              <ClientTable userId={dbUser.id} />
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
