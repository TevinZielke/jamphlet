"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { insertCategorySchema } from "@jamphlet/database";
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

import { toast } from "sonner";
import { cn } from "lib/utils";
import { Button } from "./ui/button";

// type MyEnum = typeof FeatureType

type CategoryFormProps = {
  name?: string;
  categoryId: number;
};

export function CategoryForm({ name, categoryId }: CategoryFormProps) {
  const form = useForm<z.infer<typeof insertCategorySchema>>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: name || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof insertCategorySchema>) => {
    console.log("categoryForm", values);
    // const newFeature: NewFeature = values;
    // const insertedFeature = await addFeatureAction(newFeature);
    // const insertedFeatureName = insertedFeature.at(0)?.insertedName;
    // insertedFeatureName &&
    //   toast("New feature type added.", {
    //     description: `${insertedFeatureName} has been added to ${categoryName}.`,
    //   });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className={cn("flex gap-2")}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Rooms" {...field} />
                </FormControl>
                <FormDescription>The name of your category.</FormDescription>
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
