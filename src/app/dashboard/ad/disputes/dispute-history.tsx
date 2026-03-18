"use client";

import { HistoryTable } from "@/components/dashboard/tables";
import { Dispute, DisputesColumns } from "../_columns/disputes-table-column";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Download, Search, XCircle, Loader2 } from "lucide-react";
import { useGetDisputeDashboardQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { AdminDisputeDashboardListItem } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { useState, useEffect } from "react";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import { SortingState } from "@tanstack/react-table";

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
  const [priority, setPriority] = useState("all");
  const [tier, setTier] = useState("all");
  const [dashboardFilter, setDashboardFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  // Debouncing search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: dashboardResponse, isLoading, isFetching, refetch } = useGetDisputeDashboardQuery({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: debouncedSearch.length > 0 ? debouncedSearch : undefined,
    status: status === "all" ? undefined : status,
    priority: priority === "all" ? undefined : priority,
    tier: tier === "all" ? undefined : tier,
    filter: dashboardFilter as any,
    startDate: dateRange[0] || undefined,
    endDate: dateRange[1] || undefined,
    sort: sorting.length > 0
      ? sorting.map(s => `${s.id === 'dateTime' ? 'created_at' : s.id},${s.desc ? 'DESC' : 'ASC'}`)
      : undefined,
  });

  const mapDispute = (item: AdminDisputeDashboardListItem): Dispute => ({
    id: item.id,
    disputeReference: item.disputeReference,
    dealReference: item.dealReference,
    dealId: item.dealId,
    dateTime: new Date(item.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    dealAmount: item.dealAmount,
    preferredResolution: item.preferredResolution,
    currencyCode: item.currencyCode,
    buyerName: item.claimant.name,
    sellerName: item.respondent.name,
    priority: item.priority,
    status: item.status,
    tier: item.tier,
    sla: item.sla,
    assignedAdmin: item.assignedAdmin ? {
      name: item.assignedAdmin.name,
      email: item.assignedAdmin.email,
    } : null,
  });

  const disputes: Dispute[] = dashboardResponse?.data?.disputes?.content?.map(mapDispute) || [];

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
    setPriority("all");
    setTier("all");
    setDashboardFilter("ALL");
    setDateRange(["", ""]);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const hasFilters = search || status !== "all" || priority !== "all" || tier !== "all" || dashboardFilter !== "ALL" || dateRange[0];

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
          {/* <h2 className="text-xl font-bold font-outfit">Dispute History</h2> */}

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
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
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

            <Select value={priority} onValueChange={(v) => {
              setPriority(v);
              setPagination(prev => ({ ...prev, pageIndex: 0 }));
            }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tier} onValueChange={(v) => {
              setTier(v);
              setPagination(prev => ({ ...prev, pageIndex: 0 }));
            }}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="TIER_1">Tier 1</SelectItem>
                <SelectItem value="TIER_2">Tier 2</SelectItem>
                <SelectItem value="TIER_3">Tier 3</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dashboardFilter} onValueChange={(v) => {
              setDashboardFilter(v);
              setPagination(prev => ({ ...prev, pageIndex: 0 }));
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Active</SelectItem>
                <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                <SelectItem value="MONITORING">Monitoring</SelectItem>
                <SelectItem value="MY_CASES">My Cases</SelectItem>
              </SelectContent>
            </Select>

            <RangePicker
              value={dateRange[0] ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
              onChange={handleDateChange}
              className="h-10 border-gray-200"
              style={{ borderRadius: '8px', width: '240px' }}
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
          pageCount={dashboardResponse?.data?.pagination?.totalPages ?? -1}
          onSortingChange={setSorting}
          state={{ sorting }}
        />
      </div>
    </ConfigProvider>
  );
}
