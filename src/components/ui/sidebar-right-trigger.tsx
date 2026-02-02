// components/ui/sidebar-right-trigger.tsx
"use client"

import * as React from "react"
import { useSidebarRight } from "@/components/ui/sidebar-right-provider"
import { Button } from "@/components/ui/button"
import { PanelRight, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export function SidebarRightTrigger({
  className,
  onClick,
  variant = "ghost",
  showBellIcon = false,
  ...props
}: React.ComponentProps<typeof Button> & {
  showBellIcon?: boolean
}) {
  const { toggleSidebar } = useSidebarRight()

  return (
    <Button
      data-sidebar-right="trigger"
      data-slot="sidebar-right-trigger"
      variant={variant}
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      {showBellIcon ? <Bell className="size-4" /> : <PanelRight className="size-4" />}
      <span className="sr-only">Toggle Right Sidebar</span>
    </Button>
  )
}