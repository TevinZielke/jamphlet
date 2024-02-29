import { ProjectStructure } from "@/components/project-structure";
import { ProjectView } from "@/components/project-view";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import {
  getProjectAction,
  getProjectFormSchemaAction,
  getUserByKindeId,
} from "@jamphlet/database";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "lib/getQueryClient";
import { redirect } from "next/navigation";

// const projectId = 1;

export default async function Project() {
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

  if (!dbUser?.id) {
    throw new Error("Error fetching dbUser.");
  }
  if (!projectId) {
    throw new Error("Error fetching current project.");
  }

  const project = await getProjectAction(projectId);

  if (!project) {
    throw new Error("Error fetching project.");
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project-form-schema", projectId],
    queryFn: () => getProjectFormSchemaAction(projectId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectAction(projectId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectView projectId={projectId} projectName={project.name} />
      Hello
      <ProjectStructure projectId={projectId} />
    </HydrationBoundary>
  );
}
