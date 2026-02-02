// @ts-nocheck
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaLock } from "react-icons/fa";
import { LiaArrowRightSolid } from "react-icons/lia";
import { useLoginMutation } from "@/lib/store/features/auth/authApi";
import FormInput from "./FormInput";
import { useAuth } from "@/context/AuthContext";

interface AuthFormProps {
  formData: Record<string, string>;
  onFormDataChange: (field: string, value: string) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  mode?: "signin" | "signup";
}

export default function AuthForm({
  formData,
  onFormDataChange,
  errors,
  setErrors,
  mode = "signin",
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const { login: authLogin } = useAuth();

  const adminFields = [
    {
      id: "email",
      label: "Admin Email",
      type: "email",
      placeholder: "Enter admin email",
      required: true,
    },
    {
      id: "password",
      label: "Admin Password",
      type: "password",
      placeholder: "Enter admin password",
      required: true,
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = "Admin email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (result.success) {
        if (result.data?.accessToken) {
          const userTypeFromResponse = result.data.userType;

          if (userTypeFromResponse !== "ADMIN") {
            setApiError("Access denied. Admin credentials required.");
            setIsSubmitting(false);
            return;
          }

          authLogin(result.data.accessToken, result);
          router.push("/dashboard/ad");

        } else {
          setApiError("Login successful but no access token received");
          setIsSubmitting(false);
        }
      } else {
        if (result.message?.includes("Account not verified")) {
          localStorage.setItem("signupEmail", formData.email);
          localStorage.setItem("otpResent", "true");
          const redirectUrl = `/verify-otp?email=${encodeURIComponent(formData.email)}`;
          router.push(redirectUrl);
        } else {
          setApiError(result.message || "Login failed");
          setIsSubmitting(false);
        }
      }
    } catch (err: any) {
      const errorData = err.data || err;

      if (errorData.success === false &&
        errorData.message?.includes("Account not verified")) {
        localStorage.setItem("signupEmail", formData.email);
        localStorage.setItem("otpResent", "true");
        const redirectUrl = `/verify-otp?email=${encodeURIComponent(formData.email)}`;
        router.push(redirectUrl);
      } else {
        setApiError(errorData?.message || "An error occurred. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  const isLoading = isSubmitting || isLoginLoading;

  const isButtonDisabled = () => {
    if (isLoading) return true;
    if (!formData.email || !formData.password) return true;
    return false;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Admin Header */}
      <div className="text-center mb-6">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-primary rounded-xl flex items-center justify-center mb-3">
            <FaLock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Restricted access. Admin credentials required.</p>
        </div>
      </div>

      {/* Form fields */}
      {adminFields.map((field) => (
        <div key={field.id} className="relative">
          <FormInput
            field={field}
            value={formData[field.id] || ""}
            onChange={(value) => {
              onFormDataChange(field.id, value);
              if (errors[field.id]) {
                setErrors({ ...errors, [field.id]: "" });
              }
            }}
            showPassword={field.id === "password" ? showPassword : undefined}
            onTogglePassword={
              field.id === "password" ? () => setShowPassword(!showPassword) : undefined
            }
            error={errors[field.id]}
          />
        </div>
      ))}

      {/* Forgot password link */}
      <div className="text-right">
        <Link
          href="/admin/forgot-password"
          className="text-sm text-primary hover:text-blue-800 hover:underline"
        >
          Forgot admin password?
        </Link>
      </div>

      {/* Error Display */}
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isButtonDisabled()}
        className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2 mt-6 transition-colors ${isButtonDisabled()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-[057fa4]'
          }`}
      >
        <span>
          {isLoading
            ? "Authenticating..."
            : "Admin Sign In"}
        </span>
        <LiaArrowRightSolid className="text-lg" />
      </button>

      {/* Security Notice */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            ⚠️ This portal is restricted to authorized personnel only.
            <br />
            Unauthorized access attempts are logged and monitored.
          </p>
        </div>
      </div>
    </form>
  );
}