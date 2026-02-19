import { DynamicBreadcrumb } from "@/app/dashboard/dynamic-breadcrumbs";
import { SearchForm } from "@/components/dashboard/search-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell, History } from "lucide-react";
import { ModeToggle } from "../mode-toogle";
import { AppSidebar } from "@/components/dashboard/ad/app-sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarRightProvider } from "@/components/ui/sidebar-right-provider";
import { SidebarRightTrigger } from "@/components/ui/sidebar-right-trigger";
import { NotificationSidebar } from "@/components/dashboard/ad/notification-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedUserTypes={["ADMIN"]}>
    <SidebarProvider>
      <SidebarRightProvider>
        <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
          </div>
          <div className="flex items-center gap-3">
            <SearchForm />
            <ModeToggle />
            <Button variant="ghost" size="icon">
              <History className="h-5 w-5" />
            </Button>
            <SidebarRightTrigger showBellIcon />
          </div>
        </header>
        {children}
      </SidebarInset>
        <NotificationSidebar />
      </SidebarRightProvider>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
