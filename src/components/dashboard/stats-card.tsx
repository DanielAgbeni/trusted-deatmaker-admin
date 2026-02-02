import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn, formatCountValue, formatCurrency } from "@/lib/utils";
import { CardHeader, CardTitle } from "@/components/ui/card";

// Base interface for common props
interface BaseStatCardProps {
  title: string;
  index: number;
  count?: number;
  change?: {
    trend: "up" | "down" | "neutral";
    value: string;
  };
}

// Currency-specific props
interface CurrencyStatCardProps extends BaseStatCardProps {
  type: "currency";
  value: string | number;
}

// General value props (for non-currency data)
interface GeneralStatCardProps extends BaseStatCardProps {
  type: "general";
  value: string | number;
  formatter?: (value: string | number) => string;
}

// Union type for all possible props
type StatCardProps = CurrencyStatCardProps | GeneralStatCardProps;

// Main StatCard component - NO CHANGES to the rendering logic
export function StatCard(props: StatCardProps) {
  const { title, index, count, change } = props;

  // Render value based on type
  const renderValue = () => {
    if (props.type === "currency") {
      const { amount, decimal } = formatCurrency(props.value);
      return (
        <p className="text-2xl font-bold">
          {amount}
          <span className="text-sm font-medium">
            {"."}
            {decimal}
          </span>
        </p>
      );
    } else {
      const displayValue = props.formatter
        ? props.formatter(props.value)
        : props.value.toString();

      return <p className="text-2xl font-bold">{displayValue}</p>;
    }
  };

  return (
    <Card
      className={cn(
        index % 2 === 0 ? "bg-secondary" : "bg-accent",
        "shadow-none gap-4 "
      )}
    >
      <CardHeader className="pb-2 px-3">
        <CardTitle className="text-sm font-medium">
          {title}{" "}
          {count !== undefined && count > 0 && (
            <span className="text-xs font-normal text-muted-foreground">
              ({formatCountValue(count)})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3">
        <div className="flex items-baseline">
          {renderValue()}
          {/* {change && (
            <div
              className={cn(
                "flex items-center text-xs",
                change.trend === "up" && "text-green-600",
                change.trend === "down" && "text-red-600",
                change.trend === "neutral" && "text-gray-500"
              )}
            >
              {change.trend === "up" && <ArrowUp className="h-3 w-3 mr-1" />}
              {change.trend === "down" && (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {change.value}
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
}

// Alternative: Separate components approach - NO CHANGES
export function CurrencyStatCard({
  title,
  value,
  change,
  index,
  count,
}: {
  title: string;
  value: number | string;
  change?: { trend: "up" | "down" | "neutral"; value: string };
  index: number;
  count?: number;
}) {
  return (
    <StatCard
      type="currency"
      title={title}
      value={value}
      change={change}
      index={index}
      count={count}
    />
  );
}

export function GeneralStatCard({
  title,
  value,
  change,
  index,
  count,
  formatter,
}: {
  title: string;
  value: string | number;
  change?: { trend: "up" | "down" | "neutral"; value: string };
  index: number;
  count?: number;
  formatter?: (value: string | number) => string;
}) {
  return (
    <StatCard
      type="general"
      title={title}
      value={value}
      change={change}
      index={index}
      count={count}
      formatter={formatter}
    />
  );
}

interface StatCardV1Props {
  title: string;
  value: string | number;
  className?: string;
  currency?: string;
}

export function StatCardV1({
  title,
  value,
  className,
  currency = "₦",
}: StatCardV1Props) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <Card
      className={cn(
        "border-2 border-cyan-400 bg-gray-50/50 rounded-2xl p-6",
        className
      )}
    >
      <CardContent className="p-0 space-y-3">
        <div className="space-y-1">
          <h3 className="text-gray-500 text-base font-normal">{title}</h3>
          <div className="w-8 h-1 bg-blue-600 rounded-full" />
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {currency}
          {formattedValue}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardV2({
  title,
  value,
  className,
  currency = "₦",
}: StatCardV1Props) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div
      className={cn(
        "border-2 border-cyan-400 bg-gray-50/50 rounded-2xl px-6 py-2",
        className
      )}
    >
      <CardContent className="p-0 space-y-3">
        <div className="space-y-1">
          <h3 className="text-gray-500 text-base font-normal">{title}</h3>
          <div className="w-8 h-1 bg-blue-600 rounded-full" />
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {currency}
          {formattedValue}
        </div>
      </CardContent>
    </div>
  );
}