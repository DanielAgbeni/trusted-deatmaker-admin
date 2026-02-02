"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminRole } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";

export const createRoleColumns = (
    onEdit: (role: AdminRole) => void,
    onDelete: (role: AdminRole) => void
): ColumnDef<AdminRole>[] => [
        {
            accessorKey: "name",
            header: "Role Name",
            cell: ({ row }) => <span className="font-semibold">{row.getValue("name")}</span>,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground truncate max-w-[300px] block">
                    {row.getValue("description")}
                </span>
            ),
        },
        {
            accessorKey: "permissions",
            header: "Permissions",
            cell: ({ row }) => {
                const permissions = row.getValue("permissions") as string[];
                return (
                    <div className="flex flex-wrap gap-1 max-w-[400px]">
                        {permissions.slice(0, 3).map((perm) => (
                            <Badge key={perm} variant="secondary" className="text-[10px] py-0 px-1">
                                {perm}
                            </Badge>
                        ))}
                        {permissions.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{permissions.length - 3} more</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const role = row.original;

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
                            <DropdownMenuItem onClick={() => onEdit(role)}>
                                Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(role)}
                                className="text-red-600"
                            >
                                Delete Role
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
