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
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  PowerOff,
} from "lucide-react";

export interface TimerSetting {
  id: number;
  category: string;
  transactionType: string;
  value: number;
  unit: "minutes" | "hours" | "days";
  status: "enabled" | "disabled";
  timerType: "payment" | "rejection" | "delivery" | "inspection" | "dispute" | "arbitration";
}

export const TimersColumns: ColumnDef<TimerSetting>[] = [
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
    accessorKey: "id",
    header: "SL",
    cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("transactionType")}</div>
    ),
  },
  {
    accessorKey: "value",
    header: "Duration",
    cell: ({ row }) => {
      const timer = row.original;
      return (
        <div className="text-sm font-medium">
          {timer.value} {timer.unit}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          variant={status === "enabled" ? "default" : "secondary"}
          className={
            status === "enabled"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-red-100 text-red-800 hover:bg-red-100"
          }
        >
          • {status === "enabled" ? "Enabled" : "Disabled"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const timer = row.original as TimerSetting;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
            onClick={() => {
              const event = new CustomEvent("editTimer", {
                detail: timer,
              });
              window.dispatchEvent(event);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => {
              const event = new CustomEvent("disableTimer", {
                detail: timer.id,
              });
              window.dispatchEvent(event);
            }}
          >
            <PowerOff className="h-4 w-4 mr-1" />
            Disable
          </Button>

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
                onClick={() => navigator.clipboard.writeText(timer.category)}
              >
                Copy Category Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(timer.transactionType)}
              >
                Copy Transaction Type
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-cyan-600"
                onClick={() => {
                  const event = new CustomEvent("editTimer", {
                    detail: timer,
                  });
                  window.dispatchEvent(event);
                }}
              >
                Edit Timer Setting
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-blue-600"
                onClick={() => {
                  const event = new CustomEvent("duplicateTimer", {
                    detail: timer,
                  });
                  window.dispatchEvent(event);
                }}
              >
                Duplicate Setting
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={
                  timer.status === "enabled" ? "text-red-600" : "text-green-600"
                }
                onClick={() => {
                  const event = new CustomEvent("toggleTimerStatus", {
                    detail: timer.id,
                  });
                  window.dispatchEvent(event);
                }}
              >
                {timer.status === "enabled" ? "Disable" : "Enable"} Timer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];