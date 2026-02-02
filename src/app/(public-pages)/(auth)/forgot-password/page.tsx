// /app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/lib/store/features/auth/authApi";
import { LiaArrowRightSolid } from "react-icons/lia";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    try {
      const result = await forgotPassword({ email }).unwrap();
      
      if (result.success) {
        setIsSubmitted(true);
        // Store email for OTP verification page
        localStorage.setItem('resetEmail', email);
      } else {
        setError(result.message || "Failed to send reset instructions");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(err.data?.message || "An error occurred. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-medium text-gray-900">
              Check Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent an email to:
            </p>
            <p className="mt-2 text-lg font-medium text-gray-900">{email}</p>
            <p className="mt-4 text-sm text-gray-600">
              Please check your inbox get the OTP and use that to reset your password.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/reset-password')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0097C7] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097C7]"
            >
              Reset Password
              <LiaArrowRightSolid className="ml-2" />
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the email?{" "}
                <button
                  onClick={handleSubmit}
                  className="font-medium text-[#0097C7] hover:text-blue-700"
                >
                  {isLoading ? 'Resending...' : 'Resend'}
                </button>
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/signin"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097C7]"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                error ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#0097C7] focus:border-[#0097C7] focus:z-10 sm:text-sm`}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#0097C7] hover:bg-[#0585ac] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097C7]'
              } transition-colors`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending instructions...
                </span>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/signin"
              className="font-medium text-[#0097C7] hover:text-blue-700"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}