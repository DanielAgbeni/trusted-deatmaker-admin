"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronsUpDown } from "lucide-react";

const autoGateways = [
  { id: 1, sl: 1, name: "AMARAPAY", supportedCurrency: 1000, enabledCurrency: 1000, status: "Enabled" },
  { id: 2, sl: 1, name: "AUTHORIZE.net", supportedCurrency: 1000, enabledCurrency: 1000, status: "Disabled" },
  { id: 3, sl: 1, name: "AUTHORIZE.net", supportedCurrency: 1000, enabledCurrency: 1000, status: "Enabled" },
  { id: 4, sl: 1, name: "AUTHORIZE.net", supportedCurrency: 1000, enabledCurrency: 1000, status: "Disabled" },
  { id: 5, sl: 1, name: "AUTHORIZE.net", supportedCurrency: 1000, enabledCurrency: 1000, status: "Enabled" },
  { id: 6, sl: 1, name: "AUTHORIZE.net", supportedCurrency: 1000, enabledCurrency: 1000, status: "Disabled" },
  { id: 7, sl: 1, name: "AUTHORIZE.net", supportedCurrency: 1000, enabledCurrency: 1000, status: "Enabled" },
];

const manualGateways = [
  { id: 1, sl: 1, name: "AMARAPAY", status: "Enabled" },
  { id: 2, sl: 1, name: "AUTHORIZE.net", status: "Disabled" },
  { id: 3, sl: 1, name: "AMARAPAY", status: "Enabled" },
  { id: 4, sl: 1, name: "AUTHORIZE.net", status: "Disabled" },
  { id: 5, sl: 1, name: "AMARAPAY", status: "Enabled" },
  { id: 6, sl: 1, name: "AUTHORIZE.net", status: "Disabled" },
  { id: 7, sl: 1, name: "AMARAPAY", status: "Enabled" },
];

export default function PaymentGatewayPage() {
  const [activeTab, setActiveTab] = useState<"automatic" | "manual">("automatic");

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs Header - the background is light cyan-ish for the whole bar, except the active tab */}
        <div className="flex bg-[#f2fbff] border-b border-gray-100 px-4 pt-4">
          <button
            onClick={() => setActiveTab("automatic")}
            className={`px-6 py-3 font-medium text-[15px] rounded-t-xl transition-all ${
              activeTab === "automatic"
                ? "bg-white text-[#0ea5e9] shadow-[0_-2px_10px_rgba(0,0,0,0.02)]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Automatic Gateway
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-6 py-3 font-medium text-[15px] rounded-t-xl transition-all ${
              activeTab === "manual"
                ? "bg-white text-[#0ea5e9] shadow-[0_-2px_10px_rgba(0,0,0,0.02)]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Manual Gateway
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {activeTab === "automatic" ? "Automatic Gateway" : "Manual Gateway"}
          </h2>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="font-bold text-gray-900 text-xs py-4 pl-4 w-24">
                    <div className="flex items-center gap-2">
                      <Checkbox className="border-gray-300 rounded-[4px]" />
                      <span>SL</span>
                      <ChevronsUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-xs py-4">Gateway</TableHead>
                  {activeTab === "automatic" && (
                    <>
                      <TableHead className="font-bold text-gray-900 text-xs py-4 text-center">Supported Currency</TableHead>
                      <TableHead className="font-bold text-gray-900 text-xs py-4 text-center">Enabled Currency</TableHead>
                    </>
                  )}
                  <TableHead className="font-bold text-gray-900 text-xs py-4 text-center">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 text-xs py-4 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(activeTab === "automatic" ? autoGateways : manualGateways).map((gateway, index) => (
                  <TableRow key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <TableCell className="pl-4 py-5 w-24">
                      <div className="flex items-center gap-2">
                        <Checkbox className="border-gray-300 rounded-[4px]" />
                        <span className="text-[#0ea5e9] font-medium">{gateway.sl}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <span className="font-bold text-gray-600 text-[13px] tracking-wide">{gateway.name}</span>
                    </TableCell>
                    
                    {activeTab === "automatic" && (
                      <>
                        <TableCell className="py-5 text-center">
                          <span className="font-bold text-gray-800">
                            {('supportedCurrency' in gateway) ? (gateway.supportedCurrency as number) : ''}
                          </span>
                        </TableCell>
                        <TableCell className="py-5 text-center">
                          <span className="font-bold text-gray-800">
                            {('enabledCurrency' in gateway) ? (gateway.enabledCurrency as number) : ''}
                          </span>
                        </TableCell>
                      </>
                    )}

                    <TableCell className="py-5">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-6 py-1 rounded-sm text-[12px] font-medium ${
                            gateway.status === "Enabled"
                              ? "bg-[#e8f7ed] text-[#42b76b]"
                              : "bg-[#fdebea] text-[#ea5b5b]"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            gateway.status === "Enabled" ? "bg-[#42b76b]" : "bg-[#ea5b5b]"
                          }`} />
                          {gateway.status}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-5">
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-4 rounded-full border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white transition-colors bg-transparent text-[13px] font-medium"
                        >
                          Edit
                        </Button>
                        {gateway.status === "Enabled" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-4 rounded-full border-[#ea5b5b] text-[#ea5b5b] hover:bg-[#ea5b5b] hover:text-white transition-colors bg-transparent text-[13px] font-medium"
                          >
                            Disable
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-4 rounded-full border-[#42b76b] text-[#42b76b] hover:bg-[#42b76b] hover:text-white transition-colors bg-transparent text-[13px] font-medium"
                          >
                            Enable
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
