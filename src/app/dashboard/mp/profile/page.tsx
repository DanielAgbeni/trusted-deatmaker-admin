// src/app/dashboard/mp/profile/page.tsx
import type { Metadata } from "next";
import MarketplaceProfileContainer from "./marketplace-profile-container";

export const metadata: Metadata = {
  title: "Marketplace Profile | Dashboard",
  description: "Manage your marketplace profile, business settings and operational preferences",
};

export default function MarketplaceProfilePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace Profile</h1>
          <p className="text-muted-foreground">
            Manage your business information, commission settings, and operational preferences
          </p>
        </div>
      </div>
      <MarketplaceProfileContainer />
    </div>
  );
}