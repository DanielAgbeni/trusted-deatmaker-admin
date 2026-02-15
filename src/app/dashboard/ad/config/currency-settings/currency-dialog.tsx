"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EscrowFeeConfig } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";

export interface FeeFormData {
  calculationType: "PERCENTAGE" | "FIXED";
  percentage: number;
  flatAmount: number;
  minAmount: number;
  maxAmount: number;
  capAmount: number;
  active: boolean;
}

interface FeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fee: EscrowFeeConfig | null;
  onSave: (data: FeeFormData) => void;
}

export function FeeDialog({
  open,
  onOpenChange,
  fee,
  onSave,
}: FeeDialogProps) {
  const [calculationType, setCalculationType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [percentage, setPercentage] = useState<number>(0);
  const [flatAmount, setFlatAmount] = useState<number>(0);
  const [minAmount, setMinAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [capAmount, setCapAmount] = useState<number>(0);
  const [active, setActive] = useState<boolean>(true);

  useEffect(() => {
    if (fee) {
      setCalculationType(fee.type as "PERCENTAGE" | "FIXED" || "PERCENTAGE");
      setPercentage(fee.percentage || 0);
      setFlatAmount(fee.flatAmount || 0);
      setMinAmount(fee.minAmount || 0);
      setMaxAmount(fee.maxAmount || 0);
      setCapAmount(fee.capAmount || 0);
      setActive(fee.active);
    } else {
      setCalculationType("PERCENTAGE");
      setPercentage(0);
      setFlatAmount(0);
      setMinAmount(0);
      setMaxAmount(0);
      setCapAmount(0);
      setActive(true);
    }
  }, [fee, open]);

  const handleSave = () => {
    onSave({
      calculationType,
      percentage,
      flatAmount,
      minAmount,
      maxAmount,
      capAmount,
      active
    });
    onOpenChange(false);
  };

  const dialogTitle = fee ? "Edit Fee Config" : "Add Fee Config";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>Configure escrow fee rules.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label>Fee Type</Label>
            <Select value={calculationType} onValueChange={(v: "PERCENTAGE" | "FIXED") => setCalculationType(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                <SelectItem value="FIXED">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {calculationType === "PERCENTAGE" && (
            <div className="space-y-2">
              <Label>Percentage (%)</Label>
              <Input type="number" value={percentage} onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)} />
            </div>
          )}

          {calculationType === "FIXED" && (
            <div className="space-y-2">
              <Label>Flat Amount</Label>
              <Input type="number" value={flatAmount} onChange={(e) => setFlatAmount(parseFloat(e.target.value) || 0)} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Transaction Amount</Label>
              <Input type="number" value={minAmount} onChange={(e) => setMinAmount(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Max Transaction Amount</Label>
              <Input type="number" value={maxAmount} onChange={(e) => setMaxAmount(parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cap Amount (Max Fee)</Label>
            <Input type="number" value={capAmount} onChange={(e) => setCapAmount(parseFloat(e.target.value) || 0)} />
          </div>

          <div className="flex items-center justify-between">
            <Label>Active Status</Label>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
