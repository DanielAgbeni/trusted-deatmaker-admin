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
}

export default function TransactionHistory({
  onRefresh
}: TransactionHistoryProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch deals
  const { data: dealsResponse, isLoading, isFetching } = useGetDealsQuery({
    page: 0,
    size: 20,
    search: searchTerm.length > 2 ? searchTerm : undefined,
  });

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

  const transactions: Transaction[] = dealsResponse?.data?.content?.map(mapDealToTransaction) || [];

  return (
    <div className="space-y-4">
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

      <HistoryTable columns={TransactionsColumns} data={transactions} />
      {(isLoading || isFetching) && <p className="text-sm text-muted-foreground">Loading transactions...</p>}
    </div>
  );
}