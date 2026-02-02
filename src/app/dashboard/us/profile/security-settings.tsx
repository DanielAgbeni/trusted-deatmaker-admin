// src/app/dashboard/us/profile/security-settings.tsx
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
} from "lucide-react";
import { toast } from "sonner";

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

interface SecuritySettingsProps {
  userProfile: {
    verification: {
      email: boolean;
      phone: boolean;
      kyc: boolean;
    };
    // preferences?: {
    //   twoFactorAuth?: boolean;
    //   loginAlerts?: boolean;
    // };
  };
}

export default function SecuritySettings({
  userProfile,
}: SecuritySettingsProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [twoFactorEnabled, setTwoFactorEnabled] = useState(userProfile.preferences?.twoFactorAuth || false);
  // const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(userProfile.preferences?.loginAlerts || true);

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
        description: "Your password has been changed successfully.",
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

  // const handleTwoFactorToggle = async (enabled: boolean) => {
  //   try {
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 500));
  //     setTwoFactorEnabled(enabled);

  //     toast.success(enabled ? "2FA Enabled" : "2FA Disabled", {
  //       description: enabled
  //         ? "Two-factor authentication has been enabled for your account."
  //         : "Two-factor authentication has been disabled for your account.",
  //     });
  //   } catch (error) {
  //     toast.error("Failed to update 2FA settings");
  //   }
  // };

  // const handleLoginAlertsToggle = async (enabled: boolean) => {
  //   try {
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 500));
  //     setLoginAlertsEnabled(enabled);

  //     toast.success("Settings Updated", {
  //       description: `Login alerts have been ${enabled ? 'enabled' : 'disabled'}.`,
  //     });
  //   } catch (error) {
  //     toast.error("Failed to update login alert settings");
  //   }
  // };

  const sendVerificationEmail = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Verification Email Sent", {
        description: "Please check your email for verification instructions.",
      });
    } catch (error) {
      toast.error("Failed to send verification email");
    }
  };

  const sendVerificationSMS = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Verification SMS Sent", {
        description: "Please check your phone for verification instructions.",
      });
    } catch (error) {
      toast.error("Failed to send verification SMS");
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email Verification */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-xs text-muted-foreground">Verification</p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    userProfile.verification.email ? "default" : "destructive"
                  }
                >
                  {userProfile.verification.email ? "Verified" : "Unverified"}
                </Badge>
                {!userProfile.verification.email && (
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
                  <p className="font-medium text-sm">Phone</p>
                  <p className="text-xs text-muted-foreground">Verification</p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    userProfile.verification.phone ? "default" : "destructive"
                  }
                >
                  {userProfile.verification.phone ? "Verified" : "Unverified"}
                </Badge>
                {!userProfile.verification.phone && (
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

            {/* KYC Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">KYC</p>
                  <p className="text-xs text-muted-foreground">Identity</p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    userProfile.verification.kyc ? "default" : "secondary"
                  }
                >
                  {userProfile.verification.kyc ? "Completed" : "Pending"}
                </Badge>
                {!userProfile.verification.kyc && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs"
                  >
                    Complete KYC
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Security Score */}
          {(!userProfile.verification.email ||
            !userProfile.verification.phone ||
            !userProfile.verification.kyc) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Complete all verification steps to secure your account and
                unlock full functionality.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
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
      Security Preferences
      {/* <Card>
        <CardHeader>
          <CardTitle>Security Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
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
              <div className="text-base font-medium">Login Alerts</div>
              <div className="text-sm text-muted-foreground">
                Get notified when your account is accessed
              </div>
            </div>
            <Switch
              checked={loginAlertsEnabled}
              onCheckedChange={handleLoginAlertsToggle}
            />
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
