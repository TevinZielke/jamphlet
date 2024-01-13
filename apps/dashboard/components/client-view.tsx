"use client";

import { getClientsWithPamphletsByUserId } from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";
import { useClient } from "lib/use-client";

export function ClientView() {
  const testUserId = 3;
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
        <div className=" flex-col">
          <div>
            <h2>Client Name: {client?.name}</h2>
            <p>Client Email: {client?.email}</p>
            <p>Client Id: {client?.id}</p>
          </div>
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
      )}
    </>
  );
}
