"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Loader2,
    ArrowLeft,
    MessageSquare,
    CheckCircle2,
    AlertCircle,
    FileText,
    Clock,
    ChevronRight,
    User,
    ExternalLink,
    AlertTriangle,
} from "lucide-react";
import {
    useGetDisputeDashboardQuery,
    useGetDealDetailQuery,
    useConfirmResolutionMutation,
} from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { toast } from "sonner";
import { DisputeMessagesDrawer } from "./dispute-messages-drawer";
import { cn } from "@/lib/utils";

// Interface for Resolution Form
interface ResolutionForm {
    type: string;
    totalAmount: number;
    buyerAmount: number;
    sellerAmount: number;
    platformFee: number;
    feePayer: string;
    conditionDescription: string;
    conditionDeadline: string;
    arbitrationService: 'internal' | 'external';
    arbitrationFeePayer: string;
    adminNotes: string;
}

export default function DisputeDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const disputeId = params.disputeId as string;

    const { data: dashboardResponse, isLoading: isLoadingDispute } = useGetDisputeDashboardQuery({ searchTerm: disputeId });
    const dispute = dashboardResponse?.data?.disputes?.content?.[0] as any;

    const { data: dealResponse } = useGetDealDetailQuery(dispute?.dealId || "", {
        skip: !dispute?.dealId,
    });
    const deal = dealResponse?.data;

    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const [form, setForm] = useState<ResolutionForm>({
        type: "FULL_REFUND",
        totalAmount: dispute?.dealAmount || 5000,
        buyerAmount: dispute?.dealAmount || 5000,
        sellerAmount: 0,
        platformFee: 0,
        feePayer: "Seller Pays Fee",
        conditionDescription: "",
        conditionDeadline: "",
        arbitrationService: 'internal',
        arbitrationFeePayer: "Seller Pays Arbitration",
        adminNotes: "",
    });

    const [confirmResolution, { isLoading: isConfirming }] = useConfirmResolutionMutation();

    const handleFormChange = (key: keyof ResolutionForm, value: any) => {
        setForm(prev => {
            const newForm = { ...prev, [key]: value };

            // Auto-allocation logic for specific types
            if (key === 'type') {
                if (value === 'FULL_REFUND') {
                    newForm.buyerAmount = newForm.totalAmount;
                    newForm.sellerAmount = 0;
                } else if (value === 'REJECT') {
                    newForm.buyerAmount = 0;
                    newForm.sellerAmount = newForm.totalAmount;
                }
            }

            return newForm;
        });
    };

    const handleSubmit = async () => {
        if (!dispute?.id) return;
        try {
            await confirmResolution(dispute.id).unwrap();
            toast.success("Resolution submitted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to submit resolution");
        }
    };

    if (isLoadingDispute) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    if (!dispute) return <div>Dispute not found</div>;

    const amountAllocated = form.buyerAmount + form.sellerAmount + form.platformFee;
    const isAllocationCorrect = Math.abs(amountAllocated - form.totalAmount) < 0.01;

    const arbitrationFee = form.arbitrationService === 'internal'
        ? Math.min(Math.max(form.totalAmount * 0.02, 500), 5000)
        : 10000;

    const showConditionDetails = form.type === "REVISION" || form.type === "REPLACEMENT";

    return (
        <div className="min-h-screen bg-slate-50/50 p-6">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <div className="flex flex-col gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="w-fit p-0 h-auto text-slate-500 hover:bg-transparent hover:text-slate-700 font-medium"
                    >
                        <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Manage Dispute
                    </Button>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-slate-400">Case ID: </span>
                        <span className="text-sm font-bold text-slate-800">#{dispute.disputeReference} - {dispute.reason}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <TabsList className="w-full bg-slate-50/50 border-b border-slate-200 h-14 justify-start px-0 overflow-x-auto">
                                <TabsTrigger
                                    value="overview"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-white h-full px-8 text-sm font-bold"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="evidence"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-white h-full px-8 text-sm font-bold"
                                >
                                    Evidence ({(dispute?.evidenceCountClaimant || 0) + (dispute?.evidenceCountRespondent || 0)})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="timeline"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-white h-full px-8 text-sm font-bold"
                                >
                                    Timeline
                                </TabsTrigger>
                            </TabsList>

                            <div className="p-6">
                                <TabsContent value="overview" className="mt-0 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-base font-bold text-slate-900">Buyer's Claim</h3>
                                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 space-y-2">
                                            <p className="text-sm font-bold text-slate-800">{dispute.claimant?.name || "Unknown Buyer"}</p>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                {dispute.description || "The buyer reports that the product received does not match the description provided by the seller. The screen is damaged."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-base font-bold text-slate-900">Seller's Defense</h3>
                                        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/50 space-y-2">
                                            <p className="text-sm font-bold text-slate-800">{dispute.respondent?.name || "Unknown Seller"}</p>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                {dispute.respondentResponse || "The seller maintains that the product sent was exactly as described and was in good condition before shipping."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-base font-bold text-slate-900">Transaction Details</h3>
                                        <div className="bg-slate-50 border rounded-xl overflow-hidden">
                                            <div className="flex justify-between items-center p-4 border-b">
                                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Product</span>
                                                <span className="text-sm font-bold text-slate-800">{dispute.milestoneTitle || "HP Pavilion Laptop - 15.6\" Display, Intel Core i5"}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4">
                                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Amount</span>
                                                <span className="text-sm font-bold text-slate-800">
                                                    {dispute.currencyCode} {dispute.dealAmount?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold h-10"
                                        onClick={() => setIsMessagesOpen(true)}
                                    >
                                        Open Chat Section
                                    </Button>
                                </TabsContent>

                                <TabsContent value="evidence" className="mt-0 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[1, 2, 3].map((item) => (
                                            <div key={item} className="flex flex-col gap-3 group">
                                                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                                                    <img
                                                        src={`https://picsum.photos/seed/${item + 20}/400/400`}
                                                        alt="Evidence"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-800 truncate">
                                                        {item === 1 ? "Damaged laptop screen" : item === 2 ? "Packaging photos" : "WhatsApp Chat Log"}
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] text-slate-400 font-medium">By {item === 2 ? "Seller" : "Buyer"}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">Recently</span>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" className="h-8 border-cyan-200 text-cyan-600 font-bold bg-cyan-50">
                                                    View Full Size
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="timeline" className="mt-0">
                                    <div className="space-y-6">
                                        {[
                                            { step: 1, title: "Order Placed", date: dispute.createdAt },
                                            { step: 2, title: "Dispute Opened", date: dispute.createdAt },
                                            { step: 3, title: "Tier 1 Negotiation Failed", date: dispute.createdAt },
                                            { step: 4, title: "Escalated to Admin", date: dispute.createdAt },
                                        ].map((event) => (
                                            <div key={event.step} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {event.step}
                                                    </div>
                                                    {event.step !== 4 && <div className="w-0.5 h-full bg-slate-100 mt-1 mb-1" />}
                                                </div>
                                                <div className="pb-8">
                                                    <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
                                                    <p className="text-xs text-slate-400 font-medium mt-1">
                                                        {new Date(event.date).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 space-y-8">
                                <div className="text-center space-y-1">
                                    <h2 className="text-lg font-bold text-slate-900">Enter Resolution</h2>
                                    <div className="h-1 w-20 bg-cyan-400 mx-auto rounded-full" />
                                </div>

                                <RadioGroup value={form.type} onValueChange={(v) => handleFormChange('type', v)} className="space-y-2">
                                    {[
                                        { id: "FULL_REFUND", label: "Refund to Buyer" },
                                        { id: "REVISION", label: "Revision (Service Redo)" },
                                        { id: "REPLACEMENT", label: "Replacement (New Item)" },
                                        { id: "CANCELLATION", label: "Cancellation" },
                                        { id: "REJECT", label: "Reject Dispute" },
                                    ].map((option) => (
                                        <div key={option.id} className={cn(
                                            "flex items-center space-x-3 border rounded-lg p-3 px-4 transition-colors cursor-pointer",
                                            form.type === option.id ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200" : "hover:bg-slate-50 border-slate-100"
                                        )} onClick={() => handleFormChange('type', option.id)}>
                                            <RadioGroupItem value={option.id} id={option.id} className="text-cyan-500" />
                                            <Label htmlFor={option.id} className="flex-1 font-bold text-sm text-slate-700 cursor-pointer">{option.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>

                                {form.type === "REVISION" && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
                                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                                        <p className="text-xs font-medium text-amber-700 leading-relaxed">
                                            Warning: Revision is typically for services only. This is a Tangible Goods transaction.
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-900 capitalize">Financial Allocation</h3>
                                        {form.type === "FULL_REFUND" && (
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-bold text-[10px]">
                                                Locked
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</Label>
                                            <Input
                                                type="number"
                                                value={form.totalAmount}
                                                onChange={(e) => handleFormChange('totalAmount', Number(e.target.value))}
                                                className="bg-slate-50 border-slate-200 font-bold"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase">Buyer Amount</Label>
                                                <Input
                                                    type="number"
                                                    value={form.buyerAmount}
                                                    onChange={(e) => handleFormChange('buyerAmount', Number(e.target.value))}
                                                    className="bg-slate-50 border-slate-200 font-bold"
                                                    disabled={form.type === "FULL_REFUND"}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase">Seller Amount</Label>
                                                <Input
                                                    type="number"
                                                    value={form.sellerAmount}
                                                    onChange={(e) => handleFormChange('sellerAmount', Number(e.target.value))}
                                                    className="bg-slate-50 border-slate-200 font-bold"
                                                    disabled={form.type === "FULL_REFUND"}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">Platform Fee</Label>
                                            <Input
                                                type="number"
                                                value={form.platformFee}
                                                onChange={(e) => handleFormChange('platformFee', Number(e.target.value))}
                                                className="bg-slate-50 border-slate-200 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">Fee Payer</Label>
                                            <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 px-4 text-sm font-medium text-slate-700 flex justify-between items-center cursor-pointer">
                                                {form.feePayer}
                                                <ChevronRight className="h-4 w-4 rotate-90 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "flex items-center gap-2 p-3 rounded-lg border text-[11px] font-bold",
                                        isAllocationCorrect ? "bg-green-100 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
                                    )}>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Allocation {isAllocationCorrect ? 'correct' : 'incorrect'}: {dispute.currencyCode} {amountAllocated?.toLocaleString()}
                                    </div>
                                </div>

                                {showConditionDetails && (
                                    <div className="p-4 bg-amber-50/30 rounded-xl border border-amber-200 space-y-4">
                                        <h3 className="text-sm font-bold text-slate-900">Condition Details</h3>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition Description * (min 20 characters)</Label>
                                            <Textarea
                                                placeholder="e.g. Repair fence blue, replace damaged parts, etc."
                                                value={form.conditionDescription}
                                                onChange={(e) => handleFormChange('conditionDescription', e.target.value)}
                                                className="bg-white border-slate-200 min-h-[80px] resize-none text-sm placeholder:italic placeholder:text-slate-300"
                                            />
                                            <div className="flex justify-end">
                                                <span className="text-[10px] font-medium text-slate-400">{form.conditionDescription.length}/20 characters</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition Deadline * (3-90 days from now)</Label>
                                            <Input
                                                type="date"
                                                value={form.conditionDeadline}
                                                onChange={(e) => handleFormChange('conditionDeadline', e.target.value)}
                                                className="bg-white border-slate-200 h-10 font-medium"
                                                placeholder="dd/mm/yyyy"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-6">
                                    <h3 className="text-sm font-bold text-slate-900 text-center">Arbitration Fee Calculator</h3>
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Arbitration Service</div>
                                        <div className="flex bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
                                            <button
                                                className={cn("flex-1 h-10 rounded-md text-xs font-bold transition-all", form.arbitrationService === 'internal' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600')}
                                                onClick={() => handleFormChange('arbitrationService', 'internal')}
                                            >
                                                Internal
                                            </button>
                                            <button
                                                className={cn("flex-1 h-10 rounded-md text-xs font-bold transition-all", form.arbitrationService === 'external' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600')}
                                                onClick={() => handleFormChange('arbitrationService', 'external')}
                                            >
                                                External
                                            </button>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">Arbitration Fee Payer</Label>
                                            <div className="w-full bg-white border border-slate-200 rounded-lg p-2.5 px-4 text-sm font-medium text-slate-700 flex justify-between items-center cursor-pointer">
                                                {form.arbitrationFeePayer}
                                                <ChevronRight className="h-4 w-4 rotate-90 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-sm flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Calculated Arbitration Fee:</p>
                                                <p className="text-[10px] text-slate-400 font-medium italic">To be paid by: <span className="font-bold">seller</span></p>
                                            </div>
                                            <p className="text-lg font-bold text-cyan-500">₦{arbitrationFee.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase">Admin Notes</Label>
                                    <Textarea
                                        placeholder="Explain your decision reasoning..."
                                        className="bg-slate-50 border-slate-200 min-h-[80px] resize-none"
                                        value={form.adminNotes}
                                        onChange={(e) => handleFormChange('adminNotes', e.target.value)}
                                    />
                                </div>

                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-lg shadow-emerald-100"
                                    onClick={handleSubmit}
                                    disabled={isConfirming || !isAllocationCorrect || (showConditionDetails && form.conditionDescription.length < 20)}
                                >
                                    Submit Decision
                                </Button>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Time in Queue</span>
                                <span className="text-sm font-bold text-slate-800">4 hours</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Evidence Items</span>
                                <span className="text-sm font-bold text-slate-800">{(dispute?.evidenceCountClaimant || 0) + (dispute?.evidenceCountRespondent || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">SLA Remaining</span>
                                <span className="text-sm font-bold text-red-500">{dispute.sla?.remainingTime || "Calculating..."}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DisputeMessagesDrawer
                disputeId={dispute.id}
                isOpen={isMessagesOpen}
                onOpenChange={setIsMessagesOpen}
            />
        </div>
    );
}