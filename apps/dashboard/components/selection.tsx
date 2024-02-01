"use client";

import {
  ItemWithImages,
  getClientAction,
  getItemsByProjectIdAction,
} from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";
import { cn } from "lib/utils";
import Image from "next/image";
import { Fragment } from "react";
import { Separator } from "./ui/separator";
import { SelectionFormDialog } from "./selection-form";

// type PreviewImage = {
//   id: number;
//   publicUrl: string;
//   path: string;
//   alt: string;
//   itemId: number;
// };

type SelectionProps = {
  projectId: number;
  clientId: number;
};

export function Selection({ projectId, clientId }: SelectionProps) {
  const { data } = useQuery({
    queryKey: ["items", projectId],
    queryFn: () => getItemsByProjectIdAction(projectId),
  });

  const { data: client } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientAction(clientId),
  });

  if (!data) return null;

  // const items: ItemsWithImages = data;

  const currentSelection = client?.pamphlets.at(0)?.itemsOnPamphlets;

  if (!currentSelection) return null;

  return (
    <div className="space-y-2 flex flex-col">
      <div className=" flex justify-between place-items-center">
        <p className=" text-sm font-medium">Selection</p>
        <SelectionFormDialog />
      </div>
      <div className=" border rounded-lg">
        {currentSelection.map((selectionItem, index) => {
          const item = selectionItem.item as ItemWithImages;
          return (
            //  cs.map((it) => {
            <Fragment key={item.id}>
              {index !== 0 && <Separator />}
              <Item {...item} />
            </Fragment>
            // });
          );
        })}
      </div>
      <span className="text-[0.8rem] text-muted-foreground">
        The items you want to show your client.
      </span>
    </div>
  );
}

function Item(item: ItemWithImages) {
  const previewRegex = ".*\bpreview\b.*";
  const itemImages = item.itemImages;
  const previewImage = itemImages.find((img) => img.path?.search(previewRegex));

  const preview = itemImages.find((e) => e.path?.includes("preview"));

  const price = `$${item.id * 2}.500.000`;
  const bedrooms = `${item.id + 1} bedrooms`;
  return (
    <div className={cn(" flex")}>
      <div className={cn(" p-2")}>
        <Image
          className={cn(" rounded-lg")}
          src={preview?.publicUrl!}
          width={150}
          height={100}
          alt={"alt preview"}
        />
      </div>
      <div className={cn(" p-2 flex flex-col justify-between")}>
        <p className=" text-sm font-medium">{item.name}</p>
        <div className=" flex gap-12">
          <p className=" text-sm">{price}</p>
          <div>
            <p className=" text-sm">{bedrooms}</p>
            <p className=" text-sm">{bedrooms}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
