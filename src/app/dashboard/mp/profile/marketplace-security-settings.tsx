// src/app/dashboard/mp/profile/marketplace-security-settings.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Key,
  Smartphone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Building2,
  DollarSign,
  Users,
  Lock,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { MarketplaceProfile } from "@/types/marketplace-profile";

// Password change schema
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface MarketplaceSecuritySettingsProps {
  marketplaceProfile: MarketplaceProfile;
}

export default function MarketplaceSecuritySettings({
  marketplaceProfile,
}: MarketplaceSecuritySettingsProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [adminLoginAlerts, setAdminLoginAlerts] = useState(true);
  const [suspiciousActivityAlerts, setSuspiciousActivityAlerts] =
    useState(true);
  const [dataBackupEnabled, setDataBackupEnabled] = useState(true);
  const [apiAccessLogging, setApiAccessLogging] = useState(true);

  const form = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordChange = async (
    data: z.infer<typeof passwordChangeSchema>
  ) => {
    setIsChangingPassword(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Password Updated", {
        description: "Your admin password has been changed successfully.",
      });

      form.reset();
    } catch (error) {
      toast.error("Password Change Failed", {
        description: "Failed to update password. Please try again.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTwoFactorEnabled(enabled);

      toast.success(enabled ? "2FA Enabled" : "2FA Disabled", {
        description: enabled
          ? "Two-factor authentication has been enabled for admin access."
          : "Two-factor authentication has been disabled for admin access.",
      });
    } catch (error) {
      toast.error("Failed to update 2FA settings");
    }
  };

  const handleSecurityToggle = async (
    setting: string,
    enabled: boolean,
    setter: (value: boolean) => void
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setter(enabled);

      toast.success("Settings Updated", {
        description: `${setting} has been ${enabled ? "enabled" : "disabled"}.`,
      });
    } catch (error) {
      toast.error(`Failed to update ${setting.toLowerCase()} settings`);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Verification Email Sent", {
        description:
          "Please check your business email for verification instructions.",
      });
    } catch (error) {
      toast.error("Failed to send verification email");
    }
  };

  const sendVerificationSMS = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Verification SMS Sent", {
        description:
          "Please check your business phone for verification instructions.",
      });
    } catch (error) {
      toast.error("Failed to send verification SMS");
    }
  };

  const initiateComplianceReview = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Compliance Review Initiated", {
        description:
          "Your compliance review request has been submitted. You will be contacted within 2-3 business days.",
      });
    } catch (error) {
      toast.error("Failed to initiate compliance review");
    }
  };

  const getVerificationCount = () => {
    const verifications = Object.values(marketplaceProfile.verification);
    return verifications.filter(Boolean).length;
  };

  const getSecurityScore = () => {
    let score = 0;
    const totalChecks = 10;

    // Basic verifications
    if (marketplaceProfile.verification.email) score++;
    if (marketplaceProfile.verification.phone) score++;
    if (marketplaceProfile.verification.businessRegistration) score++;
    if (marketplaceProfile.verification.bankAccount) score++;
    if (marketplaceProfile.verification.compliance) score++;

    // Security settings
    if (twoFactorEnabled) score++;
    if (adminLoginAlerts) score++;
    if (suspiciousActivityAlerts) score++;
    if (dataBackupEnabled) score++;
    if (apiAccessLogging) score++;

    return Math.round((score / totalChecks) * 100);
  };

  const securityScore = getSecurityScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Overview
            <Badge
              variant="outline"
              className={`ml-auto ${getScoreColor(securityScore)}`}
            >
              Security Score: {securityScore}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Email Verification */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Business Email</p>
                  <p className="text-xs text-muted-foreground">Verification</p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    marketplaceProfile.verification.email
                      ? "default"
                      : "destructive"
                  }
                >
                  {marketplaceProfile.verification.email
                    ? "Verified"
                    : "Unverified"}
                </Badge>
                {!marketplaceProfile.verification.email && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs"
                    onClick={sendVerificationEmail}
                  >
                    Verify Now
                  </Button>
                )}
              </div>
            </div>

            {/* Phone Verification */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Business Phone</p>
                  <p className="text-xs text-muted-foreground">Verification</p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    marketplaceProfile.verification.phone
                      ? "default"
                      : "destructive"
                  }
                >
                  {marketplaceProfile.verification.phone
                    ? "Verified"
                    : "Unverified"}
                </Badge>
                {!marketplaceProfile.verification.phone && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs"
                    onClick={sendVerificationSMS}
                  >
                    Verify Now
                  </Button>
                )}
              </div>
            </div>

            {/* Business Registration */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Business Registration</p>
                  <p className="text-xs text-muted-foreground">
                    Legal Verification
                  </p>
                </div>
              </div>
              <div className="text-right">
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
            </div>

            {/* Bank Account */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Bank Account</p>
                  <p className="text-xs text-muted-foreground">
                    Payment Verification
                  </p>
                </div>
              </div>
              <div className="text-right">
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
            </div>

            {/* Compliance */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Compliance Review</p>
                  <p className="text-xs text-muted-foreground">
                    Regulatory Check
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    marketplaceProfile.verification.compliance
                      ? "default"
                      : "secondary"
                  }
                >
                  {marketplaceProfile.verification.compliance
                    ? "Completed"
                    : "Pending"}
                </Badge>
                {!marketplaceProfile.verification.compliance && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs"
                    onClick={initiateComplianceReview}
                  >
                    Request Review
                  </Button>
                )}
              </div>
            </div>

            {/* Two-Factor Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Two-Factor Auth</p>
                  <p className="text-xs text-muted-foreground">
                    Admin Security
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Security Alert */}
          {securityScore < 80 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your security score is below recommended levels. Complete the
                remaining verification steps and enable additional security
                features to improve your marketplace security.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Change Admin Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Admin Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onPasswordChange)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="flex items-center gap-2"
              >
                {isChangingPassword && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {isChangingPassword
                  ? "Updating Password..."
                  : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Advanced Security Settings */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Advanced Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">
                Add an extra layer of security to admin accounts
              </div>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base font-medium">Admin Login Alerts</div>
              <div className="text-sm text-muted-foreground">
                Get notified when admin accounts are accessed
              </div>
            </div>
            <Switch
              checked={adminLoginAlerts}
              onCheckedChange={(enabled) => handleSecurityToggle("Admin login alerts", enabled, setAdminLoginAlerts)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base font-medium">Suspicious Activity Alerts</div>
              <div className="text-sm text-muted-foreground">
                Monitor and alert on unusual marketplace activity
              </div>
            </div>
            <Switch
              checked={suspiciousActivityAlerts}
              onCheckedChange={(enabled) => handleSecurityToggle("Suspicious activity alerts", enabled, setSuspiciousActivityAlerts)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base font-medium">Automated Data Backup</div>
              <div className="text-sm text-muted-foreground">
                Automatically backup marketplace data daily
              </div>
            </div>
            <Switch
              checked={dataBackupEnabled}
              onCheckedChange={(enabled) => handleSecurityToggle("Data backup", enabled, setDataBackupEnabled)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base font-medium">API Access Logging</div>
              <div className="text-sm text-muted-foreground">
                Log all API access attempts for security auditing
              </div>
            </div>
            <Switch
              checked={apiAccessLogging}
              onCheckedChange={(enabled) => handleSecurityToggle("API access logging", enabled, setApiAccessLogging)}
            />
          </div>
        </CardContent>
      </Card> */}

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityScore < 100 && (
              <div className="space-y-2">
                <h4 className="font-medium">To improve your security:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {!marketplaceProfile.verification.email && (
                    <li>Verify your business email address</li>
                  )}
                  {!marketplaceProfile.verification.phone && (
                    <li>Verify your business phone number</li>
                  )}
                  {!marketplaceProfile.verification.compliance && (
                    <li>Complete the compliance review process</li>
                  )}
                  {!twoFactorEnabled && (
                    <li>Enable two-factor authentication for admin accounts</li>
                  )}
                  {!adminLoginAlerts && <li>Enable admin login alerts</li>}
                  {!suspiciousActivityAlerts && (
                    <li>Enable suspicious activity monitoring</li>
                  )}
                </ul>
              </div>
            )}

            {securityScore >= 100 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Excellent! Your marketplace security is fully optimized.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
