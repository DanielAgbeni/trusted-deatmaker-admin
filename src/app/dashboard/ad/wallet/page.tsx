// page.tsx
import type { Metadata } from "next";
import WalletTransactionHistory from "./wallet-transaction-history";
import TransactionCards from "./transaction-cards";
import { Suspense } from "react";
import WalletContent from "./wallet-content"; // New client component

// export const dynamic = "force-dynamic"; // Force dynamic rendering

export const metadata: Metadata = {
  title: "Wallet | Dashboard",
  description: "Manage your wallet, view balance and transaction history",
};

type TransactionModes = "deposit" | "withdrawal";
export interface TransactionType {
  transactionType?: TransactionModes;
}

export default async function WalletPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const transactionType =
    resolvedSearchParams.transactionType as TransactionModes;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold capitalize">
        {transactionType}s Overview
      </h1>

      <Suspense fallback={<div>Loading...</div>}>
        <WalletContent transactionType={transactionType} />
      </Suspense>
    </div>
  );
}
