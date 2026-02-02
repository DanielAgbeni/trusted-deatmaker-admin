"use client";

import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Form validation schema
const kycFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  bvnNin: z.string().min(10, {
    message: "BVN/NIN must be at least 10 characters.",
  }),
});

type KycFormValues = z.infer<typeof kycFormSchema>;

interface KycDialogProps {
  onSubmit?: (values: KycFormValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function KycDialog({
  onSubmit,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: KycDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isControlled =
    controlledOpen !== undefined && setControlledOpen !== undefined;

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bvnNin: "",
    },
  });

  const handleSubmit = async (values: KycFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      // Reset form after successful submission
      form.reset();
      // Close dialog if not controlled externally
      if (!isControlled) {
        setOpen(false);
      }
    } catch (error) {
      console.error("KYC submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isControlled ? controlledOpen : open}
      onOpenChange={isControlled ? setControlledOpen : setOpen}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Complete KYC
          </DialogTitle>
          <div className="w-full h-0.5 bg-primary mt-2"></div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Input your First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Input your Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bvnNin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BVN/NIN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Input your BVN/NIN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full " disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Information"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
