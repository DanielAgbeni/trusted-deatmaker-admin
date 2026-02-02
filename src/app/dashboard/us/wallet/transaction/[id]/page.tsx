// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useGetUserTransactionDetailQuery } from "@/lib/store/features/userDashboardApi/userDashboardApi";
import Link from "next/link";

interface TransactionDetailPageProps {
  params: Promise<{ id: string }>; // params is a Promise
}

// Interface based on actual API response
interface ApiTransactionDetail {
  transactionReference: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "DEAL_PAYMENT" | "DEAL_REFUND" | "FEE" | "COMMISSION";
  amount: number;
  fee: number;
  status: "SUCCESS" | "PENDING" | "FAILED" | "CANCELLED";
  date: string;
  destinationBank: string | null;
  destinationAccountName: string | null;
  destinationAccountNumber: string | null;
  description: string;
}

export default function WalletTransactionDetailsPage({
  params,
}: TransactionDetailPageProps) {
  const [transactionId, setTransactionId] = useState<string>("");
  const [isUnwrapped, setIsUnwrapped] = useState(false);
  
  // Extract transaction ID from params using React.use()
  useEffect(() => {
    async function unwrapParams() {
      try {
        const unwrappedParams = await params; // Await the Promise
        const id = unwrappedParams.id;
        // Remove the # if it's included in the ID
        const cleanId = id.startsWith("#") ? id.substring(1) : id;
        setTransactionId(cleanId);
        setIsUnwrapped(true);
      } catch (error) {
        console.error("Error unwrapping params:", error);
        setIsUnwrapped(true);
      }
    }
    
    unwrapParams();
  }, [params]);

  // Use the transaction detail API hook
  const {
    data: transactionResponse,
    isLoading,
    isError,
    error,
  } = useGetUserTransactionDetailQuery(transactionId, {
    skip: !transactionId, // Skip query if no transactionId
  });

  // Show loading state while unwrapping params
  if (!isUnwrapped) {
    return (
      <div className="container p-6 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32 ml-auto" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container p-6 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32 ml-auto" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-48" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container p-6 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/us/wallet">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
              <p className="text-gray-500 mb-6">
                {error?.data?.message || "Unable to load transaction details. Please check the transaction ID and try again."}
              </p>
              <Button asChild>
                <Link href="/dashboard/us/wallet">Back to Wallet</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const transaction = transactionResponse?.data as ApiTransactionDetail;
  
  if (!transaction) {
    return (
      <div className="container p-6 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/us/wallet">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
              <p className="text-gray-500 mb-6">
                The transaction with ID #{transactionId} could not be found.
              </p>
              <Button asChild>
                <Link href="/dashboard/us/wallet">Back to Wallet</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate net amount based on transaction type
  const getNetAmount = () => {
    const amount = transaction.amount || 0;
    const fee = transaction.fee || 0;
    
    // For deposits, net is amount minus fee
    // For withdrawals, amount already includes fee deduction typically
    return transaction.type === "DEPOSIT" ? amount - fee : amount;
  };

  // Format data from API response
  const isDeposit = transaction.type === "DEPOSIT";
  const transactionTypeTitle = isDeposit ? "Deposit" : "Withdrawal";
  const pageTitle = `${transactionTypeTitle} Transaction Details`;
  const netAmount = getNetAmount();
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Status color based on status and type
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'success' || statusLower === 'completed') {
      return "bg-green-100 text-green-700 hover:bg-green-100";
    } else if (statusLower === 'pending') {
      return "bg-orange-100 text-orange-600 hover:bg-orange-100";
    } else if (statusLower === 'failed' || statusLower === 'cancelled') {
      return "bg-red-100 text-red-600 hover:bg-red-100";
    }
    return "bg-gray-100 text-gray-600 hover:bg-gray-100";
  };

  // Get method from description or metadata
  const getPaymentMethod = () => {
    // Try to extract from description
    if (transaction.description?.includes('via')) {
      const parts = transaction.description.split('via');
      return parts[1]?.trim() || 'Bank Transfer';
    }
    
    return 'Bank Transfer';
  };

  // Get provider from description
  const getProvider = () => {
    if (transaction.description?.includes('PAYSTACK')) {
      return 'Paystack';
    }
    if (transaction.description?.includes('STRIPE')) {
      return 'Stripe';
    }
    if (transaction.description?.includes('FLUTTERWAVE')) {
      return 'Flutterwave';
    }
    return 'Unknown';
  };

  // Get account name for display
  const getAccountName = () => {
    if (transaction.destinationAccountName) {
      return transaction.destinationAccountName;
    }
    
    // Extract from description if possible
    if (transaction.description) {
      const nameMatch = transaction.description.match(/(?:to|for)\s+([A-Za-z\s]+)(?:via|with|$)/i);
      if (nameMatch) {
        return nameMatch[1].trim();
      }
    }
    
    return 'Trusted Dealmaker User';
  };

  return (
    <div className="container p-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/us/wallet">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Details Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {transactionTypeTitle} Via {getPaymentMethod()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Transaction Date</div>
              <div className="text-sm font-medium text-right">
                {formatDate(transaction.date)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Transaction Reference</div>
              <div className="text-sm font-medium text-right font-mono">
                {transaction.transactionReference}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Payment Provider</div>
              <div className="text-sm font-medium text-right">
                {getProvider()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Type</div>
              <div className="text-sm font-medium text-right capitalize">
                {transaction.type.toLowerCase().replace('_', ' ')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Gross Amount</div>
              <div className="text-sm font-medium text-right">
                {formatCurrency(transaction.amount)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Transaction Fee</div>
              <div className="text-sm font-medium text-right">
                {formatCurrency(transaction.fee)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Net Amount</div>
              <div className="text-sm font-medium text-right">
                {formatCurrency(netAmount)}
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

            {transaction.description && (
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500 mb-1">Description</div>
                <div className="text-sm font-medium">
                  {transaction.description}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User/Account Information Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {isDeposit ? "Deposit Information" : "Withdrawal Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transaction.destinationAccountName && (
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Account Name</div>
                <div className="text-sm font-medium">
                  {transaction.destinationAccountName}
                </div>
              </div>
            )}

            {transaction.destinationAccountNumber && (
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Account Number</div>
                <div className="text-sm font-medium font-mono">
                  {transaction.destinationAccountNumber}
                </div>
              </div>
            )}

            {transaction.destinationBank && (
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Bank Name</div>
                <div className="text-sm font-medium">
                  {transaction.destinationBank}
                </div>
              </div>
            )}

            {!transaction.destinationAccountName && !transaction.destinationAccountNumber && !transaction.destinationBank && (
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Account</div>
                <div className="text-sm font-medium">
                  {getAccountName()}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="text-sm text-gray-500 mb-2">Transaction Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Type:</span>
                  <span className="font-medium capitalize">{transaction.type.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{transaction.status.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Amount:</span>
                  <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee:</span>
                  <span className="font-medium">{formatCurrency(transaction.fee)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-800 font-medium">Net Amount:</span>
                  <span className="font-bold text-primary">{formatCurrency(netAmount)}</span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-500 mb-2">Additional Notes</div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Transaction completed on {formatDate(transaction.date)}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Reference: {transaction.transactionReference}</span>
                </li>
                {isDeposit ? (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Funds will be available in your wallet immediately</span>
                  </li>
                ) : (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Withdrawal processing time: 1-3 business days</span>
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button variant="outline" asChild className="flex-1">
          <Link href="/dashboard/us/wallet">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wallet
          </Link>
        </Button>
        
        <Button variant="default" className="flex-1" onClick={() => {
          // Copy transaction details to clipboard
          const details = `
Transaction Reference: ${transaction.transactionReference}
Type: ${transaction.type}
Amount: ${formatCurrency(transaction.amount)}
Fee: ${formatCurrency(transaction.fee)}
Net Amount: ${formatCurrency(netAmount)}
Status: ${transaction.status}
Date: ${formatDate(transaction.date)}
Description: ${transaction.description}
          `.trim();
          
          navigator.clipboard.writeText(details);
          
          // Show success message (you can use toast here)
          alert('Transaction details copied to clipboard!');
        }}>
          Copy Transaction Details
        </Button>
      </div>
    </div>
  );
}