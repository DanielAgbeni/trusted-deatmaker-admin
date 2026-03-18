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
    <div className="container p-6 max-w-5xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            size="sm" 
            className="p-0 h-auto hover:bg-transparent -ml-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to transactions
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Escrow Transaction</h1>
            <Badge className={cn("rounded-full px-3 py-1 font-medium", getStatusStyle(deal.status))}>
              {deal.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">ID: {deal.transactionReference}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Amount Hero Section - Compact Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Original</p>
              <p className="text-xl font-bold font-outfit">{formatCurrency(deal.originalAmount)}</p>
              <DollarSign className="absolute -right-2 -bottom-2 h-12 w-12 opacity-5" />
            </div>
            
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Estimated Payout</p>
              <p className="text-xl font-bold font-outfit text-emerald-700">{formatCurrency(deal.payoutAmount)}</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">Total Fees</p>
              <p className="text-xl font-bold font-outfit text-blue-700">{formatCurrency(deal.totalFees)}</p>
            </div>
          </div>

          {/* Details Section - Merged and Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Metadata & Schedule</span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Marketplace</span>
                    <p className="text-sm font-semibold text-slate-900">{deal.vendorName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Vendor Ref</span>
                    <p className="text-sm font-medium text-slate-700 truncate">{deal.vendorReference || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Created On</span>
                    <p className="text-sm text-slate-700">{formatDate(deal.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Fee Bearer</span>
                    <div><Badge variant="outline" className="h-4 text-[9px] uppercase font-bold py-0">{deal.feeBearer}</Badge></div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Funding Expiry</span>
                    <p className="text-sm font-medium text-slate-900">{formatDate(deal.fundingExpiryTime)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Auto-Release</span>
                    <p className="text-sm font-medium text-slate-900">{formatDate(deal.autoReleaseAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Execution Progress</span>
              </div>
              <div className="space-y-4 relative">
                <div className="absolute left-2.5 top-2 bottom-2 w-px bg-slate-100" />
                {deal.milestones?.map((m) => (
                  <div key={m.milestoneId} className="flex gap-3 relative z-10">
                    <div className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ring-1",
                      m.status === "COMPLETED" ? "bg-emerald-500 ring-emerald-100" : "bg-slate-200 ring-slate-100"
                    )}>
                      {m.status === "COMPLETED" && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className={cn("text-xs font-bold truncate", m.status === "COMPLETED" ? "text-slate-900" : "text-slate-400")}>
                          {m.title}
                        </p>
                        <span className="text-[10px] font-bold text-slate-500 ml-2 shrink-0">{formatCurrency(m.amount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Involved Parties</h3>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-900 text-white font-bold text-xs">{deal.buyer.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Buyer</span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{deal.buyer.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{deal.buyer.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-orange-600 text-white font-bold text-xs">{deal.seller.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Seller</span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{deal.seller.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{deal.seller.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
