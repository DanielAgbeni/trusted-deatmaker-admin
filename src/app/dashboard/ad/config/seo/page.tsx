"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, UploadCloud, ChevronLeft } from "lucide-react";

export default function SEOConfigurationPage() {
  const [keywords, setKeywords] = useState<string[]>(["Joshua", "Joshua", "Joshua", "Joshua", "Joshua"]);
  const [keywordInput, setKeywordInput] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [socialTitle, setSocialTitle] = useState("");
  const [socialDescription, setSocialDescription] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = keywordInput.trim();
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
        setKeywordInput("");
      }
    } else if (e.key === "Backspace" && keywordInput === "" && keywords.length > 0) {
      setKeywords(keywords.slice(0, -1));
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted config:", {
      keywords,
      metaDescription,
      socialTitle,
      socialDescription,
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-[1200px]">
      <div className="flex flex-col gap-1 mb-8">
        <Link
          href="/dashboard/ad/config"
          className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-[#0092ca] transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to categories
        </Link>
        <h1 className="text-[22px] font-semibold text-gray-900">
          SEO Configuration
        </h1>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Left Column - Image Upload */}
              <div className="space-y-4">
                <h3 className="text-[15px] font-semibold text-gray-900">SEO Image</h3>
                <div className="border border-dashed border-[#0092ca]/40 rounded-[12px] bg-white p-12 flex flex-col items-center justify-center text-center">
                  {/* Custom Folder Icon that matches the design briefly */}
                  <div className="relative mb-6">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M26.6667 10.6667H10.6667C7.72 10.6667 5.33334 13.0533 5.33334 16V48C5.33334 50.9467 7.72 53.3333 10.6667 53.3333H53.3333C56.28 53.3333 58.6667 50.9467 58.6667 48V21.3333C58.6667 18.3867 56.28 16 53.3333 16H32L26.6667 10.6667Z" fill="#0092ca"/>
                      <circle cx="32" cy="34" r="10" fill="white"/>
                      <path d="M32 29L27 34H31V39H33V34H37L32 29Z" fill="#0092ca"/>
                    </svg>
                  </div>
                  
                  <p className="text-[15px] text-gray-600 font-medium mb-4">
                    Drag your file(s) to start uploading
                  </p>
                  
                  <div className="flex items-center gap-4 w-[200px] mb-4">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-[13px] text-gray-400 font-medium">OR</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-[#0092ca] text-[#0092ca] hover:bg-[#0092ca]/5 rounded-full px-8 h-10 font-semibold"
                  >
                    Browse files
                  </Button>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-6">
                
                {/* Meta Keywords */}
                <div className="space-y-2">
                  <Label className="text-[14px] font-semibold text-gray-700">
                    Meta Keywords (Separate multiple keywords by <span className="text-[#f17171] font-normal">, or enter key</span>
                  </Label>
                  <div className="min-h-[44px] flex flex-wrap items-center gap-2 border border-gray-200 rounded-[6px] p-2 bg-white focus-within:border-gray-300 transition-colors">
                    {keywords.map((kw, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-1.5 bg-[#f3f4f6] text-gray-700 px-2 py-1 rounded-[4px] text-[13px]"
                      >
                        <X 
                          className="w-3.5 h-3.5 cursor-pointer text-gray-500 hover:text-gray-800" 
                          onClick={() => removeKeyword(index)} 
                        />
                        <span>{kw}</span>
                      </div>
                    ))}
                    <input
                      type="text"
                      className="flex-1 min-w-[120px] outline-none text-[14px] text-gray-700 bg-transparent py-1"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={keywords.length === 0 ? "Add keywords..." : ""}
                    />
                  </div>
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                  <Label className="text-[14px] font-semibold text-gray-700">
                    Meta Description
                  </Label>
                  <Input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Input your description"
                    className="h-11 rounded-[6px] border-gray-200 shadow-sm"
                  />
                </div>

                {/* Social Title */}
                <div className="space-y-2">
                  <Label className="text-[14px] font-semibold text-gray-700">
                    Social Title
                  </Label>
                  <Input
                    type="text"
                    value={socialTitle}
                    onChange={(e) => setSocialTitle(e.target.value)}
                    placeholder="Input a Title"
                    className="h-11 rounded-[6px] border-gray-200 shadow-sm"
                  />
                </div>

                {/* Social Description */}
                <div className="space-y-2">
                  <Label className="text-[14px] font-semibold text-gray-700">
                    Social Description
                  </Label>
                  <Input
                    type="text"
                    value={socialDescription}
                    onChange={(e) => setSocialDescription(e.target.value)}
                    placeholder="Input a Social Description"
                    className="h-11 rounded-[6px] border-gray-200 shadow-sm"
                  />
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-[#0092ca] hover:bg-[#007ba8] text-white py-6 text-[16px] font-semibold rounded-[4px] shadow-sm transition-colors"
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
