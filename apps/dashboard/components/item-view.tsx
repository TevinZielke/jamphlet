"use client";
import { getItemById } from "@jamphlet/database";

import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { DeleteDialog } from "./delete-dialog";
import { toast } from "sonner";
import { ClientFormDialog } from "./client-form";
import Image from "next/image";
import { ImageForm } from "./image-form";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery } from "@tanstack/react-query";

type ItemViewProps = {
  // data: ItemsWithImages | null;
  // data: ItemWithImages | null;
  itemId: number;
};

export function ItemView({ itemId }: ItemViewProps) {
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

  // const item = data?.find((c) => c.id === itemAtom);

  const { data: item } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => getItemById(itemId),
  });

  // if (!data) return null;
  return (
    <ScrollArea className=" h-full">
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
    </ScrollArea>
  );
}
