import { getClients } from "@jamphlet/database";
import { ClientList } from "./client-list";
import { ClientView } from "./client-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { Separator } from "./ui/separator";
import { DataTable } from "./clientTable/data-table";
import { ScrollArea } from "./ui/scroll-area";

const testUserId = 4;
const data = await getClients(testUserId);

export function Clients() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className=" min-h-full w-full rounded-lg border"
      // className=" min-h-full w-full"
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={50}>
        <div className="flex flex-col items-start px-4 py-2">
          <h1 className="text-xl font-bold">Clients</h1>
        </div>
        <Separator />
        <div className=" p-4 h-full">
          <ScrollArea className=" h-screen">
            <DataTable data={data} />
          </ScrollArea>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65} minSize={50} maxSize={80}>
        <div className="h-full p-2">
          <ClientView data={data} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
