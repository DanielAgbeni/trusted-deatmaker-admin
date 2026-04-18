'use client';

import { useState } from 'react';
import { HistoryTable } from '@/components/dashboard/tables';
import {
	Extension,
	ExtensionActions,
	createExtensionColumns,
} from '../../_columns/extensions-table-column';
import { toast } from 'sonner';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data matching the UI
const initialExtensions: Extension[] = [
	{
		id: 1,
		title: 'Custom Captcha',
		status: 'enabled',
	},
	{
		id: 2,
		title: 'Custom Captcha',
		status: 'disabled',
	},
	{
		id: 3,
		title: 'Custom Captcha',
		status: 'disabled',
	},
	{
		id: 4,
		title: 'Custom Captcha',
		status: 'disabled',
	},
];

export default function ExtensionsPage() {
	const [extensions, setExtensions] = useState<Extension[]>(initialExtensions);
	const [configureDialogOpen, setConfigureDialogOpen] = useState(false);
	const [helpDialogOpen, setHelpDialogOpen] = useState(false);
	const [selectedExtension, setSelectedExtension] = useState<Extension | null>(
		null,
	);

	// Simulate API calls
	const simulateApiCall = async <T,>(
		operation: () => T,
		successMessage: string,
		delay: number = 500,
	): Promise<T> => {
		try {
			await new Promise((resolve) => setTimeout(resolve, delay));
			const result = operation();
			toast.success(successMessage);
			return result;
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'An error occurred');
			throw error;
		}
	};

	const handleConfigure = (extension: Extension) => {
		setSelectedExtension(extension);
		setConfigureDialogOpen(true);
	};

	const handleHelp = (extension: Extension) => {
		setSelectedExtension(extension);
		setHelpDialogOpen(true);
	};

	const handleToggleStatus = async (extension: Extension) => {
		try {
			await simulateApiCall(
				() => {
					setExtensions((prev) =>
						prev.map((e) =>
							e.id === extension.id
								? {
										...e,
										status: e.status === 'enabled' ? 'disabled' : 'enabled',
									}
								: e,
						),
					);
				},
				`${extension.title} ${extension.status === 'enabled' ? 'disabled' : 'enabled'} successfully`,
			);
		} catch (error) {
			// Error handled by simulateApiCall
		}
	};

	// Generate columns with the actions
	const columns = createExtensionColumns({
		onConfigure: handleConfigure,
		onHelp: handleHelp,
		onToggleStatus: handleToggleStatus,
	});

	return (
		<div className="container  p-4 md:p-6 space-y-6">
			<div className="flex flex-col space-y-6">
				<div>
					<h1 className="text-[22px] font-semibold text-gray-900 mb-6">
						Extensions
					</h1>
				</div>

				{/* Main Content */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
					<HistoryTable
						columns={columns}
						data={extensions}
					/>
				</div>

				{/* Configure Dialog */}
				<Dialog
					open={configureDialogOpen}
					onOpenChange={setConfigureDialogOpen}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Configure {selectedExtension?.title}</DialogTitle>
							<DialogDescription>
								Update the configuration settings for this extension.
							</DialogDescription>
						</DialogHeader>
						<div className="py-4 text-sm text-gray-500">
							Configuration fields for {selectedExtension?.title} will be
							displayed here.
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setConfigureDialogOpen(false)}>
								Cancel
							</Button>
							<Button
								className="bg-blue-600 hover:bg-blue-700 text-white"
								onClick={() => {
									toast.success('Configuration saved successfully');
									setConfigureDialogOpen(false);
								}}>
								Save changes
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Help Dialog */}
				<Dialog
					open={helpDialogOpen}
					onOpenChange={setHelpDialogOpen}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle className="flex items-center justify-between">
								{selectedExtension?.title} Help
								<button className="text-blue-600 hover:text-blue-800">
									<ExternalLink className="h-4 w-4" />
								</button>
							</DialogTitle>
							<DialogDescription>
								Need help with {selectedExtension?.title}?
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4 text-sm text-gray-700">
							<p>
								Documentation and instructions for setting up and using the{' '}
								{selectedExtension?.title} extension.
							</p>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setHelpDialogOpen(false)}>
								Close
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
