import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number | string,
  currency: string = "NGN"
): { amount: string; decimal: string } {
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return { amount: value.toString(), decimal: "00" };
  }
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
  };
  const formatted = new Intl.NumberFormat("en-NG", options).format(numValue);
  const [amount, decimal] = formatted.split(".");
  return { amount, decimal: decimal || "00" };
}

export function formatCountValue(value: number | string): string {
  //format count value to be in thousands or millions
  const numValue = Number(value);
  if (numValue >= 1_000_000) {
    return `${(numValue / 1_000_000).toFixed(1)}M`;
  }
  if (numValue >= 1_000) {
    return `${(numValue / 1_000).toFixed(1)}K`;
  }
  return numValue.toString();
}
