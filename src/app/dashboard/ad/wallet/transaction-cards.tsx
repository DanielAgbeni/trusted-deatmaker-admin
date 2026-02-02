"use client";
import { CurrencyStatCard } from "@/components/dashboard/stats-card";
import { TransactionType } from "./page";
import { useGetDepositsQuery, useGetWithdrawalsQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";

export default function TransactionCards({ transactionType }: TransactionType) {
  // Determine mode
  const isWithdrawal = transactionType === 'withdrawal';
  const isDeposit = transactionType === 'deposit';

  // We need to fetch data based on the mode.
  // If mode is undefined (Overview), we might want to show mixed stats or just default to withdrawals stats?
  // Usually overview highlights generic stats. Let's assume if undefined we show withdrawals data or both summed?
  // Given the UI design likely expects one set, we'll default to 'withdrawal' if strict, but maybe better to show aggregate if possible of "All Transactions".
  // However, strict types differ. Let's follow the prop: if deposit -> deposit stats, else withdrawal stats (default).

  const showDeposit = isDeposit;

  // Fetch Withdrawals Stats
  const { data: wSuccess } = useGetWithdrawalsQuery({ size: 0, status: 'SUCCESS' }, { skip: showDeposit });
  const { data: wPending } = useGetWithdrawalsQuery({ size: 0, status: 'PENDING' }, { skip: showDeposit });
  const { data: wFailed } = useGetWithdrawalsQuery({ size: 0, status: 'FAILED' }, { skip: showDeposit });
  // "Initiated" might be same as Pending or created? 

  // Fetch Deposits Stats
  const { data: dSuccess } = useGetDepositsQuery({ size: 0, status: 'SUCCESS' }, { skip: !showDeposit });
  const { data: dPending } = useGetDepositsQuery({ size: 0, status: 'PENDING' }, { skip: !showDeposit });
  const { data: dFailed } = useGetDepositsQuery({ size: 0, status: 'FAILED' }, { skip: !showDeposit });

  const stats = showDeposit ? [
    {
      title: "Successful Deposits",
      value: "N/A", // Value not available
      count: dSuccess?.data?.totalElements || 0,
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Pending Deposits",
      value: "N/A",
      count: dPending?.data?.totalElements || 0,
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Failed/Rejected Deposits",
      value: "N/A",
      count: dFailed?.data?.totalElements || 0,
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Total Deposits", // Replaces "Initiated" which is vague without specific status
      value: "N/A",
      count: (dSuccess?.data?.totalElements || 0) + (dPending?.data?.totalElements || 0) + (dFailed?.data?.totalElements || 0),
      change: { value: "+0%", trend: "neutral" as const },
    }
  ] : [
    {
      title: "Successful Withdrawals",
      value: "N/A", // Value not available
      count: wSuccess?.data?.totalElements || 0,
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Pending Withdrawals",
      value: "N/A",
      count: wPending?.data?.totalElements || 0,
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Failed/Rejected Withdrawals",
      value: "N/A",
      count: wFailed?.data?.totalElements || 0,
      change: { value: "+0%", trend: "neutral" as const },
    },
    {
      title: "Total Withdrawals",
      value: "N/A",
      count: (wSuccess?.data?.totalElements || 0) + (wPending?.data?.totalElements || 0) + (wFailed?.data?.totalElements || 0),
      change: { value: "+0%", trend: "neutral" as const },
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <CurrencyStatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          count={stat.count}
          index={index}
        />
      ))}
    </div>
  );
}
