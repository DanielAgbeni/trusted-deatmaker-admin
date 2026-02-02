"use client";

import TransactionHistory from "@/app/dashboard/us/transactions/transactions-history";
import { use, useState } from "react";
import TransactionOverview from "./transaction-overview";

export default function WalletContainer() {
  const [isKYCCompleted, setIsKYCCompleted] = useState(false);

  const handleKYCStatusChange = () => {
    setIsKYCCompleted((status) => !status);
  };

  return (
    <>
      <TransactionOverview
        isKYCCompleted={isKYCCompleted}
        handleKYCStatusChange={handleKYCStatusChange}
      />
      <TransactionHistory isKYCCompleted={isKYCCompleted} />
    </>
  );
}
