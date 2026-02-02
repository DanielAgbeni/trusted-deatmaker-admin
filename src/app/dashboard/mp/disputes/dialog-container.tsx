"use client";
import { Button } from "@/components/ui/button";
import DisputeDialog from "@/app/dashboard/us/disputes/dispute-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DialogContainer({
  transactionId,
}: {
  transactionId: string;
}) {
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const router = useRouter();

  const handleDisputeSubmit = async (values: any) => {
    // In a real app, this would be an API call
    console.log("Dispute created for transaction:", transactionId, values);
    setDisputeDialogOpen(false);
    router.push("/dashboard/us/disputes");
  };
  return (
    <DisputeDialog
      open={disputeDialogOpen}
      onOpenChange={setDisputeDialogOpen}
      defaultTransactionId={transactionId}
      onSubmit={handleDisputeSubmit}
      trigger={
        <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600">
          Raise A Dispute
        </Button>
      }
    />
  );
}
