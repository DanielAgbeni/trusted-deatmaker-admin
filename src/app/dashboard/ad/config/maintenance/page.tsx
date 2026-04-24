"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FolderUp, ChevronLeft } from "lucide-react";
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

export default function MaintenanceModePage() {
  const [enabled, setEnabled] = useState(false);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit maintenance setting", { enabled, description });
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
          Maintenance Mode
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <ToggleSwitch enabled={enabled} onChange={setEnabled} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="text-[15px] font-semibold text-gray-800">Image</h3>
            <div className="border-[1.5px] border-dashed border-[#8bcdec] rounded-xl bg-white p-8 flex flex-col items-center justify-center min-h-[220px]">
              <div className="bg-[#0092ca] p-3 rounded-lg flex items-center justify-center mb-4">
                <FolderUp className="w-8 h-8 text-white stroke-[1.5]" />
              </div>
              <p className="text-[15px] text-gray-600 mb-2">Drag your file(s) to start uploading</p>
              <div className="flex items-center gap-2 mb-4 w-full max-w-[200px]">
                <div className="h-[1px] bg-gray-200 flex-1"></div>
                <span className="text-[13px] text-gray-400 font-medium px-1">OR</span>
                <div className="h-[1px] bg-gray-200 flex-1"></div>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="rounded-full border-[#0092ca] text-[#0092ca] hover:bg-[#e6f4fa] hover:text-[#0092ca] px-8 h-10 font-semibold"
              >
                Browse files
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[15px] font-semibold text-gray-800">Description</h3>
            <Textarea
              placeholder='Input a description to fully explain your "Maintenance progress"'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none h-[220px] rounded-xl border-gray-200 focus:border-[#0092ca] focus:ring-[#0092ca] placeholder:text-gray-400"
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
