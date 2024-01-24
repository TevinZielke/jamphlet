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
import { useItemAtom } from "lib/use-item";
import { toast } from "sonner";

export function ItemFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">create a new one</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create client</DialogTitle>
          <DialogDescription>
            Add a new client to your list. You can still make changes later.
          </DialogDescription>
        </DialogHeader>
        <ItemForm />
      </DialogContent>
    </Dialog>
  );
}

export function ItemForm() {
  const form = useForm<z.infer<typeof insertItemSchema>>({
    resolver: zodResolver(insertItemSchema),
    defaultValues: {
      name: "",
      code: "",
    },
    mode: "onChange",
  });

  const [itemAtom] = useItemAtom();

  const onSubmit = async (values: z.infer<typeof insertItemSchema>) => {
    const newItem: NewItem = values;
    const insertedItem = await addItem(newItem);

    if (insertedItem) {
      toast("Item successfully added.", {
        description: `${insertedItem} has been created.`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormDescription>The name of your client.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="item_001" {...field} />
              </FormControl>
              <FormDescription>The item's code.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Submit</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
