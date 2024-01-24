"use client";
import { ItemsWithImages } from "@jamphlet/database";

import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { DeleteDialog } from "./delete-dialog";
import { toast } from "sonner";
import { ClientFormDialog } from "./client-form";
import Image from "next/image";
import { ImageForm } from "./image-form";
import { ScrollArea } from "./ui/scroll-area";
import { useItemAtom } from "lib/use-item";

type ItemViewProps = {
  data: ItemsWithImages | null;
};

export function ItemView({ data }: ItemViewProps) {
  const [itemAtom, setClientAtom] = useItemAtom();

  //   const confirm = async () => {
  //     // const res = await deleteClient(itemAtom);
  //     //Toast
  //     // console.log("Confirm Result:", res);
  //     toast("Client has been deleted.", {
  //       description: `${res.at(0)?.name} has left the building.`,
  //       action: {
  //         label: "Undo",
  //         onClick: () => console.log("Undo"),
  //       },
  //     });
  //     setClientAtom(0);
  //   };

  const item = data?.find((c) => c.id === itemAtom);

  if (!data) return null;
  return (
    <ScrollArea className=" h-full">
      {itemAtom === 0 ? (
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
              <h2 className=" text-3xl font-bold">{item?.name}</h2>
              <p>{item?.code}</p>
              <p>{item?.createdAt?.toLocaleString()}</p>
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
            <div>
              {item?.itemImages.map((itemImage) => {
                return (
                  <div>
                    <Image
                      src={itemImage.publicUrl!}
                      width={100}
                      height={100}
                      alt={itemImage.alt!}
                    />
                  </div>
                );
              })}
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