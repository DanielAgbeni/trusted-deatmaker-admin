"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  ShieldAlert,
  User,
  Briefcase,
  Clock,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  useGetDisputeDetailQuery,
  useGetDealDetailQuery,
  useClaimDisputeMutation,
  useConfirmResolutionMutation,
} from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { toast } from "sonner";
import { ProposeResolutionDialog } from "./propose-resolution-dialog";
import { AssignAdminDialog } from "./assign-admin-dialog";
import { DisputeMessagesDrawer } from "./dispute-messages-drawer";

// Interface matching the actual API response
interface DisputeDetail {
  id: string;
  openedBy: "BUYER" | "SELLER";
  milestoneTitle: string;
  disputeReference: string;
  dealId: string;
  dealReference: string;
  dealAmount: number;
  currencyCode: string;
  status: string;
  tier: string;
  priority: string;
  reason: string;
  claimant: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  respondent: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  description: string;
  preferredResolution: string;
  requestedRefundAmount: number;
  requestedRefundPercentage: number;
  respondentResponse: string | null;
  respondentRespondedAt: string | null;
  assignedAdmin: {
    adminId: string;
    name: string;
    email: string;
  } | null;
  assignedAt: string | null;
  sla: {
    deadline: string;
    totalHours: number;
    remainingMinutes: number;
    remainingPercentage: number;
    colorCode: string;
    breached: boolean;
    atRisk: boolean;
  };
  evidenceCountClaimant: number;
  evidenceCountRespondent: number;
  unreadMessageCount: number | null;
  createdAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  milestones: Array<{
    id: string;
    title: string;
    amount: number;
    status: string;
    sequence: number;
    description: string;
    disputeReason: string;
    disputed: boolean;
  }>;
  proposals: Array<{
    id: string;
    proposedBy: string;
    resolutionType: string;
    refundAmount: number;
    payoutAmount: number;
    status: string;
    note: string;
    createdAt: string;
  }>;
  counterProposalResolution: any;
  counterProposalRefundAmount: any;
  counterProposalRefundPercentage: any;
  tier2Proposal: {
    resolutionType: string;
    buyerReceives: number;
    sellerReceives: number;
    publicSummary: string;
    consentDeadline: string;
    buyerAccepted: boolean | null;
    sellerAccepted: boolean | null;
  } | null;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "RESOLVED":
    case "CLOSED":
      return "bg-green-100 text-green-700 border-green-200";
    case "OPEN":
    case "ASSIGNED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "NEGOTIATION":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "ARBITRATION":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getPriorityStyle = (priority: string) => {
  return priority === "CRITICAL"
    ? "bg-red-100 text-red-700 border-red-200"
    : "bg-slate-100 text-slate-700 border-slate-200";
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function DisputeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = params.disputeId as string;

  const { data: disputeResponse, isLoading: isLoadingDispute, error: disputeError, refetch: refetchDispute } =
    useGetDisputeDetailQuery(disputeId);
  const dispute = disputeResponse?.data?.disputes?.content?.[0] as DisputeDetail | undefined;

  const { data: dealResponse } = useGetDealDetailQuery(dispute?.dealId || "", {
    skip: !dispute?.dealId,
  });
  const deal = dealResponse?.data;

  const [isResolutionOpen, setIsResolutionOpen] = React.useState(false);
  const [isAssignOpen, setIsAssignOpen] = React.useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = React.useState(false);
  const [claimDispute, { isLoading: isClaiming }] = useClaimDisputeMutation();
  const [confirmResolution, { isLoading: isConfirming }] = useConfirmResolutionMutation();

  const handleClaim = async () => {
    if (!dispute?.id) return;
    try {
      await claimDispute(dispute.id).unwrap();
      toast.success("Dispute claimed successfully");
      refetchDispute();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to claim dispute");
    }
  };

  const handleConfirmResolution = async () => {
    if (!dispute?.id) return;
    try {
      await confirmResolution(dispute.id).unwrap();
      toast.success("Resolution confirmed successfully");
      refetchDispute();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to confirm resolution");
    }
  };

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
          We couldn't find the dispute details you're looking for.
        </p>
        <Button onClick={() => router.back()} variant="outline" className="mt-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const openedByName = dispute.openedBy === "BUYER"
    ? dispute?.claimant?.name
    : dispute?.respondent?.name;

  const isAssigned = !!dispute.assignedAdmin;
  const isTier3 = dispute?.tier === 'TIER_3' || !!(dispute?.tier2Proposal && (dispute.tier2Proposal.buyerAccepted === false || dispute.tier2Proposal.sellerAccepted === false));

  return (
    <div className="container p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-0 rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-xl font-medium tracking-tight text-slate-900">
              Dispute Details
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {dispute?.milestones?.[0]?.title}
              </Badge>
              <Badge variant="outline" className={getStatusStyle(dispute.status)}>
                {dispute.status}
              </Badge>
              {dispute?.sla?.breached && (
                <Badge variant="destructive" className="gap-1 text-xs">
                  <AlertCircle className="h-3 w-3" /> SLA Breached
                </Badge>
              )}
              {/* {dispute?.sla?.atRisk && !dispute?.sla?.breached && (
                <Badge className="bg-orange-100 text-orange-700 gap-1 text-xs border-orange-200">
                  <Clock className="h-3 w-3" /> At Risk
                </Badge>
              )} */}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isAssigned ? (
            <>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleClaim}
                disabled={isClaiming}
                size="sm"
              >
                {isClaiming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign to myself
              </Button>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={() => setIsAssignOpen(true)}
                size="sm"
              >
                Assign to Admin
              </Button>
            </>
          ) : dispute.status !== 'RESOLVED' && dispute.status !== 'CLOSED' ? (
            <>
              {(dispute.tier === 'TIER_3' || (dispute.tier2Proposal && (dispute.tier2Proposal.buyerAccepted === false || dispute.tier2Proposal.sellerAccepted === false))) ? (
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setIsResolutionOpen(true)}
                  size="sm"
                >
                  Enforce Resolution
                </Button>
              ) : dispute.tier2Proposal && dispute.tier2Proposal.buyerAccepted && dispute.tier2Proposal.sellerAccepted ? (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleConfirmResolution}
                  disabled={isConfirming}
                  size="sm"
                >
                  {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Resolution
                </Button>
              ) : !dispute.tier2Proposal ? (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setIsResolutionOpen(true)}
                  size="sm"
                >
                  Propose Resolution
                </Button>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {/* Admin Assignment - minimal */}
      <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-blue-50">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Assigned Admin</p>
            {dispute.assignedAdmin ? (
              <div>
                <p className="font-medium">{dispute.assignedAdmin.name}</p>
                <p className="text-sm text-muted-foreground">{dispute.assignedAdmin.email}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Unassigned</p>
            )}
          </div>
        </div>
        {dispute.assignedAdmin && (
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" /> Claimed
            </Badge>
            {dispute.assignedAt && (
              <p className="text-xs text-muted-foreground">
                {formatDateTime(dispute.assignedAt)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Main details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Parties Involved */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Parties Involved
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Buyer */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-900 text-white">
                    {dispute?.claimant?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase">Buyer</p>
                  <p className="font-medium">{dispute?.claimant?.name}</p>
                  <p className="text-sm text-muted-foreground break-all">{dispute?.claimant?.email}</p>
                </div>
              </div>

              {/* Seller */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-orange-600 text-white">
                    {dispute?.respondent?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold text-orange-600 uppercase">Seller</p>
                  <p className="font-medium">{dispute?.respondent?.name}</p>
                  <p className="text-sm text-muted-foreground break-all">{dispute?.respondent?.email}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Dispute Overview */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Dispute Overview
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Reason</p>
                  <p className="font-medium capitalize">
                    {dispute?.reason?.toLowerCase().replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dispute Amount</p>
                  <p className="font-medium">
                    {dispute?.currencyCode} {dispute?.dealAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Opened By</p>
                  <p className="font-medium">{openedByName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Opened On</p>
                  <p className="font-medium">{formatDateTime(dispute?.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Marketplace</p>
                  <p className="font-medium">{deal?.vendorName || "TrustedDealMaker"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Milestone</p>
                  <p className="font-medium">{dispute?.milestoneTitle}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <div className="p-3 bg-gray-50 rounded-lg font-medium text-gray-700">
                  {dispute?.description || "No description provided."}
                </div>
              </div>
            </div>
          </section>

          {/* Resolution Request */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Resolution Request
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Preferred Resolution</p>
                <p className="font-medium capitalize">
                  {dispute?.preferredResolution?.toLowerCase().replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Requested Refund</p>
                <p className="font-medium">
                  {dispute?.currencyCode} {dispute?.requestedRefundAmount?.toLocaleString()}
                  {dispute?.requestedRefundPercentage && (
                    <span className="text-sm text-muted-foreground ml-1">
                      ({dispute?.requestedRefundPercentage}%)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Milestones */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Milestones
            </h2>
            <div className="divide-y border rounded-lg overflow-hidden">
              {dispute?.milestones?.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`p-4 flex items-center justify-between ${milestone.disputed ? "bg-red-50" : ""
                    }`}
                >
                  <div>
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description || "No description"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {dispute?.currencyCode} {milestone.amount}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        milestone.status === "DISPUTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-8">
          {/* SLA Info */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              SLA Status
            </h2>
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Deadline</span>
                <span className="font-medium">{formatDateTime(dispute?.sla?.deadline)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="font-medium">
                  {Math.floor(dispute?.sla?.remainingMinutes / 60)}h{" "}
                  {dispute?.sla?.remainingMinutes % 60}m
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{dispute?.sla?.remainingPercentage}% remaining</span>
                </div>
                {/* Progress bar can be added later */}
              </div>
            </div>
          </section>

          {/* Evidence & Messages */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Communication
            </h2>
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm">Evidence (Buyer)</span>
                <Badge variant="outline">{dispute.evidenceCountClaimant}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Evidence (Seller)</span>
                <Badge variant="outline">{dispute.evidenceCountRespondent}</Badge>
              </div>
              {/* {dispute.unreadMessageCount !== null && (
                <div className="flex justify-between">
                  <span className="text-sm">Unread Messages</span>
                  <Badge variant="destructive">{dispute.unreadMessageCount}</Badge>
                </div>
              )} */}
              <Button
                variant="outline"
                className="w-full mt-2"
                size="sm"
                onClick={() => setIsMessagesOpen(true)}
              >
                View Messages & Evidence
              </Button>
            </div>
          </section>

          {/* Proposals */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Proposals
            </h2>
            <div className="space-y-3">
              {/* Existing proposals */}
              {dispute?.proposals?.map((proposal) => (
                <div key={proposal.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-blue-50">
                      {proposal.proposedBy}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        proposal.status === "PENDING"
                          ? "bg-yellow-100"
                          : proposal.status === "ACCEPTED"
                            ? "bg-green-100"
                            : "bg-gray-100"
                      }
                    >
                      {proposal.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mt-2 capitalize">
                    {proposal.resolutionType.toLowerCase().replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Refund: {dispute?.currencyCode} {proposal.refundAmount}
                  </p>
                  {proposal.note && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      "{proposal.note}"
                    </p>
                  )}
                </div>
              ))}

              {/* Tier 2 Proposal */}
              {dispute?.tier2Proposal && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-purple-600">Admin's Proposal</Badge>
                    <Badge variant="outline" className="bg-purple-100">
                      {dispute?.tier2Proposal?.resolutionType}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Buyer receives:</span>{" "}
                      {dispute?.currencyCode} {dispute?.tier2Proposal?.buyerReceives}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Seller receives:</span>{" "}
                      {dispute?.currencyCode} {dispute?.tier2Proposal?.sellerReceives}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      "{dispute?.tier2Proposal?.publicSummary}"
                    </p>
                    <div className="flex justify-between text-xs mt-2">
                      <span>Consent deadline:</span>
                      <span className="font-medium">
                        {formatDateTime(dispute?.tier2Proposal?.consentDeadline)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {dispute?.tier2Proposal?.buyerAccepted !== null && (
                        <Badge
                          variant="outline"
                          className={
                            dispute?.tier2Proposal?.buyerAccepted
                              ? "bg-green-100"
                              : "bg-red-100"
                          }
                        >
                          Buyer: {dispute?.tier2Proposal?.buyerAccepted ? "Accepted" : "Rejected"}
                        </Badge>
                      )}
                      {dispute?.tier2Proposal?.sellerAccepted !== null && (
                        <Badge
                          variant="outline"
                          className={
                            dispute?.tier2Proposal?.sellerAccepted
                              ? "bg-green-100"
                              : "bg-red-100"
                          }
                        >
                          Seller: {dispute?.tier2Proposal?.sellerAccepted ? "Accepted" : "Rejected"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {dispute?.proposals?.length === 0 && !dispute?.tier2Proposal && (
                <p className="text-sm text-muted-foreground text-center py-4 bg-slate-50 rounded-lg">
                  No proposals yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Dialogs */}
      <ProposeResolutionDialog
        disputeId={dispute?.id}
        isOpen={isResolutionOpen}
        onOpenChange={setIsResolutionOpen}
        dealAmount={dispute?.dealAmount}
        isTier3={isTier3}
        onSuccess={() => refetchDispute()}
      />

      <AssignAdminDialog
        disputeId={dispute?.id}
        isOpen={isAssignOpen}
        onOpenChange={setIsAssignOpen}
      />

      <DisputeMessagesDrawer
        disputeId={dispute?.id}
        isOpen={isMessagesOpen}
        onOpenChange={setIsMessagesOpen}
      />
    </div>
  );
}