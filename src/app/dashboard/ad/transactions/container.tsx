// @ts-nocheck
"use client";

import TransactionHistory from "@/app/dashboard/ad/transactions/transactions-history";
import TransactionOverview from "./transaction-overview";
import StatCards from "./transaction-stats-card";

export default function WalletContainer() {
  return (
    <>
      <StatCards />
      <TransactionHistory />
    </>
  );
}
