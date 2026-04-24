"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronsUpDown, ChevronLeft } from "lucide-react";

const withdrawalMethods = [
  { id: 1, sl: 1, method: "Bank Transfer", currency: "PKR", charge: "$1.00 USD + $2.00 USD %", limit: "$1.00 USD + $2.00 USD %", status: "Enabled" },
  { id: 2, sl: 1, method: "Bank Transfer", currency: "PKR", charge: "$1.00 USD + $2.00 USD %", limit: "$1.00 USD + $2.00 USD %", status: "Disabled" },
  { id: 3, sl: 1, method: "Bank Transfer", currency: "PKR", charge: "$1.00 USD + $2.00 USD %", limit: "$1.00 USD + $2.00 USD %", status: "Disabled" },
  { id: 4, sl: 1, method: "Bank Transfer", currency: "PKR", charge: "$1.00 USD + $2.00 USD %", limit: "$1.00 USD + $2.00 USD %", status: "Enabled" },
  { id: 5, sl: 1, method: "Bank Transfer", currency: "PKR", charge: "$1.00 USD + $2.00 USD %", limit: "$1.00 USD + $2.00 USD %", status: "Enabled" },
  { id: 6, sl: 1, method: "Bank Transfer", currency: "PKR", charge: "$1.00 USD + $2.00 USD %", limit: "$1.00 USD + $2.00 USD %", status: "Disabled" },
  { id: 7, sl: 1, method: "Bank Transfer", currency: "PKR", charge: "$1.00 USD + $2.00 USD %", limit: "$1.00 USD + $2.00 USD %", status: "Enabled" },
];

export default function WithdrawalMethodsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1 mb-6">
        <Link
          href="/dashboard/ad/config"
          className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-[#0092ca] transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to categories
        </Link>
        <h1 className="text-[22px] font-semibold text-gray-900">
          Withdrawal Methods
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
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
                  <TableHead className="font-bold text-gray-900 text-xs py-4">Method</TableHead>
                  <TableHead className="font-bold text-gray-900 text-xs py-4 text-center">Currency</TableHead>
                  <TableHead className="font-bold text-gray-900 text-xs py-4 text-center">Charge</TableHead>
                  <TableHead className="font-bold text-gray-900 text-xs py-4 text-center">Withdrawal Limit</TableHead>
                  <TableHead className="font-bold text-gray-900 text-xs py-4 text-center">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 text-xs py-4 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalMethods.map((method, index) => (
                  <TableRow key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <TableCell className="pl-4 py-5 w-24">
                      <div className="flex items-center gap-2">
                        <Checkbox className="border-gray-300 rounded-[4px]" />
                        <span className="text-[#0ea5e9] font-medium">{method.sl}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <span className="font-bold text-gray-600 text-[13px] tracking-wide">{method.method}</span>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <span className="font-bold text-gray-600 text-[13px]">{method.currency}</span>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <span className="font-bold text-gray-600 text-[13px]">{method.charge}</span>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <span className="font-bold text-gray-600 text-[13px]">{method.limit}</span>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-6 py-1 rounded-sm text-[12px] font-medium ${
                            method.status === "Enabled"
                              ? "bg-[#e8f7ed] text-[#42b76b]"
                              : "bg-[#fdebea] text-[#ea5b5b]"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            method.status === "Enabled" ? "bg-[#42b76b]" : "bg-[#ea5b5b]"
                          }`} />
                          {method.status}
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
                        {method.status === "Enabled" ? (
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
