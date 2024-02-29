"use client";
import {
  CategoriesWithFeatures,
  getProjectFormSchemaAction,
} from "@jamphlet/database";

import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { DeleteDialog } from "./delete-dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { ProjectForm } from "./project-form";

type ProjectViewProps = {
  projectId: number;
  projectName: string;
};

function confirm() {
  // reset item schema
}

export function ProjectView({ projectId, projectName }: ProjectViewProps) {
  const { data: project } = useQuery({
    queryKey: ["project-form-schema", projectId],
    queryFn: () => getProjectFormSchemaAction(projectId),
  });

  const categories: CategoriesWithFeatures = project?.categories!;

  return (
    <ScrollArea className=" h-full">
      <div>
        <div className="flex flex-row justify-between px-2 py-2">
          <div>
            <h2 className=" text-3xl font-bold">Item Schema</h2>
          </div>
          <div className=" flex gap-2">
            <Button variant="secondary">Edit</Button>
            <DeleteDialog handleConfirm={confirm}>
              <Button variant="destructive">Reset</Button>
            </DeleteDialog>
          </div>
        </div>
        <Separator />
        <div className="flex justify-center p-2">
          <ProjectForm
            categories={categories}
            projectId={projectId}
            projectName={projectName}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
