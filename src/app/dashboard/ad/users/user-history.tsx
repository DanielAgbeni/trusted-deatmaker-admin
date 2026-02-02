"use client";

import { HistoryTable } from "@/components/dashboard/tables";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetUsersQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { useState } from "react";
import { UsersColumns } from "../_columns/users-table-column";
import { Loader2 } from "lucide-react";

export default function UserHistory() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [kycFilter, setKycFilter] = useState<string>("all");

  const { data: usersResponse, isLoading, isFetching } = useGetUsersQuery({
    page: 0,
    size: 50,
    search: search.length > 2 ? search : undefined,
    active: activeFilter === "all" ? undefined : activeFilter === "active",
    kycVerified: kycFilter === "all" ? undefined : kycFilter === "verified",
  });

  const users = usersResponse?.data?.content || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold font-outfit">User History</h2>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-xs"
          />

          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={kycFilter} onValueChange={setKycFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="KYC Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All KYC</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>

          {isFetching && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <HistoryTable
          columns={UsersColumns}
          data={users}
        />
        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-muted-foreground">Loading users...</span>
          </div>
        )}
        {!isLoading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-gray-50/50">
            <p>No users found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
