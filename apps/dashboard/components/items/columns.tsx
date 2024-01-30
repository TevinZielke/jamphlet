"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Item } from "@jamphlet/database";

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];
