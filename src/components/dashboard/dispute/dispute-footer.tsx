import { memo } from 'react';
import {
	BellRing,
	FileText,
	Paperclip,
	SendHorizontal,
	Mic,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DisputeFooterProps {
	inputValue: string;
	onInputChange: (value: string) => void;
	onSendMessage: (e: React.FormEvent) => void;
	onAlertUser: () => void;
	onServiceDetails: () => void;
}

export const DisputeFooter = memo(
	({
		inputValue,
		onInputChange,
		onSendMessage,
		onAlertUser,
		onServiceDetails,
	}: DisputeFooterProps) => {
		return (
			<div className="bg-white border-t p-4 space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<Button
						variant="outline"
						className="text-sky-500 border-sky-200 hover:text-sky-600 hover:bg-sky-50 h-10 rounded-full"
						onClick={onAlertUser}>
						<BellRing className="mr-2 h-4 w-4" />
						Alert User
					</Button>
					<Button
						variant="outline"
						className="text-sky-500 border-sky-200 hover:text-sky-600 hover:bg-sky-50 h-10 rounded-full"
						onClick={onServiceDetails}>
						<FileText className="mr-2 h-4 w-4" />
						Service Details
					</Button>
				</div>

				<form
					onSubmit={onSendMessage}
					className="flex items-center gap-2">
					<div className="relative flex-1">
						<Input
							value={inputValue}
							onChange={(e) => onInputChange(e.target.value)}
							placeholder="Type your message here"
							className="bg-gray-100 border-0 rounded-full pl-4 pr-10 h-12"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-2 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-600 hover:bg-transparent">
							<Paperclip className="h-5 w-5 transform rotate-45" />
						</Button>
					</div>
					{inputValue.trim() ? (
						<Button
							type="submit"
							size="icon"
							className="h-10 w-10 shrink-0 rounded-full bg-sky-500 hover:bg-sky-600">
							<SendHorizontal className="h-5 w-5 text-white" />
						</Button>
					) : (
						<Button
							type="button"
							size="icon"
							variant="ghost"
							className="h-10 w-10 shrink-0 text-sky-500 hover:text-sky-600 hover:bg-transparent">
							<Mic className="h-6 w-6" />
						</Button>
					)}
				</form>
			</div>
		);
	},
);

DisputeFooter.displayName = 'DisputeFooter';
