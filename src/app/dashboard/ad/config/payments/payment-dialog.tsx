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
import { useConfigurePaymentFeeMutation, useUpdatePaymentFeeMutation } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { toast } from "sonner";
import { Percent, Wallet, ShieldCheck, Globe } from "lucide-react";

interface PaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    config?: any;
}

export function PaymentDialog({ isOpen, onClose, config }: PaymentDialogProps) {
    const [configurePaymentFee, { isLoading: isCreating }] = useConfigurePaymentFeeMutation();
    const [updatePaymentFee, { isLoading: isUpdating }] = useUpdatePaymentFeeMutation();

    const isLoading = isCreating || isUpdating;

    const [formData, setFormData] = useState({
        provider: "PAYSTACK",
        method: "BANK_TRANSFER",
        type: "DEPOSIT",
        currencyCode: "NGN",
        percentage: 0,
        flatFee: 0,
        capAmount: 0,
    });

    useEffect(() => {
        if (config) {
            setFormData({
                provider: config.provider || "PAYSTACK",
                method: config.method || "BANK_TRANSFER",
                type: config.type || "DEPOSIT",
                currencyCode: config.currency?.code || "NGN",
                percentage: config.percentageFee || 0,
                flatFee: config.flatFee || 0,
                capAmount: config.capAmount || 0,
            });
        } else {
            setFormData({
                provider: "PAYSTACK",
                method: "BANK_TRANSFER",
                type: "DEPOSIT",
                currencyCode: "NGN",
                percentage: 0,
                flatFee: 0,
                capAmount: 0,
            });
        }
    }, [config, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (config?.id) {
                await updatePaymentFee({
                    id: config.id,
                    ...formData
                }).unwrap();
                toast.success("Payment fee updated successfully");
            } else {
                await configurePaymentFee(formData).unwrap();
                toast.success("Payment fee configured successfully");
            }
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${config ? 'update' : 'configure'} payment fee`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl max-h-[90vh] flex flex-col">
                <DialogHeader className="bg-cyan-600 p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldCheck size={120} />
                    </div>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Wallet className="h-6 w-6" />
                        Configure Payment Fee
                    </DialogTitle>
                    <DialogDescription className="text-cyan-50 font-medium">
                        Set fees for deposit and withdrawal methods across providers.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Provider</Label>
                                <Select
                                    value={formData.provider}
                                    onValueChange={(val) => setFormData({ ...formData, provider: val })}
                                >
                                    <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-cyan-500">
                                        <SelectValue placeholder="Select Provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PAYSTACK">Paystack</SelectItem>
                                        <SelectItem value="STRIPE">Stripe</SelectItem>
                                        <SelectItem value="FLUTTERWAVE">Flutterwave</SelectItem>
                                        <SelectItem value="SQUAD">Squad</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Currency</Label>
                                <Select
                                    value={formData.currencyCode}
                                    onValueChange={(val) => setFormData({ ...formData, currencyCode: val })}
                                >
                                    <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-cyan-500">
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-cyan-500" />
                                            <SelectValue placeholder="Select Currency" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NGN">NGN (Naira)</SelectItem>
                                        <SelectItem value="USD">USD (Dollar)</SelectItem>
                                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                                        <SelectItem value="GBP">GBP (Pound)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Payment Method</Label>
                                <Select
                                    value={formData.method}
                                    onValueChange={(val) => setFormData({ ...formData, method: val })}
                                >
                                    <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-cyan-500">
                                        <SelectValue placeholder="Select Method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                        <SelectItem value="CARD">Card Payment</SelectItem>
                                        <SelectItem value="USSD">USSD</SelectItem>
                                        <SelectItem value="VIRTUAL_ACCOUNT">Virtual Account</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Transaction Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-cyan-500">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DEPOSIT">Deposit</SelectItem>
                                        <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Percentage Fee (%)</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="0.001"
                                            value={formData.percentage * 100}
                                            onChange={(e) => setFormData({ ...formData, percentage: parseFloat(e.target.value) / 100 })}
                                            className="h-12 rounded-xl pl-10 border-gray-200 focus:ring-cyan-500"
                                        />
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Flat Fee (₦)</Label>
                                    <Input
                                        type="number"
                                        value={formData.flatFee}
                                        onChange={(e) => setFormData({ ...formData, flatFee: parseFloat(e.target.value) })}
                                        className="h-12 rounded-xl border-gray-200 focus:ring-cyan-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-700">Charge Cap Amount (Max Fee)</Label>
                                <Input
                                    type="number"
                                    value={formData.capAmount}
                                    onChange={(e) => setFormData({ ...formData, capAmount: parseFloat(e.target.value) })}
                                    className="h-12 rounded-xl border-gray-200 focus:ring-cyan-500"
                                    placeholder="e.g., 2000"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl h-12 px-8 font-bold min-w-[140px] shadow-lg shadow-cyan-100 transition-all active:scale-95"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                "Save Configuration"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl h-12 px-8 border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
