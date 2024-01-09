"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Client } from "@jamphlet/database";

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
