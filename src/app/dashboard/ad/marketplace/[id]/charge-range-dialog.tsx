"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfigureEscrowFeeMutation, useUpdateEscrowFeeMutation } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ChargeRangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  config?: any; // If executing in edit mode
}

export function ChargeRangeDialog({
  isOpen,
  onClose,
  vendorId,
  config,
}: ChargeRangeDialogProps) {
  const [configureEscrowFee, { isLoading: isCreating }] = useConfigureEscrowFeeMutation();
  const [updateEscrowFee, { isLoading: isUpdating }] = useUpdateEscrowFeeMutation();

  const isLoading = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    minAmount: 0,
    maxAmount: 0,
    fixedCharge: 0,
    percentCharge: 0,
    chargeCap: 0,
  });

  useEffect(() => {
    if (config) {
      setFormData({
        minAmount: config.minAmount || 0,
        maxAmount: config.maxAmount || 0,
        fixedCharge: config.flatAmount || 0,
        percentCharge: (config.percentage || 0) * 100, // Convert back to percentage for display
        chargeCap: config.capAmount || 0,
      });
    } else {
      // Reset form on open if no config (Add mode)
      setFormData({
        minAmount: 0,
        maxAmount: 0,
        fixedCharge: 0,
        percentCharge: 0,
        chargeCap: 0,
      });
    }
  }, [config, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (config) {
        await updateEscrowFee({
          id: config.id,
          vendorId: vendorId,
          currencyCode: "NGN",
          type: config.type || "VENDOR_COMMISSION",
          minAmount: Number(formData.minAmount),
          maxAmount: Number(formData.maxAmount),
          percentage: Number(formData.percentCharge) / 100,
          flatAmount: Number(formData.fixedCharge),
          capAmount: Number(formData.chargeCap),
        }).unwrap();
      } else {
        await configureEscrowFee({
          vendorId: vendorId,
          currencyCode: "NGN",
          type: "VENDOR_COMMISSION",
          minAmount: Number(formData.minAmount),
          maxAmount: Number(formData.maxAmount),
          percentage: Number(formData.percentCharge) / 100,
          flatAmount: Number(formData.fixedCharge),
          capAmount: Number(formData.chargeCap),
        }).unwrap();
      }

      toast.success(
        config
          ? "Charge range updated successfully"
          : "Charge range added successfully"
      );
      onClose();
    } catch (error: any) {
      console.error("Failed to configure fee:", error);
      toast.error(error?.data?.message || "Failed to save charge configuration");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold">
            {config ? "Edit Charge Range" : "Add Charge Range"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure the charge range for transactions within the specified
            amount limits.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAmount" className="text-xs font-semibold uppercase text-gray-500">
                  Minimum Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="minAmount"
                    name="minAmount"
                    type="number"
                    value={formData.minAmount}
                    onChange={handleInputChange}
                    className="pr-12"
                    placeholder="0.00"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                    NGN
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount" className="text-xs font-semibold uppercase text-gray-500">
                  Maximum Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="maxAmount"
                    name="maxAmount"
                    type="number"
                    value={formData.maxAmount}
                    onChange={handleInputChange}
                    className="pr-12"
                    placeholder="0.00"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                    NGN
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fixedCharge" className="text-xs font-semibold uppercase text-gray-500">
                Fixed Charge <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="fixedCharge"
                  name="fixedCharge"
                  type="number"
                  value={formData.fixedCharge}
                  onChange={handleInputChange}
                  className="pr-12"
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                  NGN
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentCharge" className="text-xs font-semibold uppercase text-gray-500">
                Percent Charge <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="percentCharge"
                  name="percentCharge"
                  type="number"
                  step="0.01"
                  value={formData.percentCharge}
                  onChange={handleInputChange}
                  className="pr-12"
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                  %
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chargeCap" className="text-xs font-semibold uppercase text-gray-500">
                Charge Cap <span className="text-cyan-600 normal-case">(Maximum charge for the range)</span> <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="chargeCap"
                  name="chargeCap"
                  type="number"
                  value={formData.chargeCap}
                  onChange={handleInputChange}
                  className="pr-12"
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                  NGN
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
