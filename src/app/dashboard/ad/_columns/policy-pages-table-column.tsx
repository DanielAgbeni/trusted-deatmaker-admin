"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Search,
  Edit,
  Trash2,
} from "lucide-react";

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
    accessorKey: "id",
    header: "SL",
    cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <div className="font-medium">{title}</div>;
    },
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const policy = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
            onClick={() => actions.onSeoSetting(policy)}
          >
            <Search className="h-4 w-4 mr-2" />
            SEO Setting
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
            onClick={() => actions.onEdit(policy)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => actions.onRemove(policy)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      );
    },
  },
];