import { zodResolver } from "@hookform/resolvers/zod";
import { insertItemSchema, NewItem, addItem } from "@jamphlet/database";
import { redirect } from "next/navigation";
import { useForm, Form } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { CardFooter } from "./ui/card";
import { DialogClose, DialogFooter } from "./ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export function ItemForm(itemId: number) {
  const form = useForm<z.infer<typeof insertItemSchema>>({
    resolver: zodResolver(insertItemSchema),
    defaultValues: {
      name: "",
      code: "",
      projectId: 1,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof insertItemSchema>) => {
    const newItem: NewItem = values;
    const insertedItem = await addItem(newItem);
    const insertedItemId = insertedItem.at(0)?.insertedId;
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
