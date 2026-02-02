"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryTable } from "@/components/dashboard/tables";
import {
  PolicyPage,
  PolicyPageActions,
  createPolicyPageColumns,
} from "../../_columns/policy-pages-table-column";
import {
  PolicyEditorDialog,
  PolicyFormData,
} from "./policy-editor-dialog";
import {
  SeoSettingsDialog,
  SeoFormData,
} from "./seo-settings-dialog";
import { toast } from "sonner";

// Mock data matching the UI
const initialPolicies: PolicyPage[] = [
  {
    id: 1,
    title: "Company Rules",
    slug: "company-rules",
    content: `
      <h2>What is Escrow?</h2>
      <p>Escrow is a secure process where a neutral third party holds funds or assets until all agreed-upon conditions are met by both parties (buyer and seller).</p>
      
      <h3>How It Works</h3>
      <p>Buyer and seller agree to terms. Buyer sends payment to the escrow account. Seller delivers the product/service. Buyer confirms receipt and satisfaction. Escrow releases funds to the seller.</p>
      
      <h3>Key Rules</h3>
      <p>Funds are held securely until all conditions are fulfilled. Both parties must agree to the terms before starting the process. Disputes are resolved by the escrow service based on evidence provided. Fees may apply for using the escrow service.</p>
      
      <h3>Do we disclose any information to outside parties?</h3>
      <p>We don't sell, exchange, or in any case move to outside gatherings by and by recognizable data. This does exclude confided in outsiders who help us in working our site, leading our business, or adjusting you, since those gatherings consent to keep this data private. We may likewise deliver your data when we accept discharge is suitable to follow the law, implement our site strategies, or ensure our own or others' rights, property, or wellbeing.</p>
    `,
    seoTitle: "Company Rules - Escrow Service Guidelines",
    seoDescription: "Learn about our company rules and escrow service guidelines for secure transactions.",
    seoKeywords: "company rules, escrow, guidelines, secure transactions",
    status: "published",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Payment Policy",
    slug: "payment-policy",
    content: `
      <h2>Payment Policy</h2>
      <p>This document outlines our payment policies and procedures for all transactions conducted through our escrow service.</p>
      
      <h3>Accepted Payment Methods</h3>
      <ul>
        <li>Credit and debit cards</li>
        <li>Bank transfers</li>
        <li>Digital wallets</li>
        <li>Cryptocurrency (selected types)</li>
      </ul>
      
      <h3>Payment Processing</h3>
      <p>All payments are processed securely through our encrypted payment gateway. Funds are held in escrow until transaction completion.</p>
      
      <h3>Fees and Charges</h3>
      <p>Service fees apply to all transactions. Fees are clearly displayed before transaction confirmation. Additional charges may apply for premium services.</p>
    `,
    seoTitle: "Payment Policy - Secure Payment Processing",
    seoDescription: "Understand our payment policy for secure escrow transactions and accepted payment methods.",
    seoKeywords: "payment policy, escrow payments, secure transactions, payment methods",
    status: "published",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 3,
    title: "Privacy Policy",
    slug: "privacy-policy",
    content: `
      <h2>Privacy Policy</h2>
      <p>Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>
      
      <h3>Information We Collect</h3>
      <p>We collect information you provide directly, such as account details and transaction information. We also collect usage data and device information automatically.</p>
      
      <h3>How We Use Your Information</h3>
      <p>We use your information to provide our services, process transactions, communicate with you, and improve our platform.</p>
      
      <h3>Data Protection</h3>
      <p>We implement industry-standard security measures to protect your data. Your information is encrypted and stored securely.</p>
      
      <h3>Your Rights</h3>
      <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
    `,
    seoTitle: "Privacy Policy - Data Protection and Privacy Rights",
    seoDescription: "Learn how we protect your privacy and handle your personal information in our escrow service.",
    seoKeywords: "privacy policy, data protection, personal information, privacy rights",
    status: "published",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 4,
    title: "Terms of Service",
    slug: "terms-of-service",
    content: `
      <h2>Terms of Service</h2>
      <p>These terms govern your use of our escrow service. By using our platform, you agree to these terms.</p>
      
      <h3>Service Description</h3>
      <p>We provide secure escrow services for online transactions between buyers and sellers.</p>
      
      <h3>User Responsibilities</h3>
      <p>Users must provide accurate information, comply with all applicable laws, and use the service responsibly.</p>
      
      <h3>Prohibited Activities</h3>
      <p>Users may not engage in fraudulent activities, violate laws, or misuse our platform.</p>
      
      <h3>Limitation of Liability</h3>
      <p>Our liability is limited as outlined in this agreement. We are not responsible for user actions or third-party services.</p>
      
      <h3>Changes to Terms</h3>
      <p>We may update these terms from time to time. Users will be notified of significant changes.</p>
    `,
    seoTitle: "Terms of Service - User Agreement and Guidelines",
    seoDescription: "Read our terms of service for using our secure escrow platform and understand your rights and responsibilities.",
    seoKeywords: "terms of service, user agreement, escrow terms, service guidelines",
    status: "published",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
];

export default function PolicyPagesPage() {
  const [policies, setPolicies] = useState<PolicyPage[]>(initialPolicies);
  const [filteredPolicies, setFilteredPolicies] = useState<PolicyPage[]>(initialPolicies);
  const [searchTerm, setSearchTerm] = useState("");
  const [editorDialogOpen, setEditorDialogOpen] = useState(false);
  const [seoDialogOpen, setSeoDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyPage | null>(null);

  // Filter policies based on search term
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredPolicies(policies);
    } else {
      const filtered = policies.filter(policy =>
        policy.title.toLowerCase().includes(value.toLowerCase()) ||
        policy.slug.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPolicies(filtered);
    }
  };

  // Simulate API calls with delays and success/error handling
  const simulateApiCall = async <T,>(
    operation: () => T,
    successMessage: string,
    delay: number = 500
  ): Promise<T> => {
    try {
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // 5% chance of simulated error for demo purposes
      if (Math.random() < 0.05) {
        throw new Error("Network error occurred");
      }
      
      const result = operation();
      toast.success(successMessage);
      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      throw error;
    }
  };

  const handleCreateNew = () => {
    setSelectedPolicy(null);
    setEditorDialogOpen(true);
  };

  const handleSeoSetting = (policy: PolicyPage) => {
    setSelectedPolicy(policy);
    setSeoDialogOpen(true);
  };

  const handleEdit = (policy: PolicyPage) => {
    setSelectedPolicy(policy);
    setEditorDialogOpen(true);
  };

  const handleRemove = async (policy: PolicyPage) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${policy.title}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      await simulateApiCall(
        () => {
          const updatedPolicies = policies.filter(p => p.id !== policy.id);
          setPolicies(updatedPolicies);
          setFilteredPolicies(updatedPolicies.filter(p =>
            !searchTerm || 
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.slug.toLowerCase().includes(searchTerm.toLowerCase())
          ));
        },
        `${policy.title} removed successfully`
      );
    } catch (error) {
      // Error already handled by simulateApiCall
    }
  };

  const handleSaveSeo = async (data: SeoFormData) => {
    if (!selectedPolicy) return;

    try {
      await simulateApiCall(
        () => {
          const now = new Date().toISOString();
          const updatedPolicies = policies.map(p =>
            p.id === selectedPolicy.id
              ? { 
                  ...p, 
                  seoTitle: data.seoTitle,
                  seoDescription: data.seoDescription,
                  seoKeywords: data.seoKeywords,
                  updatedAt: now 
                }
              : p
          );
          setPolicies(updatedPolicies);
          setFilteredPolicies(updatedPolicies.filter(p =>
            !searchTerm || 
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.slug.toLowerCase().includes(searchTerm.toLowerCase())
          ));
        },
        `SEO settings for ${selectedPolicy.title} updated successfully`
      );
      
      setSeoDialogOpen(false);
      setSelectedPolicy(null);
    } catch (error) {
      // Keep dialog open on error so user can retry
    }
  };

  const handleSavePolicy = async (data: PolicyFormData) => {
    try {
      await simulateApiCall(
        () => {
          const now = new Date().toISOString();
          
          if (selectedPolicy) {
            // Update existing policy
            const updatedPolicies = policies.map(p =>
              p.id === selectedPolicy.id
                ? { ...p, ...data, updatedAt: now }
                : p
            );
            setPolicies(updatedPolicies);
            setFilteredPolicies(updatedPolicies.filter(p =>
              !searchTerm || 
              p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.slug.toLowerCase().includes(searchTerm.toLowerCase())
            ));
          } else {
            // Create new policy
            const newId = Math.max(...policies.map(p => p.id)) + 1;
            const newPolicy: PolicyPage = {
              id: newId,
              ...data,
              seoTitle: data.title,
              seoDescription: "",
              seoKeywords: "",
              createdAt: now,
              updatedAt: now,
            };
            const updatedPolicies = [...policies, newPolicy];
            setPolicies(updatedPolicies);
            setFilteredPolicies(updatedPolicies.filter(p =>
              !searchTerm || 
              p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.slug.toLowerCase().includes(searchTerm.toLowerCase())
            ));
          }
        },
        selectedPolicy 
          ? `${data.title} updated successfully` 
          : `${data.title} created successfully`
      );
      
      setEditorDialogOpen(false);
      setSelectedPolicy(null);
    } catch (error) {
      // Keep dialog open on error so user can retry
    }
  };

  // Create the actions object that will be passed to the table columns
  const policyActions: PolicyPageActions = {
    onSeoSetting: handleSeoSetting,
    onEdit: handleEdit,
    onRemove: handleRemove,
  };

  // Generate columns with the actions
  const columns = createPolicyPageColumns(policyActions);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Policy Pages
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage legal documents and policy content for your platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>

        {/* Search and Statistics */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{policies.length}</div>
              <div className="text-xs text-gray-500">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {policies.filter(p => p.status === "published").length}
              </div>
              <div className="text-xs text-gray-500">Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {policies.filter(p => p.status === "draft").length}
              </div>
              <div className="text-xs text-gray-500">Drafts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {policies.filter(p => p.seoTitle && p.seoDescription).length}
              </div>
              <div className="text-xs text-gray-500">SEO Ready</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-0">
            <HistoryTable
              columns={columns}
              data={filteredPolicies}
            />
          </CardContent>
        </Card>

        {/* Policy Editor Dialog */}
        <PolicyEditorDialog
          open={editorDialogOpen}
          onOpenChange={setEditorDialogOpen}
          policy={selectedPolicy}
          onSave={handleSavePolicy}
        />

        {/* SEO Settings Dialog */}
        <SeoSettingsDialog
          open={seoDialogOpen}
          onOpenChange={setSeoDialogOpen}
          policy={selectedPolicy}
          onSave={handleSaveSeo}
        />
      </div>
    </div>
  );
}