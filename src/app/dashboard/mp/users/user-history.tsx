'use client';

import { HistoryTable } from '@/components/dashboard/tables';
import { Input } from '@/components/ui/input';
import { UsersColumns } from '../_columns/users-table-column';
import { useState, useEffect } from 'react';

interface UserHistoryProps {
	usersData?: any;
	loading?: boolean;
	error?: any;
	onRefetch?: () => void;
}

export default function UserHistory({
	usersData,
	loading,
	error,
	onRefetch,
}: UserHistoryProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

	// Transform API data to match User type
	const transformApiDataToUsers = (apiData: any[]): any[] => {
		if (!apiData) return [];

		return apiData.map((user) => ({
			id: user.userId,
			name:
				`${user.firstName || ''} ${user.lastName || ''}`.trim() ||
				'Unknown User',
			email: user.email || 'No email',
			phone: user.phoneNumber || 'No phone',
			status: user.blockedForVendor
				? 'Suspended'
				: user.globalActive
					? 'Active'
					: 'Inactive',
			avatar: user.profileImage || `/api/placeholder/40/40`, // Note: profileImage is not in new response, might need fallback or remove
			rawData: user, // Keep original data for reference
		}));
	};

	// Filter users based on search query
	useEffect(() => {
		if (usersData?.data?.content) {
			const users = transformApiDataToUsers(usersData.data.content);

			if (!searchQuery.trim()) {
				setFilteredUsers(users);
			} else {
				const query = searchQuery.toLowerCase();
				const filtered = users.filter(
					(user) =>
						user.name.toLowerCase().includes(query) ||
						user.email.toLowerCase().includes(query) ||
						user.phone.toLowerCase().includes(query) ||
						user.status.toLowerCase().includes(query),
				);
				setFilteredUsers(filtered);
			}
		}
	}, [usersData, searchQuery]);

	const handleFilterUsers = (value: string) => {
		setSearchQuery(value);
	};

	// Log API response for debugging
	useEffect(() => {
		if (usersData) {
			console.log(
				'User History - Users loaded:',
				usersData.data?.content?.length,
			);
			console.log('Sample user:', usersData.data?.content?.[0]);
		}
	}, [usersData]);

	if (loading) {
		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-bold">User History</h2>
					<Input
						placeholder="Search users..."
						disabled
						className="max-w-sm"
					/>
				</div>
				<div className="p-8 text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
					<p className="text-gray-500">Loading users...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-bold">User History</h2>
				</div>
				<div className="p-6 bg-red-50 rounded-xl shadow-sm border border-red-100">
					<div className="text-red-600 font-semibold">
						Error loading user history
					</div>
					<div className="text-red-500 text-sm mt-2">
						{error?.data?.message || 'Failed to fetch user data'}
					</div>
					{onRefetch && (
						<button
							onClick={onRefetch}
							className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
							Retry
						</button>
					)}
				</div>
			</div>
		);
	}

	// if (!usersData?.data?.content || usersData.data.content.length === 0) {
	//   return (
	//     <div className="space-y-4">
	//       <div className="flex justify-between items-center">
	//         <h2 className="text-xl font-bold">User History</h2>
	//         <Input
	//           placeholder="Search users..."
	//           disabled
	//           className="max-w-sm"
	//         />
	//       </div>
	//       <div className="p-8 text-center bg-gray-50 rounded-lg">
	//         <p className="text-gray-500">No users found</p>
	//       </div>
	//     </div>
	//   );
	// }

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-xl font-bold">User History</h2>
					<p className="text-sm text-gray-500 mt-1">
						Showing {filteredUsers.length} of{' '}
						{usersData.data.totalElements || filteredUsers.length} users
					</p>
				</div>

				<div className="flex items-center">
					<Input
						placeholder="Search by name, email, or phone"
						value={searchQuery}
						onChange={(event) => handleFilterUsers(event.target.value)}
						className="max-w-sm"
					/>
				</div>
			</div>

			<HistoryTable
				columns={UsersColumns}
				data={filteredUsers}
			/>

			{/* Pagination info */}
			{usersData.data.totalPages > 1 && (
				<div className="flex justify-between items-center text-sm text-gray-500">
					<div>
						Page {usersData.data.number + 1} of {usersData.data.totalPages}
					</div>
					<div className="text-xs">
						Note: Only showing first page. Implement pagination for more users.
					</div>
				</div>
			)}
		</div>
	);
}
