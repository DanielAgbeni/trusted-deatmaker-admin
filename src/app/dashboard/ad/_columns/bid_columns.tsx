// src/app/dashboard/ad/transactions/flow/_columns/bid-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { Bid } from "../types";

export const BidColumns: ColumnDef<Bid>[] = [
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
    accessorKey: "userName",
    header: "User ID",
    cell: ({ row }) => {
      const bid = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={bid.userAvatar} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              {bid.userName.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-900">
              {bid.userName}
            </span>
            <span className="text-xs text-gray-500">
              ID: {bid.userId}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "targetId",
    header: "Target ID",
    cell: ({ row }) => (
      <div className="font-medium text-gray-700">
        {row.getValue("targetId")}
      </div>
    ),
  },
  {
    accessorKey: "transactionTypeId",
    header: "Transaction Type ID",
    cell: ({ row }) => (
      <Badge 
        variant="outline" 
        className="bg-purple-50 text-purple-700 border-purple-200 font-medium"
      >
        {row.getValue("transactionTypeId")}
      </Badge>
    ),
  },
  {
    accessorKey: "requestTypeId",
    header: "Request Type ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Clock className="h-3 w-3 text-gray-400" />
        <span className="text-gray-600">{row.getValue("requestTypeId")}</span>
      </div>
    ),
  },
  {
    accessorKey: "bidAmount",
    header: "Bid Amount",
    cell: ({ row }) => {
      const amount = row.getValue("bidAmount") as number;
      return (
        <div className="font-semibold text-gray-900">
          ₦{amount.toLocaleString()}.00
        </div>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
      return (
        <div className="text-sm text-gray-600 max-w-xs truncate" title={message}>
          {message}
        </div>
      );
    },
  },
  {
    accessorKey: "targetOwnerId",
    header: "Target Owner ID",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">
        {row.getValue("targetOwnerId")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      const getStatusStyles = () => {
        switch (status) {
          case "accepted":
            return "bg-green-100 text-green-800 hover:bg-green-100";
          case "completed":
            return "bg-green-100 text-green-800 hover:bg-green-100";
          case "pending":
            return "bg-orange-100 text-orange-800 hover:bg-orange-100";
          case "rejected":
            return "bg-red-100 text-red-800 hover:bg-red-100";
          default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
        }
      };

      return (
        <Badge className={getStatusStyles()}>
          • {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
];