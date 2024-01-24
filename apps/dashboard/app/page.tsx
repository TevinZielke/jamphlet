import { redirect } from "next/navigation";

import {
  authenticateUser,
  getAuthenticatedUser,
  LogoutLink,
} from "@jamphlet/auth";
import { addKindeUser, getUserByKindeId, NewUser } from "@jamphlet/database";
import { Navigation } from "@/components/navigation";
import styles from "./page.module.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ProjectSelector } from "@/components/project-selector";
import { Separator } from "@/components/ui/separator";
import { ClientsMenu } from "@/components/clients-menu";
import { ItemsMenu } from "@/components/items-menu";
import { useMenuAtom } from "lib/use-menu";
import { Button } from "@/components/ui/button";

const projectId = 1;
const organizationId = 1;

type Menu = {
  mode: "items" | "clients";
};

export default async function Page(): Promise<JSX.Element> {
  // noStore();

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
  // const testUserId = dbUser.id;
  const menuMode: Menu = {
    mode: "items",
  };

  return (
    <main className={styles.main}>
      <ResizablePanelGroup
        direction="horizontal"
        className=" min-h-full w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={12} minSize={10} maxSize={20}>
          <div className="flex h-[52px] items-center justify-center px-2">
            <ProjectSelector />
          </div>
          <Separator />
          <Navigation />
          <Separator />
          <Button variant="secondary">
            <LogoutLink>Log Out</LogoutLink>
          </Button>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={88} minSize={80} maxSize={90}>
          {menuMode.mode === "clients" ? (
            <ClientsMenu userId={dbUser.id} />
          ) : (
            <ItemsMenu projectId={projectId} />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
