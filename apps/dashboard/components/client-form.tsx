"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewClient,
  addClient,
  addPamphlet,
  insertClientSchema,
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
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { useClient } from "lib/use-client";

export function ClientFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">create a new one</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create client</DialogTitle>
          <DialogDescription>
            Add a new client to your list. You can still make changes later.
          </DialogDescription>
        </DialogHeader>
        <ClientForm />
      </DialogContent>
    </Dialog>
  );
}

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

  const [clientAtom, setClientAtom] = useClient();

  const onSubmit = async (values: z.infer<typeof insertClientSchema>) => {
    const newClient: NewClient = values;
    const insertedClient = await addClient(newClient);
    const icid = insertedClient.at(0)?.insertedId;
    icid && addPamphlet(4, icid).then(() => setClientAtom(icid));
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
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Submit</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
