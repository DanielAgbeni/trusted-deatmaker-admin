"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useProposeResolutionMutation } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { toast } from "sonner";
import { Loader2, Calculator } from "lucide-react";
import { ProposeResolutionRequest } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";

interface ProposeResolutionDialogProps {
  disputeId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dealAmount: number;
  isTier3?: boolean;
  onSuccess?: () => void;
}

export function ProposeResolutionDialog({
  disputeId,
  isOpen,
  onOpenChange,
  dealAmount,
  isTier3 = false,
  onSuccess,
}: ProposeResolutionDialogProps) {
  const [proposeResolution, { isLoading }] = useProposeResolutionMutation();

  const [resolutionType, setResolutionType] = useState<ProposeResolutionRequest["resolutionType"]>("PARTIAL_REFUND");
  const [refundPercentage, setRefundPercentage] = useState<number>(50);
  const [refundAmount, setRefundAmount] = useState<number>(dealAmount * 0.5);
  const [arbitrationFeeType, setArbitrationFeeType] = useState<ProposeResolutionRequest["arbitrationFeeType"]>("INTERNAL");
  const [arbitrationFeeAmount, setArbitrationFeeAmount] = useState<number>(0);
  const [arbitrationFeePayer, setArbitrationFeePayer] = useState<ProposeResolutionRequest["arbitrationFeePayer"]>("SPLIT_50_50");
  const [adminNotes, setAdminNotes] = useState("");
  const [publicSummary, setPublicSummary] = useState("");

  const handlePercentageChange = (val: string) => {
    const pct = parseFloat(val) || 0;
    setRefundPercentage(pct);
    setRefundAmount((dealAmount * pct) / 100);
  };

  const handleAmountChange = (val: string) => {
    const amt = parseFloat(val) || 0;
    setRefundAmount(amt);
    setRefundPercentage((amt / dealAmount) * 100);
  };

  const handleSubmit = async () => {
    if (!adminNotes) {
      toast.error("Admin notes are required");
      return;
    }

    const payload: any = {
      disputeId,
      resolutionType,
      refundPercentage,
      refundAmount,
      adminNotes,
      publicSummary,
    };

    if (isTier3) {
      if (arbitrationFeeType !== "NONE") {
        const feeCap = dealAmount * 0.2;
        if (arbitrationFeeAmount > feeCap) {
          toast.error(`Arbitration fee cannot exceed 20% of deal amount (${feeCap.toLocaleString()})`);
          return;
        }
      }

      payload.arbitrationFeeType = arbitrationFeeType;
      
      // Only send amount and payer if not internal
      if (arbitrationFeeType !== "INTERNAL") {
        payload.arbitrationFeeAmount = arbitrationFeeAmount;
        payload.arbitrationFeePayer = arbitrationFeePayer;
      }
    }

    try {
      await proposeResolution(payload).unwrap();

      toast.success("Resolution proposed successfully");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to propose resolution");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-outfit text-slate-900">
            {isTier3 ? "Enforce arbitration decisions" : "Propose Resolution"}
          </DialogTitle>
          <DialogDescription>
            Determine the financial outcome for this dispute. This will be reviewed before execution.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resolutionType">Resolution Type</Label>
                <Select
                  value={resolutionType}
                  onValueChange={(val: any) => setResolutionType(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_REFUND">Full Refund</SelectItem>
                    <SelectItem value="PARTIAL_REFUND">Partial Refund</SelectItem>
                    <SelectItem value="REVISION">Revision</SelectItem>
                    <SelectItem value="REPLACEMENT">Replacement</SelectItem>
                    <SelectItem value="CANCELLATION">Cancellation</SelectItem>
                    <SelectItem value="REJECT">Reject (Payout to Seller)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {resolutionType === "PARTIAL_REFUND" && (
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-end">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Refund Distribution</Label>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-slate-900 font-outfit">{refundPercentage}%</span>
                      <p className="text-[10px] text-slate-400 font-medium">to Buyer</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={refundPercentage}
                      onChange={(e) => handlePercentageChange(e.target.value)}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />

                    <div className="flex items-center gap-2">
                      <div className="relative max-w-sm">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                        <Input
                          id="amount"
                          type="number"
                          className="pl-7 font-bold text-lg h-12"
                          value={refundAmount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isTier3 && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4 h-full">
                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                    <Calculator className="h-4 w-4" /> Arbitration Fees
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 w-full">
                      <Label className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Fee Type</Label>
                      <Select
                        value={arbitrationFeeType}
                        onValueChange={(val: any) => setArbitrationFeeType(val)}
                      >
                        <SelectTrigger className="h-10 text-sm bg-white w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INTERNAL">Internal</SelectItem>
                          <SelectItem value="EXTERNAL">External</SelectItem>
                          <SelectItem value="NONE">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {arbitrationFeeType !== "INTERNAL" && arbitrationFeeType !== "NONE" && (
                      <>
                        <div className="space-y-1.5 w-full animate-in slide-in-from-left-2 duration-300">
                          <Label className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Fee Amount</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-400">₦</span>
                            <Input
                              type="number"
                              className="h-9 text-sm bg-white pl-7"
                              value={arbitrationFeeAmount}
                              onChange={(e) => setArbitrationFeeAmount(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <p className="text-[9px] text-blue-500 font-medium">Max: ₦{(dealAmount * 0.2).toLocaleString()} (20%)</p>
                        </div>
                        <div className="space-y-1.5 w-full animate-in slide-in-from-right-2 duration-300">
                          <Label className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Fee Payer</Label>
                          <Select
                            value={arbitrationFeePayer}
                            onValueChange={(val: any) => setArbitrationFeePayer(val)}
                          >
                            <SelectTrigger className="h-9 text-sm bg-white w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BUYER">Buyer</SelectItem>
                              <SelectItem value="SELLER">Seller</SelectItem>
                              <SelectItem value="SPLIT_50_50">Split 50/50</SelectItem>
                              <SelectItem value="PLATFORM_ABSORBS">Platform Absorbs</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                  {arbitrationFeeType === "INTERNAL" && (
                    <div className="p-2 border border-blue-200 bg-blue-100/50 rounded-lg animate-in fade-in duration-500">
                      <p className="text-[11px] text-blue-700 font-medium text-center">
                        Internal arbitration fees are calculated and deducted automatically by the system.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminNotes">Admin Notes (Internal only)</Label>
            <Textarea
              id="adminNotes"
              placeholder="Provide detailed reasoning for this resolution..."
              className="min-h-[100px]"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicSummary">Public Summary (Visible to parties)</Label>
            <Textarea
              id="publicSummary"
              placeholder="Short explanation of the outcome for buyer and seller..."
              value={publicSummary}
              onChange={(e) => setPublicSummary(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isTier3 ? "Enforce arbitration decisions" : "Propose Resolution"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
