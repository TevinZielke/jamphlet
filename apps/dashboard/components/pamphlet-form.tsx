"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "usehooks-ts";
import {
  NewPamphlet,
  getItems,
  getItemsByProjectIdAction,
  insertPamphletSchema,
  updatePamphlet,
} from "@jamphlet/database";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "lib/utils";
import React from "react";
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
import { Label } from "./ui/label";
import { useQuery } from "@tanstack/react-query";
import { ItemTable } from "./item-table";
import { useSelectionAtom } from "lib/use-selection";
import { ClientTable } from "./client-table";

type PamphletFormProps = {
  defaultValues: PamphletFormDefaultValues;
};

export type PamphletFormDefaultValues = {
  clientId: number;
  userId: number;
  personalMessage: string;
};

export function PamphletForm({ defaultValues }: PamphletFormProps) {
  const form = useForm<z.infer<typeof insertPamphletSchema>>({
    resolver: zodResolver(insertPamphletSchema),
    defaultValues: defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof insertPamphletSchema>) => {
    const newPamphlet: NewPamphlet = {
      userId: defaultValues.userId,
      clientId: defaultValues.clientId,
      personalMessage: values.personalMessage,
    };
    const insertedPamphlet = await updatePamphlet(newPamphlet);

    toast("Jamphlet successfully updated.", {
      description: `Jamphlet for ${insertedPamphlet} is now up to date.`,
    });
  };

  // useEffect(() => {
  //   form.reset(defaultValues);
  // }, [clientId]);

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset(defaultValues);
    }
    console.log("formState", form.formState);
  }, [form.formState]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="personalMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal message</FormLabel>
              <FormControl>
                <Input
                  placeholder="Welcome to your bespoke Jamphlet"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A personal message to your client.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DrawerDialogDemo />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function DrawerDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit selection</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to --client name--'s selection. Click save when
              you're done.
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
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        {/* <ProfileForm className="px-4" /> */}
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

  console.log("pamphletForm: ", data);

  return (
    <div className=" flex justify-between">
      <div>
        <p>Current selection:</p>
        {selectionAtom.map((item, index) => {
          return <div key={index}>{index}</div>;
        })}
      </div>
      <div>
        <p>All tems</p>
        <ItemTable projectId={1} />
      </div>
    </div>
  );
}
