"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewPamphlet,
  insertedPamphletSchema,
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
import { Input } from "./ui/input";
import { toast } from "sonner";

type PamphletFormProps = {
  clientId: number;
};

export function PamphletForm({ clientId }: PamphletFormProps) {
  console.log(clientId);

  const form = useForm<z.infer<typeof insertedPamphletSchema>>({
    resolver: zodResolver(insertedPamphletSchema),
    defaultValues: {
      clientId: clientId,
      userId: 4,
      personalMessage: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof insertedPamphletSchema>) => {
    const newPamphlet: NewPamphlet = values;
    const insertedPamphlet = await updatePamphlet(newPamphlet);
    toast("Jamphlet successfully updated.", {
      description: `Jamphlet for ${insertedPamphlet.at(0)
        ?.updatedId} is now up to date.`,
    });
  };

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
