// @ts-nocheck
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { HistoryTable } from "@/components/dashboard/tables";
import {
  WalletTransactionsColumns,
  WalletTransaction,
} from "../_columns/wallet-transactions-table-column";

type TransactionHistoryProps = {
  isKYCCompleted: boolean;
};

export default function WalletTransactionHistory({
  isKYCCompleted,
}: TransactionHistoryProps) {
  const router = useRouter();
  const [Ttransactions, setTtransactions] = useState<WalletTransaction[]>([]);
  // Sample transaction data
  const walletTransactions: WalletTransaction[] = [
    {
      id: "1",
      user: {
        name: "Joshua King",
        bank: "GTBANK",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "27th March, 2024. 2:39 PM",
      type: "Withdrawal",
      transactionId: "11723456790",
      amount: 5000,
    },
    {
      id: "2",
      user: {
        name: "Joshua King",
        bank: "FIRST BANK",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "27th March, 2024. 2:39 PM",
      type: "Deposit",
      transactionId: "11723456793",
      amount: 25000,
    },
    {
      id: "3",
      user: {
        name: "Joshua King",
        bank: "GT BANK",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "27th March, 2024. 2:39 PM",
      type: "Withdrawal",
      transactionId: "11723456795",
      amount: 85000,
    },
    {
      id: "4",
      user: {
        name: "Joshua King",
        bank: "GT BANK",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "12th April, 2024. 10:12 AM",
      type: "Deposit",
      transactionId: "11723456801",
      amount: 120000,
    },
    {
      id: "5",
      user: {
        name: "Joshua King",
        bank: "GT Bank",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "15th April, 2024. 4:50 PM",
      type: "Withdrawal",
      transactionId: "11723456807",
      amount: 15000,
    },
    {
      id: "6",
      user: {
        name: "Joshua King",
        bank: "GT BANK",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "20th April, 2024. 11:45 AM",
      type: "Deposit",
      transactionId: "11723456815",
      amount: 60000,
    },
    {
      id: "7",
      user: {
        name: "Joshua King",
        bank: "FIRST BANK",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "25th April, 2024. 9:00 AM",
      type: "Withdrawal",
      transactionId: "11723456821",
      amount: 20000,
    },
    {
      id: "8",
      user: {
        name: "Joshua King",
        bank: "FIRST BANK",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "1st May, 2024. 3:18 PM",
      type: "Deposit",
      transactionId: "11723456830",
      amount: 75000,
    },
    {
      id: "9",
      user: {
        name: "Joshua King",
        bank: "FIRST BANK",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "5th May, 2024. 7:30 PM",
      type: "Withdrawal",
      transactionId: "11723456845",
      amount: 30000,
    },
    {
      id: "10",
      user: {
        name: "Joshua King",
        bank: "GT BANK",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "9th May, 2024. 1:15 PM",
      type: "Deposit",
      transactionId: "11723456858",
      amount: 45000,
    },
  ];

  // useEffect(() => {
  //   if (isKYCCompleted) {
  //     setTtransactions(transactions);
  //   } else {
  //     setTtransactions([]);
  //   }
  // }, [isKYCCompleted]);

  const handleRowClick = (transactionId: string) => {
    router.push(`wallet/transaction/${transactionId}`);
  };

  const handleFilterTransactions = (value: string) => {
    return;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Wallet Transactions History</h2>

        <div className="flex items-center">
          <Input
            placeholder="Filter by Transaction ID"
            // value={(table.getColumn("transactionId")?.getFilterValue() as string) ?? ""}
            onChange={(event) => handleFilterTransactions(event.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <HistoryTable
        data={walletTransactions}
        columns={WalletTransactionsColumns}
      />
    </div>
  );
}
