"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { insertClientSchema } from "@jamphlet/database";

import { getClientsWithPamphletsByUserId } from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";
import { useClient } from "lib/use-client";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

export function ClientView() {
  const testUserId = 4;
  const [clientId] = useClient();

  const { data } = useQuery({
    queryKey: ["clientsWithPamphlets", testUserId],
    queryFn: () => getClientsWithPamphletsByUserId(testUserId),
  });

  const client = data?.find((c) => c.id === clientId);
  const pamphlet = client?.pamphlets.at(0);

  return (
    <>
      {clientId === 0 ? (
        <div>No Client selected.</div>
      ) : (
        <div>
          <div className="flex flex-row justify-between px-2 py-2">
            {/* <ClientProfile /> */}
            <div>
              <h2 className=" text-3xl font-bold">{client?.name}</h2>
              <p>{client?.email}</p>
              <p>{client?.createdAt?.toLocaleString()}</p>
              <div>
                <p>
                  {client?.notes ? (
                    client.notes
                  ) : (
                    <Button variant="ghost">Add a note</Button>
                  )}
                </p>
              </div>
            </div>
            <div className=" flex gap-2">
              <Button variant="link">Visit Jamphlet</Button>
              <Button variant="secondary">Edit</Button>
              <Button>Share</Button>
            </div>
          </div>

          <Separator />
          <div className=" flex-col">
            <div>
              <p>Personal message: {pamphlet?.personalMessage}</p>
              <div>
                <span>Selected residences:</span>
                {pamphlet?.itemsOnPamphlets.map((iop) => (
                  <p key={iop.itemId}>
                    {iop.item.name}: {iop.comment}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ClientProfile() {
  return <div>{}</div>;
}
