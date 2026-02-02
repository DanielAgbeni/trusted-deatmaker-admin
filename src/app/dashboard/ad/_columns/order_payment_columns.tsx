// src/app/dashboard/ad/transactions/flow/_columns/order-payment-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Order, Payment } from "../types";

export const OrderColumns: ColumnDef<Order>[] = [
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
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <Badge 
        variant="outline" 
        className="bg-blue-50 text-blue-600 border-blue-200 font-mono text-xs"
      >
        {row.getValue("orderId")}
      </Badge>
    ),
  },
  {
    accessorKey: "buyerId",
    header: "Buyer ID",
    cell: ({ row }) => (
      <div className="font-medium text-gray-700">
        {row.getValue("buyerId")}
      </div>
    ),
  },
  {
    accessorKey: "sellerId",
    header: "Seller ID",
    cell: ({ row }) => (
      <div className="font-medium text-gray-700">
        {row.getValue("sellerId")}
      </div>
    ),
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
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {new Date(row.getValue("createdAt")).toLocaleString()}
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
          case "confirmed":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100";
          case "shipped":
            return "bg-purple-100 text-purple-800 hover:bg-purple-100";
          case "delivered":
            return "bg-green-100 text-green-800 hover:bg-green-100";
          case "pending":
            return "bg-orange-100 text-orange-800 hover:bg-orange-100";
          case "cancelled":
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

export const PaymentColumns: ColumnDef<Payment>[] = [
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
    accessorKey: "paymentId",
    header: "Payment ID",
    cell: ({ row }) => (
      <Badge 
        variant="outline" 
        className="bg-green-50 text-green-600 border-green-200 font-mono text-xs"
      >
        {row.getValue("paymentId")}
      </Badge>
    ),
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">
        {row.getValue("transactionId")}
      </div>
    ),
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
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
        {row.getValue("paymentMethod")}
      </Badge>
    ),
  },
  {
    accessorKey: "processedAt",
    header: "Processed At",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {new Date(row.getValue("processedAt")).toLocaleString()}
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
          case "failed":
            return "bg-red-100 text-red-800 hover:bg-red-100";
          case "refunded":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100";
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