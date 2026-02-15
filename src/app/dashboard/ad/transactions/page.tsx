import type { Metadata } from "next";
import TransactionContainer from "./container";

export const metadata: Metadata = {
  title: "Transaction | Dashboard",
  description: "Manage your Transaction, view balance and transaction history",
};

export default function WalletPage() {
  return (
    <div className="w-full min-w-0 overflow-hidden p-6 space-y-8">
      <h1 className="text-2xl font-bold">Overview</h1>
      <TransactionContainer />
    </div>
  );
}
