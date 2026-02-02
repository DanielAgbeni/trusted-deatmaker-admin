"use client";

import {
  TransactionChart,
  TransactionData,
} from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDepositsQuery, useGetWithdrawalsQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";

export type TransactionReportData = {
  deposits: TransactionData[];
  withdrawals: TransactionData[];
  totalDeposits: number;
  totalWithdrawals: number;
};

// Main Deposits and Withdrawal Report Component
export default function DepositsWithdrawalReport() {
  const { data: dSuccess } = useGetDepositsQuery({ page: 0, size: 0, status: 'COMPLETED' });
  const { data: dPending } = useGetDepositsQuery({ page: 0, size: 0, status: 'PENDING' });
  const { data: dFailed } = useGetDepositsQuery({ page: 0, size: 0, status: 'FAILED' }); // or REJECTED

  const { data: wSuccess } = useGetWithdrawalsQuery({ page: 0, size: 0, status: 'COMPLETED' });
  const { data: wPending } = useGetWithdrawalsQuery({ page: 0, size: 0, status: 'PENDING' });
  const { data: wFailed } = useGetWithdrawalsQuery({ page: 0, size: 0, status: 'FAILED' });

  const totalD = (dSuccess?.data?.totalElements || 0) + (dPending?.data?.totalElements || 0) + (dFailed?.data?.totalElements || 0);
  const totalW = (wSuccess?.data?.totalElements || 0) + (wPending?.data?.totalElements || 0) + (wFailed?.data?.totalElements || 0);

  const calcPercent = (val: number, total: number) => total > 0 ? (val / total) * 100 : 0;

  const reportData: TransactionReportData = {
    totalDeposits: totalD,
    totalWithdrawals: totalW,
    deposits: [
      {
        category: "Total Successful",
        percentage: calcPercent(dSuccess?.data?.totalElements || 0, totalD),
        amount: dSuccess?.data?.totalElements || 0,
        fill: "var(--color-total-deposited)",
      },
      {
        category: "Pending Deposits",
        percentage: calcPercent(dPending?.data?.totalElements || 0, totalD),
        amount: dPending?.data?.totalElements || 0,
        fill: "var(--color-pending-deposits)",
      },
      {
        category: "Rejected Deposits",
        percentage: calcPercent(dFailed?.data?.totalElements || 0, totalD),
        amount: dFailed?.data?.totalElements || 0,
        fill: "var(--color-rejected-deposits)",
      },
    ],
    withdrawals: [
      {
        category: "Total Successful",
        percentage: calcPercent(wSuccess?.data?.totalElements || 0, totalW),
        amount: wSuccess?.data?.totalElements || 0,
        fill: "var(--color-total-withdrawals)",
      },
      {
        category: "Pending Withdrawals",
        percentage: calcPercent(wPending?.data?.totalElements || 0, totalW),
        amount: wPending?.data?.totalElements || 0,
        fill: "var(--color-pending-withdrawals)",
      },
      {
        category: "Rejected Withdrawals",
        percentage: calcPercent(wFailed?.data?.totalElements || 0, totalW),
        amount: wFailed?.data?.totalElements || 0,
        fill: "var(--color-rejected-withdrawals)",
      },
    ],
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + " Txns";
  };

  return (
    <Card className="shadow-none border-none px-0">
      <CardHeader className="px-0 pb-4">
        <CardTitle className="text-lg font-medium">
          Deposits and Withdrawal Report (Count)
        </CardTitle>
        <div className="flex gap-6 text-sm text-gray-600">
          <div>Total Deposits: {formatCurrency(reportData.totalDeposits)}</div>
          <div>
            Total Withdrawals: {formatCurrency(reportData.totalWithdrawals)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <TransactionChart
            title="Deposits"
            chartData={reportData.deposits}
            total={reportData.totalDeposits}
          />

          <TransactionChart
            title="Withdrawals"
            chartData={reportData.withdrawals}
            total={reportData.totalWithdrawals}
          />
        </div>
      </CardContent>
    </Card>
  );
}
