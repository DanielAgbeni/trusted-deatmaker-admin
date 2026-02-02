"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryTable } from "@/components/dashboard/tables";
import { createFeeColumns, FeeActions } from "../../_columns/fees-table-columns";
import { FeeDialog, FeeFormData } from "./currency-dialog";
import { useGetEscrowFeesQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { EscrowFeeConfig } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";

export default function FeesSettingsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<EscrowFeeConfig | null>(null);

  const { data: feesResponse, isLoading } = useGetEscrowFeesQuery({ page: 0, size: 20 });
  const fees = feesResponse?.data?.content || [];

  const handleCreateNew = () => {
    setEditingFee(null);
    setDialogOpen(true);
  };

  const handleEdit = (fee: EscrowFeeConfig) => {
    setEditingFee(fee);
    setDialogOpen(true);
  };

  const handleToggleStatus = (fee: EscrowFeeConfig) => {
    // Implement toggle Status API
    console.log("Toggle status", fee);
  };

  const handleSave = async (data: FeeFormData) => {
    // Implement save logic (create/update) using API
    console.log("Saving fee", data);
    setDialogOpen(false);
  };

  const feeActions: FeeActions = {
    onEdit: handleEdit,
    onToggleStatus: handleToggleStatus,
  };

  const columns = createFeeColumns(feeActions);

  const activeCount = fees.filter(f => f.active).length;
  const inactiveCount = fees.filter(f => !f.active).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Escrow Fees Configuration
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage platform fees for escrow transactions.
            </p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Fee Rule
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-cyan-600">{fees.length}</div>
              <p className="text-xs text-gray-500 mt-1">Total Rules</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              <p className="text-xs text-gray-500 mt-1">Active Rules</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{inactiveCount}</div>
              <p className="text-xs text-gray-500 mt-1">Inactive Rules</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              Fee Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HistoryTable columns={columns} data={fees} />
            {isLoading && <p className="text-sm text-muted-foreground mt-2">Loading...</p>}
          </CardContent>
        </Card>

        <FeeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          fee={editingFee}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
