"use client";

import * as React from "react";
import logo from "../../../../public/images/logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HandshakeIcon,
  Home,
  UserIcon,
  ShoppingCart,
  PenBoxIcon,
  Settings,
  Wallet2Icon,
  LogOut,
  ChevronDown,
  ChevronUp,
  Phone,
  Shield,
  Coins,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGetUserProfileQuery } from "@/lib/store/features/userDashboardApi/userDashboardApi";
import { usePathname, useSearchParams } from "next/navigation";

// Navigation data Types
type NavItem = {
  title: string;
  url: string;
  icon?: React.ElementType;
  items?: { title: string; url: string }[];
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/ad",
    icon: Home,
  },
  {
    title: "Users",
    url: "/dashboard/ad/users",
    icon: UserIcon,
  },
  {
    title: "Wallet Transactions",
    url: "/dashboard/ad/wallet",
    icon: Wallet2Icon,
    items: [
      {
        title: "Deposits",
        url: "/dashboard/ad/wallet?transactionType=deposit",
      },
      {
        title: "Withdrawals",
        url: "/dashboard/ad/wallet?transactionType=withdrawal",
      },
    ],
  },
  {
    title: "Access Control",
    url: "/dashboard/ad/access-control",
    icon: Shield,
    items: [
      {
        title: "Admin Staff",
        url: "/dashboard/ad/access-control/staff",
      },
      {
        title: "Roles & Permissions",
        url: "/dashboard/ad/access-control/roles",
      },
    ],
  },
  {
    title: "Escrow Transactions",
    url: "/dashboard/ad/transactions",
    icon: Coins,
  },
  {
    title: "Disputes",
    url: "/dashboard/ad/disputes",
    icon: HandshakeIcon,
  },
  {
    title: "Marketplace",
    url: "/dashboard/ad/marketplace",
    icon: ShoppingCart,
  },
  {
    title: "Categories",
    url: "/dashboard/ad/categories",
    icon: PenBoxIcon,
  },
  {
    title: "Config",
    url: "/dashboard/ad/config",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);

  // Call the user profile API
  const {
    data: profileData,
  } = useGetUserProfileQuery();

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('dealmakerauthToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('dealmakerUserData');
    window.location.href = '/signin';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profileData?.data) {
      const { firstName, lastName } = profileData.data;
      const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
      return initials || "A";
    }
    return "A";
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-start gap-2">
          {/* Profile dropdown trigger */}
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center gap-1 rounded-full mx-1 pr-2 hover:bg-white hover:border hover:border-gray-200 transition-colors"
            >
              <Avatar>
                {profileData?.data?.profileImageUrl ? (
                  <AvatarImage src={profileData.data.profileImageUrl} alt="Profile" />
                ) : null}
                <AvatarFallback>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {isProfileDropdownOpen ? (
                <ChevronUp size={16} className="text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-500" />
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="p-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                      {profileData?.data?.profileImageUrl ? (
                        <AvatarImage src={profileData.data.profileImageUrl} />
                      ) : null}
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {profileData?.data ?
                          `${profileData.data.firstName} ${profileData.data.lastName}` :
                          "Loading..."
                        }
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {profileData?.data?.email || "admin@example.com"}
                      </p>
                    </div>
                  </div>

                  {/* User Details */}
                  {profileData?.data && (
                    <div className="space-y-3 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        <span className="truncate">{profileData.data.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield size={14} className="text-gray-400" />
                        <span>
                          Verified: <span className="font-medium">{profileData.data.security?.accountLocked ? "False" : "True"}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors text-sm font-medium"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-36 h-12 relative my-0 flex">
            <Image
              src={logo}
              alt="logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, index) => {
                const hasSubItems = item.items && item.items.length > 0;
                const isActive = currentPath === item.url || (hasSubItems && currentPath.startsWith(item.url));
                const Icon = item.icon;

                if (hasSubItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={currentPath.startsWith(item.url)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`
                              relative pl-8 pr-3 py-3 my-1
                              ${isActive
                                ? 'bg-white text-blue-600 font-medium border border-gray-100 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                              }
                              transition-all duration-200 rounded-md
                              group
                            `}
                          >
                            <span className="flex items-center gap-3 w-full">
                              <div className={`
                                ${isActive
                                  ? 'text-blue-600'
                                  : 'text-gray-500 group-hover:text-gray-700'
                                }
                                transition-colors duration-200 flex items-center justify-center
                              `}>
                                {Icon && <Icon size={20} />}
                              </div>
                              <span className="text-sm">
                                {item.title}
                              </span>
                              <ChevronDown
                                size={16}
                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
                              />
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-0 border-l-0">
                            {item.items?.map((subItem, j) => {
                              const isSubActive = currentPath === subItem.url;
                              return (
                                <SidebarMenuSubItem key={subItem.title + j}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={`
                                      relative pl-14 pr-3 py-2 my-0.5
                                      ${isSubActive
                                        ? 'text-blue-600 font-medium'
                                        : 'text-gray-500 hover:bg-gray-50'
                                      }
                                      transition-all duration-200 rounded-md
                                    `}
                                  >
                                    <a href={subItem.url} className="w-full h-full block">
                                      <span className="text-sm font-normal">{subItem.title}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        relative pl-8 pr-3 py-3 my-1
                        ${isActive
                          ? 'bg-white text-blue-600 font-medium border border-gray-100 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                        transition-all duration-200 rounded-md
                        group
                      `}
                    >
                      <a
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <div className={`
                          ${isActive
                            ? 'text-blue-600'
                            : 'text-gray-500 group-hover:text-gray-700'
                          }
                          transition-colors duration-200 flex items-center justify-center
                        `}>
                          {Icon && <Icon size={20} />}
                        </div>

                        <span className="text-sm">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
