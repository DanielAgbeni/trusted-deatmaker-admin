'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { useUpdateUserStatusMutation } from '@/lib/store/features/vendorDashboardApi/vendorDashboardApi';
import { toast } from 'sonner';
import Link from 'next/link';

// Define the User type based on your table structure
export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	status: 'Active' | 'Suspended';
	avatar?: string;
}

const UserActionsCell = ({ user }: { user: User }) => {
	const [updateStatus, { isLoading }] = useUpdateUserStatusMutation();

	const handleStatusChange = async () => {
		try {
			await updateStatus({
				userId: user.id,
				blocked: user.status !== 'Suspended',
			}).unwrap();

			toast.success(
				`User ${user.status === 'Suspended' ? 'activated' : 'suspended'} successfully`,
			);
		} catch (error) {
			toast.error('Failed to update user status');
			console.error(error);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem
					onClick={() => {
						navigator.clipboard.writeText(user.email);
						toast.success('Email copied to clipboard');
					}}>
					Copy email address
				</DropdownMenuItem>
				<DropdownMenuItem
					className={
						user.status === 'Suspended' ? 'text-green-600' : 'text-red-600'
					}
					onClick={handleStatusChange}
					disabled={isLoading}>
					{user.status === 'Suspended' ? 'Activate user' : 'Suspend user'}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/mp/users/${user.id}`}
						className="flex items-center gap-1 w-full">
						View details
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const UsersColumns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="hover:bg-transparent p-0 h-auto font-medium">
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const user = row.original;
			// Generate initials for AvatarFallback
			const initials = user.name
				? user.name
						.split(' ')
						.map((n) => n[0])
						.join('')
						.toUpperCase()
				: 'U'; // Default fallback if name is empty

			return (
				<div className="flex items-center gap-3">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={user.avatar || '/placeholder.svg'}
							alt={user.name || 'User avatar'}
						/>
						<AvatarFallback className="bg-blue-500 text-white text-sm">
							{initials}
						</AvatarFallback>
					</Avatar>
					<span className="font-medium">{user.name}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'email',
		header: 'Email Address',
		cell: ({ row }) => {
			const email = row.getValue('email') as string;
			return <div className="text-sm text-muted-foreground">{email}</div>;
		},
	},
	{
		accessorKey: 'phone',
		header: 'Phone Number',
		cell: ({ row }) => {
			const phone = row.getValue('phone') as string;
			return <div className="text-sm font-medium">{phone}</div>;
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status') as string;
			return (
				<Badge
					variant={status === 'Suspended' ? 'destructive' : 'default'}
					className={
						status === 'Suspended'
							? 'bg-red-100 text-red-700 hover:bg-red-100'
							: 'bg-green-100 text-green-700 hover:bg-green-100'
					}>
					{status}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => <UserActionsCell user={row.original} />,
	},
];
