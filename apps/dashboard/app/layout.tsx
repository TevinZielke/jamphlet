import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sidebar } from "@/components/sidebar";
import { TanStackQueryProvider } from "providers/tanStackQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jamphlet",
  description: "Create bespoke digital experiences for your clients",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanStackQueryProvider>
          <ResizablePanelGroup
            direction="horizontal"
            className=" min-h-full w-full rounded-lg border"
          >
            <ResizablePanel defaultSize={12} minSize={10} maxSize={20}>
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={88} minSize={80} maxSize={90}>
              {children}
            </ResizablePanel>
          </ResizablePanelGroup>
        </TanStackQueryProvider>

        <Toaster />
      </body>
    </html>
  );
}
