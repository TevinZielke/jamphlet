"use client";

import { getClientsWithPamphletsByUserId } from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./clientTable/data-table";

export function ClientList() {
  const testUserId = 2;

  const { data } = useQuery({
    queryKey: ["clientsWithPamphlets", testUserId],
    queryFn: () => getClientsWithPamphletsByUserId(testUserId),
  });

  if (!data) return null;
  return <DataTable data={data} />;
}
