import { ClientTable } from "@/components/clientTable/data-table";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import {
  NewUser,
  addKindeUser,
  getClientsByUserId,
  getUserByKindeId,
} from "@jamphlet/database";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { Provider as JotaiProvider } from "jotai";
import { redirect } from "next/navigation";

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

  await queryClient.prefetchQuery({
    queryKey: ["clients", dbUser.id],
    queryFn: () => getClientsByUserId(dbUser.id),
  });

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
