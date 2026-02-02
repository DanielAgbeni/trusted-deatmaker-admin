"use client";
import Link from "next/link";
import type { AuthMode } from "./types";

interface AuthModeTabsProps {
  authMode: AuthMode;
}

export default function AuthModeTabs({ authMode }: AuthModeTabsProps) {
  return (
    <nav className="mb-6">
      <div className="flex border-b border-gray-200">
        <Link
          href="/signin"
          className={`flex-1 py-3 px-1 text-center text-sm font-medium border-b-2 transition-colors ${
            authMode === "signin"
              ? "text-[#0097C7] border-[#0097C7]"
              : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className={`flex-1 py-3 px-1 text-center text-sm font-medium border-b-2 transition-colors ${
            authMode === "signup"
              ? "text-[#0097C7] border-[#0097C7]"
              : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}