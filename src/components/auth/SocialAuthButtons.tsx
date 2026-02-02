"use client";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import type { AuthMode } from "./types";

interface SocialAuthButtonsProps {
  authMode: AuthMode;
}

export default function SocialAuthButtons({ authMode }: SocialAuthButtonsProps) {
  return (
    <div className="mt-6">
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 mb-3"
      >
        <FcGoogle className="text-lg" />
        <span>{authMode === "signin" ? "Sign In" : "Sign Up"} with Google</span>
      </button>

      <button
        type="button"
        className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
      >
        <FaApple className="text-lg" />
        <span>{authMode === "signin" ? "Sign In" : "Sign Up"} with Apple</span>
      </button>
    </div>
  );
}