"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BankAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
}

interface BankCardsProps {
  banks: BankAccount[];
  onRemoveBank?: (bankId: string) => void;
}

export default function BankCards({ banks, onRemoveBank }: BankCardsProps) {
  if (banks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Bank Accounts</h3>
      <div className="space-y-3">
        {banks.map((bank) => (
          <Card key={bank.id} className="bg-gray-900 text-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-lg">
                    {bank.accountName}
                  </div>
                  <div className="text-sm opacity-80">
                    {bank.accountNumber} - {bank.bankName}
                  </div>
                </div>
                {onRemoveBank && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-gray-800"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => onRemoveBank(bank.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Bank
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
