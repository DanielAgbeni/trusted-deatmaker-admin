"use client";

import { Pie, PieChart } from "recharts";
import { ArrowUp, Calendar } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationData } from "@/app/dashboard/us/customers-location";

type MoneyFlowChartProps = {
  chartData: {
    percentage: string;
    dates: string[];
    dataPoints: number[];
  };
};

const chartConfig = {
  moneyFlow: {
    label: "Money Flow",
    color: "#0097C7",
  },
} satisfies ChartConfig;

export function MoneyFlowChart({ chartData }: MoneyFlowChartProps) {
  const [timeframe, setTimeframe] = useState("week");

  // Transform data for recharts
  const transformedData = chartData.dates.map((date, index) => ({
    date: date,
    moneyFlow: chartData.dataPoints[index] || 0,
  }));

  // Format Y-axis values (convert to k format)
  const formatYAxis = (value: number) => `${(value / 1000).toFixed(0)}k`;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Money Flow</h3>
            <div className="flex items-center text-green-500 text-sm mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>{chartData.percentage}</span>
            </div>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[100px] h-8 bg-gray-50">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Week" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0 pr-8">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={transformedData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-gray-400"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatYAxis}
              className="text-xs text-gray-400"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value) => [
                    `${formatYAxis(value as number)}`,
                    "Money Flow",
                  ]}
                />
              }
            />
            <Area
              dataKey="moneyFlow"
              type="natural"
              fill="var(--color-moneyFlow)"
              fillOpacity={0.4}
              stroke="var(--color-moneyFlow)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function LocationChart({
  title,
  chartData,
}: {
  title?: string;
  chartData: LocationData[];
}) {
  const chartConfig = {
    percentage: {
      label: "Percentage",
    },
    "united-states": {
      label: "United States",
      color: "#f63b51", // blue-500
    },
    canada: {
      label: "Canada",
      color: "#d3de08", // green-600
    },
    mexico: {
      label: "Mexico",
      color: "#34d399", // green-400
    },
    other: {
      label: "Other",
      color: "#1f2937", // gray-800
    },
  } satisfies ChartConfig;

  return (
    <Card className={`shadow-none gap-2 border-none px-0`}>
      <CardHeader className="px-0">
        <CardTitle className="text-lg font-medium">
          {title} by Location
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6 items-center">
        <ChartContainer
          config={chartConfig}
          className="w-40 h-40 flex-shrink-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => [
                    `${value}%`,
                    chartConfig[name as keyof typeof chartConfig]?.label ||
                      name,
                  ]}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="country"
              innerRadius={30}
              outerRadius={70}
              paddingAngle={2}
            />
          </PieChart>
        </ChartContainer>

        <div className="flex-1 space-y-2">
          {chartData.map((location) => {
            const configKey = location.country
              .toLowerCase()
              .replace(/\s+/g, "-") as keyof typeof chartConfig;
            const config = chartConfig[configKey];
            const color =
              config && "color" in config ? config.color : "#6b7280";

            return (
              <div
                key={location.country}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span>{location.country}</span>
                </div>
                <span className="font-medium">{location.percentage}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Types for the transaction data
export type TransactionData = {
  category: string;
  percentage: number;
  amount: number;
  fill: string;
};
// Reusable Transaction Chart Component
export function TransactionChart({
  title,
  chartData,
  total,
}: {
  title: string;
  chartData: TransactionData[];
  total: number;
}) {
  const chartConfig = {
    percentage: {
      label: "Percentage",
    },
    "total-deposited": {
      label: "Total Deposited",
      color: "#10b981", // green-500
    },
    "deposited-charge": {
      label: "Deposited Charge",
      color: "#3b82f6", // blue-500
    },
    "pending-deposits": {
      label: "Pending Deposits",
      color: "#f59e0b", // amber-500
    },
    "rejected-deposits": {
      label: "Rejected Deposits",
      color: "#ef4444", // red-500
    },
    "total-withdrawals": {
      label: "Total Withdrawals",
      color: "#10b981", // green-500
    },
    "withdrawals-charge": {
      label: "Withdrawals Charge",
      color: "#3b82f6", // blue-500
    },
    "pending-withdrawals": {
      label: "Pending Withdrawals",
      color: "#f59e0b", // amber-500
    },
    "rejected-withdrawals": {
      label: "Rejected Withdrawals",
      color: "#ef4444", // red-500
    },
  } satisfies ChartConfig;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-base font-medium text-gray-700 w-full text-left">
        {title}
      </h3>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <ChartContainer
          config={chartConfig}
          className="w-32 h-32 flex-shrink-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => [
                    `${value}%`,
                    chartConfig[name as keyof typeof chartConfig]?.label ||
                      name,
                  ]}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="category"
              innerRadius={25}
              outerRadius={55}
              paddingAngle={2}
            />
          </PieChart>
        </ChartContainer>

        <div className="space-y-2 w-full max-w-xs">
          {chartData.map((item) => {
            const configKey = item.category
              .toLowerCase()
              .replace(/\s+/g, "-") as keyof typeof chartConfig;
            const config = chartConfig[configKey];
            const color =
              config && "color" in config ? config.color : "#6b7280";

            return (
              <div
                key={item.category}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-600">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.percentage}%</div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
