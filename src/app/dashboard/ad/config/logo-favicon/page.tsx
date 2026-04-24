"use client";

import React from "react";
import Link from "next/link";
import { FolderUp, Info, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const UploadArea = ({ label }: { label: string }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-[15px] font-semibold text-gray-800">{label}</h3>
      <div className="border-[1.5px] border-dashed border-[#8bcdec] rounded-xl bg-white p-8 flex flex-col items-center justify-center min-h-[220px] transition-colors hover:border-[#0092ca]/50">
        <div className="bg-[#0092ca] p-3 rounded-lg flex items-center justify-center mb-4 shadow-sm">
          <FolderUp className="w-8 h-8 text-white stroke-[1.5]" />
        </div>
        <p className="text-[15px] text-gray-600 mb-2 font-medium">Drag your file(s) to start uploading</p>
        <div className="flex items-center gap-2 mb-4 w-full max-w-[200px]">
          <div className="h-[1px] bg-gray-100 flex-1"></div>
          <span className="text-[13px] text-gray-400 font-medium px-1 uppercase tracking-wider">OR</span>
          <div className="h-[1px] bg-gray-100 flex-1"></div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-[#0092ca] text-[#0092ca] hover:bg-[#e6f4fa] hover:text-[#0092ca] px-10 h-10 font-bold transition-all"
        >
          Browse files
        </Button>
      </div>
    </div>
  );
};

export default function LogoFaviconPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting logo and favicon config");
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
          Logos and Favicon
        </h1>
      </div>

      <div className="bg-[#eefbff] border-none border-l-[3px] border-[#0092ca] rounded-lg py-4 px-5">
        <div className="flex items-start gap-3">
          <div className="bg-[#0092ca] rounded-full p-0.5 mt-0.5">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div className="text-[14.5px] text-gray-700 leading-relaxed font-normal">
            If the logo and favicon are not changed after you update from this page, please clear the cache from your browser. As we keep the filename the same after the update, it may show the old image for the cache. usually, it works after clear the cache but if you still see the old logo or favicon, it may be caused by server level or network level caching. Please clear them too.
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UploadArea label="Logo" />
          <UploadArea label="Favicon" />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-[#0092ca] hover:bg-[#007ba8] text-white py-7 text-[16px] font-semibold rounded-[4px] shadow-sm transition-colors"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
