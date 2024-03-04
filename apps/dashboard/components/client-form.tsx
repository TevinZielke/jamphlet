"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Client,
  NewClient,
  addClient,
  addPamphlet,
  insertClientSchema,
  updateClientAction,
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
import { useClientAtom } from "lib/use-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { redirect } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ReactNode, useEffect, useState } from "react";
import { useAuthenticatedUser } from "lib/use-authenticated-user";
import { toast } from "sonner";

type ClientFormDialogProps = {
  text?: string;
  isEditMode?: boolean;
  clientData?: NewClient;
  children?: ReactNode;
};

export function ClientFormDialog({
  text,
  isEditMode = false,
  children,
  clientData,
}: ClientFormDialogProps) {
  const titleText = isEditMode ? "Edit client" : "Create client";
  return (
    <Dialog>
      <DialogTrigger asChild className=" hover:cursor-pointer">
        {/* <Button variant="outline">{text}</Button> */}
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>
            Add a new client to your list. You can still make changes later on.
          </DialogDescription>
        </DialogHeader>
        <ClientForm wrapper="dialog" isEditMode clientData={clientData} />
      </DialogContent>
    </Dialog>
  );
}

export function ClientFormCard() {
  return (
    <Card className="w-[440px]">
      <CardHeader>
        <CardTitle>Create client</CardTitle>
        <CardDescription>
          Add a new client to your list. You can still make changes later on.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ClientForm wrapper="card" />
      </CardContent>
    </Card>
  );
}

type ClientFormProps = {
  wrapper: "dialog" | "card";
  isEditMode?: boolean;
  clientData?: NewClient;
};

export function ClientForm({
  wrapper,
  isEditMode = false,
  clientData,
}: ClientFormProps) {
  // const [userId, setUserId] = useState<number>();

  // useEffect(() => {
  //   authUserId();
  // }, []);

  // const authUserId = async () => {
  //   let userId = -1;
  //   const clientUserId = clientData?.userId || -1;

  //   try {
  //     const user = await useAuthenticatedUser();
  //     if (user?.id) userId = user?.id;
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   setUserId(isEditMode ? clientUserId : userId);
  // };

  const form = useForm<z.infer<typeof insertClientSchema>>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      id: clientData?.id || undefined,
      name: clientData?.name || "",
      email: clientData?.email || "",
      notes: clientData?.notes || "",
      userId: clientData?.userId,
    },
    mode: "onChange",
  });

  const [clientAtom, setClientAtom] = useClientAtom();

  const onSubmit = async (values: z.infer<typeof insertClientSchema>) => {
    const newClient: NewClient = values;

    if (isEditMode) {
      const updatedClient = await updateClientAction(newClient);
      const updatedClientName = updatedClient.at(0)?.updatedClient;
      updatedClientName &&
        toast("New feature type added.", {
          description: `Info for ${updatedClientName} has been updated.`,
        });
    } else {
      const insertedClient = await addClient(newClient);
      const insertedClientId = insertedClient.at(0)?.insertedId;
      insertedClientId &&
        addPamphlet(4, insertedClientId).then(() => {
          setClientAtom(insertedClientId);
        });
      redirect(`/clients/${insertedClientId}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className=" flex justify-between">
                <FormLabel>Name</FormLabel>
                <FormDescription>The name of your client.</FormDescription>
              </div>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className=" flex justify-between">
                <FormLabel>Email</FormLabel>
                <FormDescription>The client's email address.</FormDescription>
              </div>
              <FormControl>
                <Input placeholder="jane.doe@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <div className=" flex justify-between">
                <FormLabel>Notes</FormLabel>
                <FormDescription>
                  Preliminary notes might come in handy later on.
                </FormDescription>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Client is a pet owner, prefers a north-west view,..."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {wrapper === "dialog" && (
          <DialogFooter>
            <DialogClose>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">Submit</Button>
            </DialogClose>
          </DialogFooter>
        )}
        {wrapper === "card" && (
          <CardFooter className="flex justify-end p-0">
            <Button>Submit</Button>
          </CardFooter>
        )}
      </form>
    </Form>
  );
}
