// components/auth/VerifyOtpPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  useVerifyOtpMutation, 
  useResendOtpMutation 
} from "@/lib/store/features/auth/authApi";
import { FaArrowLeft, FaCheckCircle, FaSpinner, FaEnvelope } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

export default function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get email from URL parameters or fallback to localStorage
  const emailFromUrl = searchParams.get("email");
  const storedEmail = typeof window !== "undefined" ? localStorage.getItem("signupEmail") : null;
  
  const [email, setEmail] = useState(emailFromUrl || storedEmail || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // RTK Query mutations
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  // Redirect if no email is found
  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMessage(""); // Clear error when user types

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when last digit is entered
    if (value && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        handleVerifyOtp();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 6).split("");
    
    if (pastedNumbers.length === 6) {
      const newOtp = [...otp];
      pastedNumbers.forEach((num, index) => {
        newOtp[index] = num;
      });
      setOtp(newOtp);
      
      // Focus last input
      const lastIndex = Math.min(pastedNumbers.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    
    // Validation
    if (otpString.length !== 6) {
      setErrorMessage("Please enter a 6-digit OTP");
      return;
    }

    if (!email) {
      setErrorMessage("Email not found. Please try signing up again.");
      return;
    }

    try {
      const result = await verifyOtp({
        email,
        otp: otpString
      }).unwrap();

      if (result.success) {
        setVerificationSuccess(true);
        setSuccessMessage(result.message || "Email verified successfully!");
        
        // Store token if available
        if (result.data?.token) {
          localStorage.setItem("authToken", result.data.token);
        }
        
        // Clear signup email from storage
        localStorage.removeItem("signupEmail");
        
        // Redirect to signin after 2 seconds
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setErrorMessage(result.message || "Verification failed");
        // Clear OTP on failure
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setErrorMessage(
        error.data?.message || 
        "Invalid OTP. Please try again."
      );
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || !email) return;

    setIsResending(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await resendOtp({ email }).unwrap();

      if (result.success) {
        setTimer(60); // Reset timer
        setSuccessMessage(result.message || "New OTP sent to your email!");
        // Clear OTP inputs
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(result.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setErrorMessage(
        error.data?.message || 
        "Failed to resend OTP. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerifyOtp();
    }
  };

  if (verificationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-lg font-medium text-gray-800 mb-2">
              Verification Successful!
            </h1>

            <p className="text-gray-600 mb-6">Welcome to the one Trusted deal maker{successMessage}</p>
            <div className="animate-pulse text-sm text-green-600">
              Redirecting to login...
            </div>
          </div>
          <div className="space-y-4">
            <Link
              href="/signin"
              className="inline-block w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Go to login
            </Link>
            <Link
              href="/"
              className="inline-block w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white shadow-lg rounded-lg p-6 py-8 flex items-center justify-center">
      <div className="w-full overflow-hidden">
        {/* Header */}
        <div className="pb-6 text-black">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/signup"
              className="flex items-center text-xs hover:text-blue-200 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Sign Up
            </Link>
          </div>
          <h1 className="text-2xl font-medium">Verify Your Email</h1>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Main Content */}
        <div className="">
          {/* Email Display */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <FaEnvelope className="w-5 h-5 text-blue-600 mr-3" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">Verification code sent to</p>
                <p className="text-sm font-medium text-gray-900 break-all">{email}</p>
              </div>
            </div>
            {successMessage && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Enter 6-digit verification code
            </label>
            
            <div className="flex justify-start space-x-2 mb-6" onPaste={handlePaste} onKeyPress={handleKeyPress}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-2xl font-bold rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errorMessage 
                      ? "border-red-300 bg-red-50" 
                      : digit 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-300"
                  }`}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 text-center">{errorMessage}</p>
              </div>
            )}
          </div>

          

          {/* Submit Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={isVerifying || otp.join("").length !== 6}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              isVerifying || otp.join("").length !== 6
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
            }`}
          >
            {isVerifying ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify Email</span>
            )}
          </button>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            {/* Resend Timer */}
          <div className="text-center mb-8">
            {timer > 0 ? (
              <div className="text-gray-600">
                <p className="text-sm">Request new code in</p>
                <p className="text-xl font-mono font-bold text-blue-600">
                  00:{timer.toString().padStart(2, "0")}
                </p>
              </div>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={isResendLoading}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isResendLoading
                    ? "bg-gray-100 text-gray-400"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                <FiRefreshCw className={`mr-2 ${isResendLoading ? "animate-spin" : ""}`} />
                {isResendLoading ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}