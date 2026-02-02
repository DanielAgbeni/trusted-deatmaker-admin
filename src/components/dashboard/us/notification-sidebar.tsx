"use client"

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Info,
  Bell,
  X,
  CheckCheck,
  Trash2,
  ExternalLink,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type NotificationType = 'success' | 'warning' | 'info' | 'error';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  time: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function NotificationSidebar({ 
  isOpen, 
  onClose,
  ...props 
}: {
  isOpen: boolean;
  onClose: () => void;
} & React.ComponentProps<typeof Sidebar>) {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: "1",
      title: "Payment Received",
      description: "You've received $500 from John Doe",
      type: "success",
      time: "2 min ago",
      read: false,
      action: {
        label: "View Details",
        onClick: () => console.log("View payment details"),
      },
    },
    {
      id: "2",
      title: "Escrow Completed",
      description: "Your escrow transaction #ESC-1234 has been completed successfully",
      type: "success",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      title: "Dispute Opened",
      description: "A dispute has been opened for transaction #TXN-5678",
      type: "warning",
      time: "3 hours ago",
      read: true,
      action: {
        label: "Respond",
        onClick: () => console.log("Respond to dispute"),
      },
    },
    {
      id: "4",
      title: "Profile Update Required",
      description: "Please complete your KYC verification",
      type: "info",
      time: "1 day ago",
      read: true,
    },
    {
      id: "5",
      title: "Wallet Low Balance",
      description: "Your wallet balance is below $10. Please top up.",
      type: "warning",
      time: "2 days ago",
      read: true,
    },
    {
      id: "6",
      title: "New Feature Available",
      description: "Try our new bulk payment feature",
      type: "info",
      time: "1 week ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Only show sidebar if isOpen is true
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm">
      <div className="flex h-full flex-col border-l bg-background shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "group relative rounded-lg border p-3 transition-all hover:bg-accent",
                    !notification.read && "bg-accent/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm mb-1">
                          {notification.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {notification.time}
                          </div>
                          {!notification.read && (
                            <Badge variant="outline" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {notification.action && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={notification.action.onClick}
                            >
                              {notification.action.label}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <SidebarSeparator />
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {notifications.length} notifications
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}