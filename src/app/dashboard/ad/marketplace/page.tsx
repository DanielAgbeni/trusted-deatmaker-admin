"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMarketplaceColumns } from "../_columns/marketplace-table-column";
import { HistoryTable } from "@/components/dashboard/tables";
import { useGetVendorsQuery, useGetEscrowFeesQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import { Search, XCircle, Loader2 } from "lucide-react";

const { RangePicker } = DatePicker;

export default function MarketplacePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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

  const { data: vendorsResponse, isLoading: vendorsLoading, isFetching } = useGetVendorsQuery({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: debouncedSearch.length > 0 ? debouncedSearch : undefined,
    startDate: dateRange[0] || undefined,
    endDate: dateRange[1] || undefined,
  });

  const { data: feesResponse, isLoading: feesLoading } = useGetEscrowFeesQuery({ page: 0, size: 100 });

  const handleView = useCallback((vendor: any) => {
    router.push(`/dashboard/ad/marketplace/${vendor.id}`);
  }, [router]);

  const columns = useMemo(() => getMarketplaceColumns(handleView), [handleView]);

  const vendors = vendorsResponse?.data?.content || [];
  const fees = feesResponse?.data?.content || (Array.isArray(feesResponse?.data) ? feesResponse?.data : []);

  // Merge fees into vendors
  const vendorsWithFees = useMemo(() => {
    return vendors.map(vendor => {
      const vendorFee = fees.find((f: any) =>
        (f.vendor?.id === vendor.id) ||
        (f.vendorId === vendor.id) ||
        (f.vendor === vendor.id)
      );

      return {
        ...vendor,
        escrowFee: vendorFee
      };
    });
  }, [vendors, fees]);

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearFilters = () => {
    setSearch("");
    setDateRange(["", ""]);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const isLoading = vendorsLoading || feesLoading;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#f97316',
          borderRadius: 8,
        },
      }}
    >
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marketplaces / Vendors</h1>
            <p className="text-muted-foreground">
              Manage registered vendors and their commission status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search Marketplace..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[200px] lg:w-[250px]"
              />
            </div>

            <RangePicker
              value={dateRange[0] ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
              onChange={handleDateChange}
              className="h-10 border-gray-200"
              style={{ borderRadius: '8px' }}
            />

            {(search || dateRange[0]) && (
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

            {isFetching && !isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <HistoryTable
            columns={columns}
            data={vendorsWithFees}
            isLoading={isLoading}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={vendorsResponse?.data?.totalPages ?? -1}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}
