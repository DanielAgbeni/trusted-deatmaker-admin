"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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

// Removed ProviderIcon since the design only shows plain bold text.

export const createSocialCredentialColumns = (actions: SocialCredentialActions): ColumnDef<SocialCredential>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-gray-300"
        />
        <span className="font-semibold text-gray-700">SL</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-gray-300"
        />
        <span className="text-blue-500 font-medium text-sm">{row.original.id}</span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => <span className="font-semibold text-gray-700">Title</span>,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <span className="font-bold text-gray-900">{title}</span>;
    },
  },
  {
    accessorKey: "clientId",
    header: () => <span className="font-semibold text-gray-700">Client ID</span>,
    cell: ({ row }) => {
      const clientId = row.getValue("clientId") as string;
      return <MaskedClientId clientId={clientId} />;
    },
  },
  {
    accessorKey: "status",
    header: () => <span className="font-semibold text-gray-700">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          variant={status === "enabled" ? "default" : "secondary"}
          className={
            status === "enabled"
              ? "bg-green-100/80 text-green-600 hover:bg-green-100 shadow-none font-medium text-xs px-3 py-0.5"
              : "bg-red-100/80 text-red-600 hover:bg-red-100 shadow-none font-medium text-xs px-3 py-0.5"
          }
        >
          • {status === "enabled" ? "Enabled" : "Disabled"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="font-semibold text-gray-700">Action</span>,
    enableHiding: false,
    cell: ({ row }) => {
      const credential = row.original;

      return (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-8 px-4 text-xs font-medium text-slate-700 border-slate-400 hover:bg-slate-50"
            onClick={() => actions.onConfigure(credential)}
          >
            Configure
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-8 px-4 text-xs font-medium text-cyan-500 border-cyan-400 hover:bg-cyan-50"
            onClick={() => actions.onHelp(credential)}
          >
            Help
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-8 px-4 text-xs font-medium text-red-500 border-red-400 hover:bg-red-50"
            onClick={() => actions.onToggleStatus(credential)}
          >
            {credential.status === "enabled" ? "Disable" : "Enable"}
          </Button>
        </div>
      );
    },
  },
];