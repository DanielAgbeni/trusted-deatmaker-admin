import { GeneralStatCard } from "@/components/dashboard/stats-card";
import { useGetDisputeAnalyticsQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function DisputeStats() {
  const { data: analyticsResponse, isLoading } = useGetDisputeAnalyticsQuery({});

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[60px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    );
  }

  const summary = analyticsResponse?.data?.summary;

  const stats = [
    {
      title: "Total Cases",
      value: summary?.totalDisputes.toString() || "0",
      change: { value: "-0.03%", trend: "down" as const },
    },
    {
      title: "Unassigned",
      value: (summary?.openCount || 0).toString(),
      change: { value: "-0.03%", trend: "down" as const },
    },
    {
      title: "My Cases",
      value: (summary?.assignedCount || 0).toString(),
      change: { value: "-0.03%", trend: "down" as const },
    },
    {
      title: "Critical",
      value: (summary?.atRiskCount || 0).toString(),
      change: { value: "-0.03%", trend: "down" as const },
    },
    {
      title: "SLA Breach Risk",
      value: (summary?.breachedCount || 0).toString(),
      change: { value: "-0.03%", trend: "down" as const },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <GeneralStatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          index={index}
        />
      ))}
    </div>
  );
}

