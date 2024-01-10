"use client";

import { getClientById, getPamphletByClientId } from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";

export function ClientView() {
  const clientId = 7;

  const { data: clientData } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId),
  });

  const { data: pamphletData } = useQuery({
    queryKey: ["pamphlet", clientId],
    queryFn: () => getPamphletByClientId(clientId),
  });

  return (
    <div className=" flex-col">
      <div>
        <h2>{clientData?.name}</h2>
        <p>{clientData?.email}</p>
      </div>
      <div>
        <p>Personal message: {pamphletData?.personalMessage}</p>
        <div>
          <span>Selected residences:</span>
          {pamphletData?.itemsOnPamphlets.map((item) => (
            <p key={item.itemId}>
              {item.item.name}: {item.comment}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
