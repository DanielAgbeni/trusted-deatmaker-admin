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
import { Textarea } from "@/components/ui/textarea";
import { Category } from "../_columns/categories-table-column";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSave: (category: Omit<Category, "id">) => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [category]);

  const handleSave = () => {
    if (name.trim() && description.trim()) {
      onSave({
        name: name.trim(),
        description: description.trim(),
        status: category?.status || "enabled",
      });
      setName("");
      setDescription("");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setName("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-lg">
        <DialogHeader className="pt-8 pb-4">
          <DialogTitle className="text-center text-[20px] font-bold text-gray-800">
            {category ? "Update Category" : "Create New Category"}
          </DialogTitle>
          <div className="w-[30%] h-[3px] bg-[#0092ca] mx-auto mt-2 rounded-full"></div>
        </DialogHeader>

        <div className="px-8 pb-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[15px] font-semibold text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full h-11 rounded-md border-gray-200 focus:border-[#0092ca] focus:ring-[#0092ca] placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[15px] font-semibold text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
              className="w-full min-h-[160px] rounded-md border-gray-200 focus:border-[#0092ca] focus:ring-[#0092ca] placeholder:text-gray-400 resize-none leading-relaxed"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-[#0092ca] hover:bg-[#007ba8] text-white h-12 text-[16px] font-semibold rounded-md shadow-sm transition-all duration-200 mt-2"
            disabled={!name.trim() || !description.trim()}
          >
            {category ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
