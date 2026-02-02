// @ts-nocheck
"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddBankDialog from "@/app/dashboard/us/wallet/_dialogues/add-bank-dialog";
import DepositDialog from "@/app/dashboard/us/wallet/_dialogues/deposit-dialog";
import WithdrawDialog from "@/app/dashboard/us/wallet/_dialogues/withdraw-dialog";
import BankCards from "@/app/dashboard/us/wallet/bank-cards";
import KycDialog from "@/app/dashboard/us/wallet/_dialogues/kyc-dialog";
import { MoneyFlowChart } from "@/components/dashboard/charts";
import { StatCardV1, StatCardV2 } from "@/components/dashboard/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetUserStatsQuery } from "@/lib/store/features/userDashboardApi/userDashboardApi";

interface BankAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
}

type WalletOverviewProps = {
  handleKYCStatusChange: () => void;
  isKYCCompleted: boolean;
  profileLoading?: boolean;
  userName?: string;
  profileData?: any;
};

export default function WalletOverview({
  handleKYCStatusChange,
  isKYCCompleted,
  profileLoading = false,
  userName = "",
  profileData,
}: WalletOverviewProps) {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [addBankDialogOpen, setAddBankDialogOpen] = useState(false);
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [timeframe, setTimeframe] = useState("week");
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [localIsKYCCompleted, setLocalIsKYCCompleted] =
    useState(isKYCCompleted);

  // Call the User Stats API
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetUserStatsQuery();

  // Sync local state with prop
  useEffect(() => {
    setLocalIsKYCCompleted(isKYCCompleted);
  }, [isKYCCompleted]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Get KYC status message
  const getKYCStatusMessage = () => {
    if (profileLoading) return "Checking KYC status...";

    if (profileData) {
      const kycStatus =
        profileData.kycStatus ||
        profileData.verificationStatus ||
        "not_started";

      switch (kycStatus.toLowerCase()) {
        case "verified":
        case "approved":
        case "completed":
          return "KYC Verified";
        case "pending":
        case "under_review":
        case "review":
          return "KYC Under Review";
        case "rejected":
        case "declined":
          return "KYC Declined";
        case "not_started":
        case "incomplete":
          return "KYC Not Started";
        default:
          return "KYC Status Unknown";
      }
    }

    return localIsKYCCompleted ? "KYC Verified" : "KYC Required";
  };

  // Get wallet balance from stats
  const getWalletBalance = () => {
    if (statsLoading) return "Loading...";
    if (statsError) return "Error loading";
    if (statsData?.data?.walletBalance !== undefined) {
      return formatCurrency(
        statsData.data.walletBalance,
        statsData.data.currency
      );
    }
    return localIsKYCCompleted ? "₦24,500.00" : "₦0.00";
  };

  // Get available balance (assuming it's the same as walletBalance for now)
  const getAvailableBalance = () => {
    if (statsLoading) return "Loading...";
    if (statsError) return "Error loading";
    if (statsData?.data?.walletBalance !== undefined) {
      return formatCurrency(
        statsData.data.walletBalance,
        statsData.data.currency
      );
    }
    return localIsKYCCompleted ? "₦22,000.00" : "₦0.00";
  };

  const handleBankAdded = (bank: BankAccount) => {
    setBanks((prev) => [...prev, bank]);
    toast.success("Bank Added Successfully", {
      description: `${bank.bankName} account has been added to your wallet.`,
    });
  };

  const handleRemoveBank = (bankId: string) => {
    setBanks((prev) => prev.filter((bank) => bank.id !== bankId));
    toast.success("Bank Removed", {
      description: "Bank account has been removed from your wallet.",
    });
  };

  const canAddMoreBanks = banks.length < 3;

  // Sample data for the chart - could be enhanced with real data later
  const chartData = {
    percentage: "+12%",
    dates: [
      "DEC 1",
      "DEC 3",
      "DEC 5",
      "DEC 7",
      "DEC 9",
      "DEC 11",
      "DEC 13",
      "DEC 15",
    ],
    dataPoints: [2000, 2500, 1800, 3000, 2200, 3500, 2800, 3200],
  };

  const handleDepositComplete = () => {
    toast.success("Deposit Initiated", {
      description:
        "Your deposit has been initiated. It will be credited once confirmed.",
    });
    // Refetch stats after deposit
    setTimeout(() => refetchStats(), 1000);
  };

  const handleWithdrawComplete = (amount: number, bank: BankAccount) => {
    toast.success("Withdrawal Initiated", {
      description: `${formatCurrency(amount)} withdrawal to ${
        bank.bankName
      } has been initiated.`,
    });
    // Refetch stats after withdrawal
    setTimeout(() => refetchStats(), 1000);
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    console.log("Timeframe changed to:", newTimeframe);
  };

  // Handle KYC submission
  const handleKYCSubmit = () => {
    handleKYCStatusChange();
    toast.info("KYC process initiated", {
      description: "Please complete the verification steps in the dialog.",
    });
  };

  // Get KYC badge variant
  const getKYCBadgeVariant = () => {
    if (profileData) {
      const kycStatus =
        profileData.kycStatus ||
        profileData.verificationStatus ||
        "not_started";

      switch (kycStatus.toLowerCase()) {
        case "verified":
        case "approved":
        case "completed":
          return "default";
        case "pending":
        case "under_review":
        case "review":
          return "secondary";
        case "rejected":
        case "declined":
          return "destructive";
        default:
          return "outline";
      }
    }

    return localIsKYCCompleted ? "default" : "outline";
  };

  // Combined loading state
  const isLoading = profileLoading || statsLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white w-[30%] p-6 rounded-lg border shadow-sm">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-20" />
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="w-[70%]">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Error state for stats
  if (statsError) {
    toast.error("Failed to load wallet data", {
      description: "Please refresh the page or try again later.",
    });
  }

  // Get max withdraw amount from wallet balance
  const maxWithdrawAmount = statsData?.data?.walletBalance || 24000;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Fund Balance Card */}
        <div className="bg-white w-[30%] flex flex-col">
          <div className="w-full flex flex-col justify-between grow">
            {/* Balance Cards */}
            <div className="space-y-4 mb-8">
              <StatCardV1
                title="Total Balance"
                value={getWalletBalance()}
                currency=" "
              />
              <StatCardV2
                title="Available Balance"
                value={getAvailableBalance()}
                currency=" "
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* WITHDRAW - Disabled without KYC */}
                <WithdrawDialog
                  open={withdrawDialogOpen}
                  onOpenChange={setWithdrawDialogOpen}
                  availableBanks={banks}
                  maxAmount={maxWithdrawAmount}
                  onWithdrawComplete={handleWithdrawComplete}
                  trigger={
                    <Button
                      variant={"defaultOutline"}
                      className="w-full"
                      disabled={
                        !localIsKYCCompleted ||
                        banks.length === 0 ||
                        maxWithdrawAmount <= 0
                      }
                      title={
                        !localIsKYCCompleted
                          ? "Complete KYC to withdraw"
                          : banks.length === 0
                          ? "Add a bank account to withdraw"
                          : maxWithdrawAmount <= 0
                          ? "Insufficient balance"
                          : ""
                      }
                    >
                      Withdraw
                    </Button>
                  }
                />

                {/* DEPOSIT - Always enabled */}
                <DepositDialog
                  open={depositDialogOpen}
                  onOpenChange={setDepositDialogOpen}
                  onComplete={handleDepositComplete}
                  trigger={
                    <Button className="w-full" variant={"defaultOutline"}>
                      Deposit
                    </Button>
                  }
                />
              </div>

              {/* Add Bank Account - Only allowed with KYC */}
              {localIsKYCCompleted ? (
                <AddBankDialog
                  open={addBankDialogOpen}
                  onOpenChange={setAddBankDialogOpen}
                  onBankAdded={handleBankAdded}
                  existingBanks={banks}
                  trigger={
                    <Button
                      className="w-full"
                      disabled={!canAddMoreBanks}
                      variant={!canAddMoreBanks ? "secondary" : "default"}
                      title={
                        !canAddMoreBanks
                          ? "Maximum of 3 bank accounts allowed"
                          : ""
                      }
                    >
                      {canAddMoreBanks
                        ? "Add Bank Account"
                        : "Maximum Banks Added"}
                    </Button>
                  }
                />
              ) : (
                // Complete KYC Button
                <KycDialog
                  onSubmit={handleKYCSubmit}
                  trigger={
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Complete KYC Verification
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-[70%]">
          <div className="bg-white h-full">
            <MoneyFlowChart chartData={chartData} />
          </div>
        </div>
      </div>

      {/* Bank Cards Section */}
      {banks.length > 0 && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Linked Bank Accounts</h3>
            <span className="text-sm text-gray-500">
              {banks.length} of 3 accounts linked
            </span>
          </div>
          <BankCards banks={banks} onRemoveBank={handleRemoveBank} />
        </div>
      )}

      {/* Stats Error Alert */}
      {statsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Unable to load wallet data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Some features may be limited. Please try refreshing the page.
                </p>
              </div>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchStats()}
                  className="text-red-700 border-red-300 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
