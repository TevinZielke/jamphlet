"use client";

import { getClientsByUserId } from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";

import { columns } from "./clientTable/columns";
import { DataTable } from "./clientTable/data-table";

export function ClientList() {
  const testUserId = 3;

  const { data } = useQuery({
    queryKey: ["clients", testUserId],
    queryFn: () => getClientsByUserId(testUserId),
  });

  if (!data) return null;
  return (
    <div>
      Client List
      <DataTable columns={columns} data={data} />
    </div>
  );
}
