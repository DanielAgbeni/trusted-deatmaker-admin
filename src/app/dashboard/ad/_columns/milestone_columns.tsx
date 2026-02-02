// src/app/dashboard/ad/transactions/flow/_columns/milestone-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { Milestone } from "../types";

export const MilestoneColumns: ColumnDef<Milestone>[] = [
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
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Badge 
          variant="outline" 
          className="bg-blue-50 text-blue-600 border-blue-200 font-mono text-xs"
        >
          {row.getValue("transactionId")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "milestoneName",
    header: "Milestone Name",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.getValue("milestoneName")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;
      return (
        <div className="text-sm text-gray-600">
          {description || (
            <span className="text-gray-400 italic">Null</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <div className="font-semibold text-gray-900">
          ₦{amount.toLocaleString()}.00
        </div>
      );
    },
  },
  {
    accessorKey: "paymentTime",
    header: "Payment Time",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Clock className="h-3 w-3 text-gray-400" />
        <span className="text-gray-600">{row.getValue("paymentTime")}</span>
      </div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">
        {row.getValue("dueDate")}
      </div>
    ),
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">
        {row.getValue("orderId")}
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
          case "completed":
            return "bg-green-100 text-green-800 hover:bg-green-100";
          case "pending":
            return "bg-orange-100 text-orange-800 hover:bg-orange-100";
          case "overdue":
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