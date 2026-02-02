"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Copy, ExternalLink } from "lucide-react";
import { SocialCredential } from "../../_columns/social-credentials-table-column";

export interface CredentialFormData {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  status: "enabled" | "disabled";
}

interface CredentialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credential: SocialCredential | null;
  onSave: (data: CredentialFormData) => void;
}

export function CredentialDialog({
  open,
  onOpenChange,
  credential,
  onSave,
}: CredentialDialogProps) {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [status, setStatus] = useState<"enabled" | "disabled">("enabled");
  const [showSecret, setShowSecret] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (credential) {
      setClientId(credential.clientId);
      setClientSecret(credential.clientSecret);
      setCallbackUrl(credential.callbackUrl);
      setStatus(credential.status);
    } else {
      setClientId("");
      setClientSecret("");
      setCallbackUrl("");
      setStatus("enabled");
    }
    setErrors({});
    setShowSecret(false);
  }, [credential, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clientId.trim()) {
      newErrors.clientId = "Client ID is required";
    }

    if (!clientSecret.trim()) {
      newErrors.clientSecret = "Client Secret is required";
    }

    if (!callbackUrl.trim()) {
      newErrors.callbackUrl = "Callback URL is required";
    } else {
      try {
        new URL(callbackUrl);
      } catch {
        newErrors.callbackUrl = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim(),
      callbackUrl: callbackUrl.trim(),
      status,
    });

    handleClose();
  };

  const handleClose = () => {
    setClientId("");
    setClientSecret("");
    setCallbackUrl("");
    setStatus("enabled");
    setErrors({});
    setShowSecret(false);
    onOpenChange(false);
  };

  const getProviderDocUrl = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case "google":
        return "https://developers.google.com/identity/protocols/oauth2";
      case "facebook":
        return "https://developers.facebook.com/docs/facebook-login";
      case "linkedin":
        return "https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin";
      default:
        return "#";
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold flex items-center justify-center gap-2">
            Update Credential: {credential?.title?.toLowerCase() || "provider"}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() =>
                window.open(
                  getProviderDocUrl(credential?.title || ""),
                  "_blank"
                )
              }
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <div className="w-16 h-0.5 bg-blue-500 mx-auto mt-2"></div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="clientId" className="text-sm font-medium">
              Client ID <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder={`Enter ${credential?.title} Client ID`}
                className={`w-full pr-10 ${
                  errors.clientId ? "border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => copyToClipboard(clientId, "Client ID")}
                disabled={!clientId}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            {errors.clientId && (
              <p className="text-sm text-red-500">{errors.clientId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientSecret" className="text-sm font-medium">
              Client Secret <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="clientSecret"
                type={showSecret ? "text" : "password"}
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder={`Enter ${credential?.title} Client Secret`}
                className={`w-full pr-20 ${
                  errors.clientSecret ? "border-red-500" : ""
                }`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(clientSecret, "Client Secret")}
                  disabled={!clientSecret}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {errors.clientSecret && (
              <p className="text-sm text-red-500">{errors.clientSecret}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="callbackUrl" className="text-sm font-medium">
              Callback URL <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="callbackUrl"
                value={callbackUrl}
                onChange={(e) => setCallbackUrl(e.target.value)}
                placeholder="https://your-domain.com/auth/callback"
                className={`w-full pr-10 ${
                  errors.callbackUrl ? "border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => copyToClipboard(callbackUrl, "Callback URL")}
                disabled={!callbackUrl}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            {errors.callbackUrl && (
              <p className="text-sm text-red-500">{errors.callbackUrl}</p>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Enable Provider
            </Label>
            <Switch
              id="status"
              checked={status === "enabled"}
              className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-blue-500"
              onCheckedChange={(checked) =>
                setStatus(checked ? "enabled" : "disabled")
              }
            />
          </div>

          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
            <strong>Setup Instructions:</strong>
            <br />
            1. Create an OAuth application in your {credential?.title} Developer
            Console
            <br />
            2. Copy the Client ID and Client Secret from your application
            settings
            <br />
            3. Add the callback URL to your application&apos;s authorized
            redirect URIs
            <br />
            4. Save the configuration to enable {credential?.title} login
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={
              !clientId.trim() || !clientSecret.trim() || !callbackUrl.trim()
            }
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
