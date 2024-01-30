"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewFeature,
  addFeatureAction,
  insertFeatureSchema,
} from "@jamphlet/database";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "lib/utils";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

type FeatureFormProps = {
  feature?: NewFeature;
  categoryId?: number;
  categoryName?: string;
  showlabel?: boolean;
};

export function FeatureForm({
  feature,
  showlabel = false,
  categoryId,
  categoryName,
}: FeatureFormProps) {
  const form = useForm<z.infer<typeof insertFeatureSchema>>({
    resolver: zodResolver(insertFeatureSchema),
    defaultValues: {
      name: feature?.name || "",
      value: feature?.value || "",
      categoryId: feature?.categoryId || categoryId,
      mainFact: feature?.mainFact || false,
      type: feature?.type,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof insertFeatureSchema>) => {
    const newFeature: NewFeature = values;
    const insertedFeature = await addFeatureAction(newFeature);
    const insertedFeatureName = insertedFeature.at(0)?.insertedName;
    insertedFeatureName &&
      toast("New feature type added.", {
        description: `${insertedFeatureName} has been added to ${categoryName}.`,
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className={cn("flex gap-3")}>
          <div className=" w-2/5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {showlabel && (
                    <div className=" flex flex-row justify-between">
                      <FormLabel className={cn(" py-2")}>Name</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle color="grey" className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Set a distinguishable name for your feature.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                  <FormControl>
                    <Input placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" w-1/5">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  {showlabel && (
                    <div className=" flex flex-row justify-between">
                      <FormLabel className={cn(" py-2")}>Type</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle color="grey" className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              The data type determines if the feature can be
                              sorted, displayed as currency, simple text, or a
                              yes or no.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Data type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="quantity">Quantity</SelectItem>
                      <SelectItem value="currency">Currency</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className=" w-2/5">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  {showlabel && (
                    <div className=" flex flex-row justify-between">
                      <FormLabel className={cn(" py-2")}>
                        Default value
                      </FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle color="grey" className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The default value when you create a new item.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                  <FormControl>
                    <Input placeholder="100000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" w-1/5">
            <FormField
              control={form.control}
              name="mainFact"
              render={({ field }) => (
                <FormItem className=" flex flex-col ">
                  {showlabel && (
                    <div className=" flex flex-row justify-between">
                      <FormLabel className={cn(" py-2")}>Main fact</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle color="grey" className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Choose whether this feature should be displayed as
                              a main fact.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}

                  <div className=" pt-2">
                    <FormControl>
                      <Switch
                        checked={field.value!}
                        onCheckedChange={field.onChange}
                        aria-readonly
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" flex justify-end place-items-end">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
