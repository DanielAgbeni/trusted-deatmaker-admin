import type { Metadata } from "next";
import SystemTimersPage from "./system-timers-page";

export const metadata: Metadata = {
  title: "System Settings | Dashboard",
  description: "Manage system timers and settings for different transaction types",
};

export default function SystemSettingsPage() {
  return <SystemTimersPage />;
}