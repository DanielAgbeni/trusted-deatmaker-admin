"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DisputeItem } from "@/lib/store/features/userDashboardApi/userDashboardTypes";
import { format } from "date-fns";

// Display type aligns with API response
export type Dispute = DisputeItem;

// Helper function to get status badge variant
const getStatusVariant = (status: Dispute['status']) => {
  switch (status) {
    case 'OPEN':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    case 'UNDER_REVIEW':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
    case 'RESOLVED':
      return 'bg-green-100 text-green-700 hover:bg-green-100';
    case 'CLOSED':
      return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
    default:
      return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
  }
};

// Helper function to format reason for display
const formatReason = (reason: Dispute['reason']) => {
  return reason.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export const DisputesColumns: ColumnDef<Dispute>[] = [
  {
    accessorKey: "dealReference",
    header: "Deal Reference",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="border border-primary text-primary hover:bg-primary/15 font-mono"
      >
        {row.getValue("dealReference")}
      </Badge>
    ),
  },
  {
    accessorKey: "milestoneTitle",
    header: "Milestone",
    cell: ({ row }) => (
      <div className="capitalize font-medium max-w-[200px] truncate">
        {row.getValue("milestoneTitle")}
      </div>
    ),
  },
  {
    accessorKey: "reason",
    header: "Dispute Reason",
    cell: ({ row }) => (
      <div className="capitalize font-semibold">
        {formatReason(row.getValue("reason"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Dispute['status'];
      return (
        <Badge
          variant="outline"
          className={getStatusVariant(status)}
        >
          {status.replace(/_/g, ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: "openedBy",
    header: "Opened By",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-purple-100 text-purple-700 hover:bg-purple-100"
      >
        {row.getValue("openedBy")}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      try {
        const date = new Date(createdAt);
        return (
          <div className="lowercase">
            {format(date, "do MMM, yyyy")}
          </div>
        );
      } catch (error) {
        return <div>{createdAt}</div>;
      }
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dispute = row.original as Dispute;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(dispute.id)}
            >
              Copy Dispute ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(dispute.dealReference)}
            >
              Copy Deal Reference
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Deal Details</DropdownMenuItem>
            <DropdownMenuItem>View Dispute Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
