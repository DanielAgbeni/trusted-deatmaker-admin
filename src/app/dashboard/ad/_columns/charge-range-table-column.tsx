// charge-range-table-column.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

export interface ChargeRange {
  id: number;
  minimumAmount: number;
  maximumAmount: number;
  fixedCharge: number;
  percentCharge: number;
  chargeCap: number;
  marketplaceId: string;
}

export const ChargeRangeColumns: ColumnDef<ChargeRange>[] = [
  {
    accessorKey: "id",
    header: "SL",
    cell: ({ row }) => {
      return <div className="font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "minimumAmount",
    header: "Minimum",
    cell: ({ row }) => {
      const amount = row.getValue("minimumAmount") as number;
      return <div className="font-medium">₦{amount.toLocaleString()}.00</div>;
    },
  },
  {
    accessorKey: "maximumAmount",
    header: "Maximum",
    cell: ({ row }) => {
      const amount = row.getValue("maximumAmount") as number;
      return <div className="font-medium">₦{amount.toLocaleString()}.00</div>;
    },
  },
  {
    accessorKey: "fixedCharge",
    header: "Fixed Charge",
    cell: ({ row }) => {
      const amount = row.getValue("fixedCharge") as number;
      return <div className="font-medium">₦{amount.toLocaleString()}.00</div>;
    },
  },
  {
    accessorKey: "percentCharge",
    header: "Percent Charge",
    cell: ({ row }) => {
      const percent = row.getValue("percentCharge") as number;
      return <div className="font-medium">{percent}%</div>;
    },
  },
  {
    accessorKey: "chargeCap",
    header: "Charge Cap",
    cell: ({ row }) => {
      const cap = row.getValue("chargeCap") as number;
      return <div className="font-medium">₦{cap.toLocaleString()}.00</div>;
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.marketplaceId ? "Active" : "Inactive";
      return (
        <Badge
          variant={status === "Active" ? "default" : "secondary"}
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const charge = row.original;

      const handleEdit = () => {
        const event = new CustomEvent("editChargeRange", {
          detail: charge,
        });
        window.dispatchEvent(event);
      };

      const handleDelete = () => {
        if (confirm("Are you sure you want to delete this charge range?")) {
          const event = new CustomEvent("deleteChargeRange", {
            detail: charge.id,
          });
          window.dispatchEvent(event);
        }
      };

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
