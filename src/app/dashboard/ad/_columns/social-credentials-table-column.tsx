"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  HelpCircle,
  PowerOff,
  Power,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

export interface SocialCredential {
  id: number;
  title: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  status: "enabled" | "disabled";
  createdAt: string;
  updatedAt: string;
}

export interface SocialCredentialActions {
  onConfigure: (credential: SocialCredential) => void;
  onHelp: (credential: SocialCredential) => void;
  onToggleStatus: (credential: SocialCredential) => void;
}

// Helper component for masked client ID display
const MaskedClientId = ({ clientId }: { clientId: string }) => {
  const [showFull, setShowFull] = useState(false);
  
  const maskedId = clientId.length > 20 
    ? `${clientId.substring(0, 10)}...${clientId.substring(clientId.length - 10)}`
    : clientId;

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">
        {showFull ? clientId : maskedId}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => setShowFull(!showFull)}
      >
        {showFull ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => navigator.clipboard.writeText(clientId)}
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
};

// Helper component for provider icons
const ProviderIcon = ({ title }: { title: string }) => {
  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'google':
        return 'text-red-500';
      case 'facebook':
        return 'text-blue-600';
      case 'linkedin':
        return 'text-blue-700';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 ${getProviderColor(title)}`}>
        {title.charAt(0).toUpperCase()}
      </div>
      <span className="font-medium">{title}</span>
    </div>
  );
};

export const createSocialCredentialColumns = (actions: SocialCredentialActions): ColumnDef<SocialCredential>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <ProviderIcon title={title} />;
    },
  },
  {
    accessorKey: "clientId",
    header: "Client ID",
    cell: ({ row }) => {
      const clientId = row.getValue("clientId") as string;
      return <MaskedClientId clientId={clientId} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          variant={status === "enabled" ? "default" : "secondary"}
          className={
            status === "enabled"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-red-100 text-red-800 hover:bg-red-100"
          }
        >
          • {status === "enabled" ? "Enabled" : "Disabled"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const credential = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={() => actions.onConfigure(credential)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-200 hover:bg-gray-50"
            onClick={() => actions.onHelp(credential)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={
              credential.status === "enabled"
                ? "text-red-600 border-red-200 hover:bg-red-50"
                : "text-green-600 border-green-200 hover:bg-green-50"
            }
            onClick={() => actions.onToggleStatus(credential)}
          >
            {credential.status === "enabled" ? (
              <>
                <PowerOff className="h-4 w-4 mr-2" />
                Disable
              </>
            ) : (
              <>
                <Power className="h-4 w-4 mr-2" />
                Enable
              </>
            )}
          </Button>
        </div>
      );
    },
  },
];