"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Copy, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export interface Dispute {
  id: string;
  disputeReference: string;
  dealReference: string;
  dealId: string;
  dateTime: string;
  dealAmount: number;
  preferredResolution: string;
  currencyCode: string;
  buyerName: string;
  sellerName: string;
  priority: string;
  status: string;
  tier: string;
  sla?: {
    deadline: string;
    remainingMinutes: number;
    remainingPercentage: number;
    colorCode: string;
    breached: boolean;
    atRisk: boolean;
  };
  assignedAdmin?: {
    name: string;
    email: string;
  } | null;
}

export type DisputeActionType = "VIEW" | "CLAIM" | "REVIEW";

export const getDisputesColumns = (
  onAction: (dispute: Dispute, actionType: DisputeActionType) => void
): ColumnDef<Dispute>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "dealReference",
    header: "Transaction ID",
    cell: ({ row }) => {
      const ref = row.getValue("dealReference") as string;
      return (
        <div className="flex items-center gap-2 group">
          <span className="text-sm font-medium text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
            #{ref}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(ref);
              toast.success("Transaction ID copied");
            }}
          >
            <Copy className="h-3.5 w-3.5 text-slate-400" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "disputeReference",
    header: "Dispute ID",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-900">
        #{row.getValue("disputeReference")}
      </span>
    ),
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => {
      const reason = row.original.preferredResolution;
      return (
        <span className="font-semibold text-slate-700 text-sm">
          {reason || "Product Mismatch"}
        </span>
      );
    },
  },
  {
    id: "parties",
    header: "Parties Involved",
    cell: ({ row }) => {
      const claimant = row.original.buyerName;
      const respondent = row.original.sellerName;
      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-1 rounded">C</span>
            <span className="text-xs font-medium text-slate-600">{claimant}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1 rounded">R</span>
            <span className="text-xs font-medium text-slate-600">{respondent}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dealAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.dealAmount;
      const currency = row.original.currencyCode || "NGN";
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
      }).format(amount);

      return <div className="font-bold text-slate-900">{formatted}</div>;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const isCritical = priority === "CRITICAL";
      return (
        <Badge
          variant="outline"
          className={cn(
            "font-medium border-0 rounded-full px-3 py-0.5",
            isCritical 
                ? "bg-red-100 text-red-500" 
                : "bg-blue-100 text-blue-500"
          )}
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignedAdmin",
    header: "Assigned Admin",
    cell: ({ row }) => {
      const admin = row.original.assignedAdmin;
      const isUnassigned = !admin;
      
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className={isUnassigned ? "bg-slate-100" : "bg-cyan-100 text-cyan-600"}>
              {isUnassigned ? <User className="h-3 w-3 text-slate-400" /> : admin.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className={cn("text-xs font-medium", isUnassigned ? "text-slate-400 italic" : "text-slate-700")}>
            {isUnassigned ? "Unassigned" : admin.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "sla",
    header: "SLA Timer",
    cell: ({ row }) => {
      const sla = row.original.sla;
      if (!sla) return null;

      const hours = Math.floor(sla.remainingMinutes / 60);
      const isAtRisk = sla.remainingMinutes < 120; // Example: < 2 hours
      
      return (
        <div className="flex flex-col">
          <span className={cn(
            "text-xs font-bold",
            isAtRisk ? "text-red-500" : "text-green-500"
          )}>
            {hours} hours left
          </span>
          <span className="text-[10px] text-slate-400">
            {new Date(sla.deadline).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const isUnassigned = !row.original.assignedAdmin;
      
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50"
            onClick={(e) => {
              e.stopPropagation();
              onAction(row.original, "VIEW");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>

          <Button
            size="sm"
            className={cn(
              "h-8 px-4 font-medium bg-cyan-500 hover:bg-cyan-600 text-white"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onAction(row.original, isUnassigned ? "CLAIM" : "REVIEW");
            }}
          >
            {isUnassigned ? "Claim" : "Review"}
          </Button>
        </div>
      );
    },
  },
];


