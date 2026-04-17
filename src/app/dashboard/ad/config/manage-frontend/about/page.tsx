"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderUp, ShieldHalf } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AboutSectionPage() {
  const tableData = Array(6).fill({
    sl: 1,
    details: "Reliable Payment Protection",
  });

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-md shadow-sm border p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">About Section</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Image</label>
            <div className="border-2 border-dashed border-[#0092ca]/40 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-[#0092ca]">
                {/* Fallback svg icon matching roughly the folder-up vibe */}
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10v-3h-2v3h-2v-4H8l4-4 4 4h-2v1z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Drag your file(s) to start uploading
              </p>
              <div className="flex items-center w-full max-w-[200px] gap-2">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              <Button
                variant="outline"
                className="text-[#0092ca] border-[#0092ca] hover:bg-[#0092ca]/10 bg-white"
              >
                Browse files
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Heading
              </label>
              <Input placeholder="Input your description" className="w-full h-11" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Subheading
              </label>
              <Textarea
                placeholder='Input a subheading to fully explain your "About Us Section"'
                className="w-full min-h-[140px] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button className="w-full bg-[#0092ca] hover:bg-[#007ba8] text-white h-12 text-base font-semibold mb-8 rounded-md">
          Submit
        </Button>

        {/* List / Table Section */}
        <div className="border-t pt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-12">
                  {/* Empty header for checkbox */}
                </TableHead>
                <TableHead className="w-20 font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    SL <span className="text-[10px] text-gray-400">↕</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Icon</TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Details
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox className="border-gray-300" />
                  </TableCell>
                  <TableCell className="font-medium text-[#0092ca]">
                    {item.sl}
                  </TableCell>
                  <TableCell>
                    <ShieldHalf className="w-5 h-5 text-gray-900" />
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {item.details}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#0092ca] text-[#0092ca] hover:bg-[#0092ca]/10 h-8 px-4 font-medium rounded-full"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-50 h-8 px-4 font-medium rounded-full"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
