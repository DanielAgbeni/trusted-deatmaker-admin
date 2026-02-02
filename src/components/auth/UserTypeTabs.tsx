"use client";
import type { UserType, AuthMode } from "./types";

interface UserTypeTabsProps {
  activeUserType: UserType;
  onUserTypeChange: (type: UserType) => void;
  authMode: AuthMode;
}

export default function UserTypeTabs({
  activeUserType,
  onUserTypeChange,
  authMode,
}: UserTypeTabsProps) {
  // Only show for signup
  if (authMode !== "signup") return null;

  return (
    <nav className="mb-6">
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => onUserTypeChange("regular")}
          className={`flex-1 py-3 px-1 text-center text-sm font-normal border-b-2 transition-colors ${
            activeUserType === "regular"
              ? "text-[#0097C7] border-[#0097C7]"
              : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Regular User
        </button>
        <button
          type="button"
          onClick={() => onUserTypeChange("marketplace")}
          className={`flex-1 py-3 px-1 text-center text-sm font-normal border-b-2 transition-colors ${
            activeUserType === "marketplace"
              ? "text-[#0097C7] border-[#0097C7]"
              : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Marketplace User
        </button>
      </div>
    </nav>
  );
}