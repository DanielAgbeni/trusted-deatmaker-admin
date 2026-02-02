import type { Metadata } from "next";
import WalletContainer from "./container";

export const metadata: Metadata = {
  title: "Wallet | Dashboard",
  description: "Manage your wallet, view balance and transaction history",
};

export default function WalletPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Overview</h1>
      <WalletContainer />
    </div>
  );
}
