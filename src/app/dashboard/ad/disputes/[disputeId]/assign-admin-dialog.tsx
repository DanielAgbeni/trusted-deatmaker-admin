"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignDisputeMutation, useGetStaffAccountsQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AssignAdminDialogProps {
  disputeId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignAdminDialog({
  disputeId,
  isOpen,
  onOpenChange,
}: AssignAdminDialogProps) {
  const [assignDispute, { isLoading: isAssigning }] = useAssignDisputeMutation();
  const { data: staffResponse, isLoading: isLoadingStaff } = useGetStaffAccountsQuery({ size: 100 });
  const staff = staffResponse?.data?.content || [];

  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!selectedAdminId) {
      toast.error("Please select an admin");
      return;
    }
    if (!reason) {
      toast.error("Please provide an assignment reason");
      return;
    }

    try {
      await assignDispute({
        disputeId,
        body: { adminId: selectedAdminId, reason },
      }).unwrap();
      
      toast.success("Dispute assigned successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign dispute");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-outfit flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Assign Case
          </DialogTitle>
          <DialogDescription>
            Assign this dispute to a specific staff member.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin">Select Admin</Label>
            <Select 
              value={selectedAdminId} 
              onValueChange={setSelectedAdminId}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingStaff ? "Loading staff..." : "Choose staff member"} />
              </SelectTrigger>
              <SelectContent>
                {staff.map((admin) => (
                  <SelectItem key={admin.id} value={admin.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[8px] bg-blue-50 text-blue-600">
                          {admin.firstName[0]}{admin.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{admin.firstName} {admin.lastName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Assignment Reason</Label>
            <Textarea 
              id="reason" 
              placeholder="e.g., Specialist required for high-value dispute" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleSubmit}
            disabled={isAssigning}
          >
            {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign Dispute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
