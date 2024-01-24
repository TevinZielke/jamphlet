import { Provider as JotaiProvider } from "jotai";

import {
  ClientsWithPamphlet,
  getClients,
  getClientsWithPamphletsByUserId,
  getImageURL,
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

export async function ClientsMenu({ userId }: ClientsProps) {
  const data: ClientsWithPamphlet =
    await getClientsWithPamphletsByUserId(userId);
  const imageURL = await getImageURL("/1/1/floorplan_1.jpg");

  if (!imageURL) return null;
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
            <DataTable input={data} menuMode="clients" />
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
