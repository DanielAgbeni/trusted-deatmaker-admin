"use client";

import { useAuth } from "@/context/AuthContext";


export function useCheckAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    userType: user?.userType || null,
  };
}