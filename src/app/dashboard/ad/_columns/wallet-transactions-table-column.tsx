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
  type: "withdrawal" | "deposit";
  transactionId: string;
  amount: number;
  status: "COMPLETED" | "PENDING" | "FAILED";
}

export const WalletTransactionsColumns: ColumnDef<WalletTransaction>[] = [
  {
    accessorKey: "user", // This correctly provides the whole 'user' object to the cell
    header: "Account Name/Bank",
    cell: ({ row }) => {
      const user = row.getValue("user") as WalletTransaction["user"];
      const initials = user?.name
        ? user?.name.split(" ").map((n) => n[0]).join("").toUpperCase()
        : "U";

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-orange-500">
            <AvatarImage
              src={user?.avatar || "/placeholder.svg"}
              alt={user?.name || "User avatar"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user?.name}</div>
            <div className="text-xs text-muted-foreground">{user?.bank}</div>
          </div>
        </div>
      );
    },
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
        currency: "NGN",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
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
          row.getValue("type") === "withdrawal" ? "destructive" : "default"
        }
        className={
          row.getValue("type") === "withdrawal"
            ? "bg-red-100 text-red-600 hover:bg-red-100"
            : "bg-green-100 text-green-600 hover:bg-green-100"
        }
      >
        {row.getValue("type")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const styles = {
        COMPLETED: "text-green-600 bg-green-50 border-green-200",
        SUCCESS: "text-green-600 bg-green-50 border-green-200",
        PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
        FAILED: "text-red-600 bg-red-50 border-red-200"
      };
      return (
        <Badge variant="outline" className={styles[status as keyof typeof styles] || ""}>
          {status}
        </Badge>
      );
    }
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
                  href={`/dashboard/ad/wallet/transaction/${payment.transactionId}`}
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
