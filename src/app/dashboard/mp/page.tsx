// @ts-nocheck
"use client";
import React, { useEffect } from "react";
import RecentUsers from "./recent-users";
import RecentTransactions from "./recent-transactions";
import StatCards from "./recent-stats";
import CustomersLocation from "./customers-location";

// Import the vendor dashboard API hooks
import {
  useGetWalletBalanceQuery,
  useGetCommissionsQuery,
  useGetUsersQuery,
  useGetTransactionsQuery,
} from "@/lib/store/features/vendorDashboardApi/vendorDashboardApi";

export default function Page() {
  // Fetch Wallet Balance
  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useGetWalletBalanceQuery();

  // Fetch Commissions (with currency parameter)
  const {
    data: commissionsData,
    isLoading: commissionsLoading,
    error: commissionsError,
    refetch: refetchCommissions,
  } = useGetCommissionsQuery({
    currency: "NGN", // You can make this dynamic based on user's location
  });

  // Fetch Recent Users (first page with 10 items)
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useGetUsersQuery({
    page: 0,
    size: 10,
    sort: "desc", // Get newest users first
  });

  // Fetch Recent Transactions (first page with 10 items)
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery({
    page: 0,
    size: 10,
    sort: "desc", // Get newest transactions first
  });

  // Extract data for StatCards
  const walletBalance = walletData?.data?.availableBalance || 0;
  const walletCurrency = walletData?.data?.currency || "NGN";
  
  const totalCommissions = commissionsData?.data?.totalEarnedCommission || 0;
  const pendingCommissions = commissionsData?.data?.totalPendingCommission || 0;
  const commissionCurrency = commissionsData?.data?.currency || "NGN";
  
  const totalUsers = usersData?.data?.totalElements || 0;
  const recentUsers = usersData?.data?.content?.length || 0;

  // Extract transactions data
  const transactions = transactionsData?.data?.content || [];

  // Log wallet balance data
  useEffect(() => {
    if (walletData) {
      console.log("=== WALLET BALANCE API RESPONSE ===");
      console.log("Success:", walletData.success);
      console.log("Message:", walletData.message);
      console.log("Timestamp:", walletData.timestamp);
      console.log("Wallet Data:", walletData.data);
      console.log("=== END WALLET BALANCE ===");
    }
  }, [walletData]);

  // Log commissions data
  useEffect(() => {
    if (commissionsData) {
      console.log("=== COMMISSIONS API RESPONSE ===");
      console.log("Success:", commissionsData.success);
      console.log("Message:", commissionsData.message);
      console.log("Timestamp:", commissionsData.timestamp);
      console.log("Total Commissions:", commissionsData.data?.totalEarnedCommission);
      console.log("Total Pending:", commissionsData.data?.totalPendingCommission);
      console.log("Commission List:", commissionsData.data?.content);
      console.log("=== END COMMISSIONS ===");
    }
  }, [commissionsData]);

  // Log users data
  useEffect(() => {
    if (usersData) {
      console.log("=== USERS API RESPONSE ===");
      console.log("Success:", usersData.success);
      console.log("Message:", usersData.message);
      console.log("Timestamp:", usersData.timestamp);
      console.log("Total Users:", usersData.data?.totalElements);
      console.log("Total Pages:", usersData.data?.totalPages);
      console.log("Current Page:", usersData.data?.number);
      console.log("Page Size:", usersData.data?.size);
      console.log("Users List:", usersData.data?.content);
      console.log("=== END USERS ===");
    }
  }, [usersData]);

  // Log transactions data
  useEffect(() => {
    if (transactionsData) {
      console.log("=== TRANSACTIONS API RESPONSE ===");
      console.log("Success:", transactionsData.success);
      console.log("Message:", transactionsData.message);
      console.log("Timestamp:", transactionsData.timestamp);
      console.log("Total Transactions:", transactionsData.data?.totalElements);
      console.log("Total Pages:", transactionsData.data?.totalPages);
      console.log("Current Page:", transactionsData.data?.number);
      console.log("Page Size:", transactionsData.data?.size);
      console.log("Transactions List:", transactionsData.data?.content);
      console.log("=== END TRANSACTIONS ===");
    }
  }, [transactionsData]);

  // Log errors
  useEffect(() => {
    if (walletError) {
      console.error("Wallet Balance Error:", walletError);
    }
    if (commissionsError) {
      console.error("Commissions Error:", commissionsError);
    }
    if (usersError) {
      console.error("Users Error:", usersError);
    }
    if (transactionsError) {
      console.error("Transactions Error:", transactionsError);
    }
  }, [walletError, commissionsError, usersError, transactionsError]);

  // Optional: Log loading states
  useEffect(() => {
    console.log("Loading States:", {
      wallet: walletLoading,
      commissions: commissionsLoading,
      users: usersLoading,
      transactions: transactionsLoading,
    });
  }, [walletLoading, commissionsLoading, usersLoading, transactionsLoading]);

  // Helper function to manually refetch all data (can be triggered by a button)
  const handleRefreshAll = () => {
    refetchWallet();
    refetchCommissions();
    refetchUsers();
    refetchTransactions();
    console.log("Refreshing all dashboard data...");
  };

  return (
    <section className="p-8 flex flex-col ">
      {/* Pass data to all three components */}
      <StatCards 
        walletBalance={walletBalance}
        walletCurrency={walletCurrency}
        totalCommissions={totalCommissions}
        pendingCommissions={pendingCommissions}
        commissionCurrency={commissionCurrency}
        totalUsers={totalUsers}
        recentUsers={recentUsers}
        isLoading={walletLoading || commissionsLoading || usersLoading}
      />
      
        <RecentUsers 
          usersData={usersData?.data?.content || []}
          isLoading={usersLoading}
          totalUsers={totalUsers}
        />
        
        <RecentTransactions 
          transactionsData={transactions}
          isLoading={transactionsLoading}
          totalTransactions={transactionsData?.data?.totalElements || 0}
        />
      
      {/* <CustomersLocation /> */}
    </section>
  );
}