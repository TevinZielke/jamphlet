"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { NewItem, addItem, insertItemSchema } from "@jamphlet/database";
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
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { redirect } from "next/navigation";
// import { useItemAtom } from "lib/use-item";

type ItemFormDialogProps = {
  text: string;
  projectId: number;
};

export function ItemFormDialog({ text, projectId }: ItemFormDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild className=" hover:cursor-pointer">
        <Button variant="outline">{text}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create item</DialogTitle>
          <DialogDescription>
            Add a new item to your list. You can still make changes later on.
          </DialogDescription>
        </DialogHeader>
        <ItemFormInitial wrapper="dialog" projectId={projectId} />
      </DialogContent>
    </Dialog>
  );
}
type ItemFormCardProps = {
  projectId: number;
};
export function ItemFormCard({ projectId }: ItemFormCardProps) {
  return (
    <Card className="w-[440px]">
      <CardHeader>
        <CardTitle>Create item</CardTitle>
        <CardDescription>
          Add a new item to your list. You can still make changes later on.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemFormInitial wrapper="card" projectId={projectId} />
      </CardContent>
    </Card>
  );
}

type ItemFormProps = {
  wrapper: "dialog" | "card";
  projectId: number;
};

export function ItemFormInitial({ wrapper, projectId }: ItemFormProps) {
  const form = useForm<z.infer<typeof insertItemSchema>>({
    resolver: zodResolver(insertItemSchema),
    defaultValues: {
      name: "",
      code: "",
      projectId: projectId,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof insertItemSchema>) => {
    const newItem: NewItem = values;
    const insertedItem = await addItem(newItem);
    const insertedItemId = insertedItem.at(0)?.insertedId;

    // change to router.push
    insertedItemId && redirect(`/items/${insertedItemId}`);
  };

  // const [itemAtom, setItemAtom] = useItemAtom();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className=" flex justify-between">
                <FormLabel>Name</FormLabel>
                <FormDescription>
                  Give your item a distinguishable name.
                </FormDescription>
              </div>
              <FormControl>
                <Input placeholder="The name of your item..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <div className=" flex justify-between">
                <FormLabel>Code</FormLabel>
                <FormDescription>
                  The item's unique reference code.
                </FormDescription>
              </div>
              <FormControl>
                <Input placeholder="Item 123ABC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {wrapper === "dialog" && (
          <DialogFooter>
            <DialogClose>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">Submit</Button>
            </DialogClose>
          </DialogFooter>
        )}
        {wrapper === "card" && (
          <CardFooter className="flex justify-end p-0">
            <Button>Submit</Button>
          </CardFooter>
        )}
      </form>
    </Form>
  );
}
