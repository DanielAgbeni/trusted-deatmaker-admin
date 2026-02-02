"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TimerSetting } from "../../_columns/timers-table-column";

interface TimerEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timer: TimerSetting | null;
  onSave: (timer: Omit<TimerSetting, "id">) => void;
}

export function TimerEditDialog({
  open,
  onOpenChange,
  timer,
  onSave,
}: TimerEditDialogProps) {
  const [category, setCategory] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [value, setValue] = useState(1);
  const [unit, setUnit] = useState<"minutes" | "hours" | "days">("hours");
  const [status, setStatus] = useState<"enabled" | "disabled">("enabled");
  const [timerType, setTimerType] =
    useState<TimerSetting["timerType"]>("payment");

  useEffect(() => {
    if (timer) {
      setCategory(timer.category);
      setTransactionType(timer.transactionType);
      setValue(timer.value);
      setUnit(timer.unit);
      setStatus(timer.status);
      setTimerType(timer.timerType);
    } else {
      setCategory("");
      setTransactionType("");
      setValue(1);
      setUnit("hours");
      setStatus("enabled");
      setTimerType("payment");
    }
  }, [timer]);

  const handleSave = () => {
    if (category.trim() && transactionType.trim() && value > 0) {
      onSave({
        category: category.trim(),
        transactionType: transactionType.trim(),
        value,
        unit,
        status,
        timerType,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form
    setCategory("");
    setTransactionType("");
    setValue(1);
    setUnit("hours");
    setStatus("enabled");
    setTimerType("payment");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {timer ? "Update Timer Setting" : "Create New Timer Setting"}
          </DialogTitle>
          <div className="w-16 h-0.5 bg-cyan-500 mx-auto mt-2"></div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
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
            <Label htmlFor="transaction-type" className="text-sm font-medium">
              Transaction Type
            </Label>
            <Select value={transactionType} onValueChange={setTransactionType}>
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
            <Label htmlFor="timer-type" className="text-sm font-medium">
              Timer Type
            </Label>
            <Select
              value={timerType}
              onValueChange={(value: TimerSetting["timerType"]) =>
                setTimerType(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder="Select Timer Type"
                  className="w-full"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment">Payment Time</SelectItem>
                <SelectItem value="rejection">Rejection</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="dispute">Dispute Resolution</SelectItem>
                <SelectItem value="arbitration">Arbitration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value" className="text-sm font-medium">
              Duration Value
            </Label>
            <Input
              id="value"
              type="number"
              min="1"
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value) || 1)}
              placeholder="Enter duration value"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit" className="text-sm font-medium">
              Duration Unit
            </Label>
            <Select value={unit} onValueChange={(value: "minutes" | "hours" | "days") => setUnit(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Enable Timer
            </Label>
            <Switch
              id="status"
              checked={status === "enabled"}
              className=" data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-cyan-500"
              onCheckedChange={(checked) =>
                setStatus(checked ? "enabled" : "disabled")
              }
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          disabled={
            !category.trim() || !transactionType.trim() || value < 1
          }
        >
          {timer ? "Update Timer Setting" : "Create Timer Setting"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
