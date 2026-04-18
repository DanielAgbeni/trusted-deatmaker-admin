"use client";

import type React from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryStatItem {
  icon: React.ReactNode;
  amount: string | number;
  label: string;
  iconBg: string; // e.g., 'bg-green-100'
  iconColor: string; // e.g., 'text-green-600'
}

interface SummaryStatsCardProps {
  title: string;
  stats: [SummaryStatItem, SummaryStatItem, SummaryStatItem, SummaryStatItem]; // Exactly 4 stats as per design
  isLoading?: boolean;
}

export function SummaryStatsCard({ title, stats, isLoading }: SummaryStatsCardProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-5 space-y-6">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between group cursor-pointer hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                  stat.iconBg
                )}>
                  <div className={stat.iconColor}>
                    {stat.icon}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
                  ) : (
                    <span className="text-base font-bold text-gray-900 tracking-tight">
                      {typeof stat.amount === 'number' ? `₦${stat.amount.toLocaleString()}` : stat.amount}
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
              </div>
              
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
