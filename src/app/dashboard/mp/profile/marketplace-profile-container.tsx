// src/app/dashboard/mp/profile/marketplace-profile-container.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketplaceProfileOverview from "./marketplace-profile-overview";
import MarketplaceProfileForm from "./marketplace-profile-form";
import MarketplaceSecuritySettings from "./marketplace-security-settings";
import {
  MarketplaceProfile,
  MarketplaceFormData,
} from "@/types/marketplace-profile";

// Mock data - in real app, this would come from API/database
const mockMarketplaceProfile: MarketplaceProfile = {
  id: "marketplace-123",
  businessName: "TechHub Marketplace",
  email: "admin@techhub.com",
  phone: "+234-901-234-567",
  website: "https://techhub.com",
  logo: "/marketplace-logos/techhub.jpg",
  businessInfo: {
    registrationNumber: "RC123456789",
    taxId: "TIN987654321",
    businessType: "Corporation",
    industry: "Technology",
    description:
      "A leading technology marketplace connecting buyers and sellers across Africa",
  },
  address: {
    street: "Plot 15, Admiralty Way",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    postalCode: "101001",
  },
  settings: {
    notificationSettings: {
      email: true,
      sms: true,
    },
    operationalSettings: {
      timezone: "Africa/Lagos",
      currency: "NGN",
      language: "en",
      businessHours: {
        enabled: true,
        start: "08:00",
        end: "18:00",
        daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      },
    },
  },
  verification: {
    email: true,
    phone: true,
    businessRegistration: true,
    bankAccount: true,
    compliance: false,
  },
  subscription: {
    plan: "Professional",
    status: "Active",
    expiresAt: "2025-12-31T23:59:59Z",
    features: [
      "unlimited_users",
      "advanced_analytics",
      "api_access",
      "priority_support",
    ],
  },
  createdAt: "2023-06-15T10:00:00Z",
  lastLoginAt: "2024-03-27T14:39:00Z",
};

export default function MarketplaceProfileContainer() {
  const [marketplaceProfile, setMarketplaceProfile] =
    useState<MarketplaceProfile>(mockMarketplaceProfile);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (formData: MarketplaceFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update marketplace profile
      const updatedProfile: MarketplaceProfile = {
        ...marketplaceProfile,
        businessName: formData.businessInfo.businessName,
        email: formData.businessInfo.email,
        phone: formData.businessInfo.phone,
        website: formData.businessInfo.website,
        businessInfo: {
          ...marketplaceProfile.businessInfo,
          registrationNumber: formData.businessInfo.registrationNumber,
          taxId: formData.businessInfo.taxId,
          businessType: formData.businessInfo.businessType,
          industry: formData.businessInfo.industry,
          description: formData.businessInfo.description,
        },
        address: formData.address,
        settings: {
          ...marketplaceProfile.settings,
          notificationSettings: formData.notificationSettings,
          operationalSettings: formData.operationalSettings,
        },
      };

      setMarketplaceProfile(updatedProfile);

      toast.success("Profile Updated", {
        description: "Your marketplace profile has been updated successfully.",
      });
    } catch (error) {
      toast.error("Update Failed", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="business">Business Info</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <MarketplaceProfileOverview marketplaceProfile={marketplaceProfile} />
      </TabsContent>

      <TabsContent value="business" className="space-y-6">
        <MarketplaceProfileForm
          marketplaceProfile={marketplaceProfile}
          isLoading={isLoading}
          onSubmit={handleProfileUpdate}
          activeSection="business"
        />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <MarketplaceProfileForm
          marketplaceProfile={marketplaceProfile}
          isLoading={isLoading}
          onSubmit={handleProfileUpdate}
          activeSection="settings"
        />
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <MarketplaceSecuritySettings marketplaceProfile={marketplaceProfile} />
      </TabsContent>
    </Tabs>
  );
}