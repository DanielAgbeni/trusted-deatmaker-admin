"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Percent, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useConfigureEscrowFeeMutation } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { formatCurrency } from "@/lib/utils";

interface CommissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: any;
}

export function CommissionDialog({
  open,
  onOpenChange,
  vendor,
}: CommissionDialogProps) {
  const [configureFee, { isLoading }] = useConfigureEscrowFeeMutation();
  const [formData, setFormData] = useState({
    percentage: 0,
    commissionType: "percentage" as "percentage" | "fixed",
    minAmount: 0,
    maxAmount: 1000000000,
    effectiveDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (vendor && open) {
      const fee = vendor.escrowFee;
      if (fee) {
        const isFixed = fee.flatAmount > 0;
        setFormData({
          percentage: isFixed ? fee.flatAmount : fee.percentage * 100,
          commissionType: isFixed ? "fixed" : "percentage",
          minAmount: fee.minAmount || 0,
          maxAmount: fee.maxAmount || 1000000000,
          effectiveDate: new Date().toISOString().split("T")[0],
          notes: "",
        });
      } else {
        setFormData({
          percentage: 0,
          commissionType: "percentage",
          minAmount: 0,
          maxAmount: 1000000000,
          effectiveDate: new Date().toISOString().split("T")[0],
          notes: "",
        });
      }
      setErrors([]);
    }
  }, [vendor, open]);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (formData.percentage < 0) {
      newErrors.push("Commission value cannot be negative.");
    }
    if (formData.maxAmount <= formData.minAmount) {
      newErrors.push("Max Amount must be greater than Min Amount.");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        vendorId: vendor.id,
        currencyCode: "NGN",
        type: "PLATFORM_FEE" as const,
        minAmount: Number(formData.minAmount),
        maxAmount: Number(formData.maxAmount),
        percentage: formData.commissionType === "percentage" ? formData.percentage / 100 : 0,
        flatAmount: formData.commissionType === "fixed" ? formData.percentage : 0,
        capAmount: 0,
      };

      const response = await configureFee(payload).unwrap();
      if (response.success) {
        toast.success(response.message || "Commission assigned successfully");
        onOpenChange(false);
      } else {
        toast.error(response.message || "Failed to assign commission");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "An error occurred while assigning commission");
    }
  };

  const currentFee = vendor?.escrowFee;
  const currentFeeDisplay = currentFee
    ? currentFee.flatAmount > 0
      ? `₦${currentFee.flatAmount.toLocaleString()}.00`
      : `${(currentFee.percentage * 100).toFixed(1)}%`
    : "₦0.00";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] p-0 overflow-hidden border-none rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Percent className="h-5 w-5 text-cyan-500" />
            Assign Commission
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Set commission parameters for <span className="font-semibold text-cyan-600">{vendor?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            {/* Marketplace Info Card */}
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 gap-4 sm:gap-0">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Marketplace</p>
                <p className="text-lg font-bold text-gray-900">{vendor?.name}</p>
              </div>
              <div className="sm:text-right space-y-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Current Commission</p>
                <p className="text-lg font-bold text-gray-900">{currentFeeDisplay}</p>
              </div>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside text-xs">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commissionType" className="text-sm font-semibold text-gray-700">Commission Type</Label>
                <Select
                  value={formData.commissionType}
                  onValueChange={(value: any) => setFormData({ ...formData, commissionType: value })}
                >
                  <SelectTrigger id="commissionType" className="h-11 rounded-xl border-gray-200 focus:ring-cyan-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Based</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentage" className="text-sm font-semibold text-gray-700">
                  {formData.commissionType === "percentage" ? "Percentage (%)" : "Fixed Amount (₦)"}
                </Label>
                <Input
                  id="percentage"
                  type="number"
                  step="0.01"
                  className="h-11 rounded-xl border-gray-200 focus:ring-cyan-500"
                  placeholder={formData.commissionType === "percentage" ? "e.g. 5" : "e.g. 25000"}
                  value={formData.percentage || ""}
                  onChange={(e) => setFormData({ ...formData, percentage: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minAmount" className="text-sm font-semibold text-gray-700">Min Amount (₦)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    className="h-11 rounded-xl border-gray-200 focus:ring-cyan-500"
                    placeholder="Optional"
                    value={formData.minAmount || ""}
                    onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount" className="text-sm font-semibold text-gray-700">Max Amount (₦)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    className="h-11 rounded-xl border-gray-200 focus:ring-cyan-500"
                    placeholder="Optional"
                    value={formData.maxAmount || ""}
                    onChange={(e) => setFormData({ ...formData, maxAmount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectiveDate" className="text-sm font-semibold text-gray-700">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  className="h-11 rounded-xl border-gray-200 focus:ring-cyan-500"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Notes (Optional)</Label>
                <Input
                  id="notes"
                  className="h-11 rounded-xl border-gray-200 focus:ring-cyan-500"
                  placeholder="Add any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="bg-gray-50/50 px-6 py-4 flex flex-col sm:flex-row-reverse sm:items-center border-t border-gray-100 gap-3 flex-shrink-0">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 rounded-xl px-8 font-semibold bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-200 transition-all active:scale-95 w-full sm:w-auto"
            >
              {isLoading ? "Assigning..." : "Assign Commission"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-xl px-6 font-semibold border-gray-200 hover:bg-white hover:text-gray-900 w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
