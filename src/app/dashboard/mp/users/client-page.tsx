"use client";

import UserStats from "./user-stats";
import UserHistory from "./user-history";
import CustomersLocation from "../customers-location";
import { InviteUserDialog } from "./invite-user-dialog";
import { useGetUsersQuery } from "@/lib/store/features/vendorDashboardApi/vendorDashboardApi";

export default function ClientUsersPage() {
  // Call the users API in the parent component
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useGetUsersQuery({
    page: 0,
    size: 20, // Fetch enough users for stats and table
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Pass data and loading state to UserStats */}
      <UserStats 
        usersData={usersData}
        loading={usersLoading}
        error={usersError}
        onRefetch={refetchUsers}
      />

      <div>
        <InviteUserDialog />
      </div>

      {/* Pass data and loading state to UserHistory */}
      <UserHistory 
        usersData={usersData}
        loading={usersLoading}
        error={usersError}
        onRefetch={refetchUsers}
      />
      
      {/* <CustomersLocation /> */}
    </div>
  );
}