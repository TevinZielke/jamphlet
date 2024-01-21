"use client";
import {
  ClientsWithPamphlet,
  deleteClient,
  getImageURL,
} from "@jamphlet/database";

import { useClientAtom } from "lib/use-client";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { DeleteDialog } from "./delete-dialog";
import { toast } from "sonner";
import { ClientFormDialog } from "./client-form";
import Image from "next/image";
import { PamphletForm } from "./pamphlet-form";
import { ImageForm } from "./image-form";
import { ScrollArea } from "./ui/scroll-area";

type ClientViewProps = {
  data: ClientsWithPamphlet | null;
  imageURL: string;
};

export function ClientView({ data, imageURL }: ClientViewProps) {
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
  const pamphlet = client?.pamphlets.at(0);

  // const imaageUrl =
  //   "https://skoadbwgytopxdzofxgm.supabase.co/storage/v1/object/public/images/images/project_1/item_1/floorplan_1.jpg?t=2024-01-17T20%3A22%3A42.901Z";

  if (!data) return null;
  return (
    <ScrollArea className=" h-full">
      {clientId === 0 ? (
        <div className=" flex place-content-center items-center h-full">
          <div>
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
              <ImageForm clientId={clientId} />
            </div>
            <div>
              <Image alt="test" src={imageURL} width={400} height={300} />
            </div>
          </div>
        </div>
      )}
    </ScrollArea>
  );
}
