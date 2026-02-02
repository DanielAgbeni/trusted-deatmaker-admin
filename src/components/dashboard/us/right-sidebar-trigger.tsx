"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { PanelRightOpen, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface RightSidebarTriggerProps {
  onClick: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showBadge?: boolean;
  showBellIcon?: boolean;
}

export function RightSidebarTrigger({ 
  onClick, 
  className, 
  variant = "ghost",
  size = "icon",
  showBadge = false,
  showBellIcon = false
}: RightSidebarTriggerProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("relative", className)}
      onClick={onClick}
    >
      {showBellIcon ? (
        <Bell className="h-5 w-5" />
      ) : (
        <PanelRightOpen className="h-4 w-4" />
      )}
      
      {showBadge && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
      <span className="sr-only">Open Notifications</span>
    </Button>
  );
}