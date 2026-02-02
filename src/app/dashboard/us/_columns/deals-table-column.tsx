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
import { UserDashboardDealItem } from "@/lib/store/features/userDashboardApi/userDashboardTypes";
import { format } from "date-fns";
import Link from "next/link";

// Display type aligns with API response
export type Deal = UserDashboardDealItem;

// Helper function to get status badge variant
const getStatusVariant = (status: Deal['status']) => {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    case 'COMPLETED':
      return 'bg-green-100 text-green-700 hover:bg-green-100';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700 hover:bg-red-100';
    case 'DISPUTED':
      return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
    case 'REFUNDED':
      return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
    default:
      return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
  }
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export const DealsColumns: ColumnDef<Deal>[] = [
  {
    accessorKey: "transactionReference",
    header: "Transaction Reference",
    cell: ({ row }) => (
      <Link href={`/dashboard/us/deals/${row.original.dealId}`}>
        <Badge
          variant="outline"
          className="border border-primary text-primary hover:bg-primary/15 font-mono cursor-pointer"
        >
          {row.getValue("transactionReference")}
        </Badge>
      </Link>
    ),
  },
  {
    accessorKey: "vendorReference",
    header: "Vendor Reference",
    cell: ({ row }) => (
      <div className="font-mono text-sm text-muted-foreground">
        {row.getValue("vendorReference")}
      </div>
    ),
  },
  {
    accessorKey: "buyerName",
    header: "Buyer",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.getValue("buyerName")}</div>
        <div className="text-xs text-muted-foreground">{row.original.buyerEmail}</div>
      </div>
    ),
  },
  {
    accessorKey: "sellerName",
    header: "Seller",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.getValue("sellerName")}</div>
        <div className="text-xs text-muted-foreground">{row.original.sellerEmail}</div>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return <div className="text-left font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "estimatedCommission",
    header: "Commission",
    cell: ({ row }) => {
      const commission = row.getValue("estimatedCommission") as number;
      return <div className="text-left font-medium text-green-600">{formatCurrency(commission)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Deal['status'];
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
      const deal = row.original as Deal;

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
              onClick={() => navigator.clipboard.writeText(deal.dealId)}
            >
              Copy Deal ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(deal.transactionReference)}
            >
              Copy Transaction Reference
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/us/deals/${deal.dealId}`}>
                View Deal Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
