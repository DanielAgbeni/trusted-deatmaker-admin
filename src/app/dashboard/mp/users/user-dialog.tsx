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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form validation schema
const disputeFormSchema = z.object({
  reason: z.string({
    required_error: "Please select a reason for the dispute",
  }),
  transactionId: z.string({
    required_error: "Please select a transaction",
  }),
  resolution: z.string({
    required_error: "Please select your preferred resolution",
  }),
});

type DisputeFormValues = z.infer<typeof disputeFormSchema>;

interface UserDialogProps {
  onSubmit?: (values: DisputeFormValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  defaultTransactionId?: string;
}

export default function UserDialog({
  onSubmit,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  defaultTransactionId,
}: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isControlled =
    controlledOpen !== undefined && setControlledOpen !== undefined;

  // Sample transaction data - in a real app, this would come from an API
  const transactions = [
    { id: "11723456789", label: "#11723456789" },
    { id: "11723456790", label: "#11723456790" },
    { id: "11723456791", label: "#11723456791" },
  ];

  const form = useForm<DisputeFormValues>({
    resolver: zodResolver(disputeFormSchema),
    defaultValues: {
      reason: "",
      transactionId: defaultTransactionId || "",
      resolution: "",
    },
  });

  const handleSubmit = async (values: DisputeFormValues) => {
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
      console.error("Dispute submission error:", error);
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
            Create Dispute
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5 pt-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Reason for Dispute</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      <SelectItem value="damaged_product">
                        Damaged Product
                      </SelectItem>
                      <SelectItem value="wrong_item">Wrong Item</SelectItem>
                      <SelectItem value="not_delivered">
                        Not Delivered
                      </SelectItem>
                      <SelectItem value="quality_issue">
                        Quality Issue
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Transaction ID</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Transaction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      {transactions.map((transaction) => (
                        <SelectItem key={transaction.id} value={transaction.id}>
                          {transaction.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Preferred Resolution</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred resolution" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      <SelectItem value="refund">Refund</SelectItem>
                      <SelectItem value="replacement">Replacement</SelectItem>
                      <SelectItem value="partial_refund">
                        Partial Refund
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Confirm Dispute"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
