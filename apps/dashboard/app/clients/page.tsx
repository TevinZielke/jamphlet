import { ClientFormCard } from "@/components/client-form";
import { Separator } from "@/components/ui/separator";

export default async function ClientPage() {
  return (
    <main className=" flex flex-row justify-center items-center h-full">
      <div className=" flex flex-col gap-4 items-center">
        <div className=" flex flex-col gap-4">
          <p className=" font-semibold">Select a client from the list, or</p>
          <Separator />
        </div>
        <div className=" flex flex-row justify-center p-2">
          <ClientFormCard />
        </div>
      </div>
    </main>
  );
}
