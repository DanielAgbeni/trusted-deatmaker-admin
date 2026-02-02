import { GeneralStatCard } from "@/components/dashboard/stats-card";

export default function DisputeStats() {
  const stats = [
    {
      title: "All Disputes",
      value: "452",
      change: { value: "-0.33%", trend: "down" as const },
    },
    {
      title: "Resolved Users",
      value: "200",
      change: { value: "0%", trend: "neutral" as const },
    },
    {
      title: "Pending Disputes",
      value: "180",
      change: { value: "+6.08%", trend: "up" as const },
    },
    {
      title: "Urgent Disputes",
      value: "72",
      change: { value: "+15.03%", trend: "up" as const },
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
