"use client";
import {
  CategoriesWithFeatures,
  getItemsByProjectIdAction,
  getProjectFormSchemaAction,
} from "@jamphlet/database";

import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { DeleteDialog } from "./delete-dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { ProjectForm } from "./project-form";
import { cn } from "lib/utils";

type ProjectViewProps = {
  projectId: number;
};

export function ProjectView({ projectId }: ProjectViewProps) {
  // const [clientId, setClientId] = useClientAtom();

  // const confirm = async () => {
  //   const res = await deleteClient(clientId);
  //   //Toast
  //   console.log("Confirm Result:", res);
  //   toast("Client has been deleted.", {
  //     description: `${res.at(0)?.name} has left the building.`,
  //     action: {
  //       label: "Undo",
  //       onClick: () => console.log("Undo"),
  //     },
  //   });
  //   setClientId(0);
  // };

  // const client = data?.find((c) => c.id === clientId);

  const { data: project } = useQuery({
    queryKey: ["project-form-schema", projectId],
    queryFn: () => getProjectFormSchemaAction(projectId),
  });

  console.log("ProjectFormSchema: ", project);

  const { data: items } = useQuery({
    queryKey: ["items", projectId],
    queryFn: () => getItemsByProjectIdAction(projectId),
  });

  console.log("Items: ", items);

  // setSelectionAtom(itemIdArray);

  //   const formDefaultValues: PamphletFormDefaultValues = {
  //     clientId: clientId,
  //     userId: client?.userId,
  //     personalMessage: pamphlet?.personalMessage,
  //   };

  const categories: CategoriesWithFeatures = project?.categories!;

  return (
    <ScrollArea className=" h-full">
      <div>
        <div className="flex flex-row justify-between px-2 py-2">
          <div>
            <h2 className=" text-3xl font-bold">{project?.name}</h2>
            {/* <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className=" p-0">
                  Last edited{" "}
                  {formatDistanceToNow(new Date(project.!))} ago
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className=" flex justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Created at</h4>
                    <div className="flex items-center pt-2">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                      <span className="text-xs text-muted-foreground">
                        {client.lastModified?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Separator orientation="vertical" className=" h-[48px]" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Last modified</h4>
                    <div className="flex items-center pt-2">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                      <span className="text-xs text-muted-foreground">
                        {client.lastModified?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard> */}
          </div>
          <div className=" flex gap-2">
            <Button variant="secondary">Edit</Button>
            <DeleteDialog handleConfirm={confirm}>
              <Button variant="destructive">Delete</Button>
            </DeleteDialog>
          </div>
        </div>

        <Separator />
        <div className=" p-2">
          {/* <PamphletForm defaultValues={formDefaultValues} /> */}

          <ProjectForm categories={categories} />
          {/* {project?.categories.map((category) => {
            return (
              <>
                <p>{category.name}</p>
                {category.features.map((feature) => {
                  return (
                    <>
                      <p>{feature.name}</p>
                    </>
                  );
                })}
              </>
            );
          })} */}
        </div>
      </div>
    </ScrollArea>
  );
}

// type ProjectFormProps = {
//   category: Category;
//   features: Feature[];
// };

// type Features = {
//   features: Feature;
// };
