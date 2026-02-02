import type { Metadata } from "next";
import ClientUsersPage from "./client-page";

export const metadata: Metadata = {
  title: "User | Dashboard",
  description: "Manage your users and view user history",
};

export default function UsersPage() {
  return <ClientUsersPage />;
}
