import { RecentTableContainer } from "@/components/dashboard/tables";
import { User, UsersColumns } from "./_columns/users-table-column";

interface RecentUsersProps {
  usersData: User[];
  isLoading?: boolean;
  totalUsers?: number;
}

export default function RecentUsers({ 
  usersData = [], 
  isLoading = false,
  totalUsers = 0
}: RecentUsersProps) {
  
  return (
    <RecentTableContainer
      title="Recent Users"
      data={usersData}
      columns={UsersColumns}
      seeAllHref="/dashboard/mp/users"
      seeAllText="See All"
      showSeeAll={true}
      // Pass loading state to the container if it supports it
      isLoading={isLoading}
      // Pass total count if needed for pagination or stats
      // totalCount={totalUsers}
    />
  );
}