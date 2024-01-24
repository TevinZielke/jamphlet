import { Provider as JotaiProvider } from "jotai";

import { ItemsWithImages, getItemsByProjectId } from "@jamphlet/database";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { Separator } from "./ui/separator";
import { DataTable } from "./clientTable/data-table";
import { ItemPreview } from "./item-preview";
import { ItemView } from "./item-view";

type ItemsMenuProps = {
  projectId: number;
};

// type Item = {
//   projectId: number;
//   name: string;
//   createdAt: Date;
//   lastModified: Date;
//   code: string;
//   itemImages: {
//     id: number;
//     publicUrl: string;
//     path: string;
//     alt: string;
//     itemId: number;
//   };
// };

// const testUserId = 4;

// const data = await getClients(testUserId);

export async function ItemsMenu({ projectId }: ItemsMenuProps) {
  const data: ItemsWithImages = await getItemsByProjectId(projectId);

  if (!data) return null;

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
            <h1 className="text-xl font-bold">Items</h1>
          </div>
          <Separator />
          <div className=" flex-auto flex flex-col p-4">
            <DataTable input={data} menuMode="items" />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50} maxSize={80}>
          <div className="h-full w-full p-2">
            <ItemView data={data} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </JotaiProvider>
  );
}
