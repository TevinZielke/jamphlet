import { NewItemImage } from "@jamphlet/database";
import { cn } from "lib/utils";
import Image from "next/image";
import { ItemImageForm } from "./item-image-form";

type ItemImageViewProps = {
  itemImage: NewItemImage;
};

export default function ItemImageView({ itemImage }: ItemImageViewProps) {
  return (
    <div
      className={cn(
        " flex flex-col justify-between gap-3 p-3 border rounded-lg w-[312px]"
      )}
    >
      <div className="relative aspect-[200/133] ">
        <Image
          src={itemImage.publicUrl!}
          fill
          alt={itemImage.alt!}
          className={cn("object-cover border rounded-lg")}
        />
      </div>
      <div>
        <ItemImageForm itemId={itemImage.itemId} itemImage={itemImage} />
      </div>
    </div>
  );
}
