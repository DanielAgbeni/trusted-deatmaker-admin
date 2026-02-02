// app/(auth)/verify-otp/page.tsx
import { Suspense } from "react";
import VerifyOtpClient from "@/components/auth/VerifyOtpClient";

export const dynamic = "force-dynamic"; // Important for CSR-only hooks

export default function VerifyOtpRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOtpClient />
    </Suspense>
  );
}
