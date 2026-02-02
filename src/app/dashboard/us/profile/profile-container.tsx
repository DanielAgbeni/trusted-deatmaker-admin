// src/app/dashboard/us/profile/profile-container.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileOverview from "./profile-overview";
import ProfileForm from "./profile-form";
import SecuritySettings from "./security-settings";
import { UserProfile, UserProfileFormData } from "@/types/user-profile";

// Mock data - in real app, this would come from API/database
const mockUserProfile: UserProfile = {
  id: "user-123",
  name: "David Abolaji Victor",
  email: "davidabolaji2014@google.com",
  phone: "+234-812-345-234",
  avatar: "/avatars/david-1.jpg",
  address: {
    street: "123 Victoria Island",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    postalCode: "100001",
  },
  preferences: {
    notifications: {
      email: true,
      sms: true,
      push: false,
    },
    language: "en",
    timezone: "Africa/Lagos",
    currency: "NGN",
  },
  verification: {
    email: true,
    phone: true,
    kyc: false,
  },
  createdAt: "2024-01-15T08:30:00Z",
  lastLoginAt: "2024-03-27T14:39:00Z",
};

export default function ProfileContainer() {
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = async (formData: UserProfileFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user profile
      const updatedProfile: UserProfile = {
        ...userProfile,
        name: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.phone,
        address: formData.address,
        preferences: formData.preferences,
      };

      setUserProfile(updatedProfile);
      setIsEditing(false);

      toast.success("Profile Updated", {
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast.error("Update Failed", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="edit">Edit Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <ProfileOverview
          userProfile={userProfile}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
        />
      </TabsContent>

      <TabsContent value="edit" className="space-y-6">
        <ProfileForm
          userProfile={userProfile}
          isEditing={true}
          isLoading={isLoading}
          onSubmit={handleProfileUpdate}
          onCancel={handleCancelEdit}
        />
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <SecuritySettings userProfile={userProfile} />
      </TabsContent>
    </Tabs>
  );
}
