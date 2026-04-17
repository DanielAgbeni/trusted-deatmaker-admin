"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

export interface PolicyPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface PolicyPageActions {
  onSeoSetting: (policy: PolicyPage) => void;
  onEdit: (policy: PolicyPage) => void;
  onRemove: (policy: PolicyPage) => void;
}

export const createPolicyPageColumns = (actions: PolicyPageActions): ColumnDef<PolicyPage>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mr-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mr-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1 cursor-pointer select-none">
          SL
          <div className="flex flex-col ml-1">
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0L7.4641 4.5H0.535898L4 0Z" fill="#CBD5E1"/>
              <path d="M4 10L0.535898 5.5L7.4641 5.5L4 10Z" fill="#CBD5E1"/>
            </svg>
          </div>
        </div>
      );
    },
    cell: ({ row }) => <div className="font-medium text-cyan-500">{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    header: () => <div className="text-center font-bold text-gray-700">Title</div>,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <div className="font-bold text-center text-gray-800">{title}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center font-bold text-gray-700">Action</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const policy = row.original;

      return (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-[#457c8b] border-[#457c8b] hover:bg-[#457c8b]/10 rounded-full h-8 px-4 font-semibold text-xs"
            onClick={() => actions.onSeoSetting(policy)}
          >
            SEO Settings
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-[#0abbe3] border-[#0abbe3] hover:bg-[#0abbe3]/10 rounded-full h-8 px-4 font-semibold text-xs"
            onClick={() => actions.onEdit(policy)}
          >
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-[#ff6b6b] border-[#ff6b6b] hover:bg-[#ff6b6b]/10 rounded-full h-8 px-4 font-semibold text-xs"
            onClick={() => actions.onRemove(policy)}
          >
            Remove
          </Button>
        </div>
      );
    },
  },
];