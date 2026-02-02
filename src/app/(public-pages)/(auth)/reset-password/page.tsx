// /app/reset-password/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation, useResendOtpMutation } from "@/lib/store/features/auth/authApi";
import { LiaArrowRightSolid } from "react-icons/lia";
import { FiInfo, FiRefreshCw } from "react-icons/fi";
import { FaCheck, FaTimes, FaTimesCircle, FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [userClosedTooltip, setUserClosedTooltip] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
      router.push('/forgot-password');
    }
  }, [router]);

  // Password strength requirements (same as AuthForm)
  const passwordRequirements = [
    {
      id: "length",
      text: "At least 8 characters",
      validator: (pwd: string) => pwd.length >= 8,
    },
    {
      id: "uppercase",
      text: "At least one uppercase letter",
      validator: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      id: "lowercase",
      text: "At least one lowercase letter",
      validator: (pwd: string) => /[a-z]/.test(pwd),
    },
    {
      id: "number",
      text: "At least one number",
      validator: (pwd: string) => /[0-9]/.test(pwd),
    },
    {
      id: "special",
      text: "At least one special character (@ $ ! % * ? &)",
      validator: (pwd: string) => /[@$!%*?&]/.test(pwd),
    },
  ];

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    const password = formData.password || "";
    if (!password) return { score: 0, color: "bg-gray-200", text: "Weak", strength: 0 };
    
    const metRequirements = passwordRequirements.filter(req => req.validator(password)).length;
    const score = metRequirements / passwordRequirements.length;
    
    if (score >= 0.9) {
      return { score, color: "bg-green-500", text: "Strong", strength: 4 };
    } else if (score >= 0.6) {
      return { score, color: "bg-blue-500", text: "Good", strength: 3 };
    } else if (score >= 0.4) {
      return { score, color: "bg-yellow-500", text: "Fair", strength: 2 };
    } else {
      return { score, color: "bg-red-500", text: "Weak", strength: 1 };
    }
  }, [formData.password]);

  // Check which requirements are met
  const requirementStatus = useMemo(() => {
    const password = formData.password || "";
    return passwordRequirements.map(req => ({
      ...req,
      met: req.validator(password),
    }));
  }, [formData.password]);

  // Check for invalid special characters
  const hasInvalidSpecialChars = useMemo(() => {
    const password = formData.password || "";
    if (!password) return false;
    
    const invalidCharMatch = password.match(/[^\w@$!%*?&]/);
    return invalidCharMatch && invalidCharMatch.length > 0;
  }, [formData.password]);

  // Check if ALL password requirements are met
  const areAllPasswordRequirementsMet = useMemo(() => {
    if (!formData.password) return false;
    return passwordRequirements.every(req => req.validator(formData.password)) && !hasInvalidSpecialChars;
  }, [formData.password, hasInvalidSpecialChars]);

  // Check if all form requirements are met
  const areAllFormRequirementsMet = useMemo(() => {
    // Check OTP
    if (!formData.otp || !/^\d{6}$/.test(formData.otp)) return false;
    
    // Check password requirements
    if (!formData.password || !areAllPasswordRequirementsMet) return false;
    
    // Check confirm password match
    if (formData.password !== formData.confirmPassword) return false;
    
    return true;
  }, [formData, areAllPasswordRequirementsMet]);

  // Handle auto-show/hide of password tooltip
  useEffect(() => {
    const password = formData.password || "";
    
    // Show tooltip when user starts typing password
    if (password.length > 0 && !userClosedTooltip) {
      setShowPasswordTooltip(true);
      setIsTypingPassword(true);
      
      // Auto-hide timer - only if all password requirements are met
      const timer = setTimeout(() => {
        if (areAllPasswordRequirementsMet && !isTypingPassword) {
          setShowPasswordTooltip(false);
          setIsTypingPassword(false);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    } else if (password.length === 0) {
      // Reset when password is cleared
      setIsTypingPassword(false);
      if (!userClosedTooltip) {
        setShowPasswordTooltip(false);
      }
    }
  }, [formData.password, areAllPasswordRequirementsMet, userClosedTooltip]);

  // Reset userClosedTooltip when password changes significantly
  useEffect(() => {
    const password = formData.password || "";
    if (password.length === 0 || (password.length === 1 && userClosedTooltip)) {
      setUserClosedTooltip(false);
    }
  }, [formData.password]);

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        if (!isTypingPassword && areAllPasswordRequirementsMet) {
          setShowPasswordTooltip(false);
        }
      }
    };

    if (showPasswordTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPasswordTooltip, isTypingPassword, areAllPasswordRequirementsMet]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // OTP validation
    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "OTP must be 6 digits";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      // Check for invalid special characters first
      if (hasInvalidSpecialChars) {
        newErrors.password = "Only @ $ ! % * ? & are allowed as special characters";
      }
      // Check all requirements
      else {
        const unmetRequirements = passwordRequirements.filter(req => !req.validator(formData.password));
        if (unmetRequirements.length > 0) {
          newErrors.password = "Password doesn't meet all requirements";
        }
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  // Handle manual tooltip close
  const handleCloseTooltip = () => {
    setShowPasswordTooltip(false);
    setUserClosedTooltip(true);
  };

  // Handle password field focus
  const handlePasswordFocus = () => {
    setShowPasswordTooltip(true);
    setIsTypingPassword(true);
  };

  // Handle password field blur
  const handlePasswordBlur = () => {
    setIsTypingPassword(false);
    if (areAllPasswordRequirementsMet && !userClosedTooltip) {
      const timer = setTimeout(() => {
        setShowPasswordTooltip(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || !email) return;

    setIsResending(true);
    setErrors(prev => ({ ...prev, general: "" }));
    setSuccessMessage("");

    try {
      const result = await resendOtp({ email }).unwrap();

      if (result.success) {
        setTimer(60); // Reset timer
        setSuccessMessage(result.message || "New OTP sent to your email!");
        // Clear OTP input
        setFormData(prev => ({ ...prev, otp: "" }));
      } else {
        setErrors(prev => ({
          ...prev,
          general: result.message || "Failed to resend OTP"
        }));
      }
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setErrors(prev => ({
        ...prev,
        general: err.data?.message || "Failed to resend OTP. Please try again."
      }));
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prevent submission if requirements are not met
    if (!areAllFormRequirementsMet) {
      setErrors(prev => ({
        ...prev,
        general: "Please complete all requirements before submitting"
      }));
      return;
    }

    try {
      const resetData = {
        email,
        otp: formData.otp,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const result = await resetPassword(resetData).unwrap();
      
      if (result.success) {
        setIsSubmitted(true);
        localStorage.removeItem('resetEmail');
      } else {
        setErrors(prev => ({
          ...prev,
          general: result.message || "Failed to reset password"
        }));
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setErrors(prev => ({
        ...prev,
        general: err.data?.message || "An error occurred. Please try again."
      }));
    }
  };

  const isButtonDisabled = isLoading || !areAllFormRequirementsMet;

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
              Password Reset Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been successfully reset.
            </p>
            <p className="mt-4 text-sm text-gray-600">
              You can now sign in with your new password.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/signin')}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0097C7] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097C7] transition-colors"
            >
              Sign In
              <LiaArrowRightSolid className="ml-2" />
            </button>

            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097C7] transition-colors"
              >
                Back to Home
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
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to your email and set a new password
          </p>
          
          {/* Email Display */}
          {email && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <FaEnvelope className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Reset password for</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{email}</p>
                </div>
              </div>
              {successMessage && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* OTP Field */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              maxLength={6}
              value={formData.otp}
              onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, ''))}
              className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                errors.otp ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#0097C7] focus:border-[#0097C7] sm:text-sm`}
              placeholder="Enter 6-digit OTP"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
            )}
          </div>

          {/* Password Field with Tooltip */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                {/* Tooltip toggle button when tooltip is hidden */}
                {!showPasswordTooltip && formData.password && formData.password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordTooltip(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiInfo className="h-4 w-4 text-gray-400 cursor-help" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="relative" ref={tooltipRef}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#0097C7] focus:border-[#0097C7] sm:text-sm`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
              
              {/* Password Strength Indicator */}
              <div className="absolute -top-8 right-0 flex items-center space-x-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-4 rounded ${
                      level <= passwordStrength.strength
                        ? passwordStrength.strength === 4 ? 'bg-green-500' :
                          passwordStrength.strength === 3 ? 'bg-blue-500' :
                          passwordStrength.strength === 2 ? 'bg-yellow-500' :
                          'bg-red-500'
                        : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Password Strength Tooltip */}
            {showPasswordTooltip && (
              <div 
                ref={tooltipRef}
                className="relative mt-2 z-50 w-full"
              >
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={handleCloseTooltip}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close password requirements"
                  >
                    <FaTimesCircle className="w-4 h-4" />
                  </button>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Password Strength</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.strength === 4 ? 'text-green-600' :
                        passwordStrength.strength === 3 ? 'text-blue-600' :
                        passwordStrength.strength === 2 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${passwordStrength.score * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">Requirements:</p>
                    {requirementStatus.map((req) => (
                      <div key={req.id} className="flex items-center">
                        {req.met ? (
                          <FaCheck className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <FaTimes className="w-3 h-3 text-red-500 mr-2 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-600'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                    
                    {/* Warning for invalid special characters */}
                    {hasInvalidSpecialChars && (
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <div className="flex items-center">
                          <FaTimes className="w-3 h-3 text-red-500 mr-2 flex-shrink-0" />
                          <span className="text-xs text-red-600 font-medium">
                            Invalid special characters detected
                          </span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">
                          Only these special characters are allowed: <span className="font-bold">@ $ ! % * ? &</span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Status message */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className={`text-xs ${
                      areAllPasswordRequirementsMet 
                        ? 'text-green-600 font-medium' 
                        : 'text-gray-500'
                    }`}>
                      {areAllPasswordRequirementsMet 
                        ? "✓ All password requirements met!"
                        : passwordStrength.strength === 4 
                        ? "✓ Strong password! Your account is well protected."
                        : passwordStrength.strength === 3
                        ? "✓ Good password. Consider adding special characters for extra security."
                        : passwordStrength.strength === 2
                        ? "⚠ Fair password. Meet more requirements for better security."
                        : "⚠ Please meet all requirements above."}
                    </p>
                    
                    {/* Auto-hide notification */}
                    {areAllPasswordRequirementsMet && (
                      <p className="text-xs text-gray-400 mt-1">
                        Tooltip will auto-hide in a few seconds
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#0097C7] focus:border-[#0097C7] sm:text-sm`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
            {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="mt-1 text-sm text-green-600">✓ Passwords match</p>
            )}
          </div>

          {/* Resend OTP Timer */}
          <div className="text-center mb-6">
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

          {/* Inline password requirements (for smaller screens) */}
          {formData.password && (
            <div className="md:hidden mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-medium text-gray-700">Password Requirements:</p>
                {!areAllPasswordRequirementsMet && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordTooltip(!showPasswordTooltip)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {showPasswordTooltip ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>
              
              {(!areAllPasswordRequirementsMet || showPasswordTooltip) && (
                <div className="space-y-1">
                  {requirementStatus.map((req) => (
                    <div key={req.id} className="flex items-center">
                      {req.met ? (
                        <FaCheck className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <FaTimes className="w-3 h-3 text-red-500 mr-2 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-600'}`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                  
                  {/* Warning for invalid special characters on mobile */}
                  {hasInvalidSpecialChars && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <div className="flex items-center">
                        <FaTimes className="w-3 h-3 text-red-500 mr-2 flex-shrink-0" />
                        <span className="text-xs text-red-600 font-medium">
                          Invalid special characters
                        </span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">
                        Allowed: <span className="font-bold">@ $ ! % * ? &</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Mobile status indicator */}
              <div className="mt-3 pt-3 border-t border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Password Status:</span>
                  <span className={`text-xs font-semibold ${
                    areAllPasswordRequirementsMet 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {areAllPasswordRequirementsMet 
                      ? "Strong ✓" 
                      : "Needs improvement"}
                  </span>
                </div>
                {areAllPasswordRequirementsMet && (
                  <p className="text-xs text-green-600 mt-1">
                    Your password meets all security requirements
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isButtonDisabled
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
                  Resetting password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col space-y-4 text-center">
            <div className="text-sm">
              <span className="text-gray-600">Didn't receive OTP? </span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timer > 0 || isResendLoading}
                className={`font-medium ${
                  timer > 0 || isResendLoading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[#0097C7] hover:text-blue-700'
                }`}
              >
                {isResendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/signin"
                className="font-medium text-[#0097C7] hover:text-blue-700"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}