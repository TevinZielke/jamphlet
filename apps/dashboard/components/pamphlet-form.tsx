"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewPamphlet,
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
import { toast } from "sonner";
import { useEffect } from "react";
import React from "react";
import { Selection } from "./selection";
import { Textarea } from "./ui/textarea";

type PamphletFormProps = {
  defaultValues: PamphletFormDefaultValues;
  projectId: number;
};

export type PamphletFormDefaultValues = {
  clientId: number;
  clientName: string;
  userId: number;
  personalMessage: string;
};

export function PamphletForm({ defaultValues, projectId }: PamphletFormProps) {
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
    // console.log("formState", form.formState);
  }, [form.formState]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="personalMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="font-medium">Personal message</p>
              </FormLabel>
              <FormControl>
                <Textarea
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
        <Selection
          projectId={projectId}
          clientId={defaultValues.clientId}
          clientName={defaultValues.clientName}
        />
        <div className=" flex flex-auto justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
