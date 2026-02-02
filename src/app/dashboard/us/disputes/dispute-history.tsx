"use client";

import { useState } from "react";
import { HistoryTable } from "@/components/dashboard/tables";
import { Dispute, DisputesColumns } from "../_columns/disputes-table-column";
import { Input } from "@/components/ui/input";
import { useGetDisputesQuery } from "@/lib/store/features/userDashboardApi/userDashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DisputeHistory() {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Fetch disputes with pagination and search
  const { data, isLoading, isError, error, refetch } = useGetDisputesQuery({
    page,
    size: pageSize,
    search: debouncedSearch || undefined,
  });

  // Debounce search input
  const handleSearchChange = (value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(0); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  };

  // Extract data from response
  const disputes: Dispute[] = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;
  const totalElements = data?.data?.totalElements || 0;
  const isFirstPage = data?.data?.first ?? true;
  const isLastPage = data?.data?.last ?? true;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Dispute History</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Failed to load disputes
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {(error as any)?.data?.message || "An error occurred while fetching disputes"}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Dispute History</h2>
          <p className="text-sm text-muted-foreground">
            {totalElements} total dispute{totalElements !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center">
          <Input
            placeholder="Search by deal reference..."
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {disputes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            No disputes found
          </p>
          {debouncedSearch && (
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria
            </p>
          )}
        </div>
      ) : (
        <>
          <HistoryTable columns={DisputesColumns} data={disputes} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={isFirstPage || isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={isLastPage || isLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
