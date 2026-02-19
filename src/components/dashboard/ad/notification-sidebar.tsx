"use client"

import * as React from "react"
import { useSidebarRight } from "@/components/ui/sidebar-right-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { 
  Bug,
  TrendingUp,
  Shield,
  CreditCard,
  UserCircle2,
  Clock,
  Bell,
  Settings,
  MoreHorizontal
} from "lucide-react"

export function NotificationSidebar() {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebarRight()

  // Notifications data with different types
  const notifications = [
    { 
      id: 1, 
      type: 'bug',
      title: "Critical bug detected", 
      description: "API response timeout in payment module",
      time: "2 min ago", 
      unread: true 
    },
    { 
      id: 2, 
      type: 'security',
      title: "Security alert", 
      description: "Multiple failed login attempts detected",
      time: "1 hour ago", 
      unread: true 
    },
    { 
      id: 3, 
      type: 'payment',
      title: "Payment processed", 
      description: "Invoice #INV-2024-001 has been paid",
      time: "3 hours ago", 
      unread: false 
    },
    { 
      id: 4, 
      type: 'update',
      title: "System update available", 
      description: "New version v2.4.1 is ready to install",
      time: "5 hours ago", 
      unread: false 
    },
  ]

  // Activities data with user icons
  const activities = [
    { 
      id: 1, 
      user: "Alex Johnson", 
      action: "created a new project", 
      description: "E-commerce dashboard",
      time: "5 min ago",
      avatar: "AJ"
    },
    { 
      id: 2, 
      user: "Sam Wilson", 
      action: "updated analytics dashboard", 
      description: "Added new metrics",
      time: "15 min ago",
      avatar: "SW"
    },
    { 
      id: 3, 
      user: "Taylor Swift", 
      action: "commented on post", 
      description: "Great work on the new feature!",
      time: "30 min ago",
      avatar: "TS"
    },
    { 
      id: 4, 
      user: "John Carter", 
      action: "completed task", 
      description: "User authentication flow",
      time: "1 hour ago",
      avatar: "JC"
    },
  ]

  // Contacts data
  const contacts = [
    { 
      id: 1, 
      name: "Alex Johnson", 
      role: "Product Manager",
      status: "online",
      avatar: "AJ",
      email: "alex@company.com"
    },
    { 
      id: 2, 
      name: "Sam Wilson", 
      role: "Frontend Developer",
      status: "online",
      avatar: "SW",
      email: "sam@company.com"
    },
    { 
      id: 3, 
      name: "Taylor Swift", 
      role: "UI/UX Designer",
      status: "away",
      avatar: "TS",
      email: "taylor@company.com"
    },
    { 
      id: 4, 
      name: "John Doe", 
      role: "Backend Engineer",
      status: "offline",
      avatar: "JD",
      email: "john@company.com"
    },
    { 
      id: 5, 
      name: "Sarah Chen", 
      role: "QA Engineer",
      status: "online",
      avatar: "SC",
      email: "sarah@company.com"
    },
  ]

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'bug': return <Bug className="size-4 " />
      case 'security': return <Shield className="size-4" />
      case 'payment': return <CreditCard className="size-4" />
      case 'update': return <TrendingUp className="size-4" />
      default: return <Bell className="size-4" />
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-300'
      default: return 'bg-gray-300'
    }
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="right"
          className="w-[320px] p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Right Sidebar</SheetTitle>
            <SheetDescription>Quick access panel</SheetDescription>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? "offcanvas" : ""}
      data-side="right"
      data-slot="sidebar-right"
    >
      <div
        data-slot="sidebar-right-gap"
        className={cn(
          "relative w-[300px] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
        )}
      />
      <div
        data-slot="sidebar-right-container"
        className={cn(
          "fixed inset-y-0 z-40 hidden h-svh w-[300px] transition-[right] duration-200 ease-linear md:flex",
          "right-0 group-data-[collapsible=offcanvas]:right-[-300px]",
          "border-l bg-white "
        )}
      >
        <SidebarContent />
      </div>
    </div>
  )

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full w-full">
        {/* Header */}
        <div className="px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Notifications</h2>
            </div>
           
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Notifications Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm uppercase tracking-wider text-gray-500">Notifications</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Mark all read
              </Button>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer",
                    notification.unread && "bg-blue-50 hover:bg-blue-100"
                  )}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "size-7 rounded-sm flex items-center justify-center",
                      notification.unread ? "bg-blue-100" : "bg-gray-100"
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={cn(
                          "font-normal text-xs",
                          notification.unread ? "text-gray-900" : "text-gray-700"
                        )}>
                          {notification.title}
                        </h4>
                      </div>
                      {notification.unread && (
                        <div className="size-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="size-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Activities Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm uppercase tracking-wider text-gray-500">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                View all
              </Button>
            </div>
            
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  {/* User Avatar Icon */}
                  <div className="flex-shrink-0 relative">
                    <div className="size-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-white">
                      <UserCircle2 className="size-5 text-blue-500" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-green-500 border-2 border-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {activity.user}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="size-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Contacts Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm uppercase tracking-wider text-gray-500">Contacts</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                {contacts.length} online
              </Button>
            </div>
            
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer group"
                >
                  {/* Avatar with status */}
                  <div className="relative">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600">
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white",
                      getStatusColor(contact.status)
                    )} />
                  </div>
                  
                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600">
                  YH
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">You</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
