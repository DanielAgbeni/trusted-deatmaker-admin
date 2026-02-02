import type { Metadata } from "next"
import ClientDealDetailPage from "./client-page"

export const metadata: Metadata = {
  title: "Deal Details | Dashboard",
  description: "View detailed information about a specific deal",
}

export default function DealDetailPage() {
  return <ClientDealDetailPage />
}
