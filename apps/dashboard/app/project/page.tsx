import { ProjectView } from "@/components/project-view";
import { getProjectFormSchemaAction } from "@jamphlet/database";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "lib/getQueryClient";

const projectId = 1;

export default async function Project() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project-form-schema", projectId],
    queryFn: () => getProjectFormSchemaAction(projectId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <ItemView itemId={itemId} /> */}
      <ProjectView projectId={projectId} />
    </HydrationBoundary>
  );
}
