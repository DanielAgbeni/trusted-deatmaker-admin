// src/app/dashboard/ad/transactions/flow/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryTable } from "@/components/dashboard/tables";
import {
  Milestone,
  Bid,
  Order,
  Payment,
  TransactionFlowTab,
} from "../../types";
import { BidColumns } from "../../_columns/bid_columns";
import {
  OrderColumns,
  PaymentColumns,
} from "../../_columns/order_payment_columns";
import { MilestoneColumns } from "../../_columns/milestone_columns";

// Mock data for milestones
const mockMilestones: Milestone[] = Array.from({ length: 12 }, (_, i) => ({
  id: `milestone-${i + 1}`,
  transactionId: "#019234890",
  milestoneName: "Creative Goods",
  description: null,
  amount: 5000,
  paymentTime: "• 48 Hours",
  dueDate: "27th March, 2024. 2:39 PM",
  orderId: "#87ya98yq-y4",
  status: "completed" as const,
}));

// Mock data for bids
const mockBids: Bid[] = Array.from({ length: 12 }, (_, i) => ({
  id: `bid-${i + 1}`,
  userId: `user-${i + 1}`,
  userName: "David Abdulai Victor",
  userAvatar: "/placeholder.svg?height=32&width=32",
  targetId: "Creative Goods",
  transactionTypeId: "SERVICE",
  requestTypeId: "• 48 Hours",
  bidAmount: 5000,
  message: "This is the amount I have at the moment, kindly consider",
  targetOwnerId: "#87ya98yq-y4",
  status: i === 0 ? "accepted" : i === 1 ? "pending" : "completed",
}));

// Mock data for orders
const mockOrders: Order[] = Array.from({ length: 8 }, (_, i) => ({
  id: `order-${i + 1}`,
  orderId: `#ORD-${1000 + i}`,
  buyerId: `buyer-${i + 1}`,
  sellerId: `seller-${i + 1}`,
  amount: 5000 + i * 1000,
  status: ["pending", "confirmed", "shipped", "delivered"][
    i % 4
  ] as Order["status"],
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
}));

// Mock data for payments
const mockPayments: Payment[] = Array.from({ length: 10 }, (_, i) => ({
  id: `payment-${i + 1}`,
  paymentId: `#PAY-${2000 + i}`,
  transactionId: `#019234890`,
  amount: 5000 + i * 500,
  paymentMethod: ["Card", "Bank Transfer", "Wallet"][i % 3],
  status: ["pending", "completed", "failed", "refunded"][
    i % 4
  ] as Payment["status"],
  processedAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
}));

export default function TransactionFlowPage() {
  const [activeTab, setActiveTab] = useState<TransactionFlowTab>("milestones");

  const getTabCount = (tab: TransactionFlowTab) => {
    switch (tab) {
      case "milestones":
        return mockMilestones.length;
      case "bids":
        return mockBids.length;
      case "orders":
        return mockOrders.length;
      case "payments":
        return mockPayments.length;
      default:
        return 0;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Transaction Flow
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor and manage transaction milestones, bids, orders, and
              payments
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TransactionFlowTab)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="milestones"
              className="relative data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              Milestones
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                {getTabCount("milestones")}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="bids"
              className="relative data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              Bids
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                {getTabCount("bids")}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="relative data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              Orders
              <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
                {getTabCount("orders")}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="relative data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              Payments
              <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full">
                {getTabCount("payments")}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  Milestones
                  <span className="text-sm font-normal text-gray-500">
                    {mockMilestones.length} total milestones
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryTable
                  columns={MilestoneColumns}
                  data={mockMilestones}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bids" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  Bids
                  <span className="text-sm font-normal text-gray-500">
                    {mockBids.length} total bids
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryTable columns={BidColumns} data={mockBids} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  Orders
                  <span className="text-sm font-normal text-gray-500">
                    {mockOrders.length} total orders
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryTable columns={OrderColumns} data={mockOrders} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  Payments
                  <span className="text-sm font-normal text-gray-500">
                    {mockPayments.length} total payments
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryTable columns={PaymentColumns} data={mockPayments} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
