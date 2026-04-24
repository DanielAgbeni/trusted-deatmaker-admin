"use client";

import UserStats from "./user-stats";
import UserHistory from "./user-history";

export default function ClientUsersPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <UserStats />
      <UserHistory />
    </div>
  );
}
