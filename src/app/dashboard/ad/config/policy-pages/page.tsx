import type { Metadata } from "next";
import PolicyPagesPage from "./policy-pages-page";

export const metadata: Metadata = {
  title: "Policy Pages | Dashboard",
  description: "Manage legal documents and policy content for your platform",
};

export default function PolicyPagesMainPage() {
  return <PolicyPagesPage />;
}