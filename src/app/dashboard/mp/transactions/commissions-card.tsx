"use client";

import { StatCardV1 } from "@/components/dashboard/stats-card";

interface StatItem {
  title: string;
  value: number | string;
}

interface StatCardsProps {
  stats: StatItem[];
  isLoading?: boolean;
}

export default function StatCards({ stats, isLoading = false }: StatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow border animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCardV1 key={stat.title} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
}