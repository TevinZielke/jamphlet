"use client";

import { getItemsByProjectIdAction } from "@jamphlet/database";
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

export function SelectionFormDialog() {
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
              <p>Make changes to --client name--'s selection.</p>
              <p>Click save when you're done.</p>
            </DialogDescription>
          </DialogHeader>
          <SelectionForm />
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
            <p>Make changes to --client name--'s selection.</p>
            <p>Click save when you're done.</p>{" "}
          </DrawerDescription>
        </DrawerHeader>
        <SelectionForm />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function SelectionForm() {
  const [selectionAtom, setSelectionAtom] = useSelectionAtom();
  const projectId = 1;

  const { data } = useQuery({
    queryKey: ["items", projectId],
    queryFn: () => getItemsByProjectIdAction(projectId),
  });

  const currentSelection = data?.filter((item) =>
    selectionAtom.includes(item.id)
  );

  return (
    <div className=" flex justify-between">
      <div className=" font-medium max-h-[300px]">
        <p>All items</p>
        <ItemTable projectId={1} />
      </div>
      <Separator orientation="vertical" />
      <div className=" w-[175px]">
        <p className=" font-medium">Current selection</p>
        <div className="pb-6">
          <Button variant={"outline"}>Save changes</Button>
        </div>
        {currentSelection?.map((item, index) => {
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
        })}
      </div>
    </div>
  );
}
