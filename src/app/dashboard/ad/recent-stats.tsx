"use client";

import { GeneralStatCard } from "@/components/dashboard/stats-card";
import { useGetUsersQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";

export default function StatCards() {
  const { data: allUsers } = useGetUsersQuery({ page: 0, size: 0 });
  const { data: activeUsers } = useGetUsersQuery({ page: 0, size: 0, active: true });
  const { data: suspendedUsers } = useGetUsersQuery({ page: 0, size: 0, active: false });
  const { data: unverifiedUsers } = useGetUsersQuery({ page: 0, size: 0, kycVerified: false });

  const stats = [
    {
      title: "Total Users",
      value: (allUsers?.data?.totalElements || 0).toString(),
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Active Users",
      value: (activeUsers?.data?.totalElements || 0).toString(),
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Suspended Users", // Renamed from New Users as "New" requires date filter logic, simplified to Suspended/Inactive for now
      value: (suspendedUsers?.data?.totalElements || 0).toString(),
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Unverified Users",
      value: (unverifiedUsers?.data?.totalElements || 0).toString(),
      change: { value: "+0%", trend: "neutral" as const },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
