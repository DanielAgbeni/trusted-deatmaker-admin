// categories-table-column.tsx
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
    cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
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
      const category = row.original as Category;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
            onClick={() => {
              // This will be handled by the parent component
              const event = new CustomEvent("editCategory", {
                detail: category,
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
            className={
              category.status === "enabled"
                ? "text-red-600 border-red-200 hover:bg-red-50"
                : "text-green-600 border-green-200 hover:bg-green-50"
            }
            onClick={() => {
              // This will be handled by the parent component
              const event = new CustomEvent("toggleStatus", {
                detail: category.id,
              });
              window.dispatchEvent(event);
            }}
          >
            {category.status === "enabled" ? (
              <>
                <PowerOff className="h-4 w-4 mr-1" />
                Disable
              </>
            ) : (
              <>
                <Power className="h-4 w-4 mr-1" />
                Enable
              </>
            )}
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
