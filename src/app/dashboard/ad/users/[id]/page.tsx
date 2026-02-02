"use client";

import React, { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";
import { useParams, notFound } from "next/navigation";
import { Loader2, User as UserIcon, Mail, Phone, ShieldCheck, ShieldAlert, Wallet, TrendingUp, TrendingDown, Minus, UserMinus, UserCheck } from "lucide-react";
import { useGetUserDetailsQuery, useUpdateUserStatusMutation } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { toast } from "sonner";
import {
  CurrencyStatCard,
  GeneralStatCard,
} from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";

// Generic Input Field Component
interface InfoFieldProps {
  id: string;
  label: string;
  value: string;
  type?: "text" | "email" | "tel";
  prefix?: ReactNode;
  className?: string;
  readOnly?: boolean;
}

const InfoField = ({
  id,
  label,
  value,
  type = "text",
  prefix,
  className = "",
  readOnly = true,
}: InfoFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <div className="flex">
      {prefix && (
        <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-md">
          {prefix}
        </div>
      )}
      <Input
        id={id}
        type={type}
        value={value || "N/A"}
        className={`bg-gray-50 border-gray-200 ${prefix ? "rounded-l-none" : ""
          } ${className}`}
        readOnly={readOnly}
      />
    </div>
  </div>
);

export default function UserDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const userId = id?.startsWith("%23") || id?.startsWith("#")
    ? (id.startsWith("%23") ? id.substring(3) : id.substring(1))
    : id;

  const { data: response, isLoading, error } = useGetUserDetailsQuery(userId);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();
  const user = response?.data;

  const handleToggleStatus = async () => {
    if (!user) return;
    try {
      await updateStatus({ id: user.id, active: !user.active }).unwrap();
      toast.success(`User ${user.active ? "deactivated" : "activated"} successfully`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update user status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-muted-foreground font-medium">Fetching User 360° View...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">User Not Found</h2>
          <p className="text-muted-foreground">We couldn't find the user you're looking for or an error occurred.</p>
        </div>
      </div>
    );
  }

  // Transformation for Stat Cards
  const stats = [
    {
      title: "Wallet Balance",
      value: user.walletBalance?.toString() || "0",
      currency: user.currency || "NGN",
    },
    {
      title: "Total Deposits",
      value: user.totalDepositsCount?.value?.toString() || "0",
      change: user.totalDepositsCount ? {
        value: `${user.totalDepositsCount.percentageChange > 0 ? '+' : ''}${user.totalDepositsCount.percentageChange}%`,
        trend: (user.totalDepositsCount.trend?.toLowerCase() as "up" | "down" | "neutral") || "neutral"
      } : undefined,
    },
    {
      title: "Total Withdrawals",
      value: user.totalWithdrawalsCount?.value?.toString() || "0",
      change: user.totalWithdrawalsCount ? {
        value: `${user.totalWithdrawalsCount.percentageChange > 0 ? '+' : ''}${user.totalWithdrawalsCount.percentageChange}%`,
        trend: (user.totalWithdrawalsCount.trend?.toLowerCase() as "up" | "down" | "neutral") || "neutral"
      } : undefined,
    },
    {
      title: "Escrow Deals",
      value: user.totalEscrowDealsCount?.value?.toString() || "0",
      change: user.totalEscrowDealsCount ? {
        value: `${user.totalEscrowDealsCount.percentageChange > 0 ? '+' : ''}${user.totalEscrowDealsCount.percentageChange}%`,
        trend: (user.totalEscrowDealsCount.trend?.toLowerCase() as "up" | "down" | "neutral") || "neutral"
      } : undefined,
    },
  ];

  const verificationStatuses = [
    { label: "Email Verification", status: user.emailVerified ? "Verified" : "Unverified", verified: user.emailVerified },
    { label: "Phone Verification", status: user.phone ? "Captured" : "Not Provided", verified: !!user.phone },
    { label: "2FA Verification", status: user.twoFactorEnabled ? "Enabled" : "Disabled", verified: user.twoFactorEnabled },
    { label: "KYC Status", status: user.kycStatus === "VERIFIED" ? "Verified" : user.kycStatus, verified: user.kycStatus === "VERIFIED" },
  ];

  return (
    <div className="container p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">User Details</h1>
          {/* <p className="text-muted-foreground text-sm uppercase font-medium tracking-wider mt-1">ID: {user.id}</p> */}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={user.active ? "destructive" : "outline"}
            size="sm"
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : user.active ? (
              <UserMinus className="h-4 w-4" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
            {user.active ? "Deactivate" : "Activate"}
          </Button>
          <Badge variant="outline" className={`px-4 py-1 flex items-center gap-2 ${user.kycStatus === 'VERIFIED' ? 'border-green-200 text-green-700 bg-green-50' : 'border-yellow-200 text-yellow-700 bg-yellow-50'}`}>
            <div className={`h-2 w-2 rounded-full ${user.kycStatus === 'VERIFIED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
            KYC: {user.kycStatus}
          </Badge>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CurrencyStatCard
          title={stats[0].title}
          value={stats[0].value}
          index={0}
        />
        {stats.slice(1, 3).map((stat, index) => (
          <GeneralStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            index={index + 1}
          />
        ))}
        <GeneralStatCard
          key={stats[3].title}
          title={stats[3].title}
          value={stats[3].value}
          change={stats[3].change}
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField
                id="firstName"
                label="First Name"
                value={user.firstName}
              />
              <InfoField
                id="lastName"
                label="Last Name"
                value={user.lastName}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField
                id="email"
                label="Email Address"
                value={user.email}
                type="email"
                prefix={<Mail className="h-4 w-4 text-gray-400" />}
              />
              <InfoField
                id="mobile"
                label="Phone Number"
                value={user.phone}
                type="tel"
                prefix={<Phone className="h-4 w-4 text-gray-400" />}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField
                id="bvn"
                label="BVN (Locked)"
                value={user.bvn ? `******${user.bvn.slice(-4)}` : "Not provided"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Verification & Security */}
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {verificationStatuses.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                <Badge
                  variant={item.verified ? "default" : "secondary"}
                  className={`px-3 ${item.verified
                    ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200"
                    } font-semibold`}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
