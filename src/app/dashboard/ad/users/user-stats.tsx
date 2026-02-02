import { GeneralStatCard, StatCard } from "@/components/dashboard/stats-card";
import { useGetUsersQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";

export default function UserStats() {
  const { data: totalUsers } = useGetUsersQuery({ size: 0 });
  const { data: activeUsers } = useGetUsersQuery({ size: 0, active: true });
  const { data: suspendedUsers } = useGetUsersQuery({ size: 0, active: false });
  const { data: unverifiedUsers } = useGetUsersQuery({ size: 0, kycVerified: false });

  const stats = [
    {
      title: "Total Users",
      value: totalUsers?.data?.totalElements.toString() || "0",
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Active Users",
      value: activeUsers?.data?.totalElements.toString() || "0",
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Suspended Users", // Renamed from New Users to match available data
      value: suspendedUsers?.data?.totalElements.toString() || "0",
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Unverified Users",
      value: unverifiedUsers?.data?.totalElements.toString() || "0",
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
