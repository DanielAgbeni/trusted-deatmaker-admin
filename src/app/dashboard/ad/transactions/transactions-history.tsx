"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { HistoryTable } from "@/components/dashboard/tables";
import {
  TransactionsColumns,
  Transaction,
} from "@/app/dashboard/ad/_columns/transactions-table-column";
import { Input } from "@/components/ui/input";
import { useGetDealsQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { AdminDealListItem } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";

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
  totalPages,
  totalItems,
  onPageChange
}: TransactionHistoryProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch deals
  const { data: dealsResponse, isLoading: queryLoading, isFetching } = useGetDealsQuery({
    page: 0,
    size: 20,
    search: searchTerm.length > 2 ? searchTerm : undefined,
  }, { skip: !!propTransactions }); // Skip query if transactions are provided via props

  const mapDealToTransaction = (deal: AdminDealListItem): Transaction => ({
    id: deal.dealId,
    escrowNumber: deal.transactionReference,
    buyerName: deal.buyerName,
    buyerUsername: deal.buyerEmail, // Fallback
    sellerName: deal.sellerName,
    sellerUsername: deal.sellerEmail, // Fallback
    amount: deal.totalAmount.toLocaleString(), // Simple formatting
    type: "Escrow",
    dateTime: new Date(deal.createdAt).toLocaleDateString(),
    marketplace: {
      name: "Direct",
      logo: "",
    },
    status: deal.status === "COMPLETED" ? "Completed" : deal.status === "FAILED" ? "Failed" : "Pending",
  });

  const transactions: Transaction[] = propTransactions || (dealsResponse?.data?.content?.map(mapDealToTransaction) || []);
  const isLoading = propIsLoading !== undefined ? propIsLoading : (queryLoading || isFetching);

  return (
    <div className="space-y-4 min-w-0">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Transactions History</h2>

        <div className="flex items-center space-x-2">
          {/* Refresh Button Logic is handled by RTK Query's caching/polling if needed, simpler to remove or just re-trigger refetch if forced */}
          <Input
            placeholder="Search Transactions..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <HistoryTable columns={TransactionsColumns} data={transactions} isLoading={isLoading} />
      {isLoading && <p className="text-sm text-muted-foreground">Loading transactions...</p>}
    </div>
  );
}