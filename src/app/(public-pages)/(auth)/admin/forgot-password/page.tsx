"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/lib/store/features/auth/authApi";
import {
  ArrowLeft,
  Mail,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShieldIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
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
        localStorage.setItem('resetEmail', email);
        toast.success("Reset instructions sent to your email");
      } else {
        setError(result.message || "Failed to send reset instructions");
        toast.error(result.message || "Failed to send reset instructions");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      const message = err.data?.message || "An error occurred. Please try again.";
      setError(message);
      toast.error(message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Check Your Email
            </h2>
            <p className="text-sm text-slate-500">
              We've sent reset instructions to:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 inline-block">
              <span className="text-sm font-semibold text-slate-700">{email}</span>
            </div>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              Please check your inbox for the OTP. You'll need it to set a new password.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <Button
              onClick={() => router.push('/admin/reset-password')}
              className="w-full bg-[#0097C7] hover:bg-[#0086b3] h-12 text-base font-semibold transition-all group"
            >
              Continue to Reset
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Didn't receive the email?{" "}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="font-semibold text-[#0097C7] hover:text-[#0086b3] hover:underline disabled:opacity-50"
                >
                  {isLoading ? 'Resending...' : 'Click to resend'}
                </button>
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() => router.push('/signin')}
              className="text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-xl bg-[#0097C7]/10 mb-4">
            <ShieldIcon className="h-7 w-7 text-[#0097C7]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Forgot Password?
          </h2>
          <p className="text-sm text-slate-500">
            No worries! Enter your admin email and we'll send you a 6-digit OTP to reset your password.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Admin Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={cn(
                  "pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all",
                  error && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>
            {error && <p className="text-xs font-medium text-red-500 mt-1">{error}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0097C7] hover:bg-[#0086b3] h-12 text-base font-semibold transition-all shadow-md shadow-[#0097C7]/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/signin"
              className="text-sm font-semibold text-slate-500 hover:text-[#0097C7] inline-flex items-center transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
        <p className="text-xs text-amber-700 leading-relaxed font-medium">
          <span className="font-bold">Security Tip:</span> For security reasons, OTPs are valid for 10 minutes. Please ensure you have access to your admin mailbox.
        </p>
      </div>
    </div>
  );
}
