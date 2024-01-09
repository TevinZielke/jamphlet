"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ClientList } from "./client-list";
import { ProjectSelector } from "./project-selector";
import { ClientView } from "./client-view";

export function Navigation() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[600px] h-full w-full rounded-lg border"
    >
      <ResizablePanel defaultSize={40}>
        <div className="flex flex-col h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
          <ProjectSelector />
          <ClientList />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center p-6">
          <ClientView />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
