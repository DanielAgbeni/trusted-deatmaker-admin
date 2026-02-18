"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface Dispute {
  id: string;
  transactionId: string;
  dateTime: string;
  amount: number;
  buyerName: string;
  sellerName: string;
  preferredResolution: string;
  status: "OPEN" | "NEGOTIATION" | "ARBITRATION" | "RESOLVED" | "CLOSED";
}

// Component for Actions Cell
function ActionsCell({ dispute }: { dispute: Dispute }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
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
            onClick={() => {
              navigator.clipboard.writeText(dispute.transactionId);
              toast.success("Transaction ID copied to clipboard");
            }}
          >
            Copy Transaction ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/ad/disputes/${dispute.id}`)}
          >
            View Dispute Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/ad/transactions/${dispute.transactionId.replace('#', '')}`)}
          >
            View Transaction Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const DisputesColumns: ColumnDef<Dispute>[] = [
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
    header: "Transaction Ref",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="border border-blue-200 text-blue-600 hover:bg-blue-50 font-mono"
      >
        {row.getValue("transactionId")}
      </Badge>
    ),
  },
  {
    accessorKey: "dateTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
  {
    accessorKey: "buyerName",
    header: "Buyer",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("buyerName")}</div>
    ),
  },
  {
    accessorKey: "sellerName",
    header: "Seller",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("sellerName")}</div>
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
    accessorKey: "preferredResolution",
    header: "Resolution",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 truncate max-w-[150px]" title={row.getValue("preferredResolution")}>
        {row.getValue("preferredResolution")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusStyles: Record<string, string> = {
        OPEN: "bg-blue-100 text-blue-800 border-blue-200",
        NEGOTIATION: "bg-yellow-100 text-yellow-800 border-yellow-200",
        ARBITRATION: "bg-purple-100 text-purple-800 border-purple-200",
        RESOLVED: "bg-green-100 text-green-800 border-green-200",
        CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
      };

      return (
        <Badge
          variant="outline"
          className={`${statusStyles[status] || "bg-gray-50 text-gray-500"
            } hover:bg-opacity-80`}
        >
          • {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    // header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const dispute = row.original as Dispute;
      return <ActionsCell dispute={dispute} />;
    },
  },
];
