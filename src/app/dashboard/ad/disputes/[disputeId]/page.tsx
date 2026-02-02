"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ExternalLink, ShieldAlert, User, Briefcase, Calendar, Info } from "lucide-react";
import { useGetDisputeDetailQuery, useGetDealDetailQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { toast } from "sonner";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "RESOLVED":
    case "CLOSED":
      return "bg-green-100 text-green-700 border-green-200";
    case "OPEN":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "NEGOTIATION":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "ARBITRATION":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function DisputeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = params.disputeId as string;

  const { data: disputeResponse, isLoading: isLoadingDispute, error: disputeError } = useGetDisputeDetailQuery(disputeId);
  const dispute = disputeResponse?.data;

  // Fetch deal details to get buyer/seller info if dealId is available
  const { data: dealResponse, isLoading: isLoadingDeal } = useGetDealDetailQuery(dispute?.dealId || "", {
    skip: !dispute?.dealId,
  });
  const deal = dealResponse?.data;

  if (isLoadingDispute) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-muted-foreground animate-pulse">Fetching dispute details...</p>
      </div>
    );
  }

  if (disputeError || !dispute) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShieldAlert className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-900">Dispute Not Found</h2>
        <p className="text-muted-foreground max-w-xs text-center">
          We couldn't find the dispute details you're looking for. It might have been deleted or the ID is invalid.
        </p>
        <Button onClick={() => router.back()} variant="outline" className="mt-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container p-6 max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">Dispute Details</h1>
            <p className="text-sm text-muted-foreground">Managing dispute for Deal: <span className="font-mono font-medium text-blue-600">{dispute.dealReference}</span></p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => toast.info("Action coming soon")}>
            Reject
          </Button>
          <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => toast.info("Action coming soon")}>
            Escalate
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => toast.info("Action coming soon")}>
            Resolve Case
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  Case Overview
                </CardTitle>
                <Badge variant="outline" className={`${getStatusStyle(dispute.status)} py-1`}>
                  • {dispute.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Reason</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{dispute.reason.toLowerCase().replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Dispute Amount</span>
                    <span className="text-lg font-bold text-gray-900">₦{dispute.disputeAmount?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Opened On</span>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(dispute.openedAt).toLocaleDateString()} at {new Date(dispute.openedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Opened By</span>
                    <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">{dispute.openedBy.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {dispute.openedBy}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Marketplace/Vendor</span>
                    <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      {dispute.vendorName}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Escalated</span>
                    <Badge variant={dispute.escalated ? "destructive" : "secondary"} className="w-fit">
                      {dispute.escalated ? "YES" : "NO"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-3">Case Description</span>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm leading-relaxed text-gray-700 italic">
                  "{dispute.description || "No description provided for this dispute."}"
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Deal Info */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  Related Transaction
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 h-8 hover:bg-blue-50" onClick={() => router.push(`/dashboard/ad/deals/${dispute.dealId}`)}>
                  View Deal Details
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Reference</p>
                  <p className="text-sm font-mono text-gray-900 font-medium">{dispute.dealReference}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Deal Status</p>
                  <Badge className="py-0.5 text-[11px]">{deal?.status || "Loading..."}</Badge>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Total Amount</p>
                  <p className="text-sm font-bold text-gray-900">₦{deal?.originalAmount?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Currency</p>
                  <p className="text-sm font-medium text-gray-900">{deal?.currency || "NGN"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Parties Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-50">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-500 uppercase tracking-tighter">
                <User className="h-4 w-4" /> Parties Involved
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Buyer */}
              <div className="p-5 border-b border-gray-50 group hover:bg-gray-50/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10 border-2 border-blue-100 ring-2 ring-white ring-offset-0">
                    <AvatarFallback className="bg-blue-600 text-white font-bold">{deal?.buyer?.name?.substring(0, 2).toUpperCase() || 'B'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">{deal?.buyer?.name || "Loading Buyer..."}</h4>
                    <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wide">Buyer</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <p className="flex justify-between"><span>Email:</span> <span className="font-medium text-gray-900">{deal?.buyer?.email || "N/A"}</span></p>
                </div>
              </div>

              {/* Seller */}
              <div className="p-5 group hover:bg-gray-50/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10 border-2 border-green-100 ring-2 ring-white ring-offset-0">
                    <AvatarFallback className="bg-green-600 text-white font-bold">{deal?.seller?.name?.substring(0, 2).toUpperCase() || 'S'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">{deal?.seller?.name || "Loading Seller..."}</h4>
                    <span className="text-[11px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase tracking-wide">Seller</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <p className="flex justify-between"><span>Email:</span> <span className="font-medium text-gray-900">{deal?.seller?.email || "N/A"}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider opacity-80">Moderation Tools</h3>
              <p className="text-xs opacity-90 leading-relaxed">
                As an arbitrator, you can review the deal milestones and chat history to make a fair decision.
              </p>
              <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs" onClick={() => toast.info("Milestones panel coming soon")}>
                Review Milestones
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
