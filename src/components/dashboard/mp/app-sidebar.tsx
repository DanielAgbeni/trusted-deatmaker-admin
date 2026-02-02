// @ts-nocheck
"use client"

import * as React from "react";
import logo from "../../../../public/images/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HandshakeIcon,
  Home,
  ShoppingBag,
  UserCircle,
  Coins,
  LogOut,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserIcon,
  Building2,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { useGetVendorProfileQuery } from "@/lib/store/features/vendorDashboardApi/vendorDashboardApi";
// Import from your vendor API slice

// This is sample data.
type NavItem = {
  title: string;
  url: string;
  isActive?: boolean;
  icon?: React.ElementType;
};

type NavGroup = {
  title: string;
  url: string;
  items: NavItem[];
};

const data: {
  versions: string[];
  navMain: NavGroup[];
} = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/mp",
          icon: Home,
        },
        {
          title: "Users",
          url: "/dashboard/mp/users",
          icon: UserIcon,
        },
        {
          title: "Wallet Transactions",
          url: "/dashboard/mp/wallet",
          icon: ShoppingBag,
        },
        {
          title: "Escrow Transactions",
          url: "/dashboard/mp/transactions",
          icon: Coins,
        },
        {
          title: "Commissions",
          url: "/dashboard/mp/commissions",
          icon: DollarSign,
        },
        {
          title: "Deals",
          url: "/dashboard/mp/deals",
          icon: CreditCard,
        },
        {
          title: "Disputes",
          url: "/dashboard/mp/disputes",
          icon: HandshakeIcon,
        },
        {
          title: "Profile",
          url: "/dashboard/mp/profile",
          icon: Building2,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [currentPath, setCurrentPath] = React.useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  
  // Call the VENDOR profile API using the hook from vendorDashboardApi
  const { 
    data: profileResponse, 
    isLoading,
    error
  } = useGetVendorProfileQuery();

  React.useEffect(() => {
    // Get current path for active state
    setCurrentPath(window.location.pathname);
  }, []);

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('dealmakerauthToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('dealmakerUserData');
    localStorage.removeItem('vendorProfile');
    
    // Redirect to signin page
    window.location.href = '/signin';
  };

  // Get vendor initials for avatar
  const getVendorInitials = () => {
    const vendorProfile = profileResponse?.data;
    if (vendorProfile) {
      const name = vendorProfile.name || vendorProfile.companyName || 'Vendor';
      return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return "V";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get vendor name
  const getVendorName = () => {
    const vendorProfile = profileResponse?.data;
    if (vendorProfile) {
      return vendorProfile.name || vendorProfile.companyName || 'Vendor Account';
    }
    return "Vendor Account";
  };

  // Get vendor email
  const getVendorEmail = () => {
    const vendorProfile = profileResponse?.data;
    if (vendorProfile) {
      return vendorProfile.email || 'vendor@example.com';
    }
    return 'vendor@example.com';
  };

  // Get vendor phone
  const getVendorPhone = () => {
    const vendorProfile = profileResponse?.data;
    if (vendorProfile) {
      return vendorProfile.phoneNumber || vendorProfile.phone || 'Not provided';
    }
    return 'Not provided';
  };

  // Get vendor status
  const getVendorStatus = () => {
    const vendorProfile = profileResponse?.data;
    if (vendorProfile) {
      return vendorProfile.status || 'Active';
    }
    return 'Active';
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-start gap-2">
          {/* Profile dropdown trigger */}
          <div className="relative">
            <button 
              onClick={toggleProfileDropdown}
              className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <Avatar>
                {profileResponse?.data?.avatarUrl || profileResponse?.data?.logoUrl ? (
                  <AvatarImage 
                    src={profileResponse.data.avatarUrl || profileResponse.data.logoUrl} 
                    alt={getVendorName()}
                  />
                ) : null}
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {getVendorInitials()}
                </AvatarFallback>
              </Avatar>
              {isLoading ? (
                <div className="animate-pulse h-4 w-4 bg-gray-200 rounded"></div>
              ) : (
                <>
                  {isProfileDropdownOpen ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </>
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="p-4">
                  {/* Vendor Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      {profileResponse?.data?.avatarUrl || profileResponse?.data?.logoUrl ? (
                        <AvatarImage 
                          src={profileResponse.data.avatarUrl || profileResponse.data.logoUrl} 
                          alt={getVendorName()}
                        />
                      ) : null}
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {getVendorInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {getVendorName()}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {getVendorEmail()}
                      </p>
                      {profileResponse?.data?.companyName && (
                        <p className="text-xs text-gray-400 mt-1">
                          {profileResponse.data.companyName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Vendor Details */}
                  {profileResponse?.data && (
                    <div className="space-y-3 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-gray-600">{getVendorPhone()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield size={14} className="text-gray-400" />
                        <span className="text-gray-600">
                          Status: <span className="font-medium">{getVendorStatus()}</span>
                        </span>
                      </div>
                      {profileResponse.data.createdAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-gray-600">
                            Registered {formatDate(profileResponse.data.createdAt)}
                          </span>
                        </div>
                      )}
                      {profileResponse.data.country && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-gray-600">{profileResponse.data.country}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="space-y-2 py-3">
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <div className="py-3 text-center">
                      <p className="text-red-500 text-sm">Failed to load profile</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="mt-2 text-blue-500 text-sm hover:underline"
                      >
                        Retry
                      </button>
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
              alt="Trusted Deal Maker Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = currentPath === item.url;
                  const Icon = item.icon;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`
                          relative pl-8 pr-3 py-3 my-1
                          ${isActive 
                            ? 'bg-white text-blue-600 font-medium' 
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
                              ? 'text-black' 
                              : 'text-gray-500 group-hover:text-gray-700'
                            }
                            transition-colors duration-200 flex items-center justify-center
                          `}>
                            {Icon && <Icon size={20} />}
                          </div>
                          
                          <span className={`
                            ${isActive 
                              ? 'text-black' 
                              : 'text-gray-700 group-hover:text-gray-900'
                            }
                            transition-colors duration-200 text-sm font-normal
                          `}>
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
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}