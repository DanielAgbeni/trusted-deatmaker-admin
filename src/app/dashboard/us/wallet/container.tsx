// Updated WalletContainer.tsx
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import WalletOverview from "./wallet-transaction-overview";
import RecentTransactions from "../recent-transactions";
import TransactionPinModal from "@/components/TransactionPinModal/TransactionPinModal";
import { useGetUserProfileQuery } from "@/lib/store/features/userDashboardApi/userDashboardApi";
import { toast } from "sonner";

export default function WalletContainer() {
  const [isKYCCompleted, setIsKYCCompleted] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [requiresPinSetup, setRequiresPinSetup] = useState(false);
  const [hasCheckedPinStatus, setHasCheckedPinStatus] = useState(false);
  
  const { 
    data: profileResponse, 
    isLoading,
    error,
    refetch
  } = useGetUserProfileQuery();

  console.log("Full profileResponse:", JSON.stringify(profileResponse, null, 2));

  // Determine KYC status
  useEffect(() => {
    if (profileResponse?.data) {
      console.log("Profile data found:", profileResponse.data);
      
      const userProfile = profileResponse.data;
      
      // Check KYC status
      console.log("KYC verified status:", userProfile.kycVerified);
      setIsKYCCompleted(userProfile.kycVerified === true);
    } else if (profileResponse) {
      console.log("profileResponse exists but no data property:", profileResponse);
    }
  }, [profileResponse]);

  // Determine PIN requirement - run only once when profile loads
  useEffect(() => {
    if (profileResponse?.data && !hasCheckedPinStatus) {
      const userProfile = profileResponse.data;
      
      console.log("=== PIN REQUIREMENT CHECK ===");
      console.log("Full user profile:", userProfile);
      console.log("hasTransactionPin property:", userProfile.hasTransactionPin);
      console.log("Type of hasTransactionPin:", typeof userProfile.hasTransactionPin);
      console.log("Associations:", userProfile.associations);
      console.log("Associations array length:", userProfile.associations?.length);
      
      // FIXED: Check if user needs to setup PIN (if hasTransactionPin is false)
      const needsPinSetup = userProfile.hasTransactionPin === false;
      
      console.log("User needs PIN setup?", needsPinSetup);
      console.log("=== END PIN CHECK ===");
      
      setRequiresPinSetup(needsPinSetup);
      setHasCheckedPinStatus(true);
      
      // Auto-show PIN modal if setup is required
      if (needsPinSetup) {
        console.log("Showing PIN modal automatically");
        setShowPinModal(true);
      }
    }
  }, [profileResponse, hasCheckedPinStatus]);

  // Alternative debug useEffect to see what's happening
  useEffect(() => {
    console.log("=== STATE UPDATE ===");
    console.log("isLoading:", isLoading);
    console.log("profileResponse exists:", !!profileResponse);
    console.log("profileResponse data exists:", !!profileResponse?.data);
    console.log("isKYCCompleted:", isKYCCompleted);
    console.log("showPinModal:", showPinModal);
    console.log("requiresPinSetup:", requiresPinSetup);
    console.log("hasCheckedPinStatus:", hasCheckedPinStatus);
    console.log("=== END STATE UPDATE ===");
  }, [isLoading, profileResponse, isKYCCompleted, showPinModal, requiresPinSetup, hasCheckedPinStatus]);

  const handlePinCreated = async (pin: string) => {
    try {
      // Call your API to create PIN
      // const response = await api.createTransactionPin(pin);
      
      // After successful PIN creation, refresh profile
      await refetch();
      
      // Reset PIN check status so we can check again
      setHasCheckedPinStatus(false);
      
      toast.success("Transaction PIN created successfully!");
      
      // Close the modal
      setShowPinModal(false);
    } catch (error) {
      toast.error("Failed to create PIN. Please try again.");
      throw error;
    }
  };

  const handlePinVerified = async (pin: string) => {
    try {
      // Call your API to verify PIN for a transaction
      // const response = await api.verifyTransactionPin(pin);
      
      toast.success("PIN verified successfully!");
      return true;
    } catch (error) {
      toast.error("Invalid PIN. Please try again.");
      throw error;
    }
  };

  // Get user name for display
  const getUserName = () => {
    if (profileResponse?.data) {
      const { firstName, lastName } = profileResponse.data;
      return `${firstName || ''} ${lastName || ''}`.trim() || 'User Account';
    }
    return 'User Account';
  };

  // Get user wallet details
  const getWalletDetails = () => {
    if (profileResponse?.data?.wallets?.[0]) {
      return profileResponse.data.wallets[0];
    }
    return null;
  };

  return (
    <>
      <WalletOverview
        isKYCCompleted={isKYCCompleted}
        handleKYCStatusChange={() => {
          setIsKYCCompleted((prev) => !prev);
          refetch();
          toast.success("KYC status updated. Please wait for verification.");
        }}
        profileLoading={isLoading}
        userName={getUserName()}
        profileData={profileResponse?.data}
        walletDetails={getWalletDetails()}
        hasError={!!error}
        // Pass PIN setup requirement to WalletOverview if needed
        requiresPinSetup={requiresPinSetup}
        onRequestPinSetup={() => setShowPinModal(true)}
      />
      
      <RecentTransactions />

      <TransactionPinModal
        isOpen={showPinModal}
        onClose={() => {
          setShowPinModal(false);
        }}
        mode={requiresPinSetup ? "create" : "verify"}
        onPinCreated={handlePinCreated}
        onPinVerified={handlePinVerified}
        requiresPinCreation={requiresPinSetup}
        userEmail={profileResponse?.data?.email}
      />
    </>
  );
}