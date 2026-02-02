"use client";

import { GeneralStatCard } from "@/components/dashboard/stats-card";
import { useEffect, useState } from "react";

interface UserStatsProps {
  usersData?: any;
  loading?: boolean;
  error?: any;
  onRefetch?: () => void;
}

export default function UserStats({ 
  usersData, 
  loading, 
  error, 
  onRefetch 
}: UserStatsProps) {
  // Local state for stats
  const [stats, setStats] = useState([
    {
      title: "Total Users",
      value: "0",
      change: { value: "-0.33%", trend: "down" as const },
    },
    {
      title: "Active Users",
      value: "0",
      change: { value: "+15.03%", trend: "up" as const },
    },
    {
      title: "New Users (7 days)",
      value: "0",
      change: { value: "0%", trend: "neutral" as const },
    },
    {
      title: "Blocked Users",
      value: "0",
      change: { value: "+6.08%", trend: "up" as const },
    },
  ]);

  // Function to calculate user statistics
  const calculateUserStats = (users: any[]) => {
    if (!users || users.length === 0) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        blockedUsers: 0,
      };
    }

    const activeUsers = users.filter(user => user.isActive && !user.isBlocked).length;
    const blockedUsers = users.filter(user => user.isBlocked).length;
    
    // For "new users", let's assume users created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = users.filter(user => {
      try {
        const createdDate = new Date(user.createdAt);
        return createdDate >= sevenDaysAgo;
      } catch {
        return false;
      }
    }).length;

    return {
      activeUsers,
      newUsers,
      blockedUsers,
    };
  };

  // Update stats when data loads
  useEffect(() => {
    if (usersData?.data?.content) {
      const userStats = calculateUserStats(usersData.data.content);
      
      setStats([
        {
          title: "Total Users",
          value: (usersData.data.totalElements || 0).toLocaleString(),
          change: { value: "-0.33%", trend: "down" as const },
        },
        {
          title: "Active Users",
          value: userStats.activeUsers.toLocaleString(),
          change: { value: "+15.03%", trend: "up" as const },
        },
        {
          title: "New Users (7 days)",
          value: userStats.newUsers.toLocaleString(),
          change: { value: "0%", trend: "neutral" as const },
        },
        {
          title: "Blocked Users",
          value: userStats.blockedUsers.toLocaleString(),
          change: { value: "+6.08%", trend: "up" as const },
        },
      ]);
    }
  }, [usersData]);

  // Log API response for debugging
  useEffect(() => {
    if (usersData) {
      console.log("User Stats - Total Users:", usersData.data?.totalElements);
    }
  }, [usersData]);

  useEffect(() => {
    if (error) {
      console.error("Error in UserStats:", error);
    }
  }, [error]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={onRefetch} />;
  }

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

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-100 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
}

// Error display component
function ErrorDisplay({ error, onRetry }: { error: any; onRetry?: () => void }) {
  return (
    <div className="p-6 bg-red-50 rounded-xl shadow-sm border border-red-100">
      <div className="text-red-600 font-semibold">Error loading user statistics</div>
      <div className="text-red-500 text-sm mt-2">
        {error?.data?.message || "Failed to fetch user data"}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Retry
        </button>
      )}
    </div>
  );
}