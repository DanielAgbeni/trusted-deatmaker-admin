"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminVendorListItem } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";

import { Percent } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const getMarketplaceColumns = (onView: (vendor: any) => void): ColumnDef<any>[] => [
  {
    id: "sl",
    header: "SL",
    cell: ({ row }) => <div className="text-gray-500 font-medium">{row.index + 1}</div>,
  },
  {
    header: "Vendor Details",
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-gray-900 uppercase tracking-tight">{vendor.name}</span>
          <span className="text-xs text-muted-foreground">{vendor.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "orgCode",
    header: "Org Code",
    cell: ({ row }) => <div className="font-mono text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100 inline-block">{row.getValue("orgCode")}</div>,
  },
  {
    id: "verification",
    header: "Verification",
    cell: ({ row }) => {
      const verified = row.original.verified as boolean;
      return (
        <Badge
          variant="outline"
          className={
            verified
              ? "bg-blue-50 text-blue-700 border-blue-200 rounded-lg px-2"
              : "bg-amber-50 text-amber-700 border-amber-200 rounded-lg px-2"
          }
        >
          {verified ? "Verified" : "Pending"}
        </Badge>
      );
    },
  },
  {
    id: "hasCommission",
    header: "Commission",
    cell: ({ row }) => {
      const hasCommission = row.original.hasCommission as boolean;
      return (
        <Badge
          variant="outline"
          className={
            hasCommission
              ? "bg-green-50 text-green-700 border-green-200 rounded-lg px-2"
              : "bg-red-50 text-red-700 border-red-200 rounded-lg px-2"
          }
        >
          {hasCommission ? "Set" : "Not Set"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <Badge
          variant="outline"
          className={
            active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 rounded-lg px-2"
              : "bg-slate-50 text-slate-700 border-slate-200 rounded-lg px-2"
          }
        >
          <span className="mr-1">•</span>
          {active ? "Active" : "Disabled"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Joined",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="text-xs text-gray-600">
          {date ? new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const vendor = row.original;

      return (
        <div className="flex items-center gap-2 text-right">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-orange-50 h-9 rounded-lg px-3"
            onClick={() => onView(vendor)}
          >
            View
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(vendor)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(vendor.id)}
              >
                Copy Vendor ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(vendor.orgCode)}
              >
                Copy Org Code
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
