// src/app/dashboard/mp/profile/marketplace-profile-overview.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  Shield,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  MarketplaceProfile,
  MarketplaceStats,
} from "@/types/marketplace-profile";
import {
  CurrencyStatCard,
  GeneralStatCard,
} from "@/components/dashboard/stats-card";

interface MarketplaceProfileOverviewProps {
  marketplaceProfile: MarketplaceProfile;
}

// Mock stats data
const mockStats: MarketplaceStats = {
  totalUsers: 18000,
  activeUsers: 16150,
  totalTransactions: 45230,
  totalVolume: "24567890",
  totalCommissions: "876400",
  successRate: "94.2",
  averageTransactionValue: "543",
  pendingDisputes: 12,
};

export default function MarketplaceProfileOverview({
  marketplaceProfile,
}: MarketplaceProfileOverviewProps) {
  const initials = marketplaceProfile.businessName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stats = [
    {
      title: "Total Volume",
      value: mockStats.totalVolume,
      change: { value: "+15.03%", trend: "up" as const },
    },
    {
      title: "Total Commissions",
      value: mockStats.totalCommissions,
      count: mockStats.totalTransactions,
      change: { value: "+8.2%", trend: "up" as const },
    },
    {
      title: "Total Users",
      value: mockStats.totalUsers.toString(),
      change: { value: "+12%", trend: "up" as const },
    },
    {
      title: "Active Users",
      value: mockStats.activeUsers.toString(),
      change: { value: "+6.5%", trend: "up" as const },
    },
    {
      title: "Success Rate",
      value: `${mockStats.successRate}%`,
      change: { value: "+2.1%", trend: "up" as const },
    },
    {
      title: "Avg Transaction",
      value: `₦${mockStats.averageTransactionValue}K`,
      change: { value: "+4.3%", trend: "up" as const },
    },
    {
      title: "Pending Disputes",
      value: mockStats.pendingDisputes.toString(),
      change: { value: "-15%", trend: "down" as const },
    },
    // {
    //   title: "Commission Rate",
    //   value: `${marketplaceProfile.settings.commissionSettings.defaultRate}%`,
    //   change: { value: "0%", trend: "neutral" as const },
    // },
  ];

  const getVerificationCount = () => {
    const verifications = Object.values(marketplaceProfile.verification);
    return verifications.filter(Boolean).length;
  };

  const getSubscriptionColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      case "Cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Basic":
        return "bg-blue-100 text-blue-700";
      case "Professional":
        return "bg-purple-100 text-purple-700";
      case "Enterprise":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.slice(0, 2).map((stat, index) => (
          <CurrencyStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            count={stat.count}
            index={index}
          />
        ))}
        {stats.slice(2, 8).map((stat, index) => (
          <GeneralStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            index={index + 2}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Logo & Basic Info */}
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={marketplaceProfile.logo}
                    alt={marketplaceProfile.businessName}
                  />
                  <AvatarFallback className="bg-blue-500 text-white text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {marketplaceProfile.businessName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {marketplaceProfile.businessInfo.businessType} •{" "}
                    {marketplaceProfile.businessInfo.industry}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">
                        {marketplaceProfile.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Business Email
                      </p>
                    </div>
                  </div>
                  {marketplaceProfile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {marketplaceProfile.phone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Business Phone
                        </p>
                      </div>
                    </div>
                  )}
                  {marketplaceProfile.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {marketplaceProfile.website}
                        </p>
                        <p className="text-xs text-muted-foreground">Website</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {marketplaceProfile.address.city},{" "}
                        {marketplaceProfile.address.state}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {marketplaceProfile.address.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
                  Business Details
                </h4>
                <div className="space-y-3">
                  {marketplaceProfile.businessInfo.registrationNumber && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Registration Number
                      </p>
                      <p className="text-sm font-medium">
                        {marketplaceProfile.businessInfo.registrationNumber}
                      </p>
                    </div>
                  )}
                  {marketplaceProfile.businessInfo.taxId && (
                    <div>
                      <p className="text-xs text-muted-foreground">Tax ID</p>
                      <p className="text-sm font-medium">
                        {marketplaceProfile.businessInfo.taxId}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Member Since
                    </p>
                    <p className="text-sm font-medium">
                      {formatDate(marketplaceProfile.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Login</p>
                    <p className="text-sm font-medium">
                      {formatDate(marketplaceProfile.lastLoginAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Description */}
            {marketplaceProfile.businessInfo.description && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-2">
                  About
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {marketplaceProfile.businessInfo.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status & Verification */}
        <div className="space-y-6">
          {/* Subscription Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Plan</span>
                <Badge
                  className={getPlanColor(marketplaceProfile.subscription.plan)}
                >
                  {marketplaceProfile.subscription.plan}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge
                  className={getSubscriptionColor(
                    marketplaceProfile.subscription.status
                  )}
                >
                  {marketplaceProfile.subscription.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Expires</span>
                <span className="text-sm font-medium">
                  {formatDate(marketplaceProfile.subscription.expiresAt)}
                </span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Manage Subscription
              </Button>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Status
                <Badge variant="secondary" className="ml-auto">
                  {getVerificationCount()}/5 Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Email</span>
                </div>
                <Badge
                  variant={
                    marketplaceProfile.verification.email
                      ? "default"
                      : "destructive"
                  }
                >
                  {marketplaceProfile.verification.email
                    ? "Verified"
                    : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Phone</span>
                </div>
                <Badge
                  variant={
                    marketplaceProfile.verification.phone
                      ? "default"
                      : "destructive"
                  }
                >
                  {marketplaceProfile.verification.phone
                    ? "Verified"
                    : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Business Reg.</span>
                </div>
                <Badge
                  variant={
                    marketplaceProfile.verification.businessRegistration
                      ? "default"
                      : "destructive"
                  }
                >
                  {marketplaceProfile.verification.businessRegistration
                    ? "Verified"
                    : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Bank Account</span>
                </div>
                <Badge
                  variant={
                    marketplaceProfile.verification.bankAccount
                      ? "default"
                      : "destructive"
                  }
                >
                  {marketplaceProfile.verification.bankAccount
                    ? "Verified"
                    : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Compliance</span>
                </div>
                <Badge
                  variant={
                    marketplaceProfile.verification.compliance
                      ? "default"
                      : "destructive"
                  }
                >
                  {marketplaceProfile.verification.compliance
                    ? "Verified"
                    : "Pending"}
                </Badge>
              </div>

              {getVerificationCount() < 5 && (
                <div className="pt-3 border-t">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-amber-700">
                        Incomplete Verification
                      </p>
                      <p className="text-xs text-amber-600">
                        Complete all verifications to unlock full marketplace
                        features.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* <div className="flex items-center justify-between">
                <span className="text-sm">Commission Rate</span>
                <span className="text-sm font-medium">
                  {marketplaceProfile.settings.commissionSettings.defaultRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Withdrawal</span>
                <Badge variant={marketplaceProfile.settings.paymentSettings.autoWithdrawal ? "default" : "secondary"}>
                  {marketplaceProfile.settings.paymentSettings.autoWithdrawal ? "Enabled" : "Disabled"}
                </Badge>
              </div> */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Business Hours</span>
                <Badge
                  variant={
                    marketplaceProfile.settings.operationalSettings
                      .businessHours.enabled
                      ? "default"
                      : "secondary"
                  }
                >
                  {marketplaceProfile.settings.operationalSettings.businessHours
                    .enabled
                    ? "Active"
                    : "24/7"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Currency</span>
                <span className="text-sm font-medium">
                  {marketplaceProfile.settings.operationalSettings.currency}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
