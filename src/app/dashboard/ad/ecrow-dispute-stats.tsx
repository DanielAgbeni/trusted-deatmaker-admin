"use client";

import type React from "react";
import {
  XCircle,
  CreditCard,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDealsQuery, useGetDisputesQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";

interface StatItemProps {
  icon: React.ReactNode;
  amount: string;
  label: string;
  iconBg: string;
}

function StatItem({ icon, amount, label, iconBg }: StatItemProps) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-lg">{amount}</div>
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
  const { data: activeDeals } = useGetDealsQuery({ page: 0, size: 0, status: 'Active' }); // Assuming 'Active' status
  const { data: completedDeals } = useGetDealsQuery({ page: 0, size: 0, status: 'Completed' });
  const { data: disputedDeals } = useGetDealsQuery({ page: 0, size: 0, status: 'Disputed' }); // Or check logic
  // "Total Commissions" not available via list.

  // Fetch Disputes Stats
  const { data: resolvedDisputes } = useGetDisputesQuery({ page: 0, size: 0, status: 'RESOLVED' });
  const { data: pendingDisputes } = useGetDisputesQuery({ page: 0, size: 0, status: 'OPEN' });
  const { data: escalatedDisputes } = useGetDisputesQuery({ page: 0, size: 0, status: 'ESCALATED' }); // Assuming status

  const transactionsStats = [
    {
      icon: <ArrowUpDown className="w-5 h-5 text-green-600" />,
      amount: (activeDeals?.data?.totalElements || 0).toString(),
      label: "Active Escrow Deals",
      iconBg: "bg-green-100",
    },
    {
      icon: <ArrowUpDown className="w-5 h-5 text-orange-600" />,
      amount: (completedDeals?.data?.totalElements || 0).toString(),
      label: "Completed Escrow Deals",
      iconBg: "bg-orange-100",
    },
    {
      icon: <ArrowUpDown className="w-5 h-5 text-red-600" />,
      amount: (disputedDeals?.data?.totalElements || 0).toString(),
      label: "Disputed Escrow Deals",
      iconBg: "bg-red-100",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      amount: "N/A", // API limitation
      label: "Total Commissions (Val)",
      iconBg: "bg-blue-100",
    },
  ];

  const disputeStats = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      amount: (resolvedDisputes?.data?.totalElements || 0).toString(),
      label: "Resolved Disputes",
      iconBg: "bg-green-100",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      amount: (pendingDisputes?.data?.totalElements || 0).toString(),
      label: "Pending Disputes",
      iconBg: "bg-orange-100",
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      amount: (escalatedDisputes?.data?.totalElements || 0).toString(),
      label: "Escalated Disputes",
      iconBg: "bg-red-100",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-blue-600" />,
      amount: "N/A",
      label: "Dispute Charges",
      iconBg: "bg-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StatsSection title="Escrow Deals (Count)" stats={transactionsStats} />
      <StatsSection title="Dispute Cases (Count)" stats={disputeStats} />
    </div>
  );
}
