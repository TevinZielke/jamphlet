"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewCategory,
  addCategoryAction,
  insertCategorySchema,
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

import { toast } from "sonner";
import { cn } from "lib/utils";
import { Button } from "./ui/button";

// type MyEnum = typeof FeatureType

type CategoryFormProps = {
  projectId: number;
};

const projectName = "St. Beaux";

export function CategoryForm({ projectId }: CategoryFormProps) {
  const form = useForm<z.infer<typeof insertCategorySchema>>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      projectId: projectId,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof insertCategorySchema>) => {
    const newCategory: NewCategory = values;
    const insertedCategory = await addCategoryAction(newCategory);
    const insertedCategoryName = insertedCategory.at(0)?.insertedCategoryName;
    insertedCategoryName &&
      toast("New feature type added.", {
        description: `${insertedCategoryName} has been added to ${projectName}.`,
      });
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
                <div className=" flex gap-2">
                  <FormControl>
                    <Input placeholder="Rooms" {...field} />
                  </FormControl>
                  <div className=" flex justify-end">
                    <Button type="submit">Submit</Button>
                  </div>
                </div>
                <FormDescription>The name of your category.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
