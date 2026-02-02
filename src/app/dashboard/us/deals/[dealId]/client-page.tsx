'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetUserDealDetailQuery } from '@/lib/store/features/userDashboardApi/userDashboardApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertTriangle, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { DisputeSidebar } from '@/components/dashboard/dispute-sidebar';

// Helper function to get status badge variant
const getStatusVariant = (status: string) => {
	switch (status) {
		case 'DRAFT':
			return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
		case 'PENDING':
			return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
		case 'IN_PROGRESS':
			return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
		case 'COMPLETED':
			return 'bg-green-100 text-green-700 hover:bg-green-100';
		case 'CANCELLED':
			return 'bg-red-100 text-red-700 hover:bg-red-100';
		case 'DISPUTED':
			return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
		case 'REFUNDED':
			return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
		case 'PAID':
			return 'bg-green-100 text-green-700 hover:bg-green-100';
		default:
			return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
	}
};

// Format currency
const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN',
	}).format(amount);
};

interface Milestone {
	milestoneId: string;
	title: string;
	amount: number;
	status: string;
	sequence: number;
}

export default function ClientDealDetailPage() {
	const params = useParams();
	const router = useRouter();
	const dealId = params.dealId as string;

	const { data, isLoading, isError, error, refetch } =
		useGetUserDealDetailQuery(dealId);
	const [isDisputeOpen, setIsDisputeOpen] = useState(false);
	const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
		null,
	);
	const [hasExistingDispute, setHasExistingDispute] = useState(false);

	// Handle opening dispute form for a specific milestone (new dispute)
	const handleOpenDispute = (milestone: Milestone) => {
		setSelectedMilestone(milestone);
		setHasExistingDispute(false); // Show form for new dispute
		setIsDisputeOpen(true);
	};

	// Handle opening chat for an existing dispute (DISPUTED status)
	const handleOpenDisputeChat = (milestone: Milestone) => {
		setSelectedMilestone(milestone);
		setHasExistingDispute(true); // Skip form, show chat directly
		setIsDisputeOpen(true);
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="container mx-auto p-6 space-y-6">
				<Skeleton className="h-10 w-32" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	// Error state
	if (isError) {
		return (
			<div className="container mx-auto p-6 space-y-6">
				<Button
					variant="ghost"
					onClick={() => router.back()}
					className="mb-4">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Deals
				</Button>

				<div className="flex flex-col items-center justify-center py-12 space-y-4">
					<div className="text-center">
						<h3 className="text-lg font-semibold text-destructive">
							Failed to load deal details
						</h3>
						<p className="text-sm text-muted-foreground mt-2">
							{(error as any)?.data?.message ||
								'An error occurred while fetching deal details'}
						</p>
					</div>
					<Button
						onClick={() => refetch()}
						variant="outline">
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	const deal = data?.data;

	if (!deal) {
		return (
			<div className="container mx-auto p-6">
				<p>Deal not found</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						onClick={() => router.back()}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<div>
						<h1 className="text-3xl font-bold">Deal Details</h1>
						<p className="text-sm text-muted-foreground font-mono">
							{deal.transactionReference}
						</p>
					</div>
				</div>
				<Badge
					variant="outline"
					className={getStatusVariant(deal.status)}>
					{deal.status.replace(/_/g, ' ')}
				</Badge>
			</div>

			{/* Deal Information Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Transaction Details */}
				<Card>
					<CardHeader>
						<CardTitle>Transaction Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Deal ID
							</p>
							<p className="font-mono text-sm">{deal.dealId}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Transaction Reference
							</p>
							<p className="font-mono text-sm">{deal.transactionReference}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Vendor Reference
							</p>
							<p className="font-mono text-sm">{deal.vendorReference}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Created At
							</p>
							<p className="text-sm">
								{format(new Date(deal.createdAt), "MMMM do, yyyy 'at' h:mm a")}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Financial Details */}
				<Card>
					<CardHeader>
						<CardTitle>Financial Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Total Amount
							</p>
							<p className="text-2xl font-bold">
								{formatCurrency(deal.totalAmount)}
							</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Estimated Commission
							</p>
							<p className="text-xl font-semibold text-green-600">
								{deal.estimatedCommission
									? formatCurrency(deal.estimatedCommission)
									: 'N/A'}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Buyer Information */}
				<Card>
					<CardHeader>
						<CardTitle>Buyer Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Name</p>
							<p className="font-medium">{deal.buyerName}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Email</p>
							<p className="text-sm">{deal.buyerEmail || 'N/A'}</p>
						</div>
					</CardContent>
				</Card>

				{/* Seller Information */}
				<Card>
					<CardHeader>
						<CardTitle>Seller Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Name</p>
							<p className="font-medium">{deal.sellerName}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Email</p>
							<p className="text-sm">{deal.sellerEmail || 'N/A'}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Milestones Section */}
			<Card>
				<CardHeader>
					<CardTitle>Milestones</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{deal.milestones && deal.milestones.length > 0 ? (
							deal.milestones.map((milestone) => (
								<div
									key={milestone.milestoneId}
									className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
												{milestone.sequence}
											</span>
											<div>
												<h4 className="font-medium">{milestone.title}</h4>
												<p className="text-sm text-muted-foreground">
													{formatCurrency(milestone.amount)}
												</p>
											</div>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Badge
											variant="outline"
											className={getStatusVariant(milestone.status)}>
											{milestone.status.replace(/_/g, ' ')}
										</Badge>
										{/* Show Raise Dispute button if milestone is NOT PAID and NOT DISPUTED */}
										{milestone.status !== 'PAID' &&
											milestone.status !== 'DISPUTED' && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleOpenDispute(milestone)}
													className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700">
													<AlertTriangle className="mr-1 h-3 w-3" />
													Raise Dispute
												</Button>
											)}
										{/* Show Chat icon if milestone is DISPUTED - go directly to chat */}
										{milestone.status === 'DISPUTED' && (
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleOpenDisputeChat(milestone)}
												className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
												<MessageCircle className="mr-1 h-3 w-3" />
												View Chat
											</Button>
										)}
									</div>
								</div>
							))
						) : (
							<p className="text-sm text-muted-foreground text-center py-4">
								No milestones found for this deal
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Dispute Sidebar - pass the selected milestone and existing dispute flag */}
			<DisputeSidebar
				dealId={dealId}
				milestones={selectedMilestone ? [selectedMilestone] : []}
				isOpen={isDisputeOpen}
				onOpenChange={setIsDisputeOpen}
				hasExistingDispute={hasExistingDispute}
			/>

			{/* Persistent Floating Chat Toggle Button - only show if there's an active dispute sidebar */}
			{!isDisputeOpen && selectedMilestone && (
				<Button
					onClick={() => setIsDisputeOpen(true)}
					className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 p-0"
					size="icon">
					<MessageCircle className="h-6 w-6" />
				</Button>
			)}
		</div>
	);
}
