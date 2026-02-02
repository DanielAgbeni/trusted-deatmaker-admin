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
import { Link, Type } from "lucide-react";
import { PolicyPage } from "../../_columns/policy-pages-table-column";

export interface PolicyFormData {
  title: string;
  slug: string;
  content: string;
  status: "published" | "draft";
}

interface PolicyEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: PolicyPage | null;
  onSave: (data: PolicyFormData) => void;
}

export function PolicyEditorDialog({
  open,
  onOpenChange,
  policy,
  onSave,
}: PolicyEditorDialogProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (policy) {
      setTitle(policy.title);
      setSlug(policy.slug);
      setContent(policy.content);
      setStatus(policy.status);
    } else {
      setTitle("");
      setSlug("");
      setContent("");
      setStatus("published");
    }
    setErrors({});
  }, [policy, open]);

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleMakeSlug = () => {
    if (title.trim()) {
      setSlug(generateSlug(title));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim(),
      status,
    });

    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setStatus("published");
    setErrors({});
    onOpenChange(false);
  };

  // Simple rich text editor toolbar actions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const textarea = document.getElementById(
      "content-editor"
    ) as HTMLDivElement;
    if (textarea) {
      setContent(textarea.innerHTML);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Policy Pages Items
          </DialogTitle>
          <div className="w-16 h-0.5 bg-purple-500 mx-auto mt-2"></div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter policy title"
                className={`w-full ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-medium">
                Slug <span className="text-red-500">*</span>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-blue-600 p-0 h-auto ml-2"
                  onClick={handleMakeSlug}
                >
                  <Link className="h-3 w-3 mr-1" />
                  Make Slug
                </Button>
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="url-friendly-slug"
                className={`w-full font-mono text-sm ${
                  errors.slug ? "border-red-500" : ""
                }`}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Details <span className="text-red-500">*</span>
            </Label>

            {/* Rich Text Editor Toolbar */}
            <div className="border border-gray-200 rounded-t-lg bg-gray-50 p-2 flex gap-1 flex-wrap">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => formatText("bold")}
                title="Bold"
              >
                <strong>B</strong>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => formatText("italic")}
                title="Italic"
              >
                <em>I</em>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => formatText("underline")}
                title="Underline"
              >
                <u>U</u>
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => formatText("formatBlock", "h1")}
                title="Heading 1"
              >
                H1
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => formatText("formatBlock", "h2")}
                title="Heading 2"
              >
                H2
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => formatText("formatBlock", "h3")}
                title="Heading 3"
              >
                H3
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => formatText("insertUnorderedList")}
                title="Bullet List"
              >
                • List
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => formatText("insertOrderedList")}
                title="Numbered List"
              >
                1. List
              </Button>
            </div>

            {/* Content Editor */}
            <div
              id="content-editor"
              contentEditable
              className={`min-h-[300px] max-h-[400px] overflow-y-auto p-4 border border-gray-200 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.content ? "border-red-500" : ""
              }`}
              dangerouslySetInnerHTML={{ __html: content }}
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              onBlur={(e) => setContent(e.currentTarget.innerHTML)}
              style={{
                fontSize: "14px",
                lineHeight: "1.5",
                fontFamily: "inherit",
              }}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Label className="text-sm font-medium">Status:</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === "published"}
                  onChange={(e) =>
                    setStatus(e.target.value as "published" | "draft")
                  }
                  className="text-purple-600"
                />
                <span className="text-sm">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === "draft"}
                  onChange={(e) =>
                    setStatus(e.target.value as "published" | "draft")
                  }
                  className="text-purple-600"
                />
                <span className="text-sm">Draft</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!title.trim() || !slug.trim() || !content.trim()}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
