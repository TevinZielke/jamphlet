"use client";

import {
  FeaturesOnItems,
  Item,
  ItemImage,
  ItemOnPamphlet,
  getClientAction,
} from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";
import { cn } from "lib/utils";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { SelectionFormDialog } from "./selection-form";
import { Textarea } from "./ui/textarea";
import { Siren } from "lucide-react";

type SelectionItemProps = {
  info: Item & ItemOnPamphlet;
  features: FeaturesOnItems[];
  images: ItemImage[];
};

type SelectionProps = {
  projectId: number;
  clientId: number;
};

export function Selection({ clientId }: SelectionProps) {
  const { data: client } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientAction(clientId),
  });

  const currentSelection = client?.pamphlets.at(0)?.itemsOnPamphlets;

  if (!currentSelection) return null;

  return (
    <div className="space-y-2 flex flex-col">
      <div className=" flex justify-between place-items-center">
        <p className="text-sm font-medium">Selection</p>
        <SelectionFormDialog />
      </div>
      <div className=" border rounded-lg">
        {currentSelection.map((selectionItem, index) => {
          const item: SelectionItemProps = {
            info: {
              id: selectionItem.itemId,
              itemId: selectionItem.itemId,
              code: selectionItem.item.code,
              comment: selectionItem.comment,
              createdAt: selectionItem.createdAt,
              lastModified: selectionItem.lastModified,
              name: selectionItem.item.name,
              pamphletId: selectionItem.pamphletId,
              projectId: selectionItem.item.projectId,
              seenAt: selectionItem.seenAt,
              seenByClient: selectionItem.seenByClient,
            },
            images: selectionItem.item.itemImages,
            features: selectionItem.item.featuresOnItems,
          };

          return (
            <div key={item.info.id}>
              {index !== 0 && <Separator />}
              <SelectionItem {...item} />
            </div>
          );
        })}
      </div>
      <span className="text-[0.8rem] text-muted-foreground">
        The items you want to show your client.
      </span>
    </div>
  );
}

function SelectionItem(item: SelectionItemProps) {
  const preview = item.images.find((image) => image.path?.includes("preview"));

  console.log(item.info.id, ": ", item.features);

  // move isMainFact to feature table
  return (
    <div className={cn("flex gap-4 p-2")}>
      <div className={cn("col-span-1")}>
        <Image
          className={cn(" rounded-md")}
          src={preview?.publicUrl!}
          width={150}
          height={100}
          alt={preview?.alt!}
        />
      </div>
      <div className={cn("flex-auto grid grid-cols-2 gap-4")}>
        <div className={cn("col-span-1 flex flex-col gap-1")}>
          <p className=" text-sm font-medium mb-2">{item.info.name}</p>
          {item.features.length > 0 ? (
            <div className={cn("grid grid-cols-2 gap-x-4")}>
              {item.features.flatMap((feature) => {
                if (feature.isMainFact) {
                  return (
                    <p className="text-sm  text-gray-500">
                      {feature.displayText || feature.value}
                    </p>
                  );
                }
              })}
            </div>
          ) : (
            <div className=" inline-flex gap-1">
              {/* <Siren color="orange" className="h-4 w-4 mt-0" /> */}
              <span className="text-sm text-gray-500 italic">
                No main facts have been set for this item.
              </span>
            </div>
          )}
        </div>
        <div className={cn("col-span-1 flex flex-col gap-1")}>
          <p className=" text-sm font-medium">Comment</p>
          <Textarea placeholder="Highlight a feature that makes this item a good fit for the client.">
            {item.info.comment}
          </Textarea>
        </div>
      </div>
    </div>
  );
}
