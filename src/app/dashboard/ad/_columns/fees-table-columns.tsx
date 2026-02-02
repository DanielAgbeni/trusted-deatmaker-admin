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
import { MoreHorizontal } from "lucide-react";
import { EscrowFeeConfig } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";

export interface FeeActions {
    onEdit: (fee: EscrowFeeConfig) => void;
    onToggleStatus: (fee: EscrowFeeConfig) => void;
}

export const createFeeColumns = (actions: FeeActions): ColumnDef<EscrowFeeConfig>[] => [
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.getValue("type")}
            </Badge>
        ),
    },
    {
        accessorKey: "percentage",
        header: "Percentage",
        cell: ({ row }) => {
            const val = row.getValue("percentage") as number;
            return val ? `${val}%` : "-";
        },
    },
    {
        accessorKey: "flatAmount",
        header: "Flat Amount",
        cell: ({ row }) => {
            const val = row.getValue("flatAmount") as number;
            return val ? `₦${val.toLocaleString()}` : "-";
        },
    },
    {
        accessorKey: "minAmount",
        header: "Min Amount",
        cell: ({ row }) => `₦${(row.getValue("minAmount") as number)?.toLocaleString() || 0}`,
    },
    {
        accessorKey: "maxAmount",
        header: "Max Amount",
        cell: ({ row }) => {
            const val = row.getValue("maxAmount") as number;
            // If huge number, maybe show 'Unlimited' or similar? assuming API returns number
            return val ? `₦${val.toLocaleString()}` : "Unlimited";
        },
    },
    {
        accessorKey: "capAmount",
        header: "Cap Amount",
        cell: ({ row }) => `₦${(row.getValue("capAmount") as number)?.toLocaleString() || 0}`,
    },
    {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => {
            const active = row.getValue("active") as boolean;
            return (
                <Badge
                    variant={active ? "default" : "secondary"}
                    className={active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                    {active ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const fee = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => actions.onEdit(fee)}>
                            Edit Fee
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => actions.onToggleStatus(fee)}>
                            {fee.active ? "Disable" : "Enable"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
