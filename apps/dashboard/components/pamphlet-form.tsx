"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Client,
  NewPamphlet,
  Pamphlet,
  insertPamphletSchema,
  //   updateClient,
  updatePamphlet,
  //   upsertPamphlet,
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

type PamphletFormProps = {
  clientId: number;
};

// type ClientsWithPamphlet = {
//     client: Client;
//     pamphlet: Pamphlet;
// }

export function PamphletForm({ clientId }: PamphletFormProps) {
  console.log(clientId);

  const form = useForm<z.infer<typeof insertPamphletSchema>>({
    resolver: zodResolver(insertPamphletSchema),
    defaultValues: {
      clientId: clientId,
      userId: 4,
      personalMessage: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof insertPamphletSchema>) => {
    const newPamphlet: NewPamphlet = {
      userId: 4,
      clientId: clientId,
      personalMessage: values.personalMessage,
    };
    console.log("newPamphlet", newPamphlet);
    const insertedPamphlet = await updatePamphlet(newPamphlet);
    // const insertedPamphlet = await upsertPamphlet(newPamphlet);
    // await updateClient;
    toast("Jamphlet successfully updated.", {
      description: `Jamphlet for ${insertedPamphlet} is now up to date.`,
    });
  };

  useEffect(() => {
    form.reset({
      userId: 4,
      clientId: clientId,
      personalMessage: "",
    });
  }, [clientId]);

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        userId: 4,
        clientId: clientId,
        personalMessage: "",
      });
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
