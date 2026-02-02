import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

// Configuration for custom breadcrumb labels and routes
const BREADCRUMB_CONFIG: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  disputes: "Disputes",
  profile: "Profile",
  wallet: "Wallet",
  settings: "Settings",
  transactions: "Transactions",
  // Add more route mappings as needed
};

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const pathname = usePathname();

  return useMemo(() => {
    // Remove leading slash and split path into segments
    const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);

    // Always start with dashboard as root
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: "Dashboard",
        href: "/dashboard",
        isCurrentPage: segments.length === 1 && segments[0] === "dashboard",
      },
    ];

    // Build breadcrumbs from path segments
    let currentPath = "";

    segments.forEach((segment, index) => {
      // Skip the first 'dashboard' segment since we already added it
      if (index === 0 && segment === "dashboard") {
        currentPath = "/dashboard";
        return;
      }

      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Get label from config or format the segment
      const label =
        BREADCRUMB_CONFIG[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath, // No href for current page
        isCurrentPage: isLast,
      });
    });

    return breadcrumbs;
  }, [pathname]);
};
