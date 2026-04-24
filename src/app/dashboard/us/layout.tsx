// app/dashboard/layout.tsx (updated)
import { DynamicBreadcrumb } from "@/app/dashboard/dynamic-breadcrumbs";
import { SearchForm } from "@/components/dashboard/search-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarRightProvider } from "@/components/ui/sidebar-right-provider";
import { SidebarRightTrigger } from "@/components/ui/sidebar-right-trigger";
import { History } from "lucide-react";
import { ModeToggle } from "../mode-toogle";
import { AppSidebar } from "@/components/dashboard/us/app-sidebar";
import { SidebarRight } from "@/components/dashboard/us/sidebar-right";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarRightProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-1 border-b px-2 sm:px-4 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4 hidden sm:block"
              />
              <DynamicBreadcrumb />
            </div>
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <SearchForm />
              <ModeToggle />
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <History className="h-5 w-5" />
              </Button>
              {/* Two ways to trigger the right sidebar */}
              <SidebarRightTrigger showBellIcon />
              <SidebarRightTrigger />
            </div>
          </header>
          {children}
        </SidebarInset>
        <SidebarRight />
      </SidebarRightProvider>
    </SidebarProvider>
  );
}