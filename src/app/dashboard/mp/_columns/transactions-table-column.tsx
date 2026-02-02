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
import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import React from "react";
import Link from "next/link";

export interface Transaction {
  id: string;
  escrowNumber: string;
  buyerName: string;
  buyerUsername: string;
  sellerName: string;
  sellerUsername: string;
  amount: string;
  type: string;
  dateTime: string;
  marketplace: {
    name: string;
    logo: string;
  };
  status: "Completed" | "Pending" | "Failed";
}

export const TransactionsColumns: ColumnDef<Transaction>[] = [
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
    accessorKey: "escrowNumber",
    header: "Title/Escrow Number",
    cell: ({ row }) => {
      const escrowNumber = row.getValue("escrowNumber") as string;
      return (
        <Badge
          variant="outline"
          className="border border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100"
        >
          #{escrowNumber}
        </Badge>
      );
    },
  },
  {
    accessorKey: "buyerName",
    header: "Buyer's Name",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">{transaction.buyerName}</p>
          <span className="text-muted-foreground text-xs">
            @{transaction.buyerUsername}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "sellerName",
    header: "Seller's Name",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">{transaction.sellerName}</p>
          <span className="text-muted-foreground text-xs">
            @{transaction.sellerUsername}
          </span>
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
          className="h-auto p-0 font-semibold"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("amount") as string;
      return <div className="font-semibold text-sm">{amount}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className="flex items-center gap-2 p-2 py-1 bg-gray-100 border border-gray-300 rounded-xs ">
          <div className="w-1.5 h-1 bg-gray-600 rounded-full"></div>
          <span className="text-xs">{type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "dateTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Date/Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("dateTime")}</div>
    ),
  },
  // {
  //   accessorKey: "marketplace",
  //   header: "Marketplace",
  //   cell: ({ row }) => {
  //     const transaction = row.original;
  //     const marketplace = transaction.marketplace;

  //     return (
  //       <div className="flex items-center gap-2">
  //         <Avatar className="h-6 w-6">
  //           <AvatarImage
  //             src={marketplace?.logo || "/placeholder.svg"}
  //             alt={marketplace?.name || "Marketplace logo"}
  //           />
  //           <AvatarFallback className="text-xs">
  //             {marketplace?.name?.substring(0, 2).toUpperCase() || "MP"}
  //           </AvatarFallback>
  //         </Avatar>
  //         <span className="text-sm text-muted-foreground">
  //           ({marketplace?.name || "Unknown"})
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const getStatusStyle = (status: string) => {
        switch (status) {
          case "Completed":
            return "bg-green-100 text-green-700 hover:bg-green-100";
          case "Pending":
            return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
          case "Failed":
            return "bg-red-100 text-red-700 hover:bg-red-100";
          default:
            return "bg-gray-100 text-gray-700 hover:bg-gray-100";
        }
      };

      return (
        <Badge variant="secondary" className={getStatusStyle(status)}>
          • {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    // header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <div className="flex items-center gap-2">
          {/* <Button
            asChild
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <Link href={`/dashboard/transactions/${transaction.escrowNumber}`}>
              Details
            </Link>
          </Button> */}

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
                onClick={() =>
                  navigator.clipboard.writeText(transaction.escrowNumber)
                }
              >
                Copy escrow number
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View buyer profile</DropdownMenuItem>
              <DropdownMenuItem>View seller profile</DropdownMenuItem>
              <DropdownMenuItem>View marketplace</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`/dashboard/mp/transactions/${transaction.escrowNumber}`}
                  className="flex items-center gap-1"
                >
                  View full details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
