import { GeneralStatCard } from "@/components/dashboard/stats-card";
import { useGetDisputesQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";

export default function DisputeStats() {
  const { data: allDisputes } = useGetDisputesQuery({ size: 0 });
  const { data: resolvedDisputes } = useGetDisputesQuery({ size: 0, status: 'RESOLVED' });
  const { data: pendingDisputes } = useGetDisputesQuery({ size: 0, status: 'PENDING' });
  const { data: inProgressDisputes } = useGetDisputesQuery({ size: 0, status: 'IN_PROGRESS' });

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
