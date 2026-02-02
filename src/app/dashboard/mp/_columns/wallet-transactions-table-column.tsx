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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import React from "react";
import Link from "next/link";

export interface WalletTransaction {
  id: string;
  user: {
    name: string;
    bank: string;
    avatar: string;
  };
  date: string;
  type: "Withdrawal" | "Commission";
  transactionId: string;
  amount: number;
}

export const WalletTransactionsColumns: ColumnDef<WalletTransaction>[] = [
  {
    accessorKey: "user", // This correctly provides the whole 'user' object to the cell
    header: "Account Name/Bank",
    cell: ({ row }) => {
      // Retrieve the user object from the row.
      // The 'as WalletTransaction["user"]' part provides type safety.
      const user = row.getValue("user") as WalletTransaction["user"];

      // Generate initials for AvatarFallback
      const initials = user?.name
        ? user?.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "U"; // Default fallback if name is empty

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-orange-500">
            <AvatarImage
              src={user?.avatar || "/placeholder.svg"} // Access user.avatar directly
              alt={user?.name || "User avatar"} // Access user.name directly
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            {/* Display user's name */}
            <div className="font-medium">{user?.name}</div>
            {/* Display user's bank */}
            <div className="text-xs text-muted-foreground">{user?.bank}</div>
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
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("type") === "Withdrawal" ? "destructive" : "default"
        }
        className={
          row.getValue("type") === "Withdrawal"
            ? "bg-red-100 text-red-600 hover:bg-red-100"
            : "bg-green-100 text-green-600 hover:bg-green-100"
        }
      >
        {row.getValue("type")}
      </Badge>
    ),
  },
  {
    accessorKey: "transactionId",
    header: "Transaction Id",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="border border-primary text-primary hover:bg-primary/15"
      >
        #{row.getValue("transactionId")}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN", //
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                asChild={true}
                variant="link"
                className="text-primary h-auto p-0"
              >
                <Link
                  href={`/dashboard/mp/wallet/transaction/${payment.transactionId}`}
                  className="flex items-center gap-1"
                >
                  View details
                </Link>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
