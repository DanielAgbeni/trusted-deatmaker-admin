"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, ChevronLeft } from "lucide-react";

export default function ManageFrontendPage() {
  const sections = [
    { name: "About Section", href: "/dashboard/ad/config/manage-frontend/about" },
    { name: "Auth Section", href: "#" },
    { name: "Banned Page", href: "#" },
    { name: "Banner Section", href: "#" },
    { name: "Blog Section", href: "#" },
    { name: "Breadcrumb Section", href: "#" },
    { name: "Contact Page", href: "#" },
    { name: "Coverage Section", href: "#" },
    { name: "FAQ Section", href: "#" },
    { name: "Feature Section", href: "#" },
    { name: "Footer Text", href: "#" },
    { name: "GDPR Cookie Policy", href: "#" },
    { name: "How it Works", href: "#" },
    { name: "KYC Content", href: "#" },
    { name: "Login Page", href: "#" },
    { name: "Maintenance Mode", href: "#" },
    { name: "Partner Section", href: "#" },
    { name: "Policy Pages", href: "#" },
    { name: "Register Page", href: "#" },
    { name: "Registration Disable", href: "#" },
    { name: "Reset Password Section", href: "#" },
    { name: "Service Section", href: "#" },
    { name: "Social Icons", href: "#" },
    { name: "Subscribe Section", href: "#" },
    { name: "Testimonial Section", href: "#" },
    { name: "Verify Code", href: "#" },
    { name: "Verify Section", href: "#" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="mb-6 flex flex-col gap-1">
        <Link
          href="/dashboard/ad/config"
          className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-[#0092ca] transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to categories
        </Link>
        <h1 className="text-[22px] font-semibold text-gray-900">
          Manage Frontend Content
        </h1>
        <h2 className="text-[16px] text-gray-700 font-medium">
          Content Management Options
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sections.map((section, index) => (
          <Link href={section.href} key={index} className="block group">
            <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="text-[15px] text-gray-800 font-medium group-hover:text-[#0092ca] transition-colors">
                  {section.name}
                </span>
                <div className="bg-gray-100 p-2 rounded-md group-hover:bg-[#e6f4fa] transition-colors">
                  <Settings className="w-4 h-4 text-gray-500 group-hover:text-[#0092ca] transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
