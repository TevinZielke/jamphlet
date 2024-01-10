import { redirect } from "next/navigation";

import {
  authenticateUser,
  getAuthenticatedUser,
  LogoutLink,
} from "@jamphlet/auth";
import {
  addKindeUser,
  getClientById,
  getClientsByUserId,
  getPamphletByClientId,
  getProjectsByUserId,
  getUserByKindeId,
  NewUser,
} from "@jamphlet/database";
import { Navigation } from "@/components/navigation";
import styles from "./page.module.css";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { unstable_noStore as noStore } from "next/cache";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ClientList } from "@/components/client-list";
import { ClientView } from "@/components/client-view";
import { ProjectSelector } from "@/components/project-selector";
import { Separator } from "@/components/ui/separator";

const projectId = 1;
const organizationId = 1;

export default async function Page(): Promise<JSX.Element> {
  noStore();

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

  const testUserId = 3;
  const testClientId = 7;

  await queryClient.prefetchQuery({
    queryKey: ["user", kindeUser.id],
    queryFn: () => getUserByKindeId(kindeUser.id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["projects", testUserId],
    queryFn: () => getProjectsByUserId(testUserId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["clients", testUserId],
    queryFn: () => getClientsByUserId(testUserId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["client", testClientId],
    queryFn: () => getClientById(testClientId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["pamphlet", testClientId],
    queryFn: () => getPamphletByClientId(testClientId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={styles.main}>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[600px] h-full w-full rounded-lg border"
        >
          <ResizablePanel defaultSize={20}>
            <div className="flex flex-col h-full items-center justify-center">
              {/* <span className="font-semibold">Sidebar</span> */}
              <div className="flex h-[52px] items-center justify-center px-2">
                <ProjectSelector />
              </div>
              <Separator />
              <Navigation />
              <Separator />
              <LogoutLink>Log Out</LogoutLink>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30}>
            <div className="flex h-full items-center justify-center p-6">
              <ClientList />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <ClientView />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </HydrationBoundary>
  );
}
