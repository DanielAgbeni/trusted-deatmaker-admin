// charge-settings.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { HistoryTable } from "@/components/dashboard/tables";
import { ChargeRangeDialog } from "./charge-range-dialog";
import {
  ChargeRange,
  ChargeRangeColumns,
} from "../../_columns/charge-range-table-column";

interface ChargeSettingsProps {
  marketplaceId: string;
}

// Mock data for charge ranges
const initialChargeRanges: ChargeRange[] = [
  {
    id: 1,
    minimumAmount: 10000,
    maximumAmount: 10000000,
    fixedCharge: 0,
    percentCharge: 3,
    chargeCap: 100,
    marketplaceId: "JIJI",
  },
];

export function ChargeSettings({ marketplaceId }: ChargeSettingsProps) {
  const [chargeRanges, setChargeRanges] = useState<ChargeRange[]>(
    initialChargeRanges.filter((cr) => cr.marketplaceId === marketplaceId)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedChargeRange, setSelectedChargeRange] =
    useState<ChargeRange | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chargeCap, setChargeCap] = useState("100");
  const [fixedCharge, setFixedCharge] = useState("0");
  const [percentCharge, setPercentCharge] = useState("3");

  // Filter charge ranges based on search term
  const filteredChargeRanges = chargeRanges.filter(
    (range) =>
      range.minimumAmount.toString().includes(searchTerm) ||
      range.maximumAmount.toString().includes(searchTerm) ||
      range.fixedCharge.toString().includes(searchTerm) ||
      range.percentCharge.toString().includes(searchTerm)
  );

  // Handle charge range CRUD operations
  const handleSaveChargeRange = (chargeRangeData: Omit<ChargeRange, "id">) => {
    if (selectedChargeRange) {
      // Update existing charge range
      setChargeRanges((prev) =>
        prev.map((cr) =>
          cr.id === selectedChargeRange.id
            ? { ...chargeRangeData, id: selectedChargeRange.id }
            : cr
        )
      );
    } else {
      // Create new charge range
      const newChargeRange: ChargeRange = {
        ...chargeRangeData,
        id: Math.max(...chargeRanges.map((cr) => cr.id), 0) + 1,
      };
      setChargeRanges((prev) => [...prev, newChargeRange]);
    }
    setIsDialogOpen(false);
    setSelectedChargeRange(null);
  };

  // const handleUpdateEscrowCharges = () => {
  //   // Handle escrow charges update logic here
  //   console.log("Updating escrow charges:", {
  //     chargeCap: parseFloat(chargeCap),
  //     fixedCharge: parseFloat(fixedCharge),
  //     percentCharge: parseFloat(percentCharge),
  //     marketplaceId,
  //   });
  //   // You can show a success message or make an API call here
  //   alert("Escrow charges updated successfully!");
  // };

  // Event listeners for table actions
  useEffect(() => {
    const handleEditChargeRange = (event: CustomEvent) => {
      const chargeRange = event.detail as ChargeRange;
      setSelectedChargeRange(chargeRange);
      setIsDialogOpen(true);
    };

    const handleDeleteChargeRange = (event: CustomEvent) => {
      const chargeRangeId = event.detail as number;
      setChargeRanges((prev) => prev.filter((cr) => cr.id !== chargeRangeId));
    };

    // Add event listeners
    window.addEventListener(
      "editChargeRange",
      handleEditChargeRange as EventListener
    );
    window.addEventListener(
      "deleteChargeRange",
      handleDeleteChargeRange as EventListener
    );

    return () => {
      // Cleanup event listeners
      window.removeEventListener(
        "editChargeRange",
        handleEditChargeRange as EventListener
      );
      window.removeEventListener(
        "deleteChargeRange",
        handleDeleteChargeRange as EventListener
      );
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Escrow Charges Card */}
      {/* <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Escrow Charges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Charge Cap{" "}
                <span className="text-blue-500 text-xs">
                  (Keep 0 for no charge cap)
                </span>{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={chargeCap}
                  onChange={(e) => setChargeCap(e.target.value)}
                  placeholder="100"
                  className="pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-r-md border-l">
                  USD
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Fixed Charge{" "}
                <span className="text-blue-500 text-xs">
                  (If the amount fit match any range)
                </span>{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={fixedCharge}
                  onChange={(e) => setFixedCharge(e.target.value)}
                  placeholder="0"
                  className="pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-r-md border-l">
                  USD
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Percent Charge{" "}
                <span className="text-blue-500 text-xs">
                  (If the amount fit match any range)
                </span>{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={percentCharge}
                  onChange={(e) => setPercentCharge(e.target.value)}
                  placeholder="3"
                  className="pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-r-md border-l">
                  %
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={handleUpdateEscrowCharges}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Update
          </Button>
        </CardContent>
      </Card> */}

      {/* Charge Ranges Table */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Charge Ranges
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                onClick={() => {
                  setSelectedChargeRange(null);
                  setIsDialogOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HistoryTable
            columns={ChargeRangeColumns}
            data={filteredChargeRanges}
          />
        </CardContent>
      </Card>

      {/* Charge Range Dialog */}
      <ChargeRangeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        chargeRange={selectedChargeRange}
        onSave={handleSaveChargeRange}
        marketplaceId={marketplaceId}
      />
    </div>
  );
}
