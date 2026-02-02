import { memo } from 'react';
import { ArrowLeft, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DisputeHeaderProps {
	onClose: () => void;
	title: string;
	avatarSrc: string;
	showAvatar?: boolean;
}

export const DisputeHeader = memo(
	({ onClose, title, avatarSrc, showAvatar = true }: DisputeHeaderProps) => {
		return (
			<div className="flex items-center justify-between px-4 py-3 bg-white border-b">
				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 -ml-2"
						onClick={onClose}>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					{showAvatar && (
						<div className="relative">
							<Avatar className="h-10 w-10">
								<AvatarImage
									src={avatarSrc}
									alt={title}
								/>
								<AvatarFallback>
									{title.substring(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
						</div>
					)}
					<div>
						<h3 className="text-base font-semibold leading-none">{title}</h3>
						{showAvatar && (
							<p className="text-xs text-muted-foreground mt-1">Active now</p>
						)}
					</div>
				</div>
				{showAvatar && (
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 text-gray-500">
							<Video className="h-5 w-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 text-gray-500">
							<MoreVertical className="h-5 w-5" />
						</Button>
					</div>
				)}
			</div>
		);
	},
);

DisputeHeader.displayName = 'DisputeHeader';
