"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetTransactionDetailQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function WalletTransactionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // Remove the # if it's included in the ID
  const transactionId = id.startsWith("#") ? id.substring(1) : id;

  const { data: response, isLoading, error } = useGetTransactionDetailQuery(transactionId);
  const transaction = response?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Fetching transaction details...</p>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Transaction Not Found</h2>
        <p className="text-sm text-muted-foreground">The transaction you're looking for could not be found or an error occurred.</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  // Assuming type can be inferred from other fields or just showing general details
  // The provided schema doesn't have a 'type' field, but it has gatewayReference, destinationAccount etc.
  const isDeposit = !!transaction.gatewayReference && !transaction.destinationAccount;
  // This is a guess, but I'll focus on displaying the fields provided in the schema.

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
      case "SUCCESS":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "PENDING":
        return "bg-orange-100 text-orange-600 hover:bg-orange-100";
      case "FAILED":
        return "bg-red-100 text-red-600 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container p-6 max-w-5xl space-y-6">
      <div className="flex items-center space-x-4">
        <Button onClick={() => router.back()} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Transaction Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Overview Card */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Transaction Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Transaction ID</div>
              <div className="text-sm font-medium text-right break-all">
                {transaction.transactionId}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Date</div>
              <div className="text-sm font-medium text-right">
                {formatDate(transaction.date)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Amount</div>
              <div className="text-sm font-bold text-right text-primary">
                ₦{transaction.amount.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Fee</div>
              <div className="text-sm font-medium text-right">
                ₦{transaction.fee.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Status</div>
              <div className="text-right">
                <Badge className={getStatusColor(transaction.status)}>
                  • {transaction.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <div className="text-sm text-gray-500">Fineract ID</div>
              <div className="text-sm font-medium text-right">
                {transaction.fineractId || "N/A"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Session ID</div>
              <div className="text-sm font-medium text-right truncate" title={transaction.sessionId}>
                {transaction.sessionId || "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & User Data Card */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Wallet Owner Email</div>
              <div className="text-sm font-medium text-blue-600">
                {transaction.walletOwnerEmail || "N/A"}
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t">
              <div className="text-sm text-gray-500">Destination Bank</div>
              <div className="text-sm font-medium">
                {transaction.destinationBank || "N/A"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-500">Destination Account</div>
              <div className="text-sm font-medium">
                {transaction.destinationAccount || "N/A"}
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t">
              <div className="text-sm text-gray-500">Gateway Reference</div>
              <div className="text-sm font-medium text-xs break-all text-slate-600">
                {transaction.gatewayReference || "N/A"}
              </div>
            </div>

            {transaction.status === "FAILED" && transaction.failureReason && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="text-xs font-bold text-red-700 uppercase mb-1">Failure Reason</div>
                <div className="text-sm text-red-600">{transaction.failureReason}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Raw Response (Optional, could be hidden behind a toggle) */}
      {transaction.rawGatewayResponse && (
        <Card className="shadow-sm border-slate-200 mt-6 overflow-hidden">
          <CardHeader className="pb-3 bg-slate-50 border-b">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Raw Gateway Response
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-slate-900">
            <pre className="text-[10px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
              {transaction.rawGatewayResponse.startsWith('{')
                ? JSON.stringify(JSON.parse(transaction.rawGatewayResponse), null, 2)
                : transaction.rawGatewayResponse}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
