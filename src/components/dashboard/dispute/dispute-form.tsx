'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, Send, Loader2 } from 'lucide-react';

// Dispute reasons matching the API enum
const DISPUTE_REASONS = [
	{ value: 'ITEM_NOT_RECEIVED', label: 'Item Not Received' },
	{ value: 'ITEM_NOT_AS_DESCRIBED', label: 'Item Not As Described' },
	{ value: 'DAMAGED_ITEM', label: 'Damaged Item' },
	{ value: 'LATE_DELIVERY', label: 'Late Delivery' },
	{ value: 'QUALITY_ISSUES', label: 'Quality Issues' },
	{ value: 'OTHER', label: 'Other' },
] as const;

export interface Milestone {
	milestoneId: string;
	title: string;
	amount: number;
	status: string;
	sequence: number;
}

export interface DisputeFormData {
	dealId: string;
	milestoneId: string;
	reason: string;
	description: string;
	evidenceUrl: string;
}

interface DisputeFormProps {
	dealId: string;
	milestones: Milestone[];
	onSubmit: (data: DisputeFormData) => void;
	isSubmitting?: boolean;
}

export function DisputeForm({
	dealId,
	milestones,
	onSubmit,
	isSubmitting = false,
}: DisputeFormProps) {
	const [reason, setReason] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [evidenceUrl, setEvidenceUrl] = useState<string>('');
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Get the first (and only) milestone's ID
	const milestoneId = milestones[0]?.milestoneId || '';

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!reason) {
			newErrors.reason = 'Please select a reason';
		}

		if (!description.trim()) {
			newErrors.description = 'Please enter a description';
		} else if (description.trim().length < 10) {
			newErrors.description = 'Description must be at least 10 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		const formData: DisputeFormData = {
			dealId,
			milestoneId,
			reason,
			description: description.trim(),
			evidenceUrl: evidenceUrl.trim(),
		};

		onSubmit(formData);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col h-full">
			{/* Header */}
			<div className="p-4 border-b bg-amber-50">
				<div className="flex items-center gap-2 text-amber-700">
					<AlertTriangle className="h-5 w-5" />
					<h3 className="font-semibold">Raise A Dispute</h3>
				</div>
				<p className="text-sm text-amber-600 mt-1">
					Please provide details about your dispute
				</p>
			</div>

			{/* Form Content */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{/* Reason Selection */}
				<div className="space-y-2">
					<Label htmlFor="reason">
						Reason for Dispute <span className="text-red-500">*</span>
					</Label>
					<Select
						value={reason}
						onValueChange={setReason}>
						<SelectTrigger
							id="reason"
							className={errors.reason ? 'border-red-500' : ''}>
							<SelectValue placeholder="Select a reason" />
						</SelectTrigger>
						<SelectContent>
							{DISPUTE_REASONS.map((item) => (
								<SelectItem
									key={item.value}
									value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.reason && (
						<p className="text-xs text-red-500">{errors.reason}</p>
					)}
				</div>

				{/* Description */}
				<div className="space-y-2">
					<Label htmlFor="description">
						Description <span className="text-red-500">*</span>
					</Label>
					<Textarea
						id="description"
						placeholder="Describe your issue in detail (minimum 10 characters)"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className={`min-h-[120px] resize-none ${errors.description ? 'border-red-500' : ''}`}
					/>
					{errors.description && (
						<p className="text-xs text-red-500">{errors.description}</p>
					)}
					<p className="text-xs text-muted-foreground">
						{description.length}/10 characters minimum
					</p>
				</div>

				{/* Evidence URL (Optional) */}
				<div className="space-y-2">
					<Label htmlFor="evidenceUrl">
						Evidence URL{' '}
						<span className="text-muted-foreground">(Optional)</span>
					</Label>
					<Input
						id="evidenceUrl"
						type="url"
						placeholder="https://example.com/evidence"
						value={evidenceUrl}
						onChange={(e) => setEvidenceUrl(e.target.value)}
					/>
					<p className="text-xs text-muted-foreground">
						Link to any supporting evidence (screenshots, documents, etc.)
					</p>
				</div>
			</div>

			{/* Submit Button */}
			<div className="p-4 border-t bg-gray-50">
				<Button
					type="submit"
					className="w-full"
					disabled={isSubmitting}>
					{isSubmitting ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Submitting...
						</>
					) : (
						<>
							<Send className="h-4 w-4 mr-2" />
							Submit Dispute
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
