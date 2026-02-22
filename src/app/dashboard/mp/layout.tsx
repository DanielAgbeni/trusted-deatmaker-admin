import { DynamicBreadcrumb } from '@/app/dashboard/dynamic-breadcrumbs';
import { SearchForm } from '@/components/dashboard/search-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { Bell, History } from 'lucide-react';
import { ModeToggle } from '../mode-toogle';
import { AppSidebar } from '@/components/dashboard/mp/app-sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ProtectedRoute allowedUserTypes={['VENDOR_USER', 'VENDOR', 'MARKETPLACE']}>
			<SidebarProvider>
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
							<Button
								variant="ghost"
								size="icon"
								className="hidden sm:flex">
								<History className="h-5 w-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon">
								<Bell className="h-5 w-5" />
							</Button>
						</div>
					</header>
					{children}
				</SidebarInset>
				{/* <SidebarRight /> */}
			</SidebarProvider>
		</ProtectedRoute>
	);
}
