"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { NewClient, addClient, insertClientSchema } from "@jamphlet/database";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import getQueryClient from "lib/getQueryClient";
import { revalidatePath } from "next/cache";

// function onSubmit(values: z.infer<typeof insertClientSchema>) {
//   console.log("Values: ", values);

//   const mutation = useMutation({
//     mutationFn: (input) => {
//       return addClient(input);
//     },
//   });
// }

export function ClientForm() {
  const form = useForm<z.infer<typeof insertClientSchema>>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      name: "",
      email: "",
      notes: "",
      userId: 4,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof insertClientSchema>) => {
    console.log("onSubmit", values);
    const newClient: NewClient = values;
    addClient(newClient);
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="jane.doe@mail.com" {...field} />
              </FormControl>
              <FormDescription>The client's email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input
                  placeholder="Client is a pet owner, prefers a north-west view,..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Preliminary notes might come in handy later on.
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
