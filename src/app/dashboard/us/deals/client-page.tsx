"use client";

import DealsHistory from "@/app/dashboard/us/deals/deals-history";

export default function ClientDealsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Deals</h1>
          <p className="text-muted-foreground">
            Manage and view all your deals
          </p>
        </div>
      </div>

      <DealsHistory />
    </div>
  );
}
