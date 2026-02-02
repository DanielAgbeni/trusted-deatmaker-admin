// src/app/dashboard/us/profile/profile-overview.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Edit,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { UserProfile, UserProfileStats } from "@/types/user-profile";
import {
  CurrencyStatCard,
  GeneralStatCard,
} from "@/components/dashboard/stats-card";

interface ProfileOverviewProps {
  userProfile: UserProfile;
  isEditing: boolean;
  onEditToggle: () => void;
}

// Mock stats data
const mockStats: UserProfileStats = {
  totalTransactions: 156,
  completedTransactions: 142,
  totalVolume: "2400000",
  successRate: "91.0",
};

export default function ProfileOverview({
  userProfile,
  isEditing,
  onEditToggle,
}: ProfileOverviewProps) {
  const initials = userProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = [
    {
      title: "Total Volume",
      value: mockStats.totalVolume,
      change: { value: "+15.03%", trend: "up" as const },
    },
    {
      title: "Success Rate",
      value: `${mockStats.successRate}%`,
      change: { value: "+2.1%", trend: "up" as const },
    },
    {
      title: "Total Transactions",
      value: mockStats.totalTransactions.toString(),
      change: { value: "+12%", trend: "up" as const },
    },
    {
      title: "Completed",
      value: mockStats.completedTransactions.toString(),
      change: { value: "+8.5%", trend: "up" as const },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CurrencyStatCard
          title={stats[0].title}
          value={stats[0].value}
          change={stats[0].change}
          index={0}
        />
        <GeneralStatCard
          title={stats[1].title}
          value={stats[1].value}
          change={stats[1].change}
          index={1}
        />
        <GeneralStatCard
          title={stats[2].title}
          value={stats[2].value}
          change={stats[2].change}
          index={2}
        />
        <GeneralStatCard
          title={stats[3].title}
          value={stats[3].value}
          change={stats[3].change}
          index={3}
        />
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Profile Information
          </CardTitle>
          {/* <Button 
            variant="outline" 
            size="sm"
            onClick={onEditToggle}
            disabled={isEditing}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {isEditing ? "Editing..." : "Edit Profile"}
          </Button> */}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback className="bg-blue-500 text-white text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{userProfile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(userProfile.createdAt).getFullYear()}
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
                    <p className="text-sm font-medium">{userProfile.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Email Address
                    </p>
                  </div>
                </div>
                {userProfile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{userProfile.phone}</p>
                      <p className="text-xs text-muted-foreground">
                        Phone Number
                      </p>
                    </div>
                  </div>
                )}
                {userProfile.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {userProfile.address.city}, {userProfile.address.state}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userProfile.address.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Verification */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
                Account Status
              </h4>
              <div className="space-y-3">
                {/* Verification Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Verification</span>
                    <Badge
                      variant={
                        userProfile.verification.email
                          ? "default"
                          : "destructive"
                      }
                    >
                      {userProfile.verification.email
                        ? "Verified"
                        : "Unverified"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone Verification</span>
                    <Badge
                      variant={
                        userProfile.verification.phone
                          ? "default"
                          : "destructive"
                      }
                    >
                      {userProfile.verification.phone
                        ? "Verified"
                        : "Unverified"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">KYC Status</span>
                    <Badge
                      variant={
                        userProfile.verification.kyc ? "default" : "secondary"
                      }
                    >
                      {userProfile.verification.kyc ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                </div>

                {/* Last Login */}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      Last login: {formatDate(userProfile.lastLoginAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
