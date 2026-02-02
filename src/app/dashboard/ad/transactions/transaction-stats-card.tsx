import { StatCardV1 } from "@/components/dashboard/stats-card";
import { useGetDealsQuery, useGetWithdrawalsQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";

export default function StatCards() {
  // We can only get counts from list endpoints metadata
  const { data: allDeals } = useGetDealsQuery({ size: 0 });
  const { data: activeDeals } = useGetDealsQuery({ size: 0, status: 'PENDING' }); // Assuming PENDING or ACTIVE
  const { data: completedWithdrawals } = useGetWithdrawalsQuery({ size: 0 }); // Status filtering might be needed if supported

  // Note: 'Total Commission' and 'Escrow Balance' (Value) are not available in list APIs. 
  // We will show counts instead or 0 for values we can't calculate.

  const stats = [
    {
      title: "Active Escrow Deals",
      value: activeDeals?.data?.totalElements || 0,
    },
    {
      title: "Total Deals",
      value: allDeals?.data?.totalElements || 0,
    },
    {
      title: "Total Withdrawals",
      value: completedWithdrawals?.data?.totalElements || 0,
    },
    {
      title: "Total Commission",
      value: 0, // Placeholder
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCardV1 key={stat.title} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
}
