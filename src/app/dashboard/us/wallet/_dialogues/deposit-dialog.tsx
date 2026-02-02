// @ts-nocheck
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Copy, Loader2, CreditCard, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetUserProfileQuery, useInitiateDepositMutation } from "@/lib/store/features/userDashboardApi/userDashboardApi";

interface DepositDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  onComplete?: (transactionReference?: string) => void;
}

interface PaymentMethodOption {
  id: 'card' | 'transfer';
  name: string;
  description: string;
  icon: React.ReactNode;
  provider: 'STRIPE' | 'BANK_TRANSFER';
  enabled: boolean;
}

// Constants moved to component scope
const MIN_AMOUNTS: Record<string, number> = {
  'NGN': 1000,
  'USD': 10,
  'EUR': 10,
  'GBP': 10,
  'KES': 100,
  'GHS': 10,
  'ZAR': 100,
};

const MAX_AMOUNTS: Record<string, number> = {
  'NGN': 5000000,
  'USD': 50000,
  'EUR': 50000,
  'GBP': 50000,
  'KES': 1000000,
  'GHS': 500000,
  'ZAR': 1000000,
};

export default function DepositDialog({
  open: controlledOpen,
  onOpenChange,
  trigger,
  onComplete,
}: DepositDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | undefined>();
  const [amount, setAmount] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // RTK Query hooks
  const { data: profileData, isLoading: isLoadingProfile } = useGetUserProfileQuery();
  const [initiateDeposit, { isLoading: isDepositLoading }] = useInitiateDepositMutation();

  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? onOpenChange : setOpen;

  // Get user's default currency and account details from profile
  const userCurrency = profileData?.data?.wallets?.[0]?.currency || 'NGN';
  const userAccountDetails = profileData?.data?.wallets?.[0];
  const userName = `${profileData?.data?.firstName || ''} ${profileData?.data?.lastName || ''}`.trim() || profileData?.data?.email;

  // Get min/max amounts for current currency
  const minAmount = MIN_AMOUNTS[userCurrency] || 1000;
  const maxAmount = MAX_AMOUNTS[userCurrency] || 5000000;

  // Define payment methods based on user's available options
  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'card',
      name: 'Pay with Stripe',
      description: 'Fund your wallet using your debit/credit card via Stripe',
      icon: <CreditCard className="h-5 w-5 mr-2" />,
      provider: 'STRIPE',
      enabled: true,
    },
    {
      id: 'transfer',
      name: 'Pay by Transfer',
      description: 'Get dedicated account for bank transfer',
      icon: <Building className="h-5 w-5 mr-2" />,
      provider: 'BANK_TRANSFER',
      enabled: !!userAccountDetails?.virtualAccountNumber,
    },
  ];

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setPaymentMethod(undefined);
      setAmount("");
      setError(null);
      setIsProcessing(false);
    }, 300);
  };

  const handleComplete = (transactionReference?: string) => {
    if (onComplete) {
      onComplete(transactionReference);
    }
    handleClose();
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    
    if (numericValue) {
      const [whole, decimal] = numericValue.split('.');
      const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
    }
    return '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setAmount(formatted);
    setError(null);
  };

  const parseAmount = (formattedAmount: string): number => {
    const numericString = formattedAmount.replace(/[^\d.]/g, '');
    return parseFloat(numericString) || 0;
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      'NGN': '₦',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'KES': 'KSh',
      'GHS': 'GH₵',
      'ZAR': 'R',
    };
    return symbols[currency] || currency;
  };

  const calculateFees = (amount: number, method: 'card' | 'transfer') => {
    if (method === 'card') {
      const percentageFee = userCurrency === 'NGN' ? 0.015 : 0.029;
      const fixedFee = userCurrency === 'NGN' ? 100 : 0.30;
      const fee = (amount * percentageFee) + fixedFee;
      return {
        fee,
        netAmount: amount - fee,
        percentage: percentageFee * 100,
        fixed: fixedFee
      };
    }
    
    return {
      fee: 0,
      netAmount: amount,
      percentage: 0,
      fixed: 0
    };
  };

  const handleProceedToPayment = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    const numericAmount = parseAmount(amount);
    if (numericAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (numericAmount < minAmount) {
      setError(`Minimum amount is ${getCurrencySymbol(userCurrency)}${minAmount.toLocaleString()}`);
      return;
    }

    if (numericAmount > maxAmount) {
      setError(`Maximum amount is ${getCurrencySymbol(userCurrency)}${maxAmount.toLocaleString()}`);
      return;
    }

    if (paymentMethod === 'transfer') {
      setStep(3);
    } else {
      await handleCardPayment(numericAmount);
    }
  };

  const handleCardPayment = async (amount: number) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const depositData = {
        amount: amount,
        currency: userCurrency,
      };

      const response = await initiateDeposit(depositData).unwrap();
      
      if (response.success && response.data?.checkoutUrl) {
        window.open(response.data.checkoutUrl, '_blank');
        
        if (response.data.transactionReference) {
          localStorage.setItem('pendingDepositRef', response.data.transactionReference);
        }
        
        handleComplete(response.data.transactionReference);
      } else {
        setError(response.message || "Failed to initiate payment");
      }
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setError(err?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isOpen && step === 1 && !amount) {
      setAmount("100,000.00");
    }
  }, [isOpen, step, amount]);

  const isLoading = isLoadingProfile || isDepositLoading || isProcessing;
  const numericAmount = parseAmount(amount);
  const fees = paymentMethod ? calculateFees(numericAmount, paymentMethod) : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        {isLoadingProfile ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          <>
            {step === 1 && (
              <>
                <DialogHeader>
                  <div className="flex justify-center mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        1
                      </div>
                      <div className="w-12 h-1 bg-gray-200">
                        <div className="w-0 h-1 bg-primary"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        2
                      </div>
                      <div className="w-12 h-1 bg-gray-200">
                        <div className="w-0 h-1 bg-gray-200"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        3
                      </div>
                    </div>
                  </div>
                  <DialogTitle className="text-center">
                    Enter Deposit Amount
                  </DialogTitle>
                  <p className="text-sm text-gray-500 text-center">
                    Your currency: {userCurrency}
                  </p>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <Label
                        htmlFor="amount"
                        className="text-sm text-gray-500 mb-1 block"
                      >
                        Amount ({userCurrency})
                      </Label>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">
                          {getCurrencySymbol(userCurrency)}
                        </span>
                        <input
                          id="amount"
                          type="text"
                          value={amount}
                          onChange={handleAmountChange}
                          className="flex-1 focus:outline-none text-lg font-medium"
                          placeholder="0.00"
                        />
                      </div>
                      {error && (
                        <p className="text-sm text-red-500 mt-2">{error}</p>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        <p>Minimum: {getCurrencySymbol(userCurrency)}{minAmount.toLocaleString()}</p>
                        <p>Maximum: {getCurrencySymbol(userCurrency)}{maxAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => setStep(2)}
                    disabled={!amount || numericAmount <= 0}
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <DialogHeader>
                  <div className="flex justify-center mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="w-12 h-1 bg-primary">
                        <div className="w-full h-1 bg-primary"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        2
                      </div>
                      <div className="w-12 h-1 bg-gray-200">
                        <div className="w-0 h-1 bg-gray-200"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        3
                      </div>
                    </div>
                  </div>
                  <DialogTitle className="text-center">
                    Select your preferred payment method
                  </DialogTitle>
                  <p className="text-sm text-gray-500 text-center">
                    Available in {userCurrency}
                  </p>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="text-center mb-4">
                    <p className="font-medium">{getCurrencySymbol(userCurrency)}{amount}</p>
                    {/* {fees && paymentMethod && (
                      <p className="text-sm text-gray-500">
                        Fee: {getCurrencySymbol(userCurrency)}{fees.fee.toFixed(2)} • 
                        You'll get: {getCurrencySymbol(userCurrency)}{fees.netAmount.toFixed(2)}
                      </p>
                    )} */}
                  </div>
                  
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => {
                      setPaymentMethod(value as 'card' | 'transfer');
                      setError(null);
                    }}
                    className="space-y-3"
                  >
                    {paymentMethods
                      .filter(method => method.enabled)
                      .map(method => (
                        <div 
                          key={method.id}
                          className={cn(
                            "border rounded-md p-4 flex items-center justify-between cursor-pointer transition-all",
                            paymentMethod === method.id && "border-primary bg-blue-50"
                          )}
                          onClick={() => {
                            setPaymentMethod(method.id);
                            setError(null);
                          }}
                        >
                          <div className="flex items-center">
                            {method.icon}
                            <div className="space-y-0.5">
                              <Label className="text-base font-medium cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-sm text-gray-500">
                                {method.description}
                              </p>
                              {method.id === 'card' && (
                                <p className="text-xs text-gray-400">
                                  Powered by Stripe • Secure payment
                                </p>
                              )}
                            </div>
                          </div>
                          <RadioGroupItem value={method.id} id={method.id} />
                        </div>
                      ))}
                  </RadioGroup>
                  
                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}

                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={handleProceedToPayment}
                      disabled={!paymentMethod || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Continue to Payment'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep(1)}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </>
            )}

            {step === 3 && paymentMethod === 'transfer' && userAccountDetails && (
              <>
                <DialogHeader>
                  <div className="flex justify-center mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="w-12 h-1 bg-primary">
                        <div className="w-full h-1 bg-primary"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="w-12 h-1 bg-primary">
                        <div className="w-full h-1 bg-primary"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-b border-primary pb-2">
                    <DialogTitle className="text-center">Bank Transfer Details</DialogTitle>
                    <p className="text-sm text-gray-500 text-center">
                      Transfer to your virtual account
                    </p>
                  </div>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="text-center text-sm">
                    <p>
                      Use the details below to transfer money to your virtual account 
                      through your bank's mobile app, internet banking, or at a branch.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Account Name:</p>
                            <p className="font-medium">{userAccountDetails.virtualAccountName || userName}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(userAccountDetails.virtualAccountName || userName, "name")}
                          >
                            {copied === "name" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Account Number:</p>
                            <p className="font-medium">{userAccountDetails.virtualAccountNumber}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(userAccountDetails.virtualAccountNumber, "number")}
                          >
                            {copied === "number" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Bank Name:</p>
                            <p className="font-medium">{userAccountDetails.virtualBankName || "Trusted Dealmaker"}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(userAccountDetails.virtualBankName || "Trusted Dealmaker", "bank")}
                          >
                            {copied === "bank" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Transfer Amount:</p>
                            <p className="font-medium">
                              {getCurrencySymbol(userCurrency)} 
                              {numericAmount.toLocaleString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(
                              `${getCurrencySymbol(userCurrency)}${numericAmount.toLocaleString()}`,
                              "amount"
                            )}
                          >
                            {copied === "amount" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" onClick={handleComplete}>
                      I have completed the transfer
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}