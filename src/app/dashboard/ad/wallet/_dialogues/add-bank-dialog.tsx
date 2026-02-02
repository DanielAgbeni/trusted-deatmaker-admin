"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown, Loader2, Trash2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Bank {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

interface BankAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
}

interface AddBankDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  onBankAdded?: (bank: BankAccount) => void;
  onBankRemoved?: (bankId: string) => void;
  existingBanks?: BankAccount[];
}

interface CustomSelectProps {
  banks: Bank[];
  selectedBank: Bank | null;
  onBankSelect: (bank: Bank) => void;
  isLoading: boolean;
  onSearch: (search: string) => void;
}

// Custom Searchable Select Component
function CustomBankSelect({
  banks,
  selectedBank,
  onBankSelect,
  isLoading,
  onSearch,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleBankSelect = (bank: Bank) => {
    onBankSelect(bank);
    setIsOpen(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      onSearch("");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Select Trigger */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          isOpen && "ring-2 ring-blue-500 border-blue-500"
        )}
      >
        <span
          className={cn("block truncate", !selectedBank && "text-gray-500")}
        >
          {selectedBank ? selectedBank.name : "Select bank..."}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search banks..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Banks List */}
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-gray-500">
                  Loading banks...
                </span>
              </div>
            ) : banks.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">
                No banks found
              </div>
            ) : (
              banks.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => handleBankSelect(bank)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50",
                    selectedBank?.id === bank.id && "bg-blue-50"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs mr-3 flex-shrink-0">
                    {bank.logo || bank.name.charAt(0)}
                  </div>
                  <span className="flex-1 truncate">{bank.name}</span>
                  {selectedBank?.id === bank.id && (
                    <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Mock API functions - templated to work without actual API calls
const fetchBanks = async (search?: string): Promise<Bank[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allBanks: Bank[] = [
    { id: "1", name: "GUARANTEED TRUST BANK", code: "GTB", logo: "🏦" },
    { id: "2", name: "ACCESS BANK", code: "ACCESS", logo: "🏛️" },
    { id: "3", name: "STANBIC IBTC BANK", code: "STANBIC", logo: "🏪" },
    { id: "4", name: "STERLING BANK", code: "STERLING", logo: "🏬" },
    { id: "5", name: "UNITED BANK OF AFRICA", code: "UBA", logo: "🏢" },
    { id: "6", name: "FIRST BANK OF NIGERIA", code: "FBN", logo: "🏦" },
    { id: "7", name: "ZENITH BANK", code: "ZENITH", logo: "🏛️" },
    { id: "8", name: "UNION BANK", code: "UNION", logo: "🏪" },
    { id: "9", name: "FIDELITY BANK", code: "FIDELITY", logo: "🏢" },
    { id: "10", name: "WEMA BANK", code: "WEMA", logo: "🏦" },
    { id: "11", name: "KEYSTONE BANK", code: "KEYSTONE", logo: "🏛️" },
    { id: "12", name: "POLARIS BANK", code: "POLARIS", logo: "🏪" },
  ];

  if (search && search.trim()) {
    return allBanks.filter((bank) =>
      bank.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return allBanks;
};

const verifyAccount = async (
  accountNumber: string,
  bankCode: string
): Promise<string | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock account verification - templated to always return a valid name
  if (accountNumber.length === 10 && /^\d+$/.test(accountNumber)) {
    const mockNames = [
      "PAUL OLAKUNLE JOHNSON",
      "ADEBAYO MICHAEL SMITH",
      "FATIMA HASSAN IBRAHIM",
      "CHINEDU PETER OKORO",
      "AISHA BELLO MOHAMMED",
    ];
    // Use account number to determine which mock name to return
    const nameIndex =
      Number.parseInt(accountNumber.slice(-1)) % mockNames.length;
    return mockNames[nameIndex];
  }

  return null;
};

export default function AddBankDialog({
  open: controlledOpen,
  onOpenChange,
  trigger,
  onBankAdded,
  onBankRemoved,
  existingBanks = [],
}: AddBankDialogProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountName, setAccountName] = useState("");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const isControlled =
    controlledOpen !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? onOpenChange : setOpen;

  // Memoize verifyAccountDetails with useCallback
  const verifyAccountDetails = useCallback(async () => {
    if (!selectedBank || accountNumber.length !== 10) return;

    setIsVerifyingAccount(true);
    setVerificationError("");

    try {
      const name = await verifyAccount(accountNumber, selectedBank.code);
      if (name) {
        setAccountName(name);
      } else {
        setVerificationError(
          "Could not verify account details. Please check and try again."
        );
        setAccountName("");
      }
    } catch (error) {
      setVerificationError("Error verifying account. Please try again.");
      setAccountName("");
    } finally {
      setIsVerifyingAccount(false);
    }
  }, [selectedBank, accountNumber]);

  // Determine initial view based on existing banks
  useEffect(() => {
    if (isOpen) {
      setView(existingBanks.length > 0 ? "list" : "form");
    }
  }, [isOpen, existingBanks.length]);

  // Load banks on component mount
  useEffect(() => {
    loadBanks();
  }, []);

  // Verify account when both account number and bank are selected
  useEffect(() => {
    if (
      accountNumber.length === 10 &&
      selectedBank &&
      /^\d+$/.test(accountNumber)
    ) {
      verifyAccountDetails();
    } else {
      setAccountName("");
      setVerificationError("");
    }
  }, [accountNumber, selectedBank, verifyAccountDetails]); // Added verifyAccountDetails to dependencies

  const loadBanks = async (search?: string) => {
    setIsLoadingBanks(true);
    try {
      const fetchedBanks = await fetchBanks(search);
      setBanks(fetchedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
      setBanks([]);
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setAccountName("");
    setVerificationError("");
  };

  const handleConfirm = () => {
    if (!selectedBank || !accountName || !accountNumber) return;

    const newBank: BankAccount = {
      id: Date.now().toString(),
      accountNumber,
      accountName,
      bankName: selectedBank.name,
      bankCode: selectedBank.code,
    };

    if (onBankAdded) {
      onBankAdded(newBank);
    }

    handleClose();
  };

  const handleRemoveBank = (bankId: string) => {
    if (onBankRemoved) {
      onBankRemoved(bankId);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setView(existingBanks.length > 0 ? "list" : "form");
      setAccountNumber("");
      setSelectedBank(null);
      setAccountName("");
      setVerificationError("");
    }, 300);
  };

  const canAddMoreBanks = existingBanks.length < 3;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Add Bank
          </DialogTitle>
          <div className="w-full h-0.5 bg-primary mt-2"></div>
        </DialogHeader>

        {view === "list" && (
          <div className="space-y-6 py-4">
            <p className="text-sm text-gray-600 text-center">
              This is where your funds will be sent to when you initiate
              withdrawal. Funds are sent instantly.
            </p>

            <div className="space-y-3">
              {existingBanks.map((bank) => (
                <div
                  key={bank.id}
                  className="bg-gray-900 text-white p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold text-lg">
                      {bank.accountName}
                    </div>
                    <div className="text-sm opacity-80">
                      {bank.accountNumber} - {bank.bankName}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBank(bank.id)}
                    className="text-white hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {canAddMoreBanks && (
                <Button
                  variant="link"
                  className="w-full "
                  onClick={() => setView("form")}
                >
                  Add Bank
                </Button>
              )}
              <Button className="w-full " onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}

        {view === "form" && (
          <div className="space-y-6 py-4">
            <p className="text-sm text-gray-600 text-center">
              To ensure the security of your account and facilitate the
              withdrawal process, please confirm your account details.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setAccountNumber(value);
                  }}
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label>Select Bank</Label>
                <CustomBankSelect
                  banks={banks}
                  selectedBank={selectedBank}
                  onBankSelect={handleBankSelect}
                  isLoading={isLoadingBanks}
                  onSearch={loadBanks}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <div className="relative">
                  <Input
                    id="accountName"
                    placeholder="Account name will appear here"
                    value={accountName}
                    readOnly
                    className="bg-gray-50"
                  />
                  {isVerifyingAccount && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                </div>
                {verificationError && (
                  <p className="text-sm text-red-500">{verificationError}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full "
                onClick={handleConfirm}
                disabled={
                  !accountName ||
                  !selectedBank ||
                  !accountNumber ||
                  isVerifyingAccount
                }
              >
                Confirm Details
              </Button>

              {existingBanks.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setView("list")}
                >
                  Back to Banks
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}