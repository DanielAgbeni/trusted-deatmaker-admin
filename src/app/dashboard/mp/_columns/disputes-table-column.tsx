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
// import { Dispute } from "../recent-users";

export interface Dispute {
  id: string;
  disputeType: string;
  date: string;
  hoursLeft: number;
  resolution: string;
  transactionId: string;
  amount: number;
}

export const DisputesColumns: ColumnDef<Dispute>[] = [
  {
    accessorKey: "disputeType",
    header: "Dispute Type",
    cell: ({ row }) => (
      <div className="capitalize font-semibold">
        {row.getValue("disputeType")}
      </div>
    ),
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
          <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
          {/* Added spacing and size for icon */}
        </Button>
      );
    },
    cell: ({ row }) => {
      // Access the full original data for the row
      const dispute = row.original as Dispute;
      return (
        <div className="lowercase">
          {/* You can get 'date' using getValue or directly from 'dispute' */}
          {dispute.date}.{" "}
          <span className="text-red-600 font-medium">
            {" "}
            {/* Added font-medium for emphasis */}
            {dispute.hoursLeft} Hours Left
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "resolution",
    header: "Dispute Resolution",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-gray-100 text-gray-600 hover:bg-gray-100"
      >
        {row.getValue("resolution")}
      </Badge>
    ),
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID", // Consistent casing
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="border border-primary text-primary hover:bg-primary/15"
      >
        {row.getValue("transactionId")}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Ensure 'en-NG' locale is supported or use a fallback like 'en-US' if only symbol matters
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
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
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Customer</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
