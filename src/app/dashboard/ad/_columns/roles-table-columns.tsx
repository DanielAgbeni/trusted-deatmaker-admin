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
import { MoreHorizontal, Shield, Clock } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

// Helper to determine role level and color based on name
const getRoleLevelInfo = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('vp') || n.includes('executive') || n.includes('head')) {
        return { level: "Level 4", color: "bg-orange-100 text-orange-700 border-orange-200", codePrefix: "EX-" };
    }
    if (n.includes('manager') || n.includes('finance') || n.includes('lead')) {
        return { level: "Level 3", color: "bg-pink-100 text-pink-700 border-pink-200", codePrefix: "MGR-" };
    }
    if (n.includes('admin') || n.includes('coordinator') || n.includes('officer')) {
        return { level: "Level 2", color: "bg-purple-100 text-purple-700 border-purple-200", codePrefix: "ADM-" };
    }
    return { level: "Level 1", color: "bg-blue-100 text-blue-700 border-blue-200", codePrefix: "SPEC-" };
};

// Helper to determine department based on name
const getDepartment = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('dispute') || n.includes('resolution')) return "Operations - Dispute Resolution";
    if (n.includes('escrow')) return "Operations - Escrow Activity";
    if (n.includes('finance') || n.includes('treasury')) return "Finance - Treasury";
    if (n.includes('compliance') || n.includes('legal')) return "Legal - Compliance";
    if (n.includes('exec')) return "Executive - Operations";
    return "Operations - General";
};

export const createRoleColumns = (
    onEdit: (role: AdminRole) => void,
    onDelete: (role: AdminRole) => void
): ColumnDef<AdminRole>[] => [
        {
            accessorKey: "name",
            header: "Role Name",
            cell: ({ row }) => {
                const name = row.getValue("name") as string;
                const { codePrefix } = getRoleLevelInfo(name);
                const code = `${codePrefix}${name.substring(0, 3).toUpperCase()}`;
                return (
                    <div className="flex flex-col space-y-1">
                        <span className="font-bold text-gray-900 font-outfit">{name}</span>
                        <span className="text-[10px] font-medium text-gray-400 tracking-wider uppercase">{code}</span>
                    </div>
                );
            },
        },
        {
            id: "level",
            header: "Level",
            cell: ({ row }) => {
                const { level, color } = getRoleLevelInfo(row.original.name);
                return (
                    <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full border shadow-none", color)}>
                        {level}
                    </Badge>
                );
            },
        },
        {
            id: "department",
            header: "Department",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-gray-600">
                    {getDepartment(row.original.name)}
                </span>
            ),
        },
        {
            id: "users",
            header: "Users",
            cell: ({ row }) => {
                // Simulating user density (active/limit)
                const mockCounts: Record<string, string> = {
                    'level 1': '15/20',
                    'level 2': '15/20',
                    'level 3': '2/3',
                    'level 4': '1/2',
                };
                const { level } = getRoleLevelInfo(row.original.name);
                const count = mockCounts[level.toLowerCase()] || '0/5';
                return (
                    <span className="text-sm font-semibold text-gray-500 tabular-nums">
                        {count}
                    </span>
                );
            },
        },
        {
            accessorKey: "permissions",
            header: "Permissions",
            cell: ({ row }) => {
                const permissions = row.getValue("permissions") as string[];
                return (
                    <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">{permissions.length}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "updatedAt",
            header: "Last Modified",
            cell: ({ row }) => {
                const date = new Date(row.getValue("updatedAt"));
                return (
                    <div className="flex flex-col text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                        <span>{date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    </div>
                );
            },
        },
        {
            id: "status",
            header: "Status",
            cell: () => (
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-0 flex items-center gap-1.5 w-fit rounded-lg shadow-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">active</span>
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const role = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-5 w-5 text-blue-600" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] p-1.5 rounded-xl border-gray-200 shadow-xl">
                            <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase p-2">Manage Role</DropdownMenuLabel>
                            <DropdownMenuItem 
                                onClick={() => onEdit(role)}
                                className="rounded-lg cursor-pointer transition-colors"
                            >
                                Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="rounded-lg cursor-pointer transition-colors"
                                onClick={() => {}}
                            >
                                Clone Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(role)}
                                className="text-red-600 rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50"
                            >
                                Delete Role
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
