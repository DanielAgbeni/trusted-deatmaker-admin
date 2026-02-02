"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
}

export default function ProtectedRoute({ 
  children, 
  allowedUserTypes 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated, redirect to signin
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    // If authenticated but no user data yet, wait
    if (!user) return;

    // Check user type permissions
    if (allowedUserTypes && user.userType) {
      const hasAccess = allowedUserTypes.includes(user.userType);
      if (!hasAccess) {
        // Define user type routes
        const userTypeRoutes: Record<string, string> = {
          "APP_USER": "/dashboard/us",
          "VENDOR_USER": "/dashboard/mp",
          "VENDOR": "/dashboard/mp",
          "ADMIN": "/dashboard/ad",
          "MARKETPLACE": "/dashboard/mp",
        };
        
        const defaultRoute = userTypeRoutes[user.userType] || "/dashboard";
        
        // Only redirect if not already on the correct route
        if (!pathname?.startsWith(defaultRoute)) {
          router.push(defaultRoute);
        }
      }
    }
    
    setIsChecking(false);
  }, [isLoading, isAuthenticated, user, router, allowedUserTypes, pathname]);

  // Show loading while checking auth
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check user type access
  if (allowedUserTypes && user.userType && !allowedUserTypes.includes(user.userType)) {
    return null;
  }

  return <>{children}</>;
}