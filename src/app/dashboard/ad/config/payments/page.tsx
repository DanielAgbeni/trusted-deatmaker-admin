"use client";

import { useState, useMemo } from "react";
import { getPaymentFeesColumns } from "../../_columns/payment-fees-table-column";
import { HistoryTable } from "@/components/dashboard/tables";
import { useGetPaymentFeesQuery, useDeletePaymentFeeMutation } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { PaymentDialog } from "./payment-dialog";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export default function PaymentConfigPage() {
    const { data: response, isLoading, isFetching, refetch } = useGetPaymentFeesQuery({ page: 0, size: 50 });
    const [deletePaymentFee] = useDeletePaymentFeeMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<any>(null);

    const handleEdit = (config: any) => {
        setSelectedConfig(config);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to disable this payment fee?")) {
            try {
                await deletePaymentFee(id).unwrap();
                toast.success("Payment fee disabled successfully");
            } catch (error: any) {
                toast.error(error?.data?.message || "Failed to disable payment fee");
            }
        }
    };

    const handleAddNew = () => {
        setSelectedConfig(null);
        setIsDialogOpen(true);
    };

    const columns = useMemo(() => getPaymentFeesColumns(handleEdit, handleDelete), [handleEdit, deletePaymentFee]);
    const data = response?.data?.content || [];

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-cyan-600" />
                        Payment Settings
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Manage provider fees for deposit and withdrawal transactions.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="rounded-xl h-12 w-12 border-gray-200 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <RefreshCcw className={`h-5 w-5 text-gray-500 ${isFetching ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        onClick={handleAddNew}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl h-12 px-6 shadow-lg shadow-cyan-100 flex items-center gap-2 font-bold transition-all active:scale-95"
                    >
                        <Plus className="h-5 w-5" />
                        Configure New Fee
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-200/50">
                <HistoryTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                />
            </div>

            <PaymentDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                config={selectedConfig}
            />
        </div>
    );
}
