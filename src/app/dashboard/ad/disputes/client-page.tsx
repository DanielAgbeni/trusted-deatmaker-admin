"use client";

import DisputeStats from "@/app/dashboard/ad/disputes/dispute-stats";
import DisputeHistory from "@/app/dashboard/ad/disputes/dispute-history";

export default function ClientDisputesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <DisputeStats />

      <DisputeHistory />
    </div>
  );
}
