"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpWideNarrow,
  GalleryVertical,
  LayoutList,
  MoreHorizontal,
  Plus,
  TableIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientPreview } from "../client-preview";
import { ScrollArea } from "../ui/scroll-area";
import { Client, getClientsWithPamphletsByUserId } from "@jamphlet/database";
import { useClient } from "lib/use-client";
import { cn } from "lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ClientForm } from "../client-form";
import { useQuery } from "@tanstack/react-query";

// export type Client = {
//   id: string;
//   name: string;
//   email: string;
//   lastModified: string;
// };

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export const hiddenColumns = ["lastModified"];

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    filterFn: fuzzyFilter,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    filterFn: fuzzyFilter,
  },
  {
    accessorKey: "lastModified",
    header: "Last Modified",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("lastModified")}</div>
    ),
    filterFn: fuzzyFilter,
    enableHiding: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const client = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(client.id.toString())
              }
            >
              Copy client ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View client</DropdownMenuItem>
            <DropdownMenuItem>Delete client</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Type
export function DataTable(input: any) {
  const [clientAtom, setClientAtom] = useClient();
  const data = input.data;
  if (!data) return null;

  // const data = d.data

  const [sortingMode, setSortingMode] = React.useState("Name ASC");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      lastModified: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  const [viewMode, setViewMode] = React.useState("table");

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className=" h-full">
      <div className="flex items-center pb-4 space-x-2">
        <Input
          placeholder="Search clients..."
          value={globalFilter ?? "a"}
          onChange={(e) => {
            setGlobalFilter(String(e.target.value));
          }}
          className="max-w-sm"
        />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MoreHorizontal />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <span>Sort</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanSort())
                      .map((column) => {
                        return (
                          <DropdownMenuRadioGroup
                            key={`${column.id}`}
                            value={sortingMode}
                            onValueChange={setSortingMode}
                          >
                            <DropdownMenuRadioItem
                              key={`${column.id} + asc`}
                              className="capitalize justify-between"
                              value={`${column.id} asc`}
                              onClick={() => {
                                column.toggleSorting(false);
                              }}
                            >
                              {column.id}
                              <ArrowUpWideNarrow />
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem
                              key={`${column.id} + desc`}
                              className="capitalize justify-between"
                              value={`${column.id} desc`}
                              onClick={() => {
                                column.toggleSorting(true);
                              }}
                            >
                              {column.id}
                              <ArrowDownNarrowWide />
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        );
                      })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <LayoutList className="mr-2 h-4 w-4" />
                  <span>View</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={sortingMode}
                      onValueChange={setSortingMode}
                    >
                      <DropdownMenuRadioItem
                        value="table"
                        onClick={() => {
                          setViewMode("table");
                        }}
                        className=" justify-between"
                      >
                        Table
                        <TableIcon />
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="card"
                        onClick={() => {
                          setViewMode("card");
                        }}
                        className=" justify-between"
                      >
                        Card
                        <GalleryVertical />
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>New Client</span>
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new client</DialogTitle>
                    <DialogDescription>
                      Add a new client to your list. You can still make changes
                      later.
                    </DialogDescription>
                  </DialogHeader>
                  <ClientForm />
                </DialogContent>
              </Dialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Sort
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanSort())
              .map((column) => {
                return (
                  <DropdownMenuRadioGroup
                    key={`${column.id}`}
                    value={sortingMode}
                    onValueChange={setSortingMode}
                  >
                    <DropdownMenuRadioItem
                      key={`${column.id} + asc`}
                      className="capitalize"
                      value={`${column.id} asc`}
                      onClick={() => {
                        column.toggleSorting(false);
                      }}
                    >
                      {column.id} ASC
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      key={`${column.id} + desc`}
                      className="capitalize"
                      value={`${column.id} desc`}
                      onClick={() => {
                        column.toggleSorting(true);
                      }}
                    >
                      {column.id} DESC
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      {viewMode === "table" ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(clientAtom === row.original.id && "bg-muted")}
                    onClick={() => {
                      setClientAtom(row.original.id);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        /**
         * Render clients as cards
         */
        <ScrollArea>
          <div className="flex flex-col gap-2">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <div key={row.id}>
                    <ClientPreview client={row.original} />
                  </div>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </div>
        </ScrollArea>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
