"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  FileText,
  Calendar,
  History,
  Package,
  Users,
  DollarSign,
  Search,
  FolderOpen,
  FileQuestion,
  Database,
  AlertCircle
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  skeletonRows?: number;
  pageCount?: number;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange?: (pagination: any) => void;
  onSortingChange?: (sorting: any) => void;
  state?: any;
}

export interface RecentTableContainerProps<TData, TValue> {
  title: string;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  seeAllHref?: string;
  seeAllText?: string;
  showSeeAll?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  skeletonRows?: number;
}

// Table Skeleton Component
const TableSkeleton = ({
  columns,
  rows = 5,
  showHeader = true
}: {
  columns: number;
  rows?: number;
  showHeader?: boolean;
}) => {
  return (
    <>
      {showHeader && (
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, cellIndex) => (
              <TableCell key={cellIndex}>
                <div className="h-4 bg-muted/50 rounded animate-pulse" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

// Recent Table Skeleton Component
const RecentTableSkeleton = ({
  columns,
  rows = 3,
  showSeeAll = false
}: {
  columns: number;
  rows?: number;
  showSeeAll?: boolean;
}) => {
  return (
    <div className="animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between px-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded w-32" />
            <div className="h-3 bg-muted/50 rounded w-20" />
          </div>
        </div>
        {showSeeAll && (
          <div className="h-5 bg-muted rounded w-16" />
        )}
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <div className="h-4 bg-muted rounded w-3/4" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <div className="h-4 bg-muted/50 rounded w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
};

// Default empty state for HistoryTable
const DefaultEmptyState = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-64 text-center">
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      </div>
    </TableCell>
  </TableRow>
);

// Default empty state for RecentTableContainer
const DefaultRecentEmptyState = () => (
  <div className="py-12 text-center">
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
        <Database className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="font-medium">No data available</h3>
        <p className="text-sm text-muted-foreground">
          Add new items to see them here
        </p>
      </div>
    </div>
  </div>
);

// Pre-defined empty state variants
export const EmptyStates = {
  // History Table variants
  History: (colSpan: number) => (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-64 text-center">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <History className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium">No History Records</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your activity history will appear here once you start using the system.
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  ),

  Orders: (colSpan: number) => (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-64 text-center">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-16 w-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium">No Orders Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Start creating orders to see them appear in your history.
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  ),

  Users: (colSpan: number) => (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-64 text-center">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-16 w-16 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium">No Users Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Add users to your organization to collaborate and manage permissions.
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  ),

  Transactions: (colSpan: number) => (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-64 text-center">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium">No Transactions</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Transactions will appear here once financial activities are recorded.
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  ),

  // Recent Table Container variants
  RecentOrders: () => (
    <div className="py-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
          <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">No Recent Orders</h3>
          <p className="text-sm text-muted-foreground">
            Create your first order to get started with your business operations.
          </p>
        </div>
      </div>
    </div>
  ),

  RecentUsers: () => (
    <div className="py-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
          <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">No Recent Users</h3>
          <p className="text-sm text-muted-foreground">
            Newly added users will appear here for quick access.
          </p>
        </div>
      </div>
    </div>
  ),

  RecentActivity: () => (
    <div className="py-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <History className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">No Recent Activity</h3>
          <p className="text-sm text-muted-foreground">
            System activities and user actions will appear here.
          </p>
        </div>
      </div>
    </div>
  ),

  Error: (colSpan: number, message: string = "Failed to load data") => (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-64 text-center">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-16 w-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium">Something Went Wrong</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  ),

  Search: (colSpan: number) => (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-64 text-center">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-16 w-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <Search className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium">No Search Results</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  ),

  EmptyFolder: () => (
    <div className="py-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
          <FolderOpen className="h-8 w-8 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Empty Folder</h3>
          <p className="text-sm text-muted-foreground">
            This folder doesn't contain any items or documents.
          </p>
        </div>
      </div>
    </div>
  ),

  Documentation: () => (
    <div className="py-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
          <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">No Documents</h3>
          <p className="text-sm text-muted-foreground">
            Upload or create documents to see them listed here.
          </p>
        </div>
      </div>
    </div>
  ),

  // Loading states
  Loading: {
    Table: ({ columns, rows = 5 }: { columns: number; rows?: number }) => (
      <>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <div className="h-4 bg-muted/50 rounded animate-pulse" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </>
    ),

    RecentContainer: ({ columns, rows = 3 }: { columns: number; rows?: number }) => (
      <RecentTableSkeleton columns={columns} rows={rows} showSeeAll={true} />
    ),
  },
};

export function HistoryTable<TData, TValue>({
  columns,
  data,
  emptyState = <DefaultEmptyState colSpan={columns.length} />,
  isLoading = false,
  skeletonRows = 5,
  ...props
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  
  const sorting = props.state?.sorting ?? internalSorting;
  const onSortingChange = props.onSortingChange ?? setInternalSorting;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: onSortingChange,
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    pageCount: props.pageCount,
    state: {
      sorting,
      ...(props.pagination ? { pagination: props.pagination } : {}),
    },
    onPaginationChange: props.onPaginationChange,
  });

  const hasData = table.getRowModel().rows?.length > 0;

  return (
    <section className="w-full min-w-0 flex flex-col gap-4 overflow-hidden">
      <Table>
        {isLoading ? (
          <TableSkeleton
            columns={columns.length}
            rows={skeletonRows}
            showHeader={true}
          />
        ) : hasData ? (
          <>
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
              {table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    index % 2 === 0 ? "bg-chart-1" : "bg-transparent"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </>
        ) : (
          <>
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
              {emptyState}
            </TableBody>
          </>
        )}
      </Table>
      {!isLoading && hasData && <DataTablePagination table={table} />}
    </section>
  );
}

export function RecentTableContainer<TData, TValue>({
  title,
  data,
  columns,
  seeAllHref = "#",
  seeAllText = "See All",
  showSeeAll,
  className = "",
  headerClassName = "",
  contentClassName = "",
  emptyState = <DefaultRecentEmptyState />,
  isLoading = false,
  skeletonRows = 3,
}: RecentTableContainerProps<TData, TValue>) {
  const hasData = data && data.length > 0;

  return (
    <Card className={`shadow-none gap-2 border-none px-0 ${className}`}>
      {isLoading ? (
        <RecentTableSkeleton
          columns={columns.length}
          rows={skeletonRows}
          showSeeAll={showSeeAll}
        />
      ) : (
        <>
          <CardHeader
            className={`flex flex-row items-center justify-between px-0 ${headerClassName}`}
          >
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            {showSeeAll && hasData && (
              <Button
                asChild={true}
                variant="link"
                className="text-primary h-auto p-0"
              >
                <Link href={seeAllHref} className="flex items-center gap-1">
                  {seeAllText}
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent className={`px-0 ${contentClassName}`}>
            {hasData ? (
              <RecentTable data={data} columns={columns} />
            ) : (
              emptyState
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}

export function RecentTable<TData, TValue>({
  columns,
  data,
  emptyState = <DefaultEmptyState colSpan={columns.length} />,
  isLoading = false,
  skeletonRows = 3,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const hasData = table.getRowModel().rows?.length > 0;

  return (
    <Table>
      {isLoading ? (
        <TableSkeleton
          columns={columns.length}
          rows={skeletonRows}
          showHeader={true}
        />
      ) : hasData ? (
        <>
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
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(index % 2 === 0 ? "bg-chart-1" : "bg-transparent")}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </>
      ) : (
        <>
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
            {emptyState}
          </TableBody>
        </>
      )}
    </Table>
  );
}

// Utility function to get appropriate empty state based on title
export function getEmptyStateForTitle(title: string, colSpan?: number) {
  const titleLower = title.toLowerCase();

  if (colSpan !== undefined) {
    // For HistoryTable (needs colSpan)
    if (titleLower.includes('history')) return EmptyStates.History(colSpan);
    if (titleLower.includes('order')) return EmptyStates.Orders(colSpan);
    if (titleLower.includes('user')) return EmptyStates.Users(colSpan);
    if (titleLower.includes('transaction')) return EmptyStates.Transactions(colSpan);
    if (titleLower.includes('search')) return EmptyStates.Search(colSpan);
    return <DefaultEmptyState colSpan={colSpan} />;
  } else {
    // For RecentTableContainer (no colSpan)
    if (titleLower.includes('order')) return EmptyStates.RecentOrders();
    if (titleLower.includes('user')) return EmptyStates.RecentUsers();
    if (titleLower.includes('activity')) return EmptyStates.RecentActivity();
    if (titleLower.includes('folder')) return EmptyStates.EmptyFolder();
    if (titleLower.includes('document')) return EmptyStates.Documentation();
    return <DefaultRecentEmptyState />;
  }
}