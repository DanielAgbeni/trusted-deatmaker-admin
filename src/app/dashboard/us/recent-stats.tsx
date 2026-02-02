// @ts-nocheck
"use client";

import {
  CurrencyStatCard,
  GeneralStatCard,
} from "@/components/dashboard/stats-card";
import { useGetUserStatsQuery } from "@/lib/store/features/userDashboardApi/userDashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";

export default function StatCards() {
  const { 
    data: userStats, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetUserStatsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState 
        title="Failed to load stats" 
        errorData={error as any} 
        retry={refetch}
      />
    );
  }

  const statsData = userStats?.data;

  const stats = [
    {
      type: "currency",
      title: "Wallet Balance",
      value: statsData?.walletBalance || 0,
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      type: "general",
      title: "Purchase Made",
      value: statsData?.completedDealsCount || 0,
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      type: "general",
      title: "Pending Purchase",
      value: statsData?.pendingFundingCount || 0,
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      type: "general",
      title: "Canceled Purchase",
      value: statsData?.cancelledDealsCount || 0,
      change: { value: "+0%", trend: "neutral" as const },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        if (stat.type === "currency") {
          return (
            <CurrencyStatCard
              key={stat.title}
              index={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}

            />
          );
        }
        return (
          <GeneralStatCard
            key={stat.title}
            index={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
          />
        );
      })}
    </div>
  );
}
