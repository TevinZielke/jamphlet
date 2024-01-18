import { Provider as JotaiProvider } from "jotai";

import {
  getClients,
  getClientsWithPamphletsByUserId,
} from "@jamphlet/database";
import { ClientView } from "./client-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { Separator } from "./ui/separator";
import { DataTable } from "./clientTable/data-table";

type ClientsProps = {
  userId: number;
};

// const testUserId = 4;

// const data = await getClients(testUserId);
export async function Clients({ userId }: ClientsProps) {
  const data = await getClientsWithPamphletsByUserId(userId);
  return (
    <JotaiProvider>
      <ResizablePanelGroup
        direction="horizontal"
        // className=" min-h-full w-full rounded-lg border"
        className=" min-h-full w-full"
      >
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          maxSize={50}
          className=" flex flex-col"
        >
          <div className="items-start px-4 py-2">
            <h1 className="text-xl font-bold">Clients</h1>
          </div>
          <Separator />
          <div className=" flex-auto flex flex-col p-4">
            <DataTable data={data} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50} maxSize={80}>
          <div className="h-full w-full p-2">
            <ClientView data={data} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </JotaiProvider>
  );
}
