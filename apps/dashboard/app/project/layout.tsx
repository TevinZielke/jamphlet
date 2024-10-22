import { Navigation } from "@/components/navigation";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import { getProjectAction, getUserByKindeId } from "@jamphlet/database";

import { Provider as JotaiProvider } from "jotai";
import { FileBox, Image, Users } from "lucide-react";
import { redirect } from "next/navigation";

const projectNavLinks = [
  {
    id: 1,
    name: "Item Schema",
    value: "/project",
  },
  {
    id: 2,
    name: "Structure",
    value: "/project/structure",
  },
  {
    id: 3,
    name: "Media",
    value: "/project/media",
  },
  {
    id: 4,
    name: "Members",
    value: "/project/members",
  },
];

export default async function ItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  }

  const kindeUser = await getAuthenticatedUser();

  if (!kindeUser || kindeUser == null || !kindeUser.id || !kindeUser.email) {
    throw new Error("Authentication failed for: " + kindeUser);
  }

  const dbUser = await getUserByKindeId(kindeUser.id);
  if (!dbUser?.id || !dbUser.currentProjectId) {
    throw new Error("Error fetching dbUser.");
  }

  const project = await getProjectAction(dbUser.currentProjectId);

  if (!project) {
    throw new Error("Error fetching project.");
  }

  return (
    <div className="h-svh">
      <JotaiProvider>
        <ResizablePanelGroup
          direction="horizontal"
          className=" min-h-full w-full"
        >
          <ResizablePanel
            defaultSize={15}
            minSize={10}
            maxSize={30}
            className=" flex flex-col"
          >
            <div className=" flex justify-between items-center px-2 py-2">
              <h1 className="text-xl font-bold py-1">{project.name}</h1>
            </div>
            <Separator />
            <div className=" flex-auto flex flex-col">
              <Navigation links={projectNavLinks} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={85} minSize={70} maxSize={90}>
            <div className="h-full w-full">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </JotaiProvider>
    </div>
  );
}
