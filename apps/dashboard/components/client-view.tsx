"use client";
import { ClientsWithPamphlet, deleteClient } from "@jamphlet/database";

import { useClientAtom } from "lib/use-client";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { DeleteDialog } from "./delete-dialog";
import { toast } from "sonner";
import { ClientFormDialog } from "./client-form";
import { PamphletForm } from "./pamphlet-form";
import { ImageForm } from "./image-form";
import { ScrollArea } from "./ui/scroll-area";

type ClientViewProps = {
  data: ClientsWithPamphlet | null;
};

export function ClientView({ data }: ClientViewProps) {
  const [clientId, setClientId] = useClientAtom();

  const confirm = async () => {
    const res = await deleteClient(clientId);
    //Toast
    console.log("Confirm Result:", res);
    toast("Client has been deleted.", {
      description: `${res.at(0)?.name} has left the building.`,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    setClientId(0);
  };

  const client = data?.find((c) => c.id === clientId);

  if (!data) return null;
  return (
    <ScrollArea className=" h-full">
      {clientId === 0 ? (
        <div className=" flex place-content-center items-center h-full">
          <div className=" h-full">
            <p>No Client selected.</p>
            <p>
              Select one from the left or <ClientFormDialog />
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-row justify-between px-2 py-2">
            <div>
              <h2 className=" text-3xl font-bold">{client?.name}</h2>
              <p>{client?.email}</p>
              <p>{client?.createdAt?.toLocaleString()}</p>
              <div>
                <p>
                  {client?.notes ? (
                    client.notes
                  ) : (
                    <Button variant="ghost">Add a note</Button>
                  )}
                </p>
              </div>
            </div>
            <div className=" flex gap-2">
              <Button variant="link">Visit Jamphlet</Button>
              <Button variant="secondary">Edit</Button>
              <DeleteDialog handleConfirm={confirm}>
                <Button variant="destructive">Delete</Button>
              </DeleteDialog>
              <Button>Share</Button>
            </div>
          </div>

          <Separator />
          <div className=" p-2">
            {/* <div className=" flex-col">
              <div>
                <p>Personal message: {pamphlet?.personalMessage}</p>
                <div>
                  <span>Selected residences:</span>
                  {pamphlet?.itemsOnPamphlets.map((iop) => (
                    <p key={iop.itemId}>
                      {iop.item.name}: {iop.comment}
                    </p>
                  ))}
                </div>
              </div>
            </div> */}
            <div>
              <PamphletForm clientId={clientId} />
              {/* <PamphletForm client={}/> */}
            </div>
            <div>
              <ImageForm />
            </div>
          </div>
        </div>
      )}
    </ScrollArea>
  );
}
