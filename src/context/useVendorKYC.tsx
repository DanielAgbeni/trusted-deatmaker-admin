// @ts-nocheck
// hooks/useVendorKYC.ts
import { useGetVendorProfileQuery } from '@/lib/store/features/vendorDashboardApi/vendorDashboardApi';
import { useState, useEffect } from 'react';

export const useVendorKYC = () => {
  const { 
    data: profileResponse, 
    isLoading,
    error,
    refetch
  } = useGetVendorProfileQuery();

  const [isKYCCompleted, setIsKYCCompleted] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>('');

  useEffect(() => {
    if (profileResponse?.data) {
      const vendorProfile = profileResponse.data;
      const kycStatusValue = vendorProfile.kycStatus || vendorProfile.status || '';
      
      setKycStatus(kycStatusValue);
      
      const isKYCComplete = 
        kycStatusValue === 'verified' || 
        kycStatusValue === 'approved' || 
        kycStatusValue === 'completed' ||
        kycStatusValue === 'active' ||
        vendorProfile.isKYCVerified === true;
      
      setIsKYCCompleted(isKYCComplete);
    }
  }, [profileResponse]);

  const getKYCStatusMessage = () => {
    if (isLoading) return "Checking KYC status...";
    if (error) return "Unable to verify KYC status";
    
    switch(kycStatus?.toLowerCase()) {
      case 'verified':
      case 'approved':
      case 'completed':
        return "KYC Verified";
      case 'pending':
      case 'review':
        return "KYC Under Review";
      case 'rejected':
      case 'declined':
        return "KYC Declined";
      default:
        return "KYC Not Completed";
    }
  };

  return {
    isKYCCompleted,
    kycStatus,
    kycStatusMessage: getKYCStatusMessage(),
    isLoading,
    error,
    refetch,
    profileData: profileResponse?.data,
    vendorName: profileResponse?.data?.name || 
                profileResponse?.data?.companyName || 
                'Vendor Account'
  };
};