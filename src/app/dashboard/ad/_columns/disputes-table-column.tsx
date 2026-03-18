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
import { cn } from "@/lib/utils";

export interface Dispute {
  id: string;
  disputeReference: string;
  dealReference: string;
  dealId: string;
  dateTime: string;
  dealAmount: number;
  preferredResolution: string;
  currencyCode: string;
  buyerName: string;
  sellerName: string;
  priority: string;
  status: string;
  tier: string;
  sla?: {
    deadline: string;
    remainingMinutes: number;
    remainingPercentage: number;
    colorCode: string;
    breached: boolean;
    atRisk: boolean;
  };
  assignedAdmin?: {
    name: string;
    email: string;
  } | null;
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
              navigator.clipboard.writeText(dispute.disputeReference);
              toast.success("Dispute Reference copied to clipboard");
            }}
          >
            Copy Dispute Ref
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/ad/disputes/${dispute.dealId}`)}
          >
            View Dispute Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/ad/transactions/${dispute.dealId}`)}
          >
            View Deal Details
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
    accessorKey: "disputeReference",
    header: "Dispute Ref",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="border border-blue-200 text-blue-600 hover:bg-blue-50 font-mono"
      >
        {row.getValue("disputeReference")}
      </Badge>
    ),
  },
  {
    accessorKey: "dealReference",
    header: "Deal Ref",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-mono"
      >
        {row.getValue("dealReference")}
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
      const currency = row.original.currencyCode || "USD";
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            priority === "CRITICAL" ? "bg-red-100 text-red-800 border-red-200" : "bg-gray-100 text-gray-800 border-gray-200"
          )}
        >
          {priority}
        </Badge>
      );
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
        NEGOTIATION: "bg-orange-100 text-orange-800 border-orange-200",
        ARBITRATION: "bg-purple-100 text-purple-800 border-purple-200",
        RESOLVED: "bg-green-100 text-green-800 border-green-200",
        CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
        UNASSIGNED: "bg-pink-100 text-pink-800 border-pink-200",
        ASSIGNED: "bg-indigo-100 text-indigo-800 border-indigo-200",
        MONITORING: "bg-cyan-100 text-cyan-800 border-cyan-200",
      };

      return (
        <Badge
          variant="outline"
          className={cn(
            statusStyles[status] || "bg-gray-50 text-gray-500",
            "hover:bg-opacity-80"
          )}
        >
          • {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "sla",
    header: "SLA",
    cell: ({ row }) => {
      const sla = row.original.sla;
      if (!sla) return null;

      const colorMap: Record<string, string> = {
        RED: "bg-red-500",
        YELLOW: "bg-yellow-500",
        GREEN: "bg-green-500",
      };

      return (
        <div className="flex flex-col gap-1 min-w-[100px]">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className={sla.breached ? "text-red-600" : "text-muted-foreground"}>
              {sla.breached ? "BREACHED" : `${Math.floor(sla.remainingMinutes / 60)}h ${sla.remainingMinutes % 60}m`}
            </span>
            {/* <span>{sla.remainingPercentage}%</span> */}
          </div>
          {/* <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={cn("h-full transition-all duration-300", colorMap[sla.colorCode] || "bg-blue-500")}
              style={{ width: `${sla.remainingPercentage}%` }}
            />
          </div> */}
        </div>
      );
    },
  },
  {
    accessorKey: "assignedAdmin",
    header: "Admin",
    cell: ({ row }) => {
      const admin = row.original.assignedAdmin;
      if (!admin) return <span className="text-muted-foreground italic text-xs">Unassigned</span>;
      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium">{admin.name}</span>
          <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{admin.email}</span>
        </div>
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
