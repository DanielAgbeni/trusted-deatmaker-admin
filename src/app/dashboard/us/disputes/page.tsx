import type { Metadata } from "next"
import ClientDisputesPage from "./client-page"

export const metadata: Metadata = {
  title: "Disputes | Dashboard",
  description: "Manage your disputes and view dispute history",
}

export default function DisputesPage() {
  return <ClientDisputesPage />
}
