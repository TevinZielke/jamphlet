"use client";

import { getClientsWithPamphletsByUserId } from "@jamphlet/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./clientTable/data-table";

export function ClientList() {
  const testUserId = 4;

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["clientsWithPamphlets", testUserId],
    queryFn: () => getClientsWithPamphletsByUserId(testUserId),
  });

  function invalidate() {
    queryClient.invalidateQueries();
  }

  if (!data) return null;
  return (
    <>
      <button onClick={() => invalidate()}>Invalidate</button>
      <DataTable data={data} />
    </>
  );
}
