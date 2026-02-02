"use client";

import DisputeStats from "@/app/dashboard/us/disputes/dispute-stats";
import DisputeHistory from "@/app/dashboard/us/disputes/dispute-history";
import DisputeDialog from "@/app/dashboard/us/disputes/dispute-dialog";
import { Button } from "@/components/ui/button";

export default function ClientDisputesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <DisputeStats />

      <div>
        <DisputeDialog
          trigger={<Button>Create Dispute</Button>}
          onSubmit={async (values) => {
            // In a real app, this would be an API call
            console.log("Dispute created:", values);
          }}
        />
      </div>

      <DisputeHistory />
    </div>
  );
}
