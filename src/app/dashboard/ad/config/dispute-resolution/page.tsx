// src/app/dashboard/ad/disputes/management/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryTable } from "@/components/dashboard/tables";
import {
  DisputeManagementType,
  DisputeReason,
  DisputeResolution,
} from "../../types";
import { DisputeResolutionColumns } from "../../_columns/dispute_resolution_columns";
import { DisputeReasonColumns } from "../../_columns/dispute_reason_columns";
import { DisputeDialog } from "./dispute_dialog";

// Mock data for dispute reasons
const initialDisputeReasons: DisputeReason[] = [
  {
    id: 1,
    title: "Damaged Product",
    details: "Product arrived damaged or broken",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Different Product",
    details: "Received product is different from what was ordered",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 3,
    title: "Swapped Product",
    details: "Product appears to have been swapped or substituted",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
];

// Mock data for dispute resolutions
const initialDisputeResolutions: DisputeResolution[] = [
  {
    id: 1,
    title: "Refund",
    details: "Full refund of the transaction amount",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Replacement",
    details: "Replace the product with a new one",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 3,
    title: "Cancel Transaction",
    details: "Cancel the entire transaction",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
];

export default function DisputeManagementPage() {
  const [activeTab, setActiveTab] = useState<DisputeManagementType>("reason");
  const [disputeReasons, setDisputeReasons] = useState<DisputeReason[]>(
    initialDisputeReasons
  );
  const [disputeResolutions, setDisputeResolutions] = useState<
    DisputeResolution[]
  >(initialDisputeResolutions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<
    DisputeReason | DisputeResolution | null
  >(null);

  // Event listeners for actions triggered from the table columns
  useEffect(() => {
    const handleEditDisputeReason = (event: CustomEvent) => {
      setEditingItem(event.detail);
      setActiveTab("reason");
      setDialogOpen(true);
    };

    const handleDeleteDisputeReason = (event: CustomEvent) => {
      const reasonId = event.detail;
      if (confirm("Are you sure you want to delete this dispute reason?")) {
        setDisputeReasons((prev) =>
          prev.filter((reason) => reason.id !== reasonId)
        );
      }
    };

    const handleEditDisputeResolution = (event: CustomEvent) => {
      setEditingItem(event.detail);
      setActiveTab("resolution");
      setDialogOpen(true);
    };

    const handleDeleteDisputeResolution = (event: CustomEvent) => {
      const resolutionId = event.detail;
      if (confirm("Are you sure you want to delete this dispute resolution?")) {
        setDisputeResolutions((prev) =>
          prev.filter((resolution) => resolution.id !== resolutionId)
        );
      }
    };

    window.addEventListener(
      "editDisputeReason",
      handleEditDisputeReason as EventListener
    );
    window.addEventListener(
      "deleteDisputeReason",
      handleDeleteDisputeReason as EventListener
    );
    window.addEventListener(
      "editDisputeResolution",
      handleEditDisputeResolution as EventListener
    );
    window.addEventListener(
      "deleteDisputeResolution",
      handleDeleteDisputeResolution as EventListener
    );

    return () => {
      window.removeEventListener(
        "editDisputeReason",
        handleEditDisputeReason as EventListener
      );
      window.removeEventListener(
        "deleteDisputeReason",
        handleDeleteDisputeReason as EventListener
      );
      window.removeEventListener(
        "editDisputeResolution",
        handleEditDisputeResolution as EventListener
      );
      window.removeEventListener(
        "deleteDisputeResolution",
        handleDeleteDisputeResolution as EventListener
      );
    };
  }, []);

  const handleCreateNew = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleSaveItem = (
    itemData: Omit<
      DisputeReason | DisputeResolution,
      "id" | "createdAt" | "updatedAt"
    >
  ) => {
    const now = new Date().toISOString();

    if (activeTab === "reason") {
      if (editingItem && "title" in editingItem) {
        // Update existing dispute reason
        setDisputeReasons((prev) =>
          prev.map((reason) =>
            reason.id === editingItem.id
              ? { ...reason, ...itemData, updatedAt: now }
              : reason
          )
        );
      } else {
        // Create new dispute reason
        const newReason: DisputeReason = {
          id: Math.max(...disputeReasons.map((r) => r.id)) + 1,
          ...itemData,
          createdAt: now,
          updatedAt: now,
        } as DisputeReason;
        setDisputeReasons((prev) => [...prev, newReason]);
      }
    } else {
      if (editingItem && "title" in editingItem) {
        // Update existing dispute resolution
        setDisputeResolutions((prev) =>
          prev.map((resolution) =>
            resolution.id === editingItem.id
              ? { ...resolution, ...itemData, updatedAt: now }
              : resolution
          )
        );
      } else {
        // Create new dispute resolution
        const newResolution: DisputeResolution = {
          id: Math.max(...disputeResolutions.map((r) => r.id)) + 1,
          ...itemData,
          createdAt: now,
          updatedAt: now,
        } as DisputeResolution;
        setDisputeResolutions((prev) => [...prev, newResolution]);
      }
    }

    setDialogOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Dispute Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage dispute reasons and resolution options
            </p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as DisputeManagementType)
          }
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="reason"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              Reason for Dispute
            </TabsTrigger>
            <TabsTrigger
              value="resolution"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              Dispute Preferred Resolution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reason" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Reason for Dispute
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryTable
                  columns={DisputeReasonColumns}
                  data={disputeReasons}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Dispute Preferred Resolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryTable
                  columns={DisputeResolutionColumns}
                  data={disputeResolutions}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog */}
        <DisputeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          type={activeTab}
          item={editingItem}
          onSave={handleSaveItem}
        />
      </div>
    </div>
  );
}
