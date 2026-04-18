"use client";

import { Users, Shield, UserCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatItemProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
  iconColor: string;
}

function StatItem({ title, value, icon: Icon, className, iconColor }: StatItemProps) {
  return (
    <Card className={cn("border-none shadow-sm ring-1 ring-gray-100/80 overflow-hidden group hover:ring-blue-100 transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-500 font-outfit uppercase tracking-tight">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 tabular-nums">{value}</h3>
          </div>
          <div className={cn("p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-sm", iconColor)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RolesStats({ totalRoles = 0, totalPermissions = 0 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatItem 
        title="Total Roles" 
        value={totalRoles} 
        icon={Shield} 
        iconColor="bg-blue-50 text-blue-600"
      />
      <StatItem 
        title="Active Users" 
        value={32} 
        icon={Users} 
        iconColor="bg-purple-50 text-purple-600"
      />
      <StatItem 
        title="Permissions" 
        value={totalPermissions} 
        icon={UserCheck} 
        iconColor="bg-emerald-50 text-emerald-600"
      />
      <StatItem 
        title="Overdue Reviews" 
        value={3} 
        icon={AlertTriangle} 
        iconColor="bg-red-50 text-red-600"
      />
    </div>
  );
}
