"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetDealDetailQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2, Clock, ShieldCheck, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TransactionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: response, isLoading, error } = useGetDealDetailQuery(id);
  const deal = response?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Fetching escrow record details...</p>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Deal Not Found</h2>
        <p className="text-sm text-muted-foreground">The deal ID provided might be invalid or there was a server error.</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
      case "FUNDED":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "PENDING":
      case "AWAITING_FUNDING":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "CANCELLED":
      case "FAILED":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "DISPUTED":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return (deal.currency || "₦") + amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
  };

  return (
    <div className="container p-6 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={() => router.back()} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Escrow Deal Details</h1>
        </div>
        <Badge className={getStatusStyle(deal.status)}>
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
          {deal.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Overview */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b bg-slate-50/50">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 px-6 pb-6 text-sm">
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Deal Reference</span>
                  <span className="font-semibold text-slate-800">#{deal.transactionReference}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Vendor Reference</span>
                  <span className="font-medium text-slate-700">{deal.vendorReference || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Created On</span>
                  <span className="text-slate-700">{formatDate(deal.createdAt)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Marketplace</span>
                  <span className="font-semibold text-primary">{deal.vendorName}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Locked Amount</span>
                  <span className="font-bold text-slate-800">{formatCurrency(deal.lockedAmount)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Payout Amount</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(deal.payoutAmount)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Fee Bearer</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-600">{deal.feeBearer}</Badge>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Disputed</span>
                  <Badge variant={deal.disputed ? "destructive" : "outline"} className="text-[10px]">
                    {deal.disputed ? "YES" : "NO"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b bg-primary/5">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-primary" />
              Financial Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
              <span className="text-slate-600">Original Amount</span>
              <span className="text-lg font-bold text-slate-800">{formatCurrency(deal.originalAmount)}</span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Platform Fee</span>
                <span className="font-medium text-slate-800">+{formatCurrency(deal.platformFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vendor Commission</span>
                <span className="font-medium text-slate-800">+{formatCurrency(deal.vendorCommission)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-bold text-slate-700">Total Fees</span>
                <span className="font-bold text-slate-900">{formatCurrency(deal.totalFees)}</span>
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Estimated Payout</p>
                <p className="text-sm font-bold text-blue-900">{formatCurrency(deal.payoutAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parties Involved */}
        <Card className="lg:col-span-1 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="pb-3 border-b bg-slate-50/50">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center">
              Involved Parties
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8 flex-1">
            {/* Buyer */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Buyer</div>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary font-bold">
                    {deal.buyer.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800">{deal.buyer.name}</p>
                  <p className="text-xs text-slate-500">{deal.buyer.email}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100 italic text-[10px] text-center bg-white px-2 text-slate-400">vs</span>
              </div>
            </div>

            {/* Seller */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Seller</div>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-orange-100">
                  <AvatarFallback className="bg-orange-50 text-orange-600 font-bold">
                    {deal.seller.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800">{deal.seller.name}</p>
                  <p className="text-xs text-slate-500">{deal.seller.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b bg-slate-50/50">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
              Delivery Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {deal.milestones && deal.milestones.length > 0 ? (
                deal.milestones.map((m, idx) => (
                  <div key={m.milestoneId} className="flex space-x-4 items-start relative pb-4 last:pb-0">
                    {/* Progress line */}
                    {idx < deal.milestones.length - 1 && (
                      <div className="absolute left-3.5 top-8 w-0.5 h-full bg-slate-100" />
                    )}
                    <div className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center shrink-0 z-10",
                      m.status === "COMPLETED" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {m.status === "COMPLETED" ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{m.sequence}</span>}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-bold text-slate-800">{m.title}</h4>
                        <span className="text-sm font-bold text-slate-900">{formatCurrency(m.amount)}</span>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold uppercase",
                        m.status === "COMPLETED" ? "border-emerald-200 text-emerald-600 bg-emerald-50" : "border-slate-200 text-slate-400 bg-slate-50"
                      )}>
                        {m.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm italic">No milestones recorded for this deal</p>
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-1">Funding Expiry</p>
                <p className="text-sm font-semibold text-slate-800">{formatDate(deal.fundingExpiryTime)}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider mb-1">Auto-Release Scheduled</p>
                <p className="text-sm font-semibold text-slate-800">{formatDate(deal.autoReleaseAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Utility function for conditional classes if not globally available
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
