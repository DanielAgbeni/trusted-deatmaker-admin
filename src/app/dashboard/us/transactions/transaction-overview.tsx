"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { MoneyFlowChart } from "@/components/dashboard/charts";
import StatCards from "./commissions-card";

type TransactionOverviewProps = {
  handleKYCStatusChange: () => void;
  isKYCCompleted: boolean;
};

export default function TransactionOverview({
  handleKYCStatusChange,
  isKYCCompleted,
}: TransactionOverviewProps) {
  // Sample data for the chart
  const chartData = {
    percentage: "+12%",
    dates: [
      "DEC 1",
      "DEC 3",
      "DEC 5",
      "DEC 7",
      "DEC 9",
      "DEC 11",
      "DEC 13",
      "DEC 15",
    ],
    dataPoints: [2000, 2500, 1800, 3000, 2200, 3500, 2800, 3200],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fund Balance Card */}
        <StatCards />

        <MoneyFlowChart chartData={chartData} />
      </div>
    </div>
  );
}
