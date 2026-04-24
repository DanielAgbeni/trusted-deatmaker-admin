"use client";

import React from "react";
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Clock, 
  XCircle, 
  Ban, 
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Hash
} from "lucide-react";
import { SummaryStatsCard } from "@/components/dashboard/summary-stats-card";
import { 
  useGetDealsQuery, 
  useGetDisputesQuery,
  useGetDepositsQuery,
  useGetWithdrawalsQuery
} from "@/lib/store/features/adminDashboardApi/adminDashboardApi";

export function EcrowDisputeStats() {
  // --- Deposits Data ---
  const { data: totalDeposits, isLoading: depLoading } = useGetDepositsQuery({ page: 0, size: 0 });
  const { data: pendingDeposits } = useGetDepositsQuery({ page: 0, size: 0, status: 'PENDING' });
  const { data: failedDeposits } = useGetDepositsQuery({ page: 0, size: 0, status: 'FAILED' });

  // --- Withdrawals Data ---
  const { data: totalWithdrawals, isLoading: withLoading } = useGetWithdrawalsQuery({ page: 0, size: 0 });
  const { data: pendingWithdrawals } = useGetWithdrawalsQuery({ page: 0, size: 0, status: 'PENDING' });
  const { data: failedWithdrawals } = useGetWithdrawalsQuery({ page: 0, size: 0, status: 'FAILED' });

  // --- Deals (Transactions) Data ---
  const { data: allDeals, isLoading: dealsLoading } = useGetDealsQuery({ page: 0, size: 0 });
  const { data: inProgressDeals } = useGetDealsQuery({ page: 0, size: 0, status: 'IN_PROGRESS' });
  const { data: completedDeals } = useGetDealsQuery({ page: 0, size: 0, status: 'COMPLETED' });
  const { data: disputedDeals } = useGetDealsQuery({ page: 0, size: 0, status: 'DISPUTED' });

  // --- Disputes Data ---
  const { data: allDisputes, isLoading: disLoading } = useGetDisputesQuery({ page: 0, size: 0 });
  const { data: openDisputes } = useGetDisputesQuery({ page: 0, size: 0, status: 'OPEN' });
  const { data: resolvedDisputes } = useGetDisputesQuery({ page: 0, size: 0, status: 'RESOLVED' });
  const { data: unassignedDisputes } = useGetDisputesQuery({ page: 0, size: 0, status: 'UNASSIGNED' });

  // Helper to format large numbers for mockup feel if count is low, or just show real count
  const fmt = (val?: number) => val || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Deposits Card */}
      <SummaryStatsCard
        title="Deposits"
        isLoading={depLoading}
        stats={[
          {
            icon: <ArrowDownToLine size={20} />,
            amount: fmt(totalDeposits?.data?.totalElements),
            label: "Total Deposited",
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
          },
          {
            icon: <Clock size={20} />,
            amount: fmt(pendingDeposits?.data?.totalElements),
            label: "Pending Deposits",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600"
          },
          {
            icon: <Ban size={20} />,
            amount: fmt(failedDeposits?.data?.totalElements),
            label: "Rejected Deposits",
            iconBg: "bg-red-100",
            iconColor: "text-red-600"
          },
          {
            icon: <DollarSign size={20} />,
            amount: "₦0",
            label: "Deposited Charge",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
          }
        ]}
      />

      {/* Withdrawals Card */}
      <SummaryStatsCard
        title="Withdrawals"
        isLoading={withLoading}
        stats={[
          {
            icon: <ArrowUpFromLine size={20} />,
            amount: fmt(totalWithdrawals?.data?.totalElements),
            label: "Total Withdrawals",
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
          },
          {
            icon: <Clock size={20} />,
            amount: fmt(pendingWithdrawals?.data?.totalElements),
            label: "Pending Withdrawals",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600"
          },
          {
            icon: <Ban size={20} />,
            amount: fmt(failedWithdrawals?.data?.totalElements),
            label: "Rejected Withdrawals",
            iconBg: "bg-red-100",
            iconColor: "text-red-600"
          },
          {
            icon: <DollarSign size={20} />,
            amount: "₦0",
            label: "Withdrawals Charge",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
          }
        ]}
      />

      {/* Transactions Card */}
      <SummaryStatsCard
        title="Transactions"
        isLoading={dealsLoading}
        stats={[
          {
            icon: <Briefcase size={20} />,
            amount: fmt(allDeals?.data?.totalElements),
            label: "Total Deals",
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
          },
          {
            icon: <Clock size={20} />,
            amount: fmt(inProgressDeals?.data?.totalElements),
            label: "In Progress",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600"
          },
          {
            icon: <CheckCircle2 size={20} />,
            amount: fmt(completedDeals?.data?.totalElements),
            label: "Completed",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
          },
          {
            icon: <XCircle size={20} />,
            amount: fmt(disputedDeals?.data?.totalElements),
            label: "Disputed",
            iconBg: "bg-red-100",
            iconColor: "text-red-600"
          }
        ]}
      />

      {/* Dispute Card */}
      <SummaryStatsCard
        title="Dispute"
        isLoading={disLoading}
        stats={[
          {
            icon: <AlertCircle size={20} />,
            amount: fmt(allDisputes?.data?.totalElements),
            label: "Total Disputes",
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
          },
          {
            icon: <Hash size={20} />,
            amount: fmt(openDisputes?.data?.totalElements),
            label: "Open Cases",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600"
          },
          {
            icon: <CheckCircle2 size={20} />,
            amount: fmt(resolvedDisputes?.data?.totalElements),
            label: "Resolved",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
          },
          {
            icon: <XCircle size={20} />,
            amount: fmt(unassignedDisputes?.data?.totalElements),
            label: "Unassigned",
            iconBg: "bg-red-100",
            iconColor: "text-red-600"
          }
        ]}
      />
    </div>
  );
}
