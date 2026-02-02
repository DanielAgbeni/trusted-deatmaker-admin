"use client";

import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner"; // or your toast library
import { useValidateBVNMutation } from "@/lib/store/features/userDashboardApi/userDashboardApi";

// Form validation schema
const kycFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  bvn: z.string().length(11, {
    message: "BVN must be exactly 11 digits.",
  }).regex(/^\d+$/, {
    message: "BVN must contain only numbers.",
  }),
});

type KycFormValues = z.infer<typeof kycFormSchema>;

interface KycDialogProps {
  onSubmit?: (values: KycFormValues, isValidated: boolean) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  onComplete?: () => void;
}

export default function KycDialog({
  onSubmit,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  onComplete,
}: KycDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationStep, setValidationStep] = useState<'form' | 'validating' | 'success' | 'error'>('form');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [bvnData, setBvnData] = useState<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    status: string;
  } | null>(null);

  // Use the BVN validation mutation
  const [validateBVN, { isLoading: isBVNValidating }] = useValidateBVNMutation();

  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bvn: "",
    },
  });

  const validateName = (inputName: string, bvnName: string): boolean => {
    // Normalize names for comparison
    const normalizeName = (name: string) => 
      name.toLowerCase().trim().replace(/\s+/g, ' ');
    
    const inputNormalized = normalizeName(inputName);
    const bvnNormalized = normalizeName(bvnName);
    
    // Check for exact match
    if (inputNormalized === bvnNormalized) {
      return true;
    }
    
    // Check if input name contains BVN name or vice versa (for partial matches)
    if (inputNormalized.includes(bvnNormalized) || bvnNormalized.includes(inputNormalized)) {
      return true;
    }
    
    // Split into parts and check if any part matches
    const inputParts = inputNormalized.split(' ');
    const bvnParts = bvnNormalized.split(' ');
    
    return inputParts.some(part => 
      bvnParts.some(bvnPart => 
        part === bvnPart || 
        (part.length > 2 && bvnPart.length > 2 && 
         (part.includes(bvnPart) || bvnPart.includes(part)))
      )
    );
  };

  const validateDateOfBirth = (bvnDOB: string): string => {
    // Extract year from BVN date of birth (format: "**-**-1990")
    const yearMatch = bvnDOB.match(/-(\d{4})$/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1], 10);
      const currentYear = new Date().getFullYear();
      const age = currentYear - year;
      
      if (age < 18) {
        return "You must be at least 18 years old.";
      }
      if (age > 100) {
        return "Please verify your date of birth.";
      }
    }
    return "";
  };

  const handleSubmit = async (values: KycFormValues) => {
    setIsSubmitting(true);
    setValidationStep('validating');
    setValidationError(null);
    
    try {
      // Call BVN validation API
      const response = await validateBVN({ bvn: values.bvn }).unwrap();
      
      if (response.success && response.data) {
        const bvnResponse = response.data;
        
        // Check if BVN is verified
        if (bvnResponse.status !== 'VERIFIED') {
          setValidationStep('error');
          setValidationError(`BVN status: ${bvnResponse.status}. Please provide a verified BVN.`);
          return;
        }
        
        // Validate date of birth
        const dobError = validateDateOfBirth(bvnResponse.dateOfBirth);
        if (dobError) {
          setValidationStep('error');
          setValidationError(dobError);
          return;
        }
        
        // Validate first name
        const isFirstNameValid = validateName(values.firstName, bvnResponse.firstName);
        if (!isFirstNameValid) {
          setValidationStep('error');
          setValidationError(`First name doesn't match BVN records. BVN shows: ${bvnResponse.firstName}`);
          return;
        }
        
        // Validate last name
        const isLastNameValid = validateName(values.lastName, bvnResponse.lastName);
        if (!isLastNameValid) {
          setValidationStep('error');
          setValidationError(`Last name doesn't match BVN records. BVN shows: ${bvnResponse.lastName}`);
          return;
        }
        
        // All validations passed
        setBvnData(bvnResponse);
        setValidationStep('success');
        
        // Store BVN data for later use
        localStorage.setItem('bvnValidationData', JSON.stringify({
          ...bvnResponse,
          userProvided: values
        }));
        
        // Show success message
        toast.success("BVN validated successfully! Names match official records.");
        
        // Call onSubmit callback with validated data
        if (onSubmit) {
          onSubmit(values, true);
        }
        
        // Call onComplete callback
        if (onComplete) {
          setTimeout(() => {
            onComplete();
            // Reset form and close dialog after 2 seconds
            form.reset();
            if (!isControlled) {
              setOpen(false);
            }
            setValidationStep('form');
          }, 2000);
        }
      } else {
        setValidationStep('error');
        setValidationError(response.message || "Failed to validate BVN. Please try again.");
      }
    } catch (error: any) {
      console.error("BVN validation error:", error);
      setValidationStep('error');
      
      // Handle specific error messages
      if (error?.data?.message) {
        setValidationError(error.data.message);
      } else if (error?.status === 400) {
        setValidationError("Invalid BVN format. Please check and try again.");
      } else if (error?.status === 404) {
        setValidationError("BVN not found. Please verify the number.");
      } else {
        setValidationError("An error occurred during BVN validation. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setValidationStep('form');
    setValidationError(null);
    setBvnData(null);
  };

  const renderContent = () => {
    switch (validationStep) {
      case 'validating':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Validating BVN</h3>
            <p className="text-gray-500 text-center">
              We're verifying your BVN with official records...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">BVN Verified Successfully!</h3>
            <p className="text-gray-500 text-center mb-6">
              Your BVN has been validated and your information matches official records.
            </p>
            
            {bvnData && (
              <div className="w-full bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <h4 className="font-medium text-green-800 mb-2">Verified Information:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Name:</span>
                    <span className="font-medium">{bvnData.firstName} {bvnData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">BVN Status:</span>
                    <span className="font-medium text-green-600">{bvnData.status}</span>
                  </div>
                  {bvnData.dateOfBirth && (
                    <div className="flex justify-between">
                      <span className="text-green-700">Year of Birth:</span>
                      <span className="font-medium">
                        {bvnData.dateOfBirth.split('-').pop()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => {
                form.reset();
                if (!isControlled) setOpen(false);
                setValidationStep('form');
                if (onComplete) onComplete();
              }}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Validation Failed</h3>
            <p className="text-gray-500 text-center mb-4">
              {validationError || "There was an issue validating your BVN."}
            </p>
            
            <div className="flex gap-3 w-full mt-4">
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => {
                  if (!isControlled) setOpen(false);
                  setValidationStep('form');
                }}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        );

      default: // 'form'
        return (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 pt-4"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Input your First Name" 
                        {...field} 
                        disabled={isSubmitting || isBVNValidating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Input your Last Name" 
                        {...field} 
                        disabled={isSubmitting || isBVNValidating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bvn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BVN Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Input your 11-digit BVN" 
                        {...field} 
                        disabled={isSubmitting || isBVNValidating}
                        maxLength={11}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      Your 11-digit Bank Verification Number
                    </p>
                  </FormItem>
                )}
              />
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Important:</h4>
                <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                  <li>Your name must match exactly with your BVN records</li>
                  <li>You must be at least 18 years old</li>
                  <li>BVN verification is required for withdrawals</li>
                  <li>Your data is securely encrypted</li>
                </ul>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isBVNValidating}
              >
                {isSubmitting || isBVNValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating BVN...
                  </>
                ) : (
                  'Verify BVN & Complete KYC'
                )}
              </Button>
            </form>
          </Form>
        );
    }
  };

  return (
    <Dialog
      open={isControlled ? controlledOpen : open}
      onOpenChange={isControlled ? setControlledOpen : setOpen}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {validationStep === 'success' ? 'KYC Complete' : 'Complete KYC Verification'}
          </DialogTitle>
          <div className="w-full h-0.5 bg-primary mt-2"></div>
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}