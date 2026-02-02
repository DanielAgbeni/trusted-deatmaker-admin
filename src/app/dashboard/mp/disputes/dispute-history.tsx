"use client";

import { HistoryTable } from "@/components/dashboard/tables";
import { Dispute, DisputesColumns } from "../_columns/disputes-table-column";
import { Input } from "@/components/ui/input";

export default function DisputeHistory() {
  // Inside your DisputeHistory component
  const disputes: Dispute[] = [
    {
      id: "1",
      disputeType: "Product Not Received",
      date: "15th May, 2024",
      hoursLeft: 24,
      resolution: "Pending",
      transactionId: "#124567890",
      amount: 15000,
    },
    {
      id: "2",
      disputeType: "Incorrect Item Sent",
      date: "12th May, 2024",
      hoursLeft: 12,
      resolution: "Replacement Sent",
      transactionId: "#124567801",
      amount: 8500,
    },
    {
      id: "3",
      disputeType: "Damaged Product",
      date: "10th May, 2024",
      hoursLeft: 3,
      resolution: "Refund",
      transactionId: "#9ac0d9112",
      amount: 32000,
    },
    {
      id: "4",
      disputeType: "Service Not Rendered",
      date: "5th May, 2024",
      hoursLeft: 72,
      resolution: "In Review",
      transactionId: "#124567345",
      amount: 5500,
    },
    {
      id: "5",
      disputeType: "Late Delivery",
      date: "2nd May, 2024",
      hoursLeft: 48,
      resolution: "Partial Refund",
      transactionId: "#124567999",
      amount: 1250,
    },
    {
      id: "6",
      disputeType: "Duplicate Charge",
      date: "28th April, 2024",
      hoursLeft: 96,
      resolution: "Refunded",
      transactionId: "#124567001",
      amount: 4999,
    },
    {
      id: "7",
      disputeType: "Product Not as Described",
      date: "25th April, 2024",
      hoursLeft: 6,
      resolution: "In Review",
      transactionId: "#124567432",
      amount: 25000,
    },
    {
      id: "8",
      disputeType: "Damaged Product",
      date: "20th April, 2024",
      hoursLeft: 1,
      resolution: "Closed",
      transactionId: "#124567876",
      amount: 18000,
    },
    {
      id: "9",
      disputeType: "Product Not Received",
      date: "15th April, 2024",
      hoursLeft: 120,
      resolution: "Pending",
      transactionId: "#124567111",
      amount: 75000,
    },
  ];
  const handleFilterDispute = (value: string) => {
    return;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Dispute History</h2>

        <div className="flex items-center">
          <Input
            placeholder="Filter by Transaction ID"
            // value={(table.getColumn("transactionId")?.getFilterValue() as string) ?? ""}
            onChange={(event) => handleFilterDispute(event.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <HistoryTable columns={DisputesColumns} data={disputes} />
    </div>
  );
}
