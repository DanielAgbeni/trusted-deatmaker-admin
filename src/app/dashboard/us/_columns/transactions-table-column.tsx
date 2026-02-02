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
import { ArrowUpDown, MoreHorizontal, Star } from "lucide-react";
import React from "react";
import Link from "next/link";
export interface Transaction {
  id: string;
  customer: {
    name: string;
    role?: "Buyer" | "Seller";
    image: string;
  };
  marketplace: {
    name: string;
    logo: string;
  };
  date: string;
  category: string;
  transactionId: string;
  amount: string;
  status: "Completed" | "Pending";
}
export const TransactionsColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "customer",
    header: "Buyer/Seller",
    cell: ({ row }) => {
      const transaction = row.original;
      const customer = transaction.customer;
      // Generate initials for AvatarFallback
      const initials = customer?.name
        ? customer?.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "U"; // Default fallback if name is empty

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-blue-500">
            <AvatarImage
              src={customer?.image || "/placeholder.svg"}
              alt={customer?.name || "Customer avatar"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-end items-start gap-1 ">
            <p className="font-medium">{customer.name}</p>
            <span className="text-muted-foreground font-bold text-xs">
              ({customer?.role})
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "marketplace",
    header: "Marketplace",
    cell: ({ row }) => {
      const transaction = row.original;
      const marketplace = transaction.marketplace;
      // Generate initials for AvatarFallback
      const initials = marketplace?.name
        ? marketplace?.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "M"; // Default fallback if name is empty

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-7 w-7 bg-blue-500">
            <AvatarImage
              src={marketplace?.logo || "/placeholder.svg"}
              alt={marketplace?.name || "Marketplace logo"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-end items-start gap-1 ">
            <p className="font-medium">{marketplace?.name}</p>
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
    cell: ({ row }) => <div className="text-sm">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="bg-purple-100 text-purple-700 hover:bg-purple-100"
      >
        {row.getValue("category")}
      </Badge>
    ),
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => {
      const transactionId = row.getValue("transactionId") as string;
      // Remove # if it exists, then add it back for display
      const cleanId = transactionId.replace("#", "");

      return (
        <Badge
          variant="outline"
          className="border border-primary text-primary hover:bg-primary/15"
        >
          #{cleanId}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue("amount") as string;
      return <div className="text-left font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "Pending" ? "secondary" : "default"}
          className={
            status === "Pending"
              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
              : "bg-green-100 text-green-700 hover:bg-green-100"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;
      const cleanTransactionId = transaction.transactionId.replace("#", "");

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
              onClick={() => navigator.clipboard.writeText(transaction.id)}
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View marketplace</DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                asChild={true}
                variant="link"
                className="text-primary h-auto p-0"
              >
                <Link
                  href={`/dashboard/us/transactions/${cleanTransactionId}`}
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
