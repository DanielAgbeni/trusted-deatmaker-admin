"use client";

import type React from "react";

import { useState } from "react";
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
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepositDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  onComplete?: () => void;
}

export default function DepositDialog({
  open: controlledOpen,
  onOpenChange,
  trigger,
  onComplete,
}: DepositDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
  const [amount, setAmount] = useState<string>("100,000.00");
  const [copied, setCopied] = useState<string | null>(null);

  const isControlled =
    controlledOpen !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? onOpenChange : setOpen;

  const handleClose = () => {
    setIsOpen(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setStep(1);
      setPaymentMethod(undefined);
    }, 300);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
    handleClose();
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
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
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <Label
                    htmlFor="amount"
                    className="text-sm text-gray-500 mb-1 block"
                  >
                    Amount
                  </Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">₦</span>
                    <input
                      id="amount"
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 focus:outline-none text-lg font-medium"
                    />
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={() => setStep(2)}>
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
            </DialogHeader>
            <div className="space-y-6 py-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                <div className="border rounded-md p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Bank Transfer
                    </Label>
                    <p className="text-sm text-gray-500">
                      Fund your wallet using bank transfer
                    </p>
                  </div>
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                </div>
                <div className="border rounded-md p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Pay with Card
                    </Label>
                    <p className="text-sm text-gray-500">
                      Fund your wallet using your debit
                    </p>
                  </div>
                  <RadioGroupItem value="card" id="card" />
                </div>
                <div className="border rounded-md p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">USSD</Label>
                    <p className="text-sm text-gray-500">
                      Fund your wallet using your service provider&#39;s USSD
                      code
                    </p>
                  </div>
                  <RadioGroupItem value="ussd" id="ussd" />
                </div>
                <div
                  className={cn(
                    "border rounded-md p-3 flex items-center justify-between",
                    paymentMethod === "transfer" && "border-primary bg-blue-50"
                  )}
                >
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Pay by Transfer
                    </Label>
                    <p className="text-sm text-gray-500">
                      Get dedicated account for Transfer
                    </p>
                  </div>
                  <RadioGroupItem value="transfer" id="transfer" />
                </div>
              </RadioGroup>
              <Button
                className="w-full "
                onClick={() => setStep(3)}
                disabled={!paymentMethod}
              >
                Proceed
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
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
                <DialogTitle className="text-center">Make Payments</DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="text-center text-sm">
                <p>
                  Use the details below to send money to your Trusted Payer
                  account through your preferred channel.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Account Name:</p>
                    <p className="font-medium">Michael Fort</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard("Michael Fort", "name")}
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
                    <p className="font-medium">8292858822</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard("8292858822", "number")}
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
                    <p className="font-medium">Trusted Payer</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard("Trusted Payer", "bank")}
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
                    <p className="text-sm text-gray-500">Target Amount:</p>
                    <p className="font-medium">NGN {amount}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(`NGN ${amount}`, "amount")}
                  >
                    {copied === "amount" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Please make transfer to the account details above</p>
              </div>

              <Button className="w-full " onClick={handleComplete}>
                Funds have been transferred
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
