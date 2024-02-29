"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  OnChangeFn,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import {
  Item,
  ItemPreview,
  ItemPreviewApiResponse,
  NewItemOnPamphlet,
  addItemToPamphletAction,
  getItemPreviewsByProjectIdAction,
} from "@jamphlet/database";
import { cn } from "lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { ItemPreviewCard, ItemPreviewSkeleton } from "./item-preview";
import { Fragment } from "react";
import { Separator } from "./ui/separator";
import { ItemFormInitial } from "./item-form-initial";
import { useItemAtom } from "lib/use-item";

const fetchSize = 15;

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

type ItemTableProps = {
  projectId: number;
  pamphletId?: number;
};

export function ItemTable({ projectId, pamphletId }: ItemTableProps) {
  const [viewMode, setViewMode] = React.useState("cards");
  const [itemId, setItemId] = useItemAtom();

  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const cardsContainerRef = React.useRef<HTMLDivElement>(null);

  const columns = React.useMemo<ColumnDef<Item>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("name")}</div>
        ),
        filterFn: fuzzyFilter,
      },
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("code")}</div>
        ),
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
          const item = row.original;

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
                    navigator.clipboard.writeText(item.id.toString())
                  }
                >
                  Copy item ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View item</DropdownMenuItem>
                <DropdownMenuItem>Delete item</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const [sortingMode, setSortingMode] = React.useState("Last Modified DESC");
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "lastModified",
      desc: true,
    },
  ]);

  const { data, fetchNextPage, status, isFetching, isLoading } =
    useInfiniteQuery<ItemPreviewApiResponse>({
      queryKey: [
        "items",
        projectId,
        sorting, //refetch when sorting changes
      ],
      queryFn: async ({ pageParam }) => {
        const start = (pageParam as number) * fetchSize;
        const fetchedData = getItemPreviewsByProjectIdAction(
          projectId,
          start,
          fetchSize,
          sorting
        );
        return await fetchedData;
      },
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });

  //flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  // const tableHeight = {};
  const estimatedTableRowHeight = 48;
  const estimatedCardRowHeight = 106;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // once the user has scrolled within three table rows off the bottom of the table, fetch more data if we can
        const scrollDistance = scrollHeight - scrollTop - clientHeight;
        const threshold = estimatedTableRowHeight * 3;
        if (
          scrollDistance < threshold &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  React.useEffect(() => {
    viewMode === "table"
      ? fetchMoreOnBottomReached(tableContainerRef.current)
      : fetchMoreOnBottomReached(cardsContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      lastModified: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: flatData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    debugTable: true,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    if (table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };

  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () =>
      viewMode === "table" ? estimatedTableRowHeight : estimatedCardRowHeight, //estimate row height for accurate scrollbar dragging
    getScrollElement: () =>
      viewMode === "table"
        ? tableContainerRef.current
        : cardsContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 3,
  });

  const items = rowVirtualizer.getVirtualItems();

  const hideSeparator =
    cardsContainerRef.current?.scrollTop === undefined ||
    cardsContainerRef.current?.scrollTop === 0;

  return (
    <div className=" flex flex-col justify-between max-h-full">
      <div className="flex flex-1 items-center pb-2 space-x-2">
        <Input
          placeholder="Search items..."
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
                    <span>New Item</span>
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new item</DialogTitle>
                    <DialogDescription>
                      Add a new item to the project. You can still make changes
                      later.
                    </DialogDescription>
                  </DialogHeader>
                  <ItemFormInitial wrapper="dialog" projectId={projectId} />
                </DialogContent>
              </Dialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className=" text-sm">
        ({flatData.length} of {totalDBRowCount} rows fetched)
      </p>
      <>
        {viewMode === "table" ? (
          <div
            ref={tableContainerRef}
            className={` relative flex-auto rounded-md border overflow-auto w-full h-[640px]`} //change to dynamic height
            onScroll={(e) =>
              fetchMoreOnBottomReached(e.target as HTMLDivElement)
            }
          >
            <Table className=" grid">
              <TableHeader className=" grid sticky top-0 z-10 bg-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className=" flex w-full">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{
                            display: "flex",
                            placeItems: "center",
                            width: header.getSize(),
                          }}
                        >
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
              <TableBody
                style={{
                  display: "grid",
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  position: "relative",
                }}
              >
                {items.map((virtualRow) => {
                  const row = rows[virtualRow.index] as Row<ItemPreview>;
                  return (
                    <TableRow
                      key={row.id}
                      data-index={virtualRow.index}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(itemId === row.original.id && "bg-muted")}
                      ref={(node) => rowVirtualizer.measureElement(node)}
                      style={{
                        display: "flex",
                        position: "absolute",
                        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                        width: `${table.getTotalSize()}px`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell
                            key={cell.id}
                            style={{
                              display: "flex",
                              width: cell.column.getSize(),
                              alignItems: "center",
                              justifyContent: cell.id.endsWith("actions")
                                ? "center"
                                : "flex-start",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {isFetching && <div>Fetching more items...</div>}
          </div>
        ) : (
          /**
           * Render items as cards
           */
          <>
            {!hideSeparator && <Separator />}
            <div
              ref={cardsContainerRef}
              className=" relative overflow-auto w-full h-fit"
              onScroll={(e) =>
                fetchMoreOnBottomReached(e.target as HTMLDivElement)
              }
            >
              <div
                style={{
                  display: "grid",
                  height: `calc(${rowVirtualizer.getTotalSize()}px + 49px)`,
                  position: "relative",
                }}
              >
                <>
                  {items.map((virtualRow) => {
                    const row = rows[virtualRow.index] as Row<ItemPreview>;
                    const data: ItemPreview = row.original;
                    return (
                      <Fragment key={row.id}>
                        {isFetching ? (
                          <ItemPreviewSkeleton />
                        ) : (
                          <div
                            key={row.id}
                            data-index={virtualRow.index}
                            ref={(node) => rowVirtualizer.measureElement(node)}
                            style={{
                              display: "flex",
                              position: "absolute",
                              transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                              width: "100%",
                            }}
                            // onClick={(e) => {
                            //   e.preventDefault();

                            //   if (pamphletId) {
                            //     const pamhletItem: NewItemOnPamphlet = {
                            //       itemId: data.id,
                            //       pamphletId: pamphletId,
                            //     };
                            //     handleAddPamphlet(pamhletItem);
                            //   }
                            // }}
                          >
                            <ItemPreviewCard
                              inputData={data}
                              pamphletId={pamphletId}
                            />
                          </div>
                        )}
                      </Fragment>
                    );
                  })}
                </>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
}
