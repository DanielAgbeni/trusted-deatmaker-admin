"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { PaginationState } from "@tanstack/react-table";
import { HistoryTable } from "@/components/dashboard/tables";
import {
  TransactionsColumns,
  Transaction,
} from "@/app/dashboard/ad/_columns/transactions-table-column";
import { Input } from "@/components/ui/input";
import { useGetDealsQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { AdminDealListItem } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import { Search, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const { RangePicker } = DatePicker;

interface TransactionHistoryProps {
  onRefresh?: () => void;
  transactions?: Transaction[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export default function TransactionHistory({
  onRefresh,
  transactions: propTransactions,
  isLoading: propIsLoading,
  isRefreshing,
  currentPage,
  totalPages: propTotalPages,
  totalItems,
  onPageChange
}: TransactionHistoryProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Debouncing search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch deals
  const { data: dealsResponse, isLoading: queryLoading, isFetching } = useGetDealsQuery({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: debouncedSearch.length > 2 ? debouncedSearch : undefined,
    startDate: dateRange[0] || undefined,
    endDate: dateRange[1] || undefined,
  }, { skip: !!propTransactions }); // Skip query if transactions are provided via props

  const mapDealToTransaction = (deal: AdminDealListItem): Transaction => ({
    id: deal.dealId,
    escrowNumber: deal.transactionReference,
    buyerName: deal.buyerName,
    buyerUsername: deal.buyerEmail,
    sellerName: deal.sellerName,
    sellerUsername: deal.sellerEmail,
    amount: deal.totalAmount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }),
    type: "Escrow",
    dateTime: new Date(deal.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    vendorReference: deal.vendorReference,
    status: deal.status,
  });

  const transactions: Transaction[] = propTransactions || (dealsResponse?.data?.content?.map(mapDealToTransaction) || []);
  const isLoading = propIsLoading !== undefined ? propIsLoading : (queryLoading || isFetching);

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateRange(["", ""]);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#f97316',
          borderRadius: 8,
        },
      }}
    >
      <div className="space-y-4 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold font-outfit">Transactions History</h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search Reference, Buyer, Seller..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9 w-[200px] lg:w-[250px]"
              />
            </div>

            <RangePicker
              value={dateRange[0] ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
              onChange={handleDateChange}
              className="h-10 border-gray-200"
              style={{ borderRadius: '8px' }}
            />

            {(searchTerm || dateRange[0]) && (
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
            columns={TransactionsColumns}
            data={transactions}
            isLoading={isLoading}
            pageCount={dealsResponse?.data?.totalPages || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
          {!isLoading && transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-gray-50/50">
              <p>No transactions found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
