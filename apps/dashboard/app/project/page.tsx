import { ProjectStructure } from "@/components/project-structure";
import { ProjectView } from "@/components/project-view";
import {
  getProjectAction,
  getProjectFormSchemaAction,
} from "@jamphlet/database";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "lib/getQueryClient";

const projectId = 1;

export default async function Project() {
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
      <ProjectView projectId={projectId} />
      Hello
      <ProjectStructure projectId={projectId} />
    </HydrationBoundary>
  );
}
