"use client";

import { HistoryTable } from "@/components/dashboard/tables";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetUsersQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { useState, useEffect } from "react";
import { UsersColumns } from "../_columns/users-table-column";
import { Loader2, Search, XCircle } from "lucide-react";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";

const { RangePicker } = DatePicker;

export default function UserHistory() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [kycFilter, setKycFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  // Debouncing search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: usersResponse, isLoading, isFetching } = useGetUsersQuery({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: debouncedSearch.length > 2 ? debouncedSearch : undefined,
    active: activeFilter === "all" ? undefined : activeFilter === "active",
    kycVerified: kycFilter === "all" ? undefined : kycFilter === "verified",
    startDate: dateRange[0] || undefined,
    endDate: dateRange[1] || undefined,
  });

  const users = usersResponse?.data?.content || [];

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearFilters = () => {
    setSearch("");
    setActiveFilter("all");
    setKycFilter("all");
    setDateRange(["", ""]);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const hasFilters = search || activeFilter !== "all" || kycFilter !== "all" || dateRange[0];

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
          <h2 className="text-xl font-bold font-outfit">User History</h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search name or email..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9 w-[200px] lg:w-[250px]"
              />
            </div>

            <Select value={activeFilter} onValueChange={(v) => {
              setActiveFilter(v);
              setPagination(prev => ({ ...prev, pageIndex: 0 }));
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Select value={kycFilter} onValueChange={(v) => {
              setKycFilter(v);
              setPagination(prev => ({ ...prev, pageIndex: 0 }));
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="KYC Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All KYC</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
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

            {isFetching && !isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <HistoryTable
            columns={UsersColumns}
            data={users}
            isLoading={isLoading}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={usersResponse?.data?.totalPages ?? -1}
          />
          {!isLoading && users.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-gray-50/50">
              <p>No users found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
