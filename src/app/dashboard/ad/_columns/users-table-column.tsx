"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import React from "react";
import { format } from "date-fns";

// Define the User type based on your table structure
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  kycVerified: boolean;
  createdAt: string;
  verified: boolean;
  active: boolean;
  avatar?: string;
}

export const UsersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-medium"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      // Generate initials for AvatarFallback
      const initials = user.fullName
        ? user.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
        : "U"; // Default fallback if name is empty

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.avatar || "/placeholder.svg"}
              alt={user.fullName || "User avatar"}
            />
            <AvatarFallback className="bg-blue-500 text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium whitespace-nowrap">{user.fullName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <div className="text-sm text-muted-foreground">{email}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const phone = row.getValue("phoneNumber") as string;
      return <div className="text-sm font-medium">{phone}</div>;
    },
  },
  {
    accessorKey: "userType",
    header: "User Type",
    cell: ({ row }) => {
      const type = row.getValue("userType") as string;
      return (
        <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-100">
          {type.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "kycVerified",
    header: "KYC Status",
    cell: ({ row }) => {
      const isVerified = row.getValue("kycVerified") as boolean;
      return (
        <div className="flex items-center gap-1.5">
          {isVerified ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex gap-1 items-center px-2 py-0.5">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none flex gap-1 items-center px-2 py-0.5">
              <Clock className="h-3 w-3" />
              Pending
            </Badge>
          )}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "verified",
  //   header: "Verification",
  //   cell: ({ row }) => {
  //     const isVerified = row.getValue("verified") as boolean;
  //     return (
  //       <div className="flex items-center gap-1.5">
  //         {isVerified ? (
  //           <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none flex gap-1 items-center px-2 py-0.5">
  //             <CheckCircle2 className="h-3 w-3" />
  //             Email
  //           </Badge>
  //         ) : (
  //           <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none flex gap-1 items-center px-2 py-0.5">
  //             <XCircle className="h-3 w-3" />
  //             Unverified
  //           </Badge>
  //         )}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {date ? format(new Date(date), "MMM dd, yyyy") : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      const status = active ? "Active" : "Suspended";
      return (
        <Badge
          variant={!active ? "destructive" : "default"}
          className={
            !active
              ? "bg-red-100 text-red-700 hover:bg-red-100"
              : "bg-green-100 text-green-700 hover:bg-green-100"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Copy email address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {" "}
              <Button
                asChild={true}
                variant="link"
                className="text-primary h-auto p-0"
              >
                <Link
                  href={`/dashboard/ad/users/${user.id}`}
                  className="flex items-center gap-1"
                >
                  View details
                </Link>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
