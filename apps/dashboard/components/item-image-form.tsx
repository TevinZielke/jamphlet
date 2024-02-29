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
import { Textarea } from "./ui/textarea";

type ItemImageFormProps = {
  itemId: number;
  itemImage: NewItemImage;
};

export function ItemImageForm({ itemId, itemImage }: ItemImageFormProps) {
  const form = useForm<z.infer<typeof insertItemImageSchema>>({
    resolver: zodResolver(insertItemImageSchema),
    defaultValues: {
      caption: itemImage.caption || "",
      alt: itemImage.alt || "",
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
              <FormItem className={cn("space-y-1")}>
                <FormLabel>Caption</FormLabel>
                <div className=" flex gap-1">
                  <FormControl>
                    <Input {...field} placeholder="The title of your image." />
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
              <FormItem className={cn("space-y-1")}>
                <FormLabel>Alt text</FormLabel>
                <div className=" flex gap-1">
                  <FormControl>
                    {/* <Input {...field} /> */}
                    <Textarea
                      placeholder="Modern and cozy apartment living room with a comfortable sectional sofa, stylish coffee table, soft rug, and large windows letting in natural light."
                      className=" resize-none h-fit"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  Add a descriptive alternative text to your image.
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
