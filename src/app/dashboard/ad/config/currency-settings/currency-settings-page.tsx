"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryTable } from "@/components/dashboard/tables";
import { createFeeColumns, FeeActions } from "../../_columns/fees-table-columns";
import { FeeDialog, FeeFormData } from "./currency-dialog";
import { useGetEscrowFeesQuery, useUpdateEscrowFeeMutation, useDeleteEscrowFeeMutation, useConfigureEscrowFeeMutation } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { toast } from "sonner";
import { EscrowFeeConfig } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";

export default function FeesSettingsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<EscrowFeeConfig | null>(null);

  const { data: feesResponse, isLoading, refetch } = useGetEscrowFeesQuery({ page: 0, size: 50 });
  const [updateEscrowFee] = useUpdateEscrowFeeMutation();
  const [deleteEscrowFee] = useDeleteEscrowFeeMutation();
  const [configureEscrowFee] = useConfigureEscrowFeeMutation();
  const fees = feesResponse?.data?.content || [];

  const handleCreateNew = () => {
    setEditingFee(null);
    setDialogOpen(true);
  };

  const handleEdit = (fee: EscrowFeeConfig) => {
    setEditingFee(fee);
    setDialogOpen(true);
  };

  const handleToggleStatus = async (fee: EscrowFeeConfig) => {
    if (window.confirm(`Are you sure you want to ${fee.active ? 'disable' : 'enable'} this fee rule?`)) {
      try {
        await deleteEscrowFee(fee.id).unwrap();
        toast.success(`Fee rule ${fee.active ? 'disabled' : 'enabled'} successfully`);
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || `Failed to ${fee.active ? 'disable' : 'enable'} fee rule`);
      }
    }
  };

  const handleSave = async (data: FeeFormData) => {
    const { calculationType, ...feeData } = data;
    try {
      if (editingFee) {
        await updateEscrowFee({
          id: editingFee.id,
          vendorId: null, // Global config
          currencyCode: "NGN", // Defaulting to NGN for now
          type: "PLATFORM_FEE", // Assuming global config is platform fee
          ...feeData
        }).unwrap();
        toast.success("Fee rule updated successfully");
      } else {
        await configureEscrowFee({
          vendorId: null,
          currencyCode: "NGN",
          type: "PLATFORM_FEE",
          ...feeData
        }).unwrap();
        toast.success("Fee rule added successfully");
      }
      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save fee rule");
    }
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
