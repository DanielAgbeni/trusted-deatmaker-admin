// src/app/dashboard/us/profile/page.tsx
import type { Metadata } from "next";
import ProfileContainer from "./profile-container";

export const metadata: Metadata = {
  title: "Profile | Dashboard",
  description: "Manage your profile information, preferences and security settings",
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>
      <ProfileContainer />
    </div>
  );
}