"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation, useResendOtpMutation } from "@/lib/store/features/auth/authApi";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  KeyRound,
  Loader2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordToolkit, setShowPasswordToolkit] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();
  const router = useRouter();

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  // Get email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push('/admin/forgot-password');
    }
  }, [router]);

  // Password requirements
  const passwordRequirements = [
    { id: "length", text: "8+ characters", validator: (pwd: string) => pwd.length >= 8 },
    { id: "uppercase", text: "Uppercase letter", validator: (pwd: string) => /[A-Z]/.test(pwd) },
    { id: "lowercase", text: "Lowercase letter", validator: (pwd: string) => /[a-z]/.test(pwd) },
    { id: "number", text: "Number", validator: (pwd: string) => /[0-9]/.test(pwd) },
    { id: "special", text: "Special character (@$!%*?&)", validator: (pwd: string) => /[@$!%*?&]/.test(pwd) },
  ];

  const requirementStatus = useMemo(() => {
    const pwd = formData.password || "";
    return passwordRequirements.map(req => ({
      ...req,
      met: req.validator(pwd),
    }));
  }, [formData.password]);

  const passwordStrength = useMemo(() => {
    const metCount = requirementStatus.filter(r => r.met).length;
    if (metCount === 0) return { label: "Very Weak", color: "bg-slate-200", textColor: "text-slate-500", percent: 0 };
    if (metCount <= 2) return { label: "Weak", color: "bg-red-500", textColor: "text-red-500", percent: 25 };
    if (metCount <= 3) return { label: "Fair", color: "bg-amber-500", textColor: "text-amber-500", percent: 50 };
    if (metCount <= 4) return { label: "Good", color: "bg-blue-500", textColor: "text-blue-500", percent: 75 };
    return { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-500", percent: 100 };
  }, [requirementStatus]);

  const areAllRequirementsMet = (metCount: number) => metCount === passwordRequirements.length;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || !email) return;

    setIsResending(true);
    try {
      const result = await resendOtp({ email }).unwrap();
      if (result.success) {
        setTimer(60);
        toast.success("New OTP sent to your email");
        setFormData(prev => ({ ...prev, otp: "" }));
      } else {
        toast.error(result.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.otp || !/^\d{6}$/.test(formData.otp)) newErrors.otp = "Valid 6-digit OTP required";
    if (!formData.password) newErrors.password = "Password required";
    else if (requirementStatus.filter(r => !r.met).length > 0) newErrors.password = "Requirements not met";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await resetPassword({
        email,
        otp: formData.otp,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      }).unwrap();

      if (result.success) {
        setIsSubmitted(true);
        localStorage.removeItem('resetEmail');
        toast.success("Password reset successfully");
      } else {
        setErrors({ general: result.message || "Reset failed" });
        toast.error(result.message || "Reset failed");
      }
    } catch (err: any) {
      const msg = err.data?.message || "An error occurred";
      setErrors({ general: msg });
      toast.error(msg);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Success!</h2>
            <p className="text-sm text-slate-500">Your admin password has been reset successfully.</p>
          </div>
          <Button
            onClick={() => router.push('/signin')}
            className="w-full bg-[#0097C7] hover:bg-[#0086b3] h-12 text-base font-semibold transition-all group"
          >
            Sign In Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-xl bg-[#0097C7]/10 mb-4">
            <KeyRound className="h-7 w-7 text-[#0097C7]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
          <p className="text-sm text-slate-500">Set a secure new password for your admin account.</p>

          {email && (
            <div className="mt-4 flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 truncate max-w-[200px]">{email}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Field */}
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-semibold text-slate-700">OTP Code</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="otp"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={formData.otp}
                onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, ''))}
                className={cn(
                  "pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all tracking-[0.5em] font-bold text-center",
                  errors.otp && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>
            {errors.otp && <p className="text-xs font-medium text-red-500 mt-1">{errors.otp}</p>}
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">New Password</Label>
              <button
                type="button"
                onClick={() => setShowPasswordToolkit(!showPasswordToolkit)}
                className="text-xs font-medium text-[#0097C7] hover:underline flex items-center gap-1"
              >
                <Info className="h-3 w-3" />
                Toolkit
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onFocus={() => setShowPasswordToolkit(true)}
                className={cn(
                  "pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all",
                  errors.password && "border-red-500 focus:ring-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Password Toolkit / Strength Indicator */}
          {(showPasswordToolkit || formData.password) && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Password Strength</span>
                  <span className={cn("text-xs font-bold", passwordStrength.textColor)}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-500", passwordStrength.color)}
                    style={{ width: `${passwordStrength.percent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {requirementStatus.map((req) => (
                  <div key={req.id} className="flex items-center gap-2">
                    {req.met ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-300 shrink-0" />
                    )}
                    <span className={cn(
                      "text-[11px] font-medium transition-colors",
                      req.met ? "text-emerald-700" : "text-slate-500"
                    )}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={cn(
                  "pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all",
                  errors.confirmPassword && "border-red-500 focus:ring-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs font-medium text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex flex-col items-center gap-4 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0097C7] hover:bg-[#0086b3] h-12 text-base font-semibold transition-all shadow-md shadow-[#0097C7]/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <div className="flex items-center gap-4 text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timer > 0 || isResendLoading}
                className={cn(
                  "font-semibold transition-colors flex items-center gap-1.5",
                  timer > 0 || isResendLoading ? "text-slate-400 cursor-not-allowed" : "text-[#0097C7] hover:text-[#0086b3]"
                )}
              >
                {isResendLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                Resend OTP {timer > 0 && `(${timer}s)`}
              </button>
              <span className="text-slate-200">|</span>
              <Link href="/signin" className="font-semibold text-slate-500 hover:text-[#0097C7] flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
