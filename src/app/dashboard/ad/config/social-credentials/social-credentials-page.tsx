"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryTable } from "@/components/dashboard/tables";
import { Badge } from "@/components/ui/badge";
import {
  SocialCredential,
  SocialCredentialActions,
  createSocialCredentialColumns,
} from "../../_columns/social-credentials-table-column";
import { CredentialDialog, CredentialFormData } from "./credential-dialog";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, CheckCircle, AlertCircle, XCircle } from "lucide-react";

// Mock data matching the UI
const initialCredentials: SocialCredential[] = [
  {
    id: 1,
    title: "Google",
    clientId:
      "375851363090-59im488kciqvjtqv3ul9jq3hbaktea0.apps.googleusercontent.com",
    clientSecret: "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",
    callbackUrl:
      "https://script.viserlab.com/escrowlab/demo/user/social-login/google/callback",
    status: "enabled",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Facebook",
    clientId: "705296487382875",
    clientSecret: "fb_secret_key_hidden_for_security",
    callbackUrl:
      "https://script.viserlab.com/escrowlab/demo/user/social-login/facebook/callback",
    status: "enabled",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 3,
    title: "LinkedIn",
    clientId: "772tej48e6ezg",
    clientSecret: "linkedin_secret_key_hidden_for_security",
    callbackUrl:
      "https://script.viserlab.com/escrowlab/demo/user/social-login/linkedin/callback",
    status: "enabled",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
];

export default function SocialCredentialsPage() {
  const [credentials, setCredentials] =
    useState<SocialCredential[]>(initialCredentials);
  const [configureDialogOpen, setConfigureDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] =
    useState<SocialCredential | null>(null);

  // Simulate API calls with delays and success/error handling
  const simulateApiCall = async <T,>(
    operation: () => T,
    successMessage: string,
    delay: number = 500
  ): Promise<T> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, delay));

      // 5% chance of simulated error for demo purposes
      if (Math.random() < 0.05) {
        throw new Error("Network error occurred");
      }

      const result = operation();
      toast.success(successMessage);
      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      throw error;
    }
  };

  const handleConfigure = (credential: SocialCredential) => {
    setSelectedCredential(credential);
    setConfigureDialogOpen(true);
  };

  const handleHelp = (credential: SocialCredential) => {
    setSelectedCredential(credential);
    setHelpDialogOpen(true);
  };

  const handleToggleStatus = async (credential: SocialCredential) => {
    try {
      await simulateApiCall(() => {
        setCredentials((prev) =>
          prev.map((c) =>
            c.id === credential.id
              ? {
                  ...c,
                  status: c.status === "enabled" ? "disabled" : "enabled",
                  updatedAt: new Date().toISOString(),
                }
              : c
          )
        );
      }, `${credential.title} ${credential.status === "enabled" ? "disabled" : "enabled"} successfully`);
    } catch (error) {
      // Error already handled by simulateApiCall
    }
  };

  const handleSave = async (data: CredentialFormData) => {
    if (!selectedCredential) return;

    try {
      await simulateApiCall(() => {
        const now = new Date().toISOString();
        setCredentials((prev) =>
          prev.map((c) =>
            c.id === selectedCredential.id
              ? { ...c, ...data, updatedAt: now }
              : c
          )
        );
      }, `${selectedCredential.title} credentials updated successfully`);

      setConfigureDialogOpen(false);
      setSelectedCredential(null);
    } catch (error) {
      // Keep dialog open on error so user can retry
    }
  };

  const getHelpContent = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "google":
        return {
          title: "Google OAuth Setup",
          steps: [
            "Go to the Google Cloud Console (https://console.cloud.google.com/)",
            "Create a new project or select an existing one",
            'Navigate to "APIs & Services" > "Credentials"',
            'Click "Create Credentials" > "OAuth 2.0 Client IDs"',
            "Configure the consent screen if prompted",
            'Select "Web application" as the application type',
            "Add your authorized redirect URIs",
            "Copy the Client ID and Client Secret",
          ],
          docUrl: "https://developers.google.com/identity/protocols/oauth2",
        };
      case "facebook":
        return {
          title: "Facebook OAuth Setup",
          steps: [
            "Go to Facebook for Developers (https://developers.facebook.com/)",
            "Create a new app or select an existing one",
            'Navigate to "Settings" > "Basic"',
            "Copy your App ID and App Secret",
            "Add Facebook Login product to your app",
            "Configure Valid OAuth Redirect URIs",
            "Set your app to Live mode when ready",
          ],
          docUrl: "https://developers.facebook.com/docs/facebook-login",
        };
      case "linkedin":
        return {
          title: "LinkedIn OAuth Setup",
          steps: [
            "Go to LinkedIn Developer Portal (https://www.linkedin.com/developers/)",
            "Create a new app or select an existing one",
            'Navigate to "Auth" tab',
            "Copy your Client ID and Client Secret",
            "Add authorized redirect URLs",
            "Request access to necessary scopes",
            "Submit your app for review if required",
          ],
          docUrl:
            "https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin",
        };
      default:
        return {
          title: "OAuth Setup",
          steps: [
            "Please refer to the provider documentation for setup instructions",
          ],
          docUrl: "#",
        };
    }
  };

  // Create the actions object that will be passed to the table columns
  const credentialActions: SocialCredentialActions = {
    onConfigure: handleConfigure,
    onHelp: handleHelp,
    onToggleStatus: handleToggleStatus,
  };

  // Generate columns with the actions
  const columns = createSocialCredentialColumns(credentialActions);

  const helpContent = selectedCredential
    ? getHelpContent(selectedCredential.title)
    : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Social Login Credentials
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Configure OAuth providers for social login functionality
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {credentials.length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Total Providers</p>
                </div>
                <div className="text-blue-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {credentials.filter((c) => c.status === "enabled").length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Active Providers</p>
                </div>
                <div className="text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {credentials.filter((c) => c.status === "disabled").length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Disabled Providers
                  </p>
                </div>
                <div className="text-red-600">
                  <XCircle className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Social Login Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HistoryTable columns={columns} data={credentials} />
          </CardContent>
        </Card>

        {/* Configure Dialog */}
        <CredentialDialog
          open={configureDialogOpen}
          onOpenChange={setConfigureDialogOpen}
          credential={selectedCredential}
          onSave={handleSave}
        />

        {/* Help Dialog */}
        <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                {helpContent?.title}
                {helpContent?.docUrl !== "#" && (
                  <button
                    onClick={() =>
                      helpContent && window.open(helpContent.docUrl, "_blank")
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
              </DialogTitle>
              <DialogDescription>
                Follow these steps to set up {selectedCredential?.title} OAuth
                integration.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-3">
                {helpContent?.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Important:</p>
                    <p className="text-amber-700">
                      Make sure to add the correct callback URL to your OAuth
                      application settings. The callback URL must match exactly
                      what&apos;s configured in your {selectedCredential?.title}{" "}
                      app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
