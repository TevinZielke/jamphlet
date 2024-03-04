"use client";

import {
  ItemOnPamphlet,
  ItemsOnPamphlet,
  NewItemOnPamphlet,
  getClientAction,
  getItemsByProjectIdAction,
} from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";
import { useSelectionAtom } from "lib/use-selection";
import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { ItemTable } from "./item-table";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "./ui/drawer";
import { Separator } from "./ui/separator";
import { X } from "lucide-react";
import { cn } from "lib/utils";
import { useClientAtom } from "lib/use-client";

type SelectionFormDialogProps = {
  projectId: number;
  clientName: string;
};

export function SelectionFormDialog({
  projectId,
  clientName,
}: SelectionFormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit selection</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[500px]">
          <DialogHeader>
            <DialogTitle>Edit selection</DialogTitle>
            <DialogDescription>
              <p>Make changes to {clientName}'s selection.</p>
              <p>Click save when you're done.</p>
            </DialogDescription>
          </DialogHeader>
          <SelectionForm projectId={projectId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit selection</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit selection</DrawerTitle>
          <DrawerDescription>
            <p>Make changes to {clientName}'s selection.</p>
            <p>Click save when you're done.</p>{" "}
          </DrawerDescription>
        </DrawerHeader>
        <SelectionForm projectId={projectId} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type SelectionFormProps = {
  projectId: number;
};

function SelectionForm({ projectId }: SelectionFormProps) {
  const [selectionAtom, setSelectionAtom] = useSelectionAtom();
  const [clientId, _] = useClientAtom();

  const { data } = useQuery({
    queryKey: ["items", projectId],
    queryFn: () => getItemsByProjectIdAction(projectId),
  });

  const { data: client } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientAction(clientId),
  });
  const selection = client?.pamphlets.at(0)?.itemsOnPamphlets;
  // selection && setSelectionAtom(selection)
  console.log(selection);

  let currentSelection: any[] = [];
  if (selection) {
    // currentSelection = data?.filter((item) =>
    //   // selectionAtom.includes(item.id)
    //   // selection.map(())
    //   selection.filter((selected: any) => selected.itemId === item.id)

    // );
    data?.map((entry) => {
      console.log("entry", entry);
      // if (entry.id )
    });
  }

  return (
    <div className=" flex">
      <div className=" font-medium max-h-[300px]">
        <p>All items</p>
        <ItemTable
          projectId={projectId}
          pamphletId={client?.pamphlets.at(0)?.id}
        />
      </div>
      <Separator orientation="vertical" />
      <div className=" w-[175px]">
        <p className=" font-medium">Current selection</p>
        <div className="pb-6">
          <Button variant={"outline"}>Save changes</Button>
        </div>
        {selection && selection?.length > 0 ? (
          currentSelection?.map((item, index) => {
            return (
              <div key={index}>
                <div className=" flex justify-between place-items-center">
                  <p>{item.name}</p>
                  <Button variant="ghost" className=" p-0">
                    <X color="grey" className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
              </div>
            );
          })
        ) : (
          <p>Empty</p>
        )}
      </div>
    </div>
  );
}
