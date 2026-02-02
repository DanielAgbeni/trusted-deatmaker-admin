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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {category ? "Update Category" : "Create New Category"}
          </DialogTitle>
          <div className="w-16 h-0.5 bg-cyan-500 mx-auto mt-2"></div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
              className="w-full min-h-[120px] resize-none"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          disabled={!name.trim() || !description.trim()}
        >
          {category ? "Update Category" : "Create Category"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
