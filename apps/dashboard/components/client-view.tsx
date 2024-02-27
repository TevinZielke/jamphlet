"use client";
import { getClientAction, getItemsByProjectIdAction } from "@jamphlet/database";

import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { DeleteDialog } from "./delete-dialog";
import { toast } from "sonner";
import { ClientFormDialog } from "./client-form";
import { PamphletForm, PamphletFormDefaultValues } from "./pamphlet-form";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { CalendarDays } from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useSelectionAtom } from "lib/use-selection";

type ClientViewProps = {
  clientId: number;
};

export function ClientView({ clientId }: ClientViewProps) {
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

  const projectId = 1;

  const { data: items } = useQuery({
    queryKey: ["items", projectId],
    queryFn: () => getItemsByProjectIdAction(projectId),
  });

  const { data: client } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientAction(clientId),
  });

  const pamphlet = client?.pamphlets.at(0);

  if (!client?.userId || !pamphlet?.personalMessage) return null;

  const [selectionAtom, setSelectionAtom] = useSelectionAtom();
  const itemIdArray = pamphlet.itemsOnPamphlets.map(({ itemId }) => itemId);
  // setSelectionAtom(itemIdArray);

  const formDefaultValues: PamphletFormDefaultValues = {
    clientId: clientId,
    userId: client?.userId,
    personalMessage: pamphlet?.personalMessage,
  };

  return (
    <ScrollArea className=" h-full">
      <div>
        <div className="flex flex-row justify-between px-2 py-2">
          <div>
            <h2 className=" text-3xl font-bold">{client?.name}</h2>
            <p>{client?.email}</p>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className=" p-0">
                  Last edited{" "}
                  {formatDistanceToNow(new Date(client.lastModified!))} ago
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
            </HoverCard>
            <div>
              <p>
                {client?.notes ? (
                  client.notes
                ) : (
                  <Button variant="outline">Add a note</Button>
                )}
              </p>
            </div>
          </div>
          <div className=" flex gap-2">
            <Button variant="link">Visit Jamphlet</Button>
            <Button variant="secondary">Edit info</Button>
            <DeleteDialog handleConfirm={confirm}>
              <Button variant="destructive">Delete</Button>
            </DeleteDialog>
            <Button>Share</Button>
          </div>
        </div>

        <Separator />
        <div className=" p-2">
          <PamphletForm defaultValues={formDefaultValues} />
        </div>
      </div>
    </ScrollArea>
  );
}
