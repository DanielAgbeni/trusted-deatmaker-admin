import type { Metadata } from "next";
import CurrencySettingsPage from "./currency-settings-page";

export const metadata: Metadata = {
  title: "Currency Settings | Dashboard",
  description: "Manage currencies and exchange rates for the platform",
};

export default function CurrencySettingsMainPage() {
  return <CurrencySettingsPage />;
}