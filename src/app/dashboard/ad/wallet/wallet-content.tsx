"use client";
// wallet-content.tsx
import WalletTransactionHistory from "./wallet-transaction-history";
import TransactionCards from "./transaction-cards";
import { TransactionType } from "./page";

export default function WalletContent({ transactionType }: TransactionType) {
  return (
    <>
      <WalletTransactionHistory transactionType={transactionType} />
    </>
  );
}
