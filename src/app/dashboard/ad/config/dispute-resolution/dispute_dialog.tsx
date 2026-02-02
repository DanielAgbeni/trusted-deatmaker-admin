// src/app/dashboard/ad/disputes/_components/dispute-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DisputeReason,
  DisputeResolution,
  DisputeManagementType,
} from "../../types";

interface DisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DisputeManagementType;
  item: DisputeReason | DisputeResolution | null;
  onSave: (
    item: Omit<
      DisputeReason | DisputeResolution,
      "id" | "createdAt" | "updatedAt"
    >
  ) => void;
}

export function DisputeDialog({
  open,
  onOpenChange,
  type,
  item,
  onSave,
}: DisputeDialogProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDetails(item.details || "");
    } else {
      setTitle("");
      setDetails("");
    }
  }, [item, open]);

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        details: details.trim(),
        status: item?.status || "active",
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setDetails("");
    onOpenChange(false);
  };

  const getDialogTitle = () => {
    const typeLabel =
      type === "reason" ? "Dispute Reason" : "Dispute Resolution";
    return item ? `Update ${typeLabel}` : `Add ${typeLabel}`;
  };

  const getDialogDescription = () => {
    const typeLabel =
      type === "reason" ? "dispute reason" : "dispute resolution";
    return item
      ? `Edit the ${typeLabel} details below.`
      : `Add a new ${typeLabel} option for dispute management.`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {getDialogTitle()}
          </DialogTitle>
          <div className="w-16 h-0.5 bg-cyan-500 mx-auto mt-2"></div>
          <DialogDescription className="text-center text-sm text-gray-600">
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-sm font-medium">
              Details
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter a brief detail"
              className="w-full min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            disabled={!title.trim()}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
