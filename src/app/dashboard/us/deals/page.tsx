import type { Metadata } from "next"
import ClientDealsPage from "./client-page"

export const metadata: Metadata = {
  title: "Deals | Dashboard",
  description: "Manage your deals and view deal history",
}

export default function DealsPage() {
  return <ClientDealsPage />
}
