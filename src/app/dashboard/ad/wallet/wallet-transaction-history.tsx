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

export default function WalletTransactionHistory({
  transactionType,
}: TransactionType) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch logic
  // If specific type is requested, we could skip the other, but for simplicity/merged view we fetch both if no type
  // Note: Pagination logic for merged lists is complex. We will fetch page 0 of both for "Overview".
  // If type IS specified, we could pass page params properly. For now we stick to simple first page fetch.

  const skipWithdrawal = transactionType === 'deposit';
  const skipDeposit = transactionType === 'withdrawal';

  const { data: withdrawalsResponse, isLoading: wLoading } = useGetWithdrawalsQuery({ page: 0, size: 20 }, { skip: skipWithdrawal });
  const { data: depositsResponse, isLoading: dLoading } = useGetDepositsQuery({ page: 0, size: 20 }, { skip: skipDeposit });

  const mapToWalletTx = (tx: AdminTransaction, type: "withdrawal" | "deposit"): WalletTransaction => ({
    id: tx.transactionId,
    transactionId: tx.transactionId,
    amount: tx.amount,
    date: new Date(tx.date).toLocaleDateString(),
    type: type,
    status: tx.status as any,
    user: {
      name: type === 'withdrawal' ? tx.payeeName : tx.payerName,
      bank: tx.destinationBank || "N/A",
      avatar: "", // API doesn't provide avatar
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
    // Sort by date desc (if needed, API usually returns sorted)
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [withdrawalsResponse, depositsResponse]);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    const lower = searchTerm.toLowerCase();
    return transactions.filter(tx =>
      (tx.transactionId?.toLowerCase() || "").includes(lower) ||
      (tx.user?.name?.toLowerCase() || "").includes(lower) ||
      (tx.amount?.toString() || "").includes(lower)
    );
  }, [transactions, searchTerm]);

  const isLoading = wLoading || dLoading;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Transactions History</h2>

        <div className="flex items-center">
          <Input
            placeholder="Search Transactions..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <HistoryTable data={filteredTransactions} columns={WalletTransactionsColumns} />
      {isLoading && <p className="text-sm text-muted-foreground">Loading transactions...</p>}
    </div>
  );
}