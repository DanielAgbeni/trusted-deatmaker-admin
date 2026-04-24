// categories-table-column.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  Power,
  PowerOff,
} from "lucide-react";

export interface Category {
  id: number;
  name: string;
  description: string;
  status: "enabled" | "disabled";
}

export const CategoriesColumns: ColumnDef<Category>[] = [
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
    cell: ({ row }) => <div className="font-semibold text-cyan-600 pl-4">{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium uppercase">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 max-w-md text-wrap leading-relaxed">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          className={cn(
            "rounded-md px-6 py-1 font-medium border-none shadow-none",
            status === "enabled"
              ? "bg-[#e8f7ed] text-[#42b76b]"
              : "bg-[#fef4e8] text-[#f2994a]"
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full mr-2", status === "enabled" ? "bg-[#42b76b]" : "bg-[#f2994a]")} />
          {status === "enabled" ? "Enabled" : "Disabled"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original as Category;

      return (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-6 rounded-[4px] border-[#0092ca] text-[#0092ca] hover:bg-[#0092ca] hover:text-white transition-colors bg-transparent text-[13px] font-medium"
            onClick={() => {
              const event = new CustomEvent("editCategory", {
                detail: category,
              });
              window.dispatchEvent(event);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 px-5 rounded-[4px] transition-colors bg-transparent text-[13px] font-medium",
              category.status === "enabled"
                ? "border-[#ea5b5b] text-[#ea5b5b] hover:bg-[#ea5b5b] hover:text-white"
                : "border-[#42b76b] text-[#42b76b] hover:bg-[#42b76b] hover:text-white"
            )}
            onClick={() => {
              const event = new CustomEvent("toggleStatus", {
                detail: category.id,
              });
              window.dispatchEvent(event);
            }}
          >
            {category.status === "enabled" ? "Disable" : "Enable"}
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
                onClick={() => navigator.clipboard.writeText(category.name)}
              >
                Copy Category Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(category.description)
                }
              >
                Copy Description
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem
                className="text-cyan-600"
                onClick={() => {
                  const event = new CustomEvent("editCategory", {
                    detail: category,
                  });
                  window.dispatchEvent(event);
                }}
              >
                Edit Category
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="text-blue-600"
                onClick={() => {
                  const event = new CustomEvent("duplicateCategory", {
                    detail: category,
                  });
                  window.dispatchEvent(event);
                }}
              >
                Duplicate Category
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  const event = new CustomEvent("deleteCategory", {
                    detail: category.id,
                  });
                  window.dispatchEvent(event);
                }}
              >
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
