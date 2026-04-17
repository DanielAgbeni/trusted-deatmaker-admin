"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, FolderUp } from "lucide-react";

export default function PageSeoSettings() {
    const [keywords] = useState(["Joshua", "Joshua", "Joshua", "Joshua", "Joshua"]);
    
    return (
        <div className="container p-4 md:p-6 space-y-8">
            <h1 className="text-[22px] font-semibold text-gray-900">SEO Configuration for HomePage</h1>
            
            {/* Info Message Box */}
            <div className="bg-[#f6f9fc] border-l-[6px] border-black p-5 rounded-md text-gray-700 text-[15.5px] leading-relaxed break-words shadow-sm">
                The SEO setting is optional for this page. If you don't configure SEO here, the global SEO contents will work for this page, which you can configure from System Setting &gt; SEO Configuration.
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Column: Image Upload */}
                <div className="space-y-3">
                    <Label className="text-[15px] font-bold text-gray-800">SEO Image</Label>
                    <div className="border-[2px] border-dashed border-[#0092ca]/50 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-5 bg-white min-h-[300px]">
                        <div className="w-20 h-16 bg-[#0092ca] rounded-lg rounded-tr-3xl flex items-center justify-center relative shadow-sm">
                            {/* Inner graphic to mimic a folder with upload icon */}
                            <div className="bg-white rounded-full p-1 shadow-sm">
                                <FolderUp className="w-5 h-5 text-[#0092ca]" strokeWidth={2.5} />
                            </div>
                        </div>
                        
                        <p className="text-[15px] text-gray-700 font-medium">Drag your file(s) to start uploading</p>
                        
                        <div className="flex items-center w-full max-w-[240px] gap-4">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-gray-400 text-xs font-semibold tracking-wide">OR</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>
                        
                        <Button variant="outline" className="border-[#0092ca] text-[#0092ca] hover:bg-[#0092ca] hover:text-white rounded-xl px-8 py-2 h-10 font-semibold shadow-none">
                            Browse files
                        </Button>
                    </div>
                </div>
                
                {/* Right Column: Form Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[15px] font-bold text-gray-800">
                            Meta Keywords <span className="font-normal text-[14px]">{"("}Separate multiple keywords by <span className="text-red-400">, or enter key</span>{")"}</span>
                        </Label>
                        <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-white min-h-[48px] items-center">
                            {keywords.map((kw, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-[#f5f5f5] px-2.5 py-1.5 rounded text-[13px] border border-gray-200">
                                    <X className="w-3 h-3 cursor-pointer text-black font-extrabold stroke-[3]" />
                                    <span className="text-gray-800 font-medium">{kw}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-[15px] font-bold text-gray-800">Meta Description</Label>
                        <Input placeholder="Input your description" className="h-12 border-gray-200 rounded-lg shadow-none text-[15px] text-gray-600" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-[15px] font-bold text-gray-800">Social Title</Label>
                        <Input placeholder="Input a Title" className="h-12 border-gray-200 rounded-lg shadow-none text-[15px] text-gray-600" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-[15px] font-bold text-gray-800">Social Description</Label>
                        <Input placeholder="Input a Social Description" className="h-12 border-gray-200 rounded-lg shadow-none text-[15px] text-gray-600" />
                    </div>
                </div>
            </div>
            
            <div className="pt-2">
                <Button className="w-full bg-[#0092ca] hover:bg-[#007da8] text-white font-bold h-12 text-[15px] rounded-md shadow-none">
                    Submit
                </Button>
            </div>
        </div>
    );
}
