'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export interface Extension {
	id: number;
	title: string;
	status: 'enabled' | 'disabled';
}

export interface ExtensionActions {
	onConfigure: (extension: Extension) => void;
	onHelp: (extension: Extension) => void;
	onToggleStatus: (extension: Extension) => void;
}

export const createExtensionColumns = (
	actions: ExtensionActions,
): ColumnDef<Extension>[] => [
	{
		id: 'select',
		header: ({ table }) => (
			<div className="flex items-center gap-2">
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="border-gray-300 rounded data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
				/>
				<span className="font-semibold text-gray-700">SL</span>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="border-gray-300 rounded data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
				/>
				<span className="text-blue-500 font-medium text-sm">
					{row.original.id}
				</span>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'title',
		header: () => (
			<span className="font-semibold text-gray-700">Extension</span>
		),
		cell: ({ row }) => {
			const title = row.getValue('title') as string;
			return <span className="font-bold text-gray-900">{title}</span>;
		},
	},
	{
		accessorKey: 'status',
		header: () => <span className="font-semibold text-gray-700">Status</span>,
		cell: ({ row }) => {
			const status = row.getValue('status') as string;

			return (
				<Badge
					variant={status === 'enabled' ? 'default' : 'secondary'}
					className={
						status === 'enabled'
							? 'bg-green-100/80 text-green-600 hover:bg-green-100 shadow-none font-medium text-xs px-4 py-1 rounded'
							: 'bg-red-100/80 text-red-600 hover:bg-red-100 shadow-none font-medium text-xs px-4 py-1 rounded'
					}>
					• {status === 'enabled' ? 'Enabled' : 'Disabled'}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		header: () => <span className="font-semibold text-gray-700">Action</span>,
		enableHiding: false,
		cell: ({ row }) => {
			const extension = row.original;

			return (
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="rounded-full h-8 px-4 text-xs font-medium text-slate-700 border-slate-300 hover:bg-slate-50"
						onClick={() => actions.onConfigure(extension)}>
						Configure
					</Button>

					<Button
						variant="outline"
						size="sm"
						className="rounded-full h-8 px-4 text-xs font-medium text-[#1dbf73] border-[#1dbf73] hover:bg-green-50"
						onClick={() => actions.onHelp(extension)}
						style={{ color: '#00b0d8', borderColor: '#00b0d8' }}>
						Help
					</Button>

					<Button
						variant="outline"
						size="sm"
						className={`rounded-full h-8 px-4 text-xs font-medium ${
							extension.status === 'enabled'
								? 'text-red-500 border-red-400 hover:bg-red-50'
								: 'text-green-600 border-green-500 hover:bg-green-50'
						}`}
						onClick={() => actions.onToggleStatus(extension)}>
						{extension.status === 'enabled' ? 'Disable' : 'Enable'}
					</Button>
				</div>
			);
		},
	},
];
