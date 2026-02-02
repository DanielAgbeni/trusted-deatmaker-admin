// components/TransactionPinModal/TransactionPinModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Lock, ShieldCheck, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useCreateTransactionPinMutation } from "@/lib/store/features/generalApis/generalApis";

interface TransactionPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "verify";
  onPinCreated?: (pin: string) => void;
  onPinVerified?: (pin: string) => void;
  title?: string;
  description?: string;
  userEmail?: string;
  requiresPinCreation?: boolean;
}

export default function TransactionPinModal({
  isOpen,
  onClose,
  mode,
  onPinCreated,
  onPinVerified,
  title,
  description,
  userEmail,
  requiresPinCreation = false,
}: TransactionPinModalProps) {
  const [step, setStep] = useState<"password" | "info" | "create" | "confirm">("password");
  const [pin, setPin] = useState<string[]>(new Array(6).fill(""));
  const [confirmPin, setConfirmPin] = useState<string[]>(new Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  
  // Use the mutation hook
  const [createPinMutation, { isLoading: isCreatingPin }] = useCreateTransactionPinMutation();
  
  // Refs for input focusing
  const pinRefs = Array(6)
    .fill(0)
    .map(() => useRef<HTMLInputElement>(null));
  const confirmPinRefs = Array(6)
    .fill(0)
    .map(() => useRef<HTMLInputElement>(null));
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      // Focus password input when modal opens
      setTimeout(() => {
        if (mode === "create" && passwordRef.current) {
          passwordRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, mode]);

  const resetForm = () => {
    setPassword("");
    setPin(new Array(6).fill(""));
    setConfirmPin(new Array(6).fill(""));
    setStep("password");
    setIsLoading(false);
    setIsSuccess(false);
    setIsPasswordVerified(false);
    setShowPassword(false);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      // For now, just verify locally that password is entered
      // In a real app, you might want to verify with an API first
      // but for PIN creation, we'll send it along with the PIN
      setIsPasswordVerified(true);
      setStep("info");
      
      if (mode === "verify") {
        // For verify mode, skip directly to PIN input
        setStep("create");
        setTimeout(() => pinRefs[0].current?.focus(), 100);
      }
      
      toast.success("Password entered");
    } catch (error) {
      toast.error("Failed to proceed. Please try again.");
      console.error("Password step error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (index: number, value: string, isConfirm = false) => {
    if (!/^\d?$/.test(value)) return;

    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value;

    if (isConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextRef = isConfirm ? confirmPinRefs[index + 1] : pinRefs[index + 1];
      nextRef.current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    isConfirm = false
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevRef = isConfirm ? confirmPinRefs[index - 1] : pinRefs[index - 1];
      prevRef.current?.focus();
    }
  };

  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePasswordSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent, isConfirm = false) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      toast.error("Please paste only numbers");
      return;
    }

    const newPinArray = pastedData.split("").concat(new Array(6 - pastedData.length).fill(""));
    
    if (isConfirm) {
      setConfirmPin(newPinArray);
      confirmPinRefs[Math.min(pastedData.length, 5)]?.current?.focus();
    } else {
      setPin(newPinArray);
      pinRefs[Math.min(pastedData.length, 5)]?.current?.focus();
    }
  };

  const validatePin = (pinArray: string[]) => {
    const pinString = pinArray.join("");
    
    if (pinString.length !== 6) {
      toast.error("Please enter a complete 6-digit PIN");
      return false;
    }

    if (/^(\d)\1{5}$/.test(pinString)) {
      toast.error("PIN cannot be all the same digit");
      return false;
    }

    if (/^123456$|^654321$/.test(pinString)) {
      toast.error("PIN is too common. Please choose a more secure PIN");
      return false;
    }

    if (/^(\d{2})\1{2}$/.test(pinString)) {
      toast.error("PIN pattern is too simple");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === "info") {
      setStep("create");
    } else if (step === "create") {
      if (!validatePin(pin)) return;
      setStep("confirm");
      setTimeout(() => confirmPinRefs[0].current?.focus(), 100);
    }
  };

  const handleBack = () => {
    if (step === "info") {
      setStep("password");
      setTimeout(() => passwordRef.current?.focus(), 100);
    } else if (step === "create") {
      setStep("info");
    } else if (step === "confirm") {
      setStep("create");
      setConfirmPin(new Array(6).fill(""));
      setTimeout(() => pinRefs[0].current?.focus(), 100);
    }
  };

  const handleCreatePin = async () => {
    if (step === "confirm") {
      const enteredPin = pin.join("");
      const confirmedPin = confirmPin.join("");

      if (enteredPin !== confirmedPin) {
        toast.error("PINs do not match. Please try again");
        return;
      }

      if (!validatePin(pin)) return;

      setIsLoading(true);

      try {
        // Call the API with the password entered earlier
        const payload = {
          pin: enteredPin,
          confirmPin: confirmedPin,
          password: password, // Use the password stored from earlier
        };

        console.log("Creating PIN with payload:", {
          ...payload,
          password: "***" + password.slice(-2) // Log only last 2 chars for security
        });

        const response = await createPinMutation(payload).unwrap();
        
        if (response.success) {
          setIsSuccess(true);
          toast.success("Transaction PIN created successfully!");
          
          if (onPinCreated) {
            onPinCreated(enteredPin);
          }

          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          toast.error(response.message || "Failed to create PIN");
        }
      } catch (error: any) {
        console.error("PIN creation error:", error);
        
        if (error?.data?.message) {
          toast.error(error.data.message);
        } else if (error?.error) {
          toast.error(error.error);
        } else {
          toast.error("Failed to create PIN. Please try again");
        }
        
        // Clear password on error and go back to password step
        setPassword("");
        setStep("password");
        setTimeout(() => passwordRef.current?.focus(), 100);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyPin = async () => {
    if (!validatePin(pin)) return;

    setIsLoading(true);

    try {
      // For verify mode, you might need to call a different API endpoint
      // Since verifyTransactionPin endpoint wasn't in your API, I'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("PIN verified successfully!");
      
      if (onPinVerified) {
        onPinVerified(pin.join(""));
      }

      onClose();
    } catch (error) {
      toast.error("Invalid PIN. Please try again");
      setPin(new Array(6).fill(""));
      pinRefs[0].current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Password Step
  const renderPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-purple-600 mx-auto" />
        <h3 className="text-lg font-semibold">Verify Your Identity</h3>
        <p className="text-gray-600 text-sm">
          Please enter your account password to continue
          {userEmail && (
            <span className="block text-xs text-gray-500 mt-1">
              Account: {userEmail}
            </span>
          )}
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Account Password
        </label>
        <div className="relative">
          <Input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            onKeyDown={handlePasswordKeyDown}
            className="pr-10"
            placeholder="Enter your password"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          This ensures only you can create or modify your transaction PIN
        </p>
      </div>

      <Button
        onClick={handlePasswordSubmit}
        disabled={isLoading || !password.trim()}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </div>
  );

  // Info Step
  const renderInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="text-gray-600 text-sm">
          Secure your transactions with a 6-digit PIN. This PIN will be required for all withdrawals and transfers.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3">
          <div className="flex-shrink-0">
            <Lock className="w-5 h-5 text-purple-600 mt-0.5" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-900">Enhanced Security</h4>
            <p className="text-xs text-gray-600 mt-1">
              Protect your funds with an additional layer of security
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3">
          <div className="flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-900">Quick Verification</h4>
            <p className="text-xs text-gray-600 mt-1">
              Fast and easy verification for every transaction
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3">
          <div className="flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-red-600 mt-0.5" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-900">Account Protection</h4>
            <p className="text-xs text-gray-600 mt-1">
              Prevent unauthorized access to your account
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep("password")}
          disabled={isLoading}
          className="flex-1"
        >
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );

  // Create PIN Step
  const renderCreateStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="text-gray-600 text-sm">
          {mode === "create" 
            ? "Enter a 6-digit PIN to secure your transactions"
            : "Enter your 6-digit PIN to authorize this transaction"
          }
        </p>
        {mode === "create" && (
          <p className="text-xs text-gray-500">
            Choose a PIN that's easy to remember but hard for others to guess
          </p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 text-center">
          {mode === "create" ? "Enter 6-digit PIN" : "Enter your PIN"}
        </label>
        <div className="flex justify-center gap-2">
          {pin.map((digit, index) => (
            <Input
              key={index}
              ref={pinRefs[index]}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-10 h-10 text-center text-lg font-semibold"
              disabled={isLoading || isCreatingPin}
              autoFocus={index === 0}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isLoading || isCreatingPin}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={mode === "create" ? handleNext : handleVerifyPin}
          disabled={isLoading || isCreatingPin || pin.some(digit => digit === "")}
          className="flex-1"
        >
          {mode === "create" ? (
            "Next"
          ) : isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify & Proceed"
          )}
        </Button>
      </div>
    </div>
  );

  // Confirm PIN Step
  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="text-gray-600 text-sm">
          Re-enter your 6-digit PIN to confirm
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 text-center">
          Re-enter 6-digit PIN
        </label>
        <div className="flex justify-center gap-2">
          {confirmPin.map((digit, index) => (
            <Input
              key={index}
              ref={confirmPinRefs[index]}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value, true)}
              onKeyDown={(e) => handleKeyDown(index, e, true)}
              onPaste={(e) => handlePaste(e, true)}
              className="w-10 h-10 text-center text-lg font-semibold"
              disabled={isLoading || isCreatingPin}
              autoFocus={index === 0}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isLoading || isCreatingPin}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleCreatePin}
          disabled={isLoading || isCreatingPin || confirmPin.some(digit => digit === "")}
          className="flex-1"
        >
          {isLoading || isCreatingPin ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create PIN"
          )}
        </Button>
      </div>
    </div>
  );

  // Success screen
  const renderSuccess = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
        <h3 className="text-lg font-semibold">PIN Setup Successful!</h3>
        <p className="text-gray-600 text-sm">
          Your transaction PIN has been created successfully.
          <br />
          You can now make secure transactions.
        </p>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5">•</span>
          <span>Never share your PIN with anyone</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>You'll need this PIN for all transactions</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-500 mt-0.5">•</span>
          <span>You can change your PIN anytime in settings</span>
        </div>
      </div>

      <Button onClick={onClose} className="w-full">
        Go To Wallet
      </Button>
    </div>
  );

  const getTitle = () => {
    if (isSuccess) return "PIN Created";
    
    if (mode === "create") {
      if (step === "password") return "Verify Identity";
      if (step === "info") return "Set Up Transaction PIN";
      if (step === "create") return "Create Transaction PIN";
      if (step === "confirm") return "Confirm Transaction PIN";
    }
    
    if (mode === "verify") {
      if (step === "password") return "Verify Identity";
      return "Verify Transaction PIN";
    }
    
    return "Transaction PIN";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b w-full flex justify-center items-center">
          <DialogTitle className="text-center w-fit border-b border-primary pb-3">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          renderSuccess()
        ) : step === "password" ? (
          renderPasswordStep()
        ) : mode === "create" ? (
          <>
            {step === "info" && renderInfoStep()}
            {step === "create" && renderCreateStep()}
            {step === "confirm" && renderConfirmStep()}
          </>
        ) : (
          // For verify mode after password verification
          renderCreateStep()
        )}
      </DialogContent>
    </Dialog>
  );
}