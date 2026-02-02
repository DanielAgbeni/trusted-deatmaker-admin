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
import { PolicyPage } from "../../_columns/policy-pages-table-column";

export interface SeoFormData {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

interface SeoSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: PolicyPage | null;
  onSave: (data: SeoFormData) => void;
}

export function SeoSettingsDialog({
  open,
  onOpenChange,
  policy,
  onSave,
}: SeoSettingsDialogProps) {
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (policy) {
      setSeoTitle(policy.seoTitle || policy.title);
      setSeoDescription(policy.seoDescription || "");
      setSeoKeywords(policy.seoKeywords || "");
    } else {
      setSeoTitle("");
      setSeoDescription("");
      setSeoKeywords("");
    }
    setErrors({});
  }, [policy, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!seoTitle.trim()) {
      newErrors.seoTitle = "SEO title is required";
    } else if (seoTitle.length > 60) {
      newErrors.seoTitle = "SEO title should be 60 characters or less";
    }

    if (seoDescription.trim() && seoDescription.length > 160) {
      newErrors.seoDescription =
        "SEO description should be 160 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      seoKeywords: seoKeywords.trim(),
    });

    handleClose();
  };

  const handleClose = () => {
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            SEO Settings - {policy?.title}
          </DialogTitle>
          <div className="w-16 h-0.5 bg-cyan-500 mx-auto mt-2"></div>
          <DialogDescription className="text-center text-sm text-gray-600">
            Configure SEO metadata for better search engine visibility
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle" className="text-sm font-medium">
              SEO Title <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">
                ({seoTitle.length}/60 characters)
              </span>
            </Label>
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Enter SEO title for search engines"
              maxLength={60}
              className={`w-full ${errors.seoTitle ? "border-red-500" : ""}`}
            />
            {errors.seoTitle && (
              <p className="text-sm text-red-500">{errors.seoTitle}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription" className="text-sm font-medium">
              SEO Description
              <span className="text-xs text-gray-500 ml-2">
                ({seoDescription.length}/160 characters)
              </span>
            </Label>
            <Textarea
              id="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Enter a brief description for search engines"
              maxLength={160}
              className={`w-full min-h-[80px] resize-none ${
                errors.seoDescription ? "border-red-500" : ""
              }`}
            />
            {errors.seoDescription && (
              <p className="text-sm text-red-500">{errors.seoDescription}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoKeywords" className="text-sm font-medium">
              SEO Keywords
            </Label>
            <Textarea
              id="seoKeywords"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="Enter keywords separated by commas (e.g., escrow, payment, security)"
              className="w-full min-h-[60px] resize-none"
            />
          </div>

          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
            <strong>SEO Tips:</strong>
            <br />
            • Keep titles under 60 characters for better search visibility
            <br />
            • Write compelling descriptions under 160 characters
            <br />
            • Use relevant keywords that users might search for
            <br />• Avoid keyword stuffing - focus on natural, readable content
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            disabled={!seoTitle.trim()}
          >
            Save SEO Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
