"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={`relative w-[210px] h-[40px] cursor-pointer rounded overflow-hidden flex items-center select-none transition-colors duration-300 ${
        enabled ? "bg-[#2ecc71]" : "bg-[#e74c3c]"
      }`}
    >
      <div
        className={`absolute top-0 h-full w-[12px] bg-black transition-all duration-300 ${
          enabled ? "left-0" : "right-0"
        }`}
      />
      <div className="absolute inset-0 flex justify-center items-center text-white font-medium text-[15px]">
        {enabled ? "Enabled" : "Disabled"}
      </div>
    </div>
  );
};

export default function GDPRCookiePage() {
  const [enabled, setEnabled] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit GDPR setting", { enabled, shortDescription, details });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-[1200px]">
      <div className="flex flex-col gap-1 mb-6">
        <Link
          href="/dashboard/ad/config"
          className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-[#0092ca] transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to categories
        </Link>
        <h1 className="text-[22px] font-semibold text-gray-900">
          GDPR Cookie
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <ToggleSwitch enabled={enabled} onChange={setEnabled} />
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-[15px] font-semibold text-gray-800">Short Description</h3>
            <Input
              placeholder='Input a brief description to fully explain your "GDPR"'
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="rounded-lg border-gray-200 focus:border-[#0092ca] focus:ring-[#0092ca] placeholder:text-gray-400 py-6"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-[15px] font-semibold text-gray-800">Details</h3>
            <Textarea
              placeholder="Input your GDPR Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="resize-none h-[250px] rounded-lg border-gray-200 focus:border-[#0092ca] focus:ring-[#0092ca] placeholder:text-gray-400"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#0092ca] hover:bg-[#007ba8] text-white py-6 text-[16px] font-semibold rounded-[4px] shadow-sm transition-colors mt-8"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
