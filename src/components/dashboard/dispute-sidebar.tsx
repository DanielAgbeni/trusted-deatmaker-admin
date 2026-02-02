'use client';

import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCreateDisputeMutation } from '@/lib/store/features/userDashboardApi/userDashboardApi';

// Import sub-components
import { DisputeHeader } from './dispute/dispute-header';
import { DisputeBanner } from './dispute/dispute-banner';
import { DisputeChatList, Message } from './dispute/dispute-chat-list';
import { DisputeFooter } from './dispute/dispute-footer';
import {
	DisputeForm,
	DisputeFormData,
	Milestone,
} from './dispute/dispute-form';

interface DisputeSidebarProps {
	dealId: string;
	milestones?: Milestone[];
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	hasExistingDispute?: boolean; // If true, skip form and show chat directly
}

// Dummy Chat Data
const DUMMY_MESSAGES: Message[] = [
	{
		id: 1,
		sender: 'OTHER',
		text: 'So where do you stay?',
		time: '8:41 pm',
		avatar: '/avatars/hamza.png',
	},
	{
		id: 2,
		sender: 'ME',
		text: 'No 41, Buhari street. Ikeja.',
		time: '8:41 pm',
		avatar: '/avatars/me.png',
	},
	{
		id: 3,
		sender: 'OTHER',
		text: 'Service would be completed shortly',
		time: '8:41 pm',
		avatar: '/avatars/hamza.png',
	},
	{
		id: 4,
		sender: 'ME',
		text: 'Would release payment once it has been completed',
		time: '8:41 pm',
		avatar: '/avatars/me.png',
	},
	{
		id: 5,
		sender: 'OTHER',
		text: 'Alright',
		time: '8:41 pm',
		avatar: '/avatars/hamza.png',
	},
];

export function DisputeSidebar({
	dealId,
	milestones = [],
	isOpen,
	onOpenChange,
	hasExistingDispute = false,
}: DisputeSidebarProps) {
	const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
	const [inputValue, setInputValue] = useState('');
	// If hasExistingDispute is true, skip the form and show chat directly
	const [isDisputeSubmitted, setIsDisputeSubmitted] =
		useState(hasExistingDispute);

	// Sync isDisputeSubmitted state when hasExistingDispute prop changes
	useEffect(() => {
		setIsDisputeSubmitted(hasExistingDispute);
	}, [hasExistingDispute]);

	// Use the actual API mutation
	const [createDispute, { isLoading: isSubmitting }] =
		useCreateDisputeMutation();

	const handleDisputeFormSubmit = useCallback(
		async (data: DisputeFormData) => {
			console.log('=== DISPUTE FORM DATA (Sending to API) ===');
			console.log(JSON.stringify(data, null, 2));
			console.log('==========================================');

			try {
				const response = await createDispute(data).unwrap();

				console.log('=== DISPUTE API RESPONSE ===');
				console.log(JSON.stringify(response, null, 2));
				console.log('============================');

				// Show success toast
				toast.success('Dispute Raised Successfully', {
					description: 'Your dispute has been submitted and is under review.',
				});

				// Transition to chat view on success
				setIsDisputeSubmitted(true);

				// Add a system message to indicate dispute was raised
				const systemMessage: Message = {
					id: messages.length + 1,
					sender: 'ME',
					text: `Dispute raised: ${data.reason.replace(/_/g, ' ')}. ${data.description}`,
					time: new Date()
						.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
						.toLowerCase(),
					avatar: '/avatars/me.png',
				};
				setMessages((prev) => [...prev, systemMessage]);
			} catch (error: any) {
				console.log('=== DISPUTE API ERROR ===');
				console.log(JSON.stringify(error, null, 2));
				console.log('=========================');

				// Extract error message from response
				const errorMessage =
					error?.data?.message ||
					error?.message ||
					'Failed to raise dispute. Please try again.';

				// Show error toast
				toast.error('Failed to Raise Dispute', {
					description: errorMessage,
				});
			}
		},
		[createDispute, messages.length],
	);

	const handleSendMessage = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (!inputValue.trim()) return;

			// Simulate sending a message
			const newMessage: Message = {
				id: messages.length + 1,
				sender: 'ME',
				text: inputValue,
				time: new Date()
					.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
					.toLowerCase(),
				avatar: '/avatars/me.png',
			};

			setMessages((prev) => [...prev, newMessage]);
			setInputValue('');
		},
		[inputValue, messages.length],
	);

	const handleInputChange = useCallback((value: string) => {
		setInputValue(value);
	}, []);

	const handleClose = useCallback(() => {
		onOpenChange(false);
	}, [onOpenChange]);

	const handleAlertUser = useCallback(() => {
		console.log('Alert User Clicked');
	}, []);

	const handleServiceDetails = useCallback(() => {
		console.log('Service Details Clicked');
	}, []);

	return (
		<>
			{/* Overlay for mobile mainly, or to click-out context */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/20 z-40 sm:hidden"
					onClick={handleClose}
				/>
			)}

			<div
				className={cn(
					'fixed top-16 bottom-0 right-0 w-full sm:w-[400px] bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out transform border-l',
					isOpen ? 'translate-x-0' : 'translate-x-full',
				)}>
				<div className="flex flex-col h-full">
					{!isDisputeSubmitted ? (
						// Show dispute form before submission
						<>
							<DisputeHeader
								onClose={handleClose}
								title="Raise A Dispute"
								avatarSrc=""
								showAvatar={false}
							/>
							<DisputeForm
								dealId={dealId}
								milestones={milestones}
								onSubmit={handleDisputeFormSubmit}
								isSubmitting={isSubmitting}
							/>
						</>
					) : (
						// Show chat view after submission
						<>
							<DisputeHeader
								onClose={handleClose}
								title="Hamza Abdul"
								avatarSrc="/avatars/hamza.png"
							/>

							<DisputeBanner amount={200000} />

							<DisputeChatList messages={messages} />

							<DisputeFooter
								inputValue={inputValue}
								onInputChange={handleInputChange}
								onSendMessage={handleSendMessage}
								onAlertUser={handleAlertUser}
								onServiceDetails={handleServiceDetails}
							/>
						</>
					)}
				</div>
			</div>
		</>
	);
}
