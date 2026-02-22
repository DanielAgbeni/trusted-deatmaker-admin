"use client";

import type React from "react";
import {
  XCircle,
  CreditCard,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDealsQuery, useGetDisputesQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";

interface StatItemProps {
  icon: React.ReactNode;
  amount: string;
  label: string;
  iconBg: string;
  isLoading?: boolean;
}

function StatItem({ icon, amount, label, iconBg, isLoading }: StatItemProps) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-lg flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              amount
            )}
          </div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );
}

interface StatsSectionProps {
  title: string;
  stats: Array<{
    icon: React.ReactNode;
    amount: string;
    label: string;
    iconBg: string;
    isLoading?: boolean;
  }>;
}

function StatsSection({ title, stats }: StatsSectionProps) {
  return (
    <Card className="bg-white border-none shadow-none ">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-sm border-gray-200 border p-4">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function EcrowDisputeStats() {
  // Fetch Deals Stats
  const { data: completedDeals, isLoading: dealsLoading } = useGetDealsQuery({ page: 0, size: 0, status: 'COMPLETED' });
  const { data: inProgressDeals, isLoading: inProgressLoading } = useGetDealsQuery({ page: 0, size: 0, status: 'IN_PROGRESS' });
  const { data: disputedDeals, isLoading: disputedLoading } = useGetDealsQuery({ page: 0, size: 0, status: 'DISPUTED' });

  // Fetch Disputes Stats
  const { data: resolvedDisputes, isLoading: resolvedLoading } = useGetDisputesQuery({ page: 0, size: 0, status: 'RESOLVED' });
  const { data: openDisputes, isLoading: openLoading } = useGetDisputesQuery({ page: 0, size: 0, status: 'OPEN' });
  const { data: unassignedDisputes, isLoading: unassignedLoading } = useGetDisputesQuery({ page: 0, size: 0, status: 'UNASSIGNED' });

  const transactionsStats = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      amount: (completedDeals?.data?.totalElements || 0).toString(),
      label: "COMPLETED",
      iconBg: "bg-green-100",
      isLoading: dealsLoading,
    },
    {
      icon: <ArrowUpDown className="w-5 h-5 text-orange-600" />,
      amount: (inProgressDeals?.data?.totalElements || 0).toString(),
      label: "IN_PROGRESS",
      iconBg: "bg-orange-100",
      isLoading: inProgressLoading,
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      amount: (disputedDeals?.data?.totalElements || 0).toString(),
      label: "DISPUTED",
      iconBg: "bg-red-100",
      isLoading: disputedLoading,
    },
  ];

  const disputeStats = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      amount: (resolvedDisputes?.data?.totalElements || 0).toString(),
      label: "RESOLVED",
      iconBg: "bg-green-100",
      isLoading: resolvedLoading,
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      amount: (openDisputes?.data?.totalElements || 0).toString(),
      label: "OPEN",
      iconBg: "bg-orange-100",
      isLoading: openLoading,
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      amount: (unassignedDisputes?.data?.totalElements || 0).toString(),
      label: "UNASSIGNED",
      iconBg: "bg-red-100",
      isLoading: unassignedLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StatsSection title="Escrow Deals (Count)" stats={transactionsStats} />
      <StatsSection title="Dispute Cases (Count)" stats={disputeStats} />
    </div>
  );
}
