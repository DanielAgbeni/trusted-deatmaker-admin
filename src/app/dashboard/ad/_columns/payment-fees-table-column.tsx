"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

export const getPaymentFeesColumns = (onEdit: (config: any) => void, onDelete: (id: string) => void): ColumnDef<any>[] => [
    {
        id: "sl",
        header: "SL",
        cell: ({ row }) => <div className="pl-4">{row.index + 1}</div>,
    },
    {
        accessorKey: "provider",
        header: "Provider",
        cell: ({ row }) => <div className="font-semibold">{row.getValue("provider")}</div>,
    },
    {
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => <div className="uppercase text-xs font-medium bg-gray-100 px-2 py-1 rounded w-fit">{row.getValue("method")?.toString().replace(/_/g, ' ')}</div>,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            return (
                <Badge variant="outline" className={type === 'DEPOSIT' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'}>
                    {type}
                </Badge>
            );
        },
    },
    {
        accessorKey: "currency",
        header: "Currency",
        cell: ({ row }) => {
            const currency = row.getValue("currency") as any;
            return <div>{currency?.code || 'NGN'}</div>;
        },
    },
    {
        header: "Fees",
        cell: ({ row }) => {
            const config = row.original;
            const { amount, decimal } = formatCurrency(config.flatFee || 0);
            const percent = ((config.percentageFee || 0) * 100).toFixed(2);

            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold whitespace-nowrap">₦{amount}.{decimal}</span>
                    <span className="text-[10px] text-muted-foreground">+{percent}%</span>
                </div>
            );
        },
    },
    {
        accessorKey: "capAmount",
        header: "Cap",
        cell: ({ row }) => {
            const { amount, decimal } = formatCurrency(row.getValue("capAmount") || 0);
            return <div className="font-medium">₦{amount}.{decimal}</div>;
        },
    },
    {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => {
            const active = row.getValue("active") as boolean;
            return (
                <Badge
                    variant="outline"
                    className={
                        active
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }
                >
                    {active ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
            const config = row.original;

            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-cyan-600 hover:bg-cyan-50"
                        onClick={() => onEdit(config)}
                    >
                        <Edit className="h-4 w-4" />
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
                            <DropdownMenuItem onClick={() => onEdit(config)}>
                                Edit Configuration
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => onDelete(config.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Disable Fee
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
