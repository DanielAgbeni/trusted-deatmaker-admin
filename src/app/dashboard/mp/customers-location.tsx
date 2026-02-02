import { LocationChart } from "@/components/dashboard/charts";

export type LocationData = {
  country: string;
  percentage: number;
  fill: string;
};

export default function CustomersLocation() {
  const chartData: LocationData[] = [
    {
      country: "United States",
      percentage: 38.6,
      fill: "var(--color-united-states)",
    },
    { country: "Canada", percentage: 22.5, fill: "var(--color-canada)" },
    { country: "Mexico", percentage: 30.8, fill: "var(--color-mexico)" },
    { country: "Other", percentage: 8.1, fill: "var(--color-other)" },
  ];

  return <LocationChart title="Users" chartData={chartData} />;
}
