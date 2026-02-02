import {
  CurrencyStatCard,
  GeneralStatCard,
  StatCard,
} from "@/components/dashboard/stats-card";

interface StatCardsProps {
  walletBalance: number;
  walletCurrency: string;
  totalCommissions: number;
  pendingCommissions: number;
  commissionCurrency: string;
  totalUsers: number;
  recentUsers: number;
  isLoading?: boolean;
}

export default function StatCards({
  walletBalance,
  walletCurrency,
  totalCommissions,
  pendingCommissions,
  commissionCurrency,
  totalUsers,
  recentUsers,
  isLoading = false,
}: StatCardsProps) {
  
  // Format currency value properly for the card
  const formatCurrencyValue = (amount: number, currencyCode: string) => {
    // The CurrencyStatCard will handle formatting via formatCurrency utility
    // Just return the raw number and let the component format it
    return amount;
  };

  // Use the same example change values as before (no changes to design)
  const exampleChanges = {
    wallet: { value: "-0.03%", trend: "down" as const },
    commissions: { value: "+15.03%", trend: "up" as const },
    totalUsers: { value: "+6.08%", trend: "up" as const },
    recentUsers: { value: "+0%", trend: "neutral" as const },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  // Prepare stats array exactly as before but with real data
  const stats = [
    {
      title: "Wallet Balance",
      value: formatCurrencyValue(walletBalance, walletCurrency),
      change: exampleChanges.wallet,
      count: pendingCommissions > 0 ? pendingCommissions : undefined,
    },
    {
      title: "Total Commissions",
      value: formatCurrencyValue(totalCommissions, commissionCurrency),
      count: pendingCommissions > 0 ? pendingCommissions : undefined,
      change: exampleChanges.commissions,
    },
    {
      title: "Total Users",
      value: totalUsers,
      change: exampleChanges.totalUsers,
    },
    {
      title: "New Users",
      value: recentUsers,
      change: exampleChanges.recentUsers,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.slice(0, 2).map((stat, index) => (
        <CurrencyStatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          index={index}
          count={stat.count}
        />
      ))}
      {stats.slice(2, 4).map((stat, index) => (
        <GeneralStatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          index={index + 2} // Keep the original index offset
        />
      ))}
    </div>
  );
}