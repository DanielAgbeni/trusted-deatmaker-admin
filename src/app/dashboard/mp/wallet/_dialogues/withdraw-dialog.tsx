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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BankAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
}

interface WithdrawDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  availableBanks: BankAccount[];
  maxAmount: number;
  onWithdrawComplete?: (amount: number, bank: BankAccount) => void;
}

interface BankSelectProps {
  banks: BankAccount[];
  selectedBank: BankAccount | null;
  onBankSelect: (bank: BankAccount) => void;
}

// Custom Bank Select Component
function BankSelect({ banks, selectedBank, onBankSelect }: BankSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleBankSelect = (bank: BankAccount) => {
    onBankSelect(bank);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className={cn(
          "w-full flex items-center justify-between px-3 py-3 text-left bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          isOpen && "ring-2 ring-blue-500 border-blue-500"
        )}
      >
        <span
          className={cn("block truncate", !selectedBank && "text-gray-500")}
        >
          {selectedBank
            ? `${selectedBank.bankName}-${selectedBank.accountNumber}`
            : "Select withdrawal destination"}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {banks.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">
              No banks available
            </div>
          ) : (
            banks.map((bank) => (
              <button
                key={bank.id}
                type="button"
                onClick={() => handleBankSelect(bank)}
                className={cn(
                  "w-full flex flex-col items-start px-3 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-b-0",
                  selectedBank?.id === bank.id && "bg-blue-50"
                )}
              >
                <div className="font-medium">{bank.accountName}</div>
                <div className="text-sm text-gray-600">
                  {bank.bankName} - {bank.accountNumber}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// OTP Input Component
function OTPInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split("");
    newValue[index] = digit;
    const result = newValue.join("").slice(0, 4);
    onChange(result);

    // Auto-focus next input
    if (digit && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      ))}
    </div>
  );
}

export default function WithdrawDialog({
  open: controlledOpen,
  onOpenChange,
  trigger,
  availableBanks,
  maxAmount,
  onWithdrawComplete,
}: WithdrawDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const isControlled =
    controlledOpen !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? onOpenChange : setOpen;

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount("");
      setSelectedBank(null);
      setOtp("");
      setPin("");
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    if (parts.length > 2) return;

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return;

    setAmount(numericValue);
  };

  const handleContinue = () => {
    if (step === 1 && amount && selectedBank && Number(amount) <= maxAmount) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleConfirmWithdrawal = async () => {
    if (!amount || !selectedBank || otp.length !== 4 || !pin) return;

    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (onWithdrawComplete) {
      onWithdrawComplete(Number(amount), selectedBank);
    }

    setIsProcessing(false);
    setIsOpen(false);
  };

  const canContinue =
    amount && selectedBank && Number(amount) > 0 && Number(amount) <= maxAmount;
  const canConfirm = otp.length === 4 && pin.length >= 4;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {step === 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-center text-xl font-semibold flex-1">
              Withdraw to Bank Account
            </DialogTitle>
          </div>
          <div className="w-full h-0.5 bg-primary mt-2"></div>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Withdrawal amount{" "}
                <span className="text-gray-500">
                  (maximum: ₦{maxAmount.toLocaleString()})
                </span>
              </Label>
              <Input
                id="amount"
                placeholder="Input amount"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="text-lg py-3"
              />
              {amount && Number(amount) > maxAmount && (
                <p className="text-sm text-red-500">
                  Amount exceeds maximum limit
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Select Withdrawal Destination</Label>
              <BankSelect
                banks={availableBanks}
                selectedBank={selectedBank}
                onBankSelect={setSelectedBank}
              />
            </div>

            <Button
              className="w-full py-3"
              onClick={handleContinue}
              disabled={!canContinue}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-4">
            {/* Preview Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">
                  ₦{Number(amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-semibold">
                  {selectedBank?.bankName}-{selectedBank?.accountNumber}
                </span>
              </div>
            </div>

            {/* OTP Section */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                We have sent a One-Time Password (OTP) to your registered mobile
                number. Please check your phone for the OTP and enter it in the
                field provided below.
              </p>
              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <OTPInput value={otp} onChange={setOtp} />
              </div>
            </div>

            {/* PIN Section */}
            <div className="space-y-2">
              <Label htmlFor="pin">Trusted Payer Password</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Input your Trusted Payer Password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="py-3"
              />
            </div>

            <Button
              className="w-full py-3"
              onClick={handleConfirmWithdrawal}
              disabled={!canConfirm || isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Withdrawal"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
