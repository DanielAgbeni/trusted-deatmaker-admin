import { StatCardV1 } from "@/components/dashboard/stats-card";

export default function StatCards() {
  const stats = [
    {
      title: "Total sales",
      value: 150000,
    },
    {
      title: "Pending sales",
      value: 265000,
    },
    {
      title: " Total purchases",
      value: 6000,
    },
    {
      title: "Pending purchases",
      value: 80000,
    },
  ];

  //   const stats = [
  //   {
  //     title: "Total Withdrawals",
  //     value: 150000,
  //   },
  //   {
  //     title: "Pending Withdrawals",
  //     value: 265000,
  //   },
  //   {
  //     title: "Total Commission",
  //     value: 6000,
  //   },
  //   {
  //     title: "Pending Commission",
  //     value: 80000,
  //   },
  // ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <StatCardV1 key={stat.title} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
}
