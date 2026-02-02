// @ts-nocheck
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  userType: string;
  accessToken: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("dealmakerauthToken");
        const userDataStr = localStorage.getItem("dealmakerUserData");
        
        if (token && userDataStr) {
          console.log("Found auth token and user data in localStorage");
          const userData = JSON.parse(userDataStr);
          setUser({
            userType: userData.data?.userType || "",
            accessToken: token,
            email: userData.data?.email,
            name: userData.data?.name,
          });
        }
      } catch (error) {
        console.error("Error loading auth:", error);
        // Clear corrupted data
        localStorage.removeItem("dealmakerauthToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("dealmakerUserData");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: any) => {
    localStorage.setItem("dealmakerauthToken", token);
    localStorage.setItem("refreshToken", userData.data?.refreshToken || "");
    localStorage.setItem("dealmakerUserData", JSON.stringify(userData));
    setUser({
      userType: userData.data?.userType || "",
      accessToken: token,
      email: userData.data?.email,
      name: userData.data?.name,
    });
  };

  const logout = () => {
    localStorage.removeItem("dealmakerauthToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("dealmakerUserData");
    setUser(null);
    router.push("/signin");
  };

  const isAuthenticated = !!user?.accessToken;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}