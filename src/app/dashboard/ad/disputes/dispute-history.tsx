"use client";

import { HistoryTable } from "@/components/dashboard/tables";
import { Dispute, DisputesColumns } from "../_columns/disputes-table-column";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";
import { useGetDisputesQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { AdminDisputeListItem } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DisputeHistory() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { data: disputesResponse, isLoading, refetch } = useGetDisputesQuery({
    page: 0,
    size: 20,
    search: search.length > 0 ? search : undefined,
    status: status === "all" ? undefined : status,
  });

  const mapDispute = (item: AdminDisputeListItem): Dispute => ({
    id: item.disputeId,
    transactionId: item.transactionReference,
    dateTime: new Date(item.createdAt).toLocaleDateString(),
    amount: item.amount,
    buyerName: item.buyerName,
    sellerName: item.sellerName,
    preferredResolution: item.preferredResolution,
    status: item.status as any,
  });

  const disputes: Dispute[] = disputesResponse?.data?.content?.map(mapDispute) || [];

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting transactions...");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold font-outfit">Dispute History</h2>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search Reference, Buyer or Seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
              <SelectItem value="ARBITRATION">Arbitration</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <HistoryTable columns={DisputesColumns} data={disputes} isLoading={isLoading} />
    </div>
  );
}
