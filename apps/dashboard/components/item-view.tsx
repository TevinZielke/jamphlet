"use client";
import {
  getItemByIdAction,
  getProjectFormSchemaAction,
} from "@jamphlet/database";

import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { DeleteDialog } from "./delete-dialog";
// import { toast } from "sonner";
import Image from "next/image";
import { ImageForm } from "./image-form";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { ItemForm, ItemFormCategory } from "./item-form";
import { cn } from "lib/utils";
import ItemImageView from "./item-image-view";

type ItemViewProps = {
  itemId: number;
};

export const fields: ItemFormCategory[] = [
  {
    category: {
      categoryId: 1,
      categoryName: "Pricing",
    },
    fields: [
      {
        featureIdString: "1",
        fieldName: "pricing",
        type: "currency",
        label: "Pricing",
        defaultValue: 1500000,
      },
    ],
  },
  {
    category: {
      categoryId: 3,
      categoryName: "Size",
    },
    fields: [
      {
        featureIdString: "6",
        fieldName: "sqft",
        type: "quantity",
        label: "Square Footage",
        defaultValue: 5000,
      },
    ],
  },
  {
    category: {
      categoryId: 2,
      categoryName: "Rooms",
    },
    fields: [
      {
        featureIdString: "2",
        fieldName: "bedrooms",
        type: "quantity",
        label: "Bedrooms",
        defaultValue: 2,
      },
      {
        featureIdString: "3",
        fieldName: "bathrooms",
        type: "quantity",
        label: "Bedrooms",
        defaultValue: 1,
      },
      {
        featureIdString: "7",
        fieldName: "dining",
        type: "text",
        label: "Dining",
        defaultValue: "Formal dining room",
      },
    ],
  },
  {
    category: {
      categoryId: 4,
      categoryName: "Exposure",
    },
    fields: [
      {
        featureIdString: "4",
        fieldName: "exposure",
        type: "text",
        label: "Exposure",
        defaultValue: "South-West",
      },
    ],
  },
];

export function ItemView({ itemId }: ItemViewProps) {
  const confirm = async () => {
    // const res = await deleteClient(itemAtom);
    //Toast
    // console.log("Confirm Result:", res);
    // toast("Client has been deleted.", {
    //   description: `${res.at(0)?.name} has left the building.`,
    //   action: {
    //     label: "Undo",
    //     onClick: () => console.log("Undo"),
    //   },
    // });
    // setClientAtom(0);
  };

  // const item = data?.find((c) => c.id === itemAtom);

  const projectId = 1;

  const { data: formSchema } = useQuery({
    queryKey: ["project-form-schema", projectId],
    queryFn: () => getProjectFormSchemaAction(projectId),
  });

  // console.log("formSchema: ", formSchema);

  const { data: item } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => getItemByIdAction(itemId),
  });

  const itemFeatures = item?.featuresOnItems;

  if (!item) return null;

  const inputItem = {
    id: item?.id,
    name: item.name,
  };

  const floorplans = item.itemImages.filter(
    (image) => image.caption?.includes("Floorplan")
  );

  const galleryImages = item.itemImages.filter(
    (image) => image.caption?.includes("Gallery")
  );

  return (
    <ScrollArea className=" h-full">
      <div className="flex flex-row justify-between p-2">
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
      <div className={cn("flex flex-col gap-8 p-2")}>
        <div className={cn("flex flex-col gap-2")}>
          <h3 className={cn(" text-xl font-semibold")}>Item Information</h3>
          <div className={cn("flex justify-center")}>
            <ItemForm formCategories={fields} item={inputItem} />
          </div>
        </div>

        <div>
          <h3 className={cn(" text-xl font-semibold pb-2")}>Item Images</h3>
          <p>Floorplans</p>
          <div className="flex flex-col gap-2">
            <div className={cn("grid grid-cols-3 gap-2")}>
              {floorplans.map((floorplan) => {
                return (
                  <div key={floorplan.id}>
                    <ItemImageView itemImage={floorplan} />
                  </div>
                );
              })}
            </div>
            {/* <div className={cn("w-full border rounded-lg p-2")}> */}
            <div>
              <ImageForm projectId={projectId} itemId={itemId} />
            </div>
          </div>
          <p>Gallery Images</p>
          <div>
            <div className={cn("grid grid-cols-3 gap-2")}>
              {galleryImages.map((galleryImage) => {
                return (
                  <div key={galleryImage.id}>
                    <ItemImageView itemImage={galleryImage} />
                  </div>
                );
              })}
            </div>
            <div>
              <ImageForm projectId={projectId} itemId={itemId} />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
