import { memo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface Message {
	id: number;
	sender: 'ME' | 'OTHER';
	text: string;
	time: string;
	avatar?: string;
}

interface DisputeChatListProps {
	messages: Message[];
}

export const DisputeChatList = memo(({ messages }: DisputeChatListProps) => {
	return (
		<ScrollArea className="flex-1 bg-gray-50 p-4">
			<div className="flex flex-col space-y-4 pb-4">
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`flex w-full ${msg.sender === 'ME' ? 'justify-end' : 'justify-start'}`}>
						<div
							className={`flex max-w-[80%] items-end gap-2 ${msg.sender === 'ME' ? 'flex-row-reverse' : 'flex-row'}`}>
							<Avatar className="h-8 w-8 mb-1">
								<AvatarImage
									src={msg.sender === 'ME' ? '/avatars/me.png' : msg.avatar}
								/>
								<AvatarFallback>
									{msg.sender === 'ME' ? 'ME' : 'HA'}
								</AvatarFallback>
							</Avatar>

							<div
								className={`
                      px-4 py-3 rounded-2xl relative text-sm
                      ${msg.sender === 'ME' ? 'bg-[#EAEAEA] text-gray-900 rounded-br-none' : 'bg-[#EAEAEA] text-gray-900 rounded-bl-none'}
                    `}>
								<p>{msg.text}</p>
								<span className="text-[10px] text-gray-500 mt-1 block text-right">
									{msg.time}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</ScrollArea>
	);
});

DisputeChatList.displayName = 'DisputeChatList';
