"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewItemImage,
  addItemImage,
  insertItemImageSchema,
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
import { Input } from "./ui/input";
import { cn } from "lib/utils";
import { Button } from "./ui/button";

type ItemImageFormProps = {
  itemId: number;
  itemImage: NewItemImage;
};

export function ItemImageForm({ itemId, itemImage }: ItemImageFormProps) {
  const form = useForm<z.infer<typeof insertItemImageSchema>>({
    resolver: zodResolver(insertItemImageSchema),
    defaultValues: {
      caption: itemImage.caption || "Give your image a title.",
      alt: itemImage.alt || "Set a descriptive alt text for your image",
      path: itemImage.path || "",
      publicUrl: itemImage.publicUrl || "",
      itemId: itemId,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof insertItemImageSchema>) => {
    const newItemImage: NewItemImage = values;

    const insertedItemImage = await addItemImage(newItemImage);

    console.log("insertedImage", insertedItemImage);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className={cn("flex flex-col gap-2")}>
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <div className=" flex gap-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </div>
                <FormDescription>The title of your image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alt text</FormLabel>
                <div className=" flex gap-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </div>
                <FormDescription>
                  Add a descriptive alternative text to your iamge.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
