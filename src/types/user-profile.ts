// src/types/user-profile.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
    currency: string;
  };
  verification: {
    email: boolean;
    phone: boolean;
    kyc: boolean;
  };
  createdAt: string; // ISO 8601 format
  lastLoginAt: string; // ISO 8601 format
}

export interface UserProfileStats {
  totalTransactions: number;
  completedTransactions: number;
  totalVolume: string;
  successRate: string;
}

export interface UserProfileFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
    currency: string;
  };
}
