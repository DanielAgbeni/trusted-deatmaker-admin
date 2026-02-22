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
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: "Marketplace ID",
    cell: ({ row }) => <div className="font-semibold uppercase tracking-tight">{row.getValue("name")}</div>,
  },
  {
    id: "hasCommission",
    header: "Commission Set",
    cell: ({ row }) => {
      const hasCommission = row.original.hasCommission as boolean;
      return (
        <Badge
          variant="outline"
          className={
            hasCommission
              ? "bg-green-100 text-green-800 border-green-200 rounded-lg px-2"
              : "bg-red-100 text-red-800 border-red-200 rounded-lg px-2"
          }
        >
          {hasCommission ? "Yes" : "No"}
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
              ? "bg-green-100 text-green-800 border-green-200 rounded-lg px-2"
              : "bg-red-100 text-red-800 border-red-200 rounded-lg px-2"
          }
        >
          <span className="mr-1">•</span>
          {active ? "Enabled" : "Disabled"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const vendor = row.original;
      const hasFee = !!vendor.escrowFee;

      return (
        <div className="flex items-center gap-2 text-right">
          <Button
            variant="ghost"
            size="sm"
            className="text-cyan-600 hover:bg-cyan-50 h-10 rounded-xl px-3"
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
