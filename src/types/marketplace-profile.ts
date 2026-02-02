// src/types/marketplace-profile.ts
import { z } from "zod";

export interface MarketplaceProfile {
  id: string;
  businessName: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  businessInfo: {
    registrationNumber?: string;
    taxId?: string;
    businessType:
      | "Corporation"
      | "LLC"
      | "Partnership"
      | "Sole Proprietorship"
      | "Other";
    industry: string;
    description?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  settings: {
    // commissionSettings: {
    //   defaultRate: number;
    //   minimumTransaction: number;
    //   maximumTransaction: number;
    // };
    // paymentSettings: {
    //   autoWithdrawal: boolean;
    //   withdrawalThreshold: number;
    //   paymentMethods: string[];
    // };
    notificationSettings: {
      email: boolean;
      sms: boolean;
      // transactionAlerts: boolean;
      // disputeAlerts: boolean;
      // userRegistrationAlerts: boolean;
    };
    operationalSettings: {
      timezone: string;
      currency: string;
      language: string;
      businessHours: {
        enabled: boolean;
        start: string;
        end: string;
        daysOfWeek: string[];
      };
    };
  };
  verification: {
    email: boolean;
    phone: boolean;
    businessRegistration: boolean;
    bankAccount: boolean;
    compliance: boolean;
  };
  subscription: {
    plan: "Basic" | "Professional" | "Enterprise";
    status: "Active" | "Suspended" | "Cancelled";
    expiresAt: string;
    features: string[];
  };
  createdAt: string;
  lastLoginAt: string;
}

export interface MarketplaceStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalVolume: string;
  totalCommissions: string;
  successRate: string;
  averageTransactionValue: string;
  pendingDisputes: number;
}

export const marketplaceFormSchema = z.object({
  businessInfo: z.object({
    businessName: z
      .string()
      .min(2, "Business name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    registrationNumber: z.string().optional(),
    taxId: z.string().optional(),
    businessType: z.enum([
      "Corporation",
      "LLC",
      "Partnership",
      "Sole Proprietorship",
      "Other",
    ]),
    industry: z.string().min(1, "Please select an industry"),
    description: z.string().optional(),
  }),
  address: z.object({
    street: z.string().min(5, "Street address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),
    postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  }),
  notificationSettings: z.object({
    email: z.boolean(),
    sms: z.boolean(),
  }),
  operationalSettings: z.object({
    timezone: z.string().min(1, "Please select a timezone"),
    currency: z.string().min(1, "Please select a currency"),
    language: z.string().min(1, "Please select a language"),
    businessHours: z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
      daysOfWeek: z.array(z.string()),
    }),
  }),
});

export type MarketplaceFormData = z.infer<typeof marketplaceFormSchema>;