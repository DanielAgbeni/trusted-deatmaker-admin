"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function GeneralSettingsPage() {
  const [formData, setFormData] = useState({
    siteTitle: "Trusted Dealmaker",
    timezone: "UTC",
    currencySymbol: "$",
    currency: "USD",
    baseColorPrimary: "#0097C7",
    baseColorSecondary: "#E8FAFF",
    recordsPerPage: "20 items per page",
    currencyFormat: "Show Both Text and Symbol",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting general settings:", formData);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-[1200px]">
      <div className="flex flex-col gap-1 mb-6">
        <Link
          href="/dashboard/ad/config"
          className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-[#0092ca] transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to categories
        </Link>
        <h1 className="text-[22px] font-semibold text-gray-900">
          General Settings
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Site Title */}
          <div className="space-y-2">
            <Label htmlFor="siteTitle" className="text-[14px] font-semibold text-gray-700">Site Title</Label>
            <Input
              id="siteTitle"
              value={formData.siteTitle}
              onChange={(e) => handleChange("siteTitle", e.target.value)}
              className="h-12 border-gray-200 rounded-lg focus:ring-[#0092ca] focus:border-[#0092ca]"
            />
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-[14px] font-semibold text-gray-700">Timezone</Label>
            <Select
              value={formData.timezone}
              onValueChange={(val) => handleChange("timezone", val)}
            >
              <SelectTrigger className="h-12 border-gray-200 rounded-lg focus:ring-[#0092ca] focus:border-[#0092ca]">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="GMT">GMT</SelectItem>
                <SelectItem value="EST">EST</SelectItem>
                <SelectItem value="PST">PST</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Currency Symbol */}
          <div className="space-y-2">
            <Label htmlFor="currencySymbol" className="text-[14px] font-semibold text-gray-700">Currency Symbol</Label>
            <Input
              id="currencySymbol"
              value={formData.currencySymbol}
              onChange={(e) => handleChange("currencySymbol", e.target.value)}
              className="h-12 border-gray-200 rounded-lg focus:ring-[#0092ca] focus:border-[#0092ca]"
            />
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-[14px] font-semibold text-gray-700">Currency</Label>
            <Input
              id="currency"
              value={formData.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              className="h-12 border-gray-200 rounded-lg focus:ring-[#0092ca] focus:border-[#0092ca]"
            />
          </div>

          {/* Site Base Color Primary */}
          <div className="space-y-2">
            <Label htmlFor="baseColorPrimary" className="text-[14px] font-semibold text-gray-700">Site Base Color</Label>
            <div className="flex rounded-lg overflow-hidden border border-gray-200 h-12">
              <div 
                className="w-1/3 h-full cursor-pointer relative"
                style={{ backgroundColor: formData.baseColorPrimary }}
              >
                <input 
                  type="color" 
                  value={formData.baseColorPrimary}
                  onChange={(e) => handleChange("baseColorPrimary", e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <Input
                value={formData.baseColorPrimary}
                onChange={(e) => handleChange("baseColorPrimary", e.target.value.toUpperCase())}
                className="flex-1 border-none h-full rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[14px] font-medium uppercase"
              />
            </div>
          </div>

          {/* Site Base Color Secondary */}
          <div className="space-y-2">
            <Label htmlFor="baseColorSecondary" className="text-[14px] font-semibold text-gray-700">Site Base Color</Label>
            <div className="flex rounded-lg overflow-hidden border border-gray-200 h-12">
              <div 
                className="w-1/3 h-full cursor-pointer relative"
                style={{ backgroundColor: formData.baseColorSecondary }}
              >
                <input 
                  type="color" 
                  value={formData.baseColorSecondary}
                  onChange={(e) => handleChange("baseColorSecondary", e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <Input
                value={formData.baseColorSecondary}
                onChange={(e) => handleChange("baseColorSecondary", e.target.value.toUpperCase())}
                className="flex-1 border-none h-full rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[14px] font-medium uppercase"
              />
            </div>
          </div>

          {/* Records to Display */}
          <div className="space-y-2">
            <Label htmlFor="recordsPerPage" className="text-[14px] font-semibold text-gray-700">Records to Display per page</Label>
            <Select
              value={formData.recordsPerPage}
              onValueChange={(val) => handleChange("recordsPerPage", val)}
            >
              <SelectTrigger className="h-12 border-gray-200 rounded-lg focus:ring-[#0092ca] focus:border-[#0092ca]">
                <SelectValue placeholder="Select amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20 items per page">20 items per page</SelectItem>
                <SelectItem value="50 items per page">50 items per page</SelectItem>
                <SelectItem value="100 items per page">100 items per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Currency Format */}
          <div className="space-y-2">
            <Label htmlFor="currencyFormat" className="text-[14px] font-semibold text-gray-700">Currency Showing format</Label>
            <Select
              value={formData.currencyFormat}
              onValueChange={(val) => handleChange("currencyFormat", val)}
            >
              <SelectTrigger className="h-12 border-gray-200 rounded-lg focus:ring-[#0092ca] focus:border-[#0092ca]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Show Both Text and Symbol">Show Both Text and Symbol</SelectItem>
                <SelectItem value="Show Symbol Only">Show Symbol Only</SelectItem>
                <SelectItem value="Show Text Only">Show Text Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-[#0092ca] hover:bg-[#007ba8] text-white h-12 text-[16px] font-semibold rounded-[4px] shadow-sm transition-colors"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
