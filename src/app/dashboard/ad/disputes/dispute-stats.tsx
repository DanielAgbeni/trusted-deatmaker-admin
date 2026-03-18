import { GeneralStatCard } from "@/components/dashboard/stats-card";
import { useGetDisputeAnalyticsQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function DisputeStats() {
  const { data: analyticsResponse, isLoading } = useGetDisputeAnalyticsQuery({});

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
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
      title: "Total Disputes",
      value: summary?.totalDisputes.toString() || "0",
      change: { value: "All time", trend: "neutral" as const },
    },
    {
      title: "Resolved Disputes",
      value: summary?.resolvedDisputes.toString() || "0",
      change: { value: `${summary?.resolutionRate.toFixed(1) || 0}% rate`, trend: "up" as const },
    },
    {
      title: "SLA Compliance",
      value: `${summary?.slaComplianceRate.toFixed(1) || 0}%`,
      change: { value: "Target: 95%", trend: (summary?.slaComplianceRate || 0) >= 95 ? "up" as const : "down" as const },
    },
    {
      title: "Resolution Rate",
      value: `${summary?.resolutionRate.toFixed(1) || 0}%`,
      change: { value: "Overall rate", trend: "neutral" as const },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
