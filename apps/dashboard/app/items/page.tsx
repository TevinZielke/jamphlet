import { ItemFormCard } from "@/components/item-form-initial";
import { Separator } from "@/components/ui/separator";

export default async function ItemsPage() {
  return (
    <main className=" flex flex-row justify-center items-center h-full">
      <div className=" flex flex-col gap-4 items-center">
        <div className=" flex flex-col gap-4">
          <p className=" font-semibold">Select an item from the list, or...</p>
          <Separator />
        </div>
        <div className=" flex flex-row justify-center p-2">
          <ItemFormCard />
        </div>
      </div>
    </main>
  );
}
