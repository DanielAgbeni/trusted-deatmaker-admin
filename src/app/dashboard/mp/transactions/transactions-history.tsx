"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { HistoryTable } from "@/components/dashboard/tables";
import {
  TransactionsColumns,
  Transaction,
} from "../_columns/transactions-table-column";
import { Input } from "@/components/ui/input";

// Sample transaction data that matches the refactored interface - moved outside component
const TRANSACTIONS_DATA: Transaction[] = [
  {
    id: "1",
    escrowNumber: "019234890",
    buyerName: "John Mark",
    buyerUsername: "Johnmark012",
    sellerName: "John Mark",
    sellerUsername: "Johnmark012",
    amount: "₦5,000.00",
    type: "Service",
    dateTime: "27th March, 2024. 2:39 PM",
    marketplace: {
      name: "Jiji",
      logo: "/logos/jiji.png",
    },
    status: "Completed",
  },
  {
    id: "2",
    escrowNumber: "019234891",
    buyerName: "Sarah Johnson",
    buyerUsername: "sarahj_buyer",
    sellerName: "Mike Thompson",
    sellerUsername: "mikeseller",
    amount: "₦12,500.00",
    type: "Product",
    dateTime: "26th March, 2024. 4:15 PM",
    marketplace: {
      name: "Konga",
      logo: "/logos/konga.png",
    },
    status: "Pending",
  },
  {
    id: "3",
    escrowNumber: "019234892",
    buyerName: "David Wilson",
    buyerUsername: "davidw123",
    sellerName: "Emma Davis",
    sellerUsername: "emmad_seller",
    amount: "₦8,750.00",
    type: "Service",
    dateTime: "25th March, 2024. 11:30 AM",
    marketplace: {
      name: "Jumia",
      logo: "/logos/jumia.png",
    },
    status: "Completed",
  },
  {
    id: "4",
    escrowNumber: "019234893",
    buyerName: "Lisa Anderson",
    buyerUsername: "lisa_buyer",
    sellerName: "Robert Chen",
    sellerUsername: "robchen",
    amount: "₦25,000.00",
    type: "Product",
    dateTime: "24th March, 2024. 9:45 AM",
    marketplace: {
      name: "OLX",
      logo: "/logos/olx.png",
    },
    status: "Failed",
  },
  {
    id: "5",
    escrowNumber: "019234894",
    buyerName: "Alex Rodriguez",
    buyerUsername: "alexr2024",
    sellerName: "Jennifer Lee",
    sellerUsername: "jenlee_seller",
    amount: "₦15,300.00",
    type: "Service",
    dateTime: "23rd March, 2024. 3:20 PM",
    marketplace: {
      name: "PayPorte",
      logo: "/logos/payporte.png",
    },
    status: "Completed",
  },
  {
    id: "6",
    escrowNumber: "019234895",
    buyerName: "Michael Brown",
    buyerUsername: "mikeb_buyer",
    sellerName: "Sophie Turner",
    sellerUsername: "sophiet",
    amount: "₦42,000.00",
    type: "Product",
    dateTime: "22nd March, 2024. 1:10 PM",
    marketplace: {
      name: "Kara",
      logo: "/logos/kara.png",
    },
    status: "Pending",
  },
  {
    id: "7",
    escrowNumber: "019234896",
    buyerName: "Grace Okafor",
    buyerUsername: "graceo123",
    sellerName: "James Miller",
    sellerUsername: "jamesmiller",
    amount: "₦7,800.00",
    type: "Service",
    dateTime: "21st March, 2024. 10:55 AM",
    marketplace: {
      name: "Jiji",
      logo: "/logos/jiji.png",
    },
    status: "Completed",
  },
  {
    id: "8",
    escrowNumber: "019234897",
    buyerName: "Tony Stark",
    buyerUsername: "tonystark",
    sellerName: "Natasha Romanoff",
    sellerUsername: "blackwidow",
    amount: "₦18,900.00",
    type: "Product",
    dateTime: "20th March, 2024. 5:30 PM",
    marketplace: {
      name: "Jumia",
      logo: "/logos/jumia.png",
    },
    status: "Completed",
  },
  {
    id: "9",
    escrowNumber: "019234898",
    buyerName: "Angela White",
    buyerUsername: "angelaw",
    sellerName: "Peter Parker",
    sellerUsername: "spiderman",
    amount: "₦33,500.00",
    type: "Service",
    dateTime: "19th March, 2024. 8:15 AM",
    marketplace: {
      name: "Konga",
      logo: "/logos/konga.png",
    },
    status: "Pending",
  },
  {
    id: "10",
    escrowNumber: "019234899",
    buyerName: "Daniel Kim",
    buyerUsername: "danielkim",
    sellerName: "Rachel Green",
    sellerUsername: "rachelg",
    amount: "₦9,200.00",
    type: "Product",
    dateTime: "18th March, 2024. 12:45 PM",
    marketplace: {
      name: "OLX",
      logo: "/logos/olx.png",
    },
    status: "Completed",
  },
  {
    id: "11",
    escrowNumber: "019234900",
    buyerName: "Kevin Hart",
    buyerUsername: "kevinhart",
    sellerName: "Dwayne Johnson",
    sellerUsername: "therock",
    amount: "₦55,000.00",
    type: "Service",
    dateTime: "17th March, 2024. 2:20 PM",
    marketplace: {
      name: "PayPorte",
      logo: "/logos/payporte.png",
    },
    status: "Failed",
  },
  {
    id: "12",
    escrowNumber: "019234901",
    buyerName: "Maya Patel",
    buyerUsername: "mayap",
    sellerName: "Carlos Santos",
    sellerUsername: "carloss",
    amount: "₦14,600.00",
    type: "Product",
    dateTime: "16th March, 2024. 11:05 AM",
    marketplace: {
      name: "Kara",
      logo: "/logos/kara.png",
    },
    status: "Completed",
  },
];

export default function TransactionHistory() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS_DATA);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(TRANSACTIONS_DATA);
  const [searchTerm, setSearchTerm] = useState("");

  // This useEffect is no longer needed since we initialize state directly
  // But keeping it here in case you need to fetch data from an API in the future
  useEffect(() => {
    // If you need to fetch from API later, you can do it here
    // For now, we're using the constant data
  }, []);

  const handleFilterTransactions = (value: string) => {
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const searchValue = value.toLowerCase().trim();
    const filtered = transactions.filter(
      (transaction) =>
        transaction.escrowNumber.toLowerCase().includes(searchValue) ||
        transaction.buyerName.toLowerCase().includes(searchValue) ||
        transaction.buyerUsername.toLowerCase().includes(searchValue) ||
        transaction.sellerName.toLowerCase().includes(searchValue) ||
        transaction.sellerUsername.toLowerCase().includes(searchValue) ||
        transaction.amount.toLowerCase().includes(searchValue)
    );
    
    setFilteredTransactions(filtered);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Escrow Transactions History</h2>

        <div className="flex items-center">
          <Input
            placeholder="Filter by Transaction ID"
            value={searchTerm}
            onChange={(event) => handleFilterTransactions(event.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <HistoryTable columns={TransactionsColumns} data={filteredTransactions} />
    </div>
  );
}