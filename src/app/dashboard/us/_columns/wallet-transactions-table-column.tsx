"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, User } from "lucide-react";
import React from "react";
import Link from "next/link";

// Updated interface to match API response
export interface WalletTransaction {
  transactionReference: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "DEAL_PAYMENT" | "DEAL_REFUND" | "FEE" | "COMMISSION";
  amount: number;
  fee: number;
  status: "SUCCESS" | "PENDING" | "FAILED" | "CANCELLED";
  date: string;
  destinationBank: string | null;
  destinationAccountName: string | null;
  destinationAccountNumber: string | null;
  description: string;
}

export const WalletTransactionsColumns: ColumnDef<WalletTransaction>[] = [
  {
    accessorKey: "description",
    header: "Transaction Details",
    cell: ({ row }) => {
      const transaction = row.original;
      const type = transaction.type;
      const description = transaction.description;
      
      // Format transaction type for display
      const typeDisplay = type.charAt(0) + type.slice(1).toLowerCase();
      
      // Get user name from description or use default
      const getUserName = () => {
        if (transaction.destinationAccountName) {
          return transaction.destinationAccountName;
        }
        
        // Extract name from description if possible
        if (description?.includes("via")) {
          const parts = description.split("via");
          return typeDisplay + (parts[0].trim() ? `: ${parts[0].trim()}` : "");
        }
        
        return typeDisplay;
      };

      const initials = getUserName()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "T";

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-orange-500">
            <AvatarImage
              src="/placeholder.svg"
              alt={getUserName()}
            />
            <AvatarFallback className="bg-orange-100 text-orange-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{getUserName()}</div>
            <div className="text-xs text-muted-foreground">
              {transaction.destinationBank || description}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.getValue("date") as string;
      const date = new Date(dateStr);
      
      // Format date as "Dec 27, 2025"
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Format time as "2:59 PM"
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{formattedDate}</div>
          <div className="text-xs text-muted-foreground">{formattedTime}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const status = row.original.status;
      
      // Determine badge style based on type
      const getBadgeConfig = () => {
        switch (type) {
          case "DEPOSIT":
            return {
              variant: "default" as const,
              className: "bg-green-100 text-green-600 hover:bg-green-100",
              label: "Deposit"
            };
          case "WITHDRAWAL":
            return {
              variant: "destructive" as const,
              className: "bg-red-100 text-red-600 hover:bg-red-100",
              label: "Withdrawal"
            };
          case "DEAL_PAYMENT":
            return {
              variant: "default" as const,
              className: "bg-blue-100 text-blue-600 hover:bg-blue-100",
              label: "Deal Payment"
            };
          case "DEAL_REFUND":
            return {
              variant: "default" as const,
              className: "bg-yellow-100 text-yellow-600 hover:bg-yellow-100",
              label: "Refund"
            };
          case "FEE":
            return {
              variant: "outline" as const,
              className: "bg-gray-100 text-gray-600 hover:bg-gray-100",
              label: "Fee"
            };
          default:
            return {
              variant: "outline" as const,
              className: "bg-gray-100 text-gray-600 hover:bg-gray-100",
              label: type
            };
        }
      };
      
      const badgeConfig = getBadgeConfig();
      
      return (
        <div className="space-y-1">
          <Badge
            variant={badgeConfig.variant}
            className={badgeConfig.className}
          >
            {badgeConfig.label}
          </Badge>
          <div className="text-xs text-muted-foreground capitalize">
            {status?.toLowerCase()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "transactionReference",
    header: "Transaction ID",
    cell: ({ row }) => {
      const ref = row.getValue("transactionReference") as string;
      console.log("ref", ref);
      
      // Extract the short reference number
      const shortRef = ref?.split('-').pop() || ref;
      
      return (
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="border border-primary text-primary hover:bg-primary/15"
          >
            #{shortRef}
          </Badge>
          <div className="text-xs text-muted-foreground truncate max-w-[120px]">
            {ref}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const transaction = row.original;
      const amount = parseFloat(transaction?.amount?.toString());
      const fee = parseFloat(transaction?.fee?.toString());
      const netAmount = amount - fee;

      const formattedAmount = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(amount);

      const formattedNet = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(netAmount);

      return (
        <div className="space-y-1">
          <div className="font-medium text-left">
            {transaction.type === "DEPOSIT" ? "+" : "-"} {formattedAmount}
          </div>
          {fee > 0 && (
            <div className="text-xs text-muted-foreground">
              Net: {formattedNet} <span className="text-xs">(Fee: ₦{fee.toFixed(2)})</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

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
              onClick={() => navigator.clipboard.writeText(transaction.transactionReference)}
              className="cursor-pointer"
            >
              Copy Transaction ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.amount.toString())}
              className="cursor-pointer"
            >
              Copy Amount
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Button
                asChild
                variant="link"
                className="text-primary h-auto p-0 justify-start w-full"
              >
                <Link
                  href={`/dashboard/us/wallet/transaction/${transaction.transactionReference}`}
                  className="flex items-center gap-1 px-2 py-1.5"
                >
                  View Transaction Details
                </Link>
              </Button>
            </DropdownMenuItem>
            {transaction.destinationAccountNumber && (
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.destinationAccountNumber!)}
                className="cursor-pointer"
              >
                Copy Account Number
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];