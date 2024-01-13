"use client";

import { getClientsWithPamphletsByUserId } from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "./ui/scroll-area";
import { useClient, useSetClient } from "lib/use-client";

export function ClientList() {
  const [clientAtom, setClientAtom] = useClient();

  const testUserId = 3;

  const { data } = useQuery({
    queryKey: ["clientsWithPamphlets", testUserId],
    queryFn: () => getClientsWithPamphletsByUserId(testUserId),
  });

  if (!data) return null;
  return (
    <div>
      Client List
      <ScrollArea>
        {data.map((client) => (
          <div
            key={client.id}
            className=" bg-red-600"
            onClick={() => setClientAtom(client.id)}
          >
            <p>
              Name: {client.name}, Id: {client.id}
            </p>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
