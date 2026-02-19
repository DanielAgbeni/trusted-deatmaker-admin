import { GeneralStatCard } from "@/components/dashboard/stats-card";
import { useGetDisputesQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function DisputeStats() {
  const { data: allDisputes, isLoading: isLoadingAll } = useGetDisputesQuery({ size: 0 });
  const { data: resolvedDisputes, isLoading: isLoadingResolved } = useGetDisputesQuery({ size: 0, status: 'RESOLVED' });
  const { data: pendingDisputes, isLoading: isLoadingPending } = useGetDisputesQuery({ size: 0, status: 'PENDING' });
  const { data: inProgressDisputes, isLoading: isLoadingInProgress } = useGetDisputesQuery({ size: 0, status: 'IN_PROGRESS' });

  const isLoading = isLoadingAll || isLoadingResolved || isLoadingPending || isLoadingInProgress;

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

  const stats = [
    {
      title: "All Disputes",
      value: allDisputes?.data?.totalElements.toString() || "0",
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Resolved Disputes",
      value: resolvedDisputes?.data?.totalElements.toString() || "0",
      change: { value: "0%", trend: "neutral" as const },
    },
    {
      title: "Pending Disputes",
      value: pendingDisputes?.data?.totalElements.toString() || "0",
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "In Progress Disputes",
      value: inProgressDisputes?.data?.totalElements.toString() || "0",
      change: { value: "+0%", trend: "neutral" as const },
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
