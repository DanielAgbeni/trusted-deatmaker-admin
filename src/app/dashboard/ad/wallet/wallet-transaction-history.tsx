"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { HistoryTable } from "@/components/dashboard/tables";
import {
  WalletTransaction,
  WalletTransactionsColumns,
} from "../_columns/wallet-transactions-table-column";
import { TransactionType } from "./page";
import { useGetDepositsQuery, useGetWithdrawalsQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { AdminTransaction } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { Button } from "@/components/ui/button";
import { XCircle, Search, Loader2 } from "lucide-react";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function WalletTransactionHistory({
  transactionType,
}: TransactionType) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  // Debouncing search term to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const skipWithdrawal = transactionType === 'deposit';
  const skipDeposit = transactionType === 'withdrawal';

  const queryParams = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
    startDate: dateRange[0] || undefined,
    endDate: dateRange[1] || undefined,
  };

  const { data: withdrawalsResponse, isLoading: wLoading, isFetching: wFetching } = useGetWithdrawalsQuery(queryParams, { skip: skipWithdrawal });
  const { data: depositsResponse, isLoading: dLoading, isFetching: dFetching } = useGetDepositsQuery(queryParams, { skip: skipDeposit });

  const mapToWalletTx = (tx: AdminTransaction, type: "withdrawal" | "deposit"): WalletTransaction => ({
    id: tx.transactionId,
    transactionId: tx.transactionId,
    amount: tx.amount,
    date: new Date(tx.date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: type,
    status: tx.status as any,
    user: {
      name: type === 'withdrawal' ? tx.payeeName : tx.payerName,
      bank: tx.destinationBank || "N/A",
      avatar: "",
    }
  });

  const transactions = useMemo(() => {
    let combined: WalletTransaction[] = [];
    if (withdrawalsResponse?.data?.content) {
      combined = combined.concat(withdrawalsResponse.data.content.map(tx => mapToWalletTx(tx, "withdrawal")));
    }
    if (depositsResponse?.data?.content) {
      combined = combined.concat(depositsResponse.data.content.map(tx => mapToWalletTx(tx, "deposit")));
    }
    // Sort combined results by date descending if both types are present
    if (!transactionType) {
      return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return combined;
  }, [withdrawalsResponse, depositsResponse, transactionType]);

  const isLoading = wLoading || dLoading;
  const isFetching = wFetching || dFetching;

  const totalPages = useMemo(() => {
    if (transactionType === 'deposit') return depositsResponse?.data?.totalPages || 0;
    if (transactionType === 'withdrawal') return withdrawalsResponse?.data?.totalPages || 0;
    return Math.max(withdrawalsResponse?.data?.totalPages || 0, depositsResponse?.data?.totalPages || 0);
  }, [withdrawalsResponse, depositsResponse, transactionType]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateRange(["", ""]);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#f97316', // Orange-500 to match dashboard
          borderRadius: 8,
        },
      }}
    >
      <div className="space-y-4 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Transactions History</h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search ID, Name..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9 w-[200px] lg:w-[300px]"
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
                className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}

            {isFetching && !isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <HistoryTable
            data={transactions}
            columns={WalletTransactionsColumns}
            isLoading={isLoading}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={totalPages}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}
