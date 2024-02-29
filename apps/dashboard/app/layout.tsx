import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sidebar } from "@/components/sidebar";
import { TanStackQueryProvider } from "providers/tanStackQueryProvider";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "lib/getQueryClient";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import {
  getUserByKindeId,
  NewUser,
  addKindeUser,
  ClientApiResponse,
  getClientPreviewsByUserIdAction,
  ItemPreviewApiResponse,
  getItemPreviewsByProjectIdAction,
  getProjectFormSchemaAction,
} from "@jamphlet/database";
import { SortingState } from "@tanstack/react-table";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jamphlet",
  description: "Create bespoke digital experiences for your clients",
};

const fetchSize = 15;

async function getClients() {
  // const projectId = 1;
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
  const projectId = dbUser?.currentProjectId;

  if (projectId && !dbUser) {
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

  // const queryClient = new QueryClient();
  const queryClient = getQueryClient();

  const sorting: SortingState = [
    {
      id: "lastModified",
      desc: true,
    },
  ];

  if (!projectId) return <p>No project available.</p>;

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

  await queryClient.prefetchInfiniteQuery<ItemPreviewApiResponse>({
    queryKey: ["items", 1, sorting],
    queryFn: () => getItemPreviewsByProjectIdAction(1, 0, fetchSize, sorting),
    initialPageParam: 0,
    getNextPageParam: (
      _lastGroup: ItemPreviewApiResponse,
      groups: ItemPreviewApiResponse[]
    ) => groups.length,
  });

  await queryClient.prefetchQuery({
    queryKey: ["project-form-schema", projectId],
    queryFn: () => getProjectFormSchemaAction(projectId),
  });

  // await queryClient.prefetchQuery({
  //   queryKey: ["items", projectId],
  //   queryFn: () => getItemsByProjectIdAction(projectId),
  // });

  return dbUser;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  await getClients();

  return (
    <html lang="en" className="h-svh">
      <body className={inter.className}>
        <TanStackQueryProvider>
          <div className=" p-4">
            <ResizablePanelGroup
              direction="horizontal"
              className=" rounded-lg border min-h-full max-h-[calc(100svh-2rem)]"
            >
              <ResizablePanel defaultSize={12} minSize={10} maxSize={20}>
                <Sidebar />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={88} minSize={80} maxSize={90}>
                <HydrationBoundary state={dehydrate(getQueryClient())}>
                  {children}
                </HydrationBoundary>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </TanStackQueryProvider>

        <Toaster />
      </body>
    </html>
  );
}
