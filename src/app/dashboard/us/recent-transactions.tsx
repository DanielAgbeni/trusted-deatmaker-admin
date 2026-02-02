// @ts-nocheck
"use client";

import {
  WalletTransactionsColumns,
  WalletTransaction,
} from "./_columns/wallet-transactions-table-column";
import { RecentTableContainer } from "@/components/dashboard/tables";
import { useGetUserTransactionsQuery } from "@/lib/store/features/userDashboardApi/userDashboardApi";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentTransactions() {
  const {
    data: transactionsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserTransactionsQuery({
    page: 0,
    size: 5,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load transactions"
        errorData={error as any}
        retry={refetch}
      />
    );
  }

  const rawTransactions = transactionsData?.data?.content || [];
  
  // Log the raw data to see what we're getting
  console.log("Raw transactions:", rawTransactions);

  const walletTransactions: WalletTransaction[] = rawTransactions.map((t: any) => {
    // Based on your API response, the structure should be:
    // {
    //   "transactionReference": "TDM-1765673662011-8788",
    //   "type": "DEPOSIT",
    //   "amount": 100000.00,
    //   "fee": 1600.00,
    //   "status": "SUCCESS",
    //   "date": "2025-12-14T01:54:24.981489",
    //   "destinationBank": null,
    //   "destinationAccountName": null,
    //   "destinationAccountNumber": null,
    //   "description": "Deposit via PAYSTACK"
    // }
    
    // If your API response doesn't match exactly, adjust the property names here
    return {
      transactionReference: t.transactionReference || t.reference || t.id,
      type: t.type || "UNKNOWN",
      amount: parseFloat(t.amount) || 0,
      fee: parseFloat(t.fee) || 0,
      status: t.status || "PENDING",
      date: t.date || t.createdAt || new Date().toISOString(),
      destinationBank: t.destinationBank || null,
      destinationAccountName: t.destinationAccountName || null,
      destinationAccountNumber: t.destinationAccountNumber || null,
      description: t.description || `${t.type || ''} transaction`
    };
  });

  // Log the mapped data to debug
  console.log("Mapped transactions:", walletTransactions);

  return (
    <RecentTableContainer
      title="Recent Wallet Transactions"
      data={walletTransactions}
      columns={WalletTransactionsColumns}
      seeAllHref="/dashboard/us/wallet"
      seeAllText="See All"
      showSeeAll={true}
    />
  );
}