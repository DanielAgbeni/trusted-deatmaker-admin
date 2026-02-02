"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryTable } from "@/components/dashboard/tables";
import {
  TimersColumns,
  TimerSetting,
} from "../../_columns/timers-table-column";
import { TimerEditDialog } from "./timer-edit-dialog";

// Mock data for timer settings
const initialTimerSettings: TimerSetting[] = [
  {
    id: 1,
    category: "Autos",
    transactionType: "Product",
    value: 2,
    unit: "hours",
    status: "enabled",
    timerType: "payment",
  },
  {
    id: 2,
    category: "Electronics",
    transactionType: "All",
    value: 3,
    unit: "days",
    status: "enabled",
    timerType: "payment",
  },
  {
    id: 3,
    category: "All Categories",
    transactionType: "All",
    value: 48,
    unit: "hours",
    status: "enabled",
    timerType: "delivery",
  },
  {
    id: 4,
    category: "Fashion",
    transactionType: "Product",
    value: 24,
    unit: "hours",
    status: "enabled",
    timerType: "inspection",
  },
  {
    id: 5,
    category: "Autos",
    transactionType: "Service",
    value: 6,
    unit: "hours",
    status: "disabled",
    timerType: "rejection",
  },
  {
    id: 6,
    category: "All Categories",
    transactionType: "Digital",
    value: 30,
    unit: "minutes",
    status: "enabled",
    timerType: "payment",
  },
  {
    id: 7,
    category: "Sports",
    transactionType: "All",
    value: 7,
    unit: "days",
    status: "enabled",
    timerType: "dispute",
  },
];

export default function SystemTimersPage() {
  const [timerSettings, setTimerSettings] =
    useState<TimerSetting[]>(initialTimerSettings);
  const [filteredSettings, setFilteredSettings] =
    useState<TimerSetting[]>(initialTimerSettings);
  const [activeTab, setActiveTab] = useState("payment");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState<TimerSetting | null>(null);

  // Filter form states
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<string>("");

  // Define tabTypes as a useMemo to avoid recreating it on every render
  const tabTypes = useMemo(
    () => ({
      payment: "payment",
      rejection: "rejection",
      delivery: "delivery",
      inspection: "inspection",
      resolution: "dispute", // Note: "resolution" maps to "dispute" timerType
      arbitration: "arbitration",
    }),
    []
  );

  // Handle tab changes and filter data
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const timerType = tabTypes[value as keyof typeof tabTypes] || value;
    const filtered = timerSettings.filter(
      (setting) => setting.timerType === timerType
    );
    setFilteredSettings(filtered);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Apply filters based on form values
    let filtered = timerSettings.filter(
      (setting) =>
        setting.timerType === (tabTypes[activeTab as keyof typeof tabTypes] || activeTab)
    );

    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (setting) =>
          setting.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedTransactionType && selectedTransactionType !== "All") {
      filtered = filtered.filter(
        (setting) =>
          setting.transactionType.toLowerCase() ===
          selectedTransactionType.toLowerCase()
      );
    }

    setFilteredSettings(filtered);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedTransactionType("");
    const timerType = tabTypes[activeTab as keyof typeof tabTypes] || activeTab;
    const filtered = timerSettings.filter(
      (setting) => setting.timerType === timerType
    );
    setFilteredSettings(filtered);
  };

  // Event listeners for timer actions
  useEffect(() => {
    const handleEditTimer = (event: CustomEvent) => {
      const timer = event.detail;
      setEditingTimer(timer);
      setDialogOpen(true);
    };

    const handleToggleStatus = (event: CustomEvent) => {
      const timerId = event.detail;
      setTimerSettings((prev) =>
        prev.map((timer) =>
          timer.id === timerId
            ? {
                ...timer,
                status: timer.status === "enabled" ? "disabled" : "enabled",
              }
            : timer
        )
      );
    };

    const handleDisableTimer = (event: CustomEvent) => {
      const timerId = event.detail;
      setTimerSettings((prev) =>
        prev.map((timer) =>
          timer.id === timerId ? { ...timer, status: "disabled" } : timer
        )
      );
    };

    const handleDuplicateTimer = (event: CustomEvent) => {
      const timer = event.detail;
      const newId = Math.max(...timerSettings.map((t) => t.id)) + 1;
      const duplicatedTimer = {
        ...timer,
        id: newId,
        category: `${timer.category} (Copy)`,
      };
      setTimerSettings((prev) => [...prev, duplicatedTimer]);
    };

    window.addEventListener("editTimer", handleEditTimer as EventListener);
    window.addEventListener(
      "toggleTimerStatus",
      handleToggleStatus as EventListener
    );
    window.addEventListener(
      "disableTimer",
      handleDisableTimer as EventListener
    );
    window.addEventListener(
      "duplicateTimer",
      handleDuplicateTimer as EventListener
    );

    return () => {
      window.removeEventListener("editTimer", handleEditTimer as EventListener);
      window.removeEventListener(
        "toggleTimerStatus",
        handleToggleStatus as EventListener
      );
      window.removeEventListener(
        "disableTimer",
        handleDisableTimer as EventListener
      );
      window.removeEventListener(
        "duplicateTimer",
        handleDuplicateTimer as EventListener
      );
    };
  }, [timerSettings]);

  // Update filtered data when timer settings change
  useEffect(() => {
    const timerType = tabTypes[activeTab as keyof typeof tabTypes] || activeTab;
    let filtered = timerSettings.filter(
      (setting) => setting.timerType === timerType
    );

    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (setting) =>
          setting.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedTransactionType && selectedTransactionType !== "All") {
      filtered = filtered.filter(
        (setting) =>
          setting.transactionType.toLowerCase() ===
          selectedTransactionType.toLowerCase()
      );
    }

    setFilteredSettings(filtered);
  }, [
    timerSettings,
    activeTab,
    selectedCategory,
    selectedTransactionType,
    tabTypes, // Now included in dependencies
  ]);

  const handleCreateNew = () => {
    setEditingTimer(null);
    setDialogOpen(true);
  };

  const handleSaveTimer = (timerData: Omit<TimerSetting, "id">) => {
    if (editingTimer) {
      // Update existing timer
      setTimerSettings((prev) =>
        prev.map((timer) =>
          timer.id === editingTimer.id ? { ...timer, ...timerData } : timer
        )
      );
    } else {
      // Create new timer
      const newId = Math.max(...timerSettings.map((timer) => timer.id)) + 1;
      setTimerSettings((prev) => [...prev, { id: newId, ...timerData }]);
    }
    setDialogOpen(false);
    setEditingTimer(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          System Settings
        </h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleCreateNew}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            Add New Timer
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            Payment Time
          </TabsTrigger>
          <TabsTrigger
            value="rejection"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            Rejection Time
          </TabsTrigger>
          <TabsTrigger
            value="delivery"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            Delivery Time
          </TabsTrigger>
          <TabsTrigger
            value="inspection"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            Inspection Time
          </TabsTrigger>
          <TabsTrigger
            value="dispute-resolution"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            Resolution Time
          </TabsTrigger>
          <TabsTrigger
            value="arbitration"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            Arbitration Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Filter Form */}
          <Card className="p-6 mb-6">
            <CardHeader className=" p-0">
              <CardTitle className="capitalize">
                {activeTab.replace("-", " ")} Time Form
              </CardTitle>
              <CardDescription>
                Configure Timer Settings for {activeTab}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Categories">All Categories</SelectItem>
                      <SelectItem value="Autos">Autos</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select
                    value={selectedTransactionType}
                    onValueChange={setSelectedTransactionType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Digital">Digital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timer Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium capitalize">
                {activeTab.replace("-", " ")} Settings
              </h2>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border">
              <HistoryTable columns={TimersColumns} data={filteredSettings} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Timer Edit Dialog */}
      <TimerEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        timer={editingTimer}
        onSave={handleSaveTimer}
      />
    </div>
  );
}