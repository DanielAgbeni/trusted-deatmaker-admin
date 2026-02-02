import type { Metadata } from "next";
import SocialCredentialsPage from "./social-credentials-page";

export const metadata: Metadata = {
  title: "Social Login Credentials | Dashboard",
  description: "Configure OAuth providers and social login integrations",
};

export default function SocialCredentialsMainPage() {
  return <SocialCredentialsPage />;
}