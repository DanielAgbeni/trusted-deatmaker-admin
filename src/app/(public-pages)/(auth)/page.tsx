"use client";

import { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function SignInPage({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="flex-1 md:max-w-md">
      <div className="bg-white shadow-sm rounded-lg p-6 py-8">
        <AuthForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          errors={errors}
          setErrors={setErrors}
          mode={mode}
        />
      </div>
    </div>
  );
}