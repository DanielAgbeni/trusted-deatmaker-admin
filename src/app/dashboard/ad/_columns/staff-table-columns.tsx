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
import { AdminStaff } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ShieldCheck, ShieldAlert } from "lucide-react";
import React from "react";
import { format } from "date-fns";

export const createStaffColumns = (
    onEdit: (staff: AdminStaff) => void,
    onToggleStatus: (staff: AdminStaff) => void
): ColumnDef<AdminStaff>[] => [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const staff = row.original;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium">{`${staff.firstName} ${staff.lastName}`}</span>
                        <span className="text-xs text-muted-foreground">{staff.email}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const staff = row.original;
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {staff.role.name}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "active",
            header: "Status",
            cell: ({ row }) => {
                const active = row.getValue("active") as boolean;
                return (
                    <Badge
                        className={
                            active
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                        }
                    >
                        {active ? "Active" : "Inactive"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "lastLoginDate",
            header: "Last Login",
            cell: ({ row }) => {
                const date = row.getValue("lastLoginDate") as string;
                if (!date) return <span className="text-muted-foreground italic text-xs">Never</span>;
                return <span className="text-sm">{format(new Date(date), "MMM d, yyyy HH:mm")}</span>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const staff = row.original;

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
                            <DropdownMenuItem onClick={() => onEdit(staff)}>
                                Edit Staff
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onToggleStatus(staff)}
                                className={staff.active ? "text-red-600" : "text-green-600"}
                            >
                                {staff.active ? "Deactivate Account" : "Activate Account"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
