"use client";

import { ItemPreview, ItemWithImages } from "@jamphlet/database";
import { useItemAtom } from "lib/use-item";
import { cn } from "lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import Link from "next/link";

type ItemPreviewProps = {
  inputData: ItemPreview;
};

export function ItemPreviewSkeleton() {
  return (
    <div className={cn("flex flex-col space-y-2 m-2 p-2 border rounded-lg")}>
      <div className="space-y-1">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// TODO: change type
export function ItemPreviewCard({ inputData }: ItemPreviewProps) {
  const item = inputData;
  const [itemAtom, setItemAtom] = useItemAtom();

  return (
    <Link href={`/items/${item.id}`} className=" w-full py-1">
      <button
        key={item.id}
        className={cn(
          "flex flex-col items-start w-full gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
          itemAtom === item.id && "bg-muted"
        )}
        onClick={() => setItemAtom(item.id)}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{item.name}</div>
              {/* {!client.pamphlets.at(0)?.itemsOnPamphlets.at(0)
                ?.seenByClient && (
                <span className="flex h-2 w-2 rounded-full bg-blue-600" />
              )} */}
            </div>
            <div
              className={cn(
                "ml-auto text-xs",
                itemAtom === item.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {formatDistanceToNow(new Date(item.lastModified!))}
            </div>
          </div>
          <div className="text-xs font-medium text-gray-500">{item.code}</div>
        </div>
        {/* <div className="line-clamp-2 text-xs text-muted-foreground">
          {client.pamphlets.at(0)?.personalMessage?.substring(0, 300)}
        </div> */}
      </button>
    </Link>
  );
}
