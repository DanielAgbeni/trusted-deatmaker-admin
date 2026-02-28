"use client";

import { HistoryTable } from "@/components/dashboard/tables";
import { Dispute, DisputesColumns } from "../_columns/disputes-table-column";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Download, Search, XCircle, Loader2 } from "lucide-react";
import { useGetDisputesQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { AdminDisputeListItem } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { useState, useEffect } from "react";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DisputeHistory() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  // Debouncing search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: disputesResponse, isLoading, isFetching, refetch } = useGetDisputesQuery({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: debouncedSearch.length > 0 ? debouncedSearch : undefined,
    status: status === "all" ? undefined : status,
    startDate: dateRange[0] || undefined,
    endDate: dateRange[1] || undefined,
  });

  const mapDispute = (item: AdminDisputeListItem): Dispute => ({
    id: item.disputeId,
    transactionId: item.transactionReference,
    dateTime: new Date(item.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    amount: item.amount,
    buyerName: item.buyerName,
    sellerName: item.sellerName,
    preferredResolution: item.preferredResolution,
    status: item.status as any,
  });

  const disputes: Dispute[] = disputesResponse?.data?.content?.map(mapDispute) || [];

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting transactions...");
  };

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setDateRange(["", ""]);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const hasFilters = search || status !== "all" || dateRange[0];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#f97316',
          borderRadius: 8,
        },
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold font-outfit">Dispute History</h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search Reference, Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[200px] lg:w-[250px]"
              />
            </div>

            <Select value={status} onValueChange={(v) => {
              setStatus(v);
              setPagination(prev => ({ ...prev, pageIndex: 0 }));
            }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                <SelectItem value="ARBITRATION">Arbitration</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            <RangePicker
              value={dateRange[0] ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
              onChange={handleDateChange}
              className="h-10 border-gray-200"
              style={{ borderRadius: '8px' }}
            />

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {isFetching && !isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>
        </div>

        <HistoryTable
          columns={DisputesColumns}
          data={disputes}
          isLoading={isLoading}
          pagination={pagination}
          onPaginationChange={setPagination}
          pageCount={disputesResponse?.data?.totalPages ?? -1}
        />
      </div>
    </ConfigProvider>
  );
}
