"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Download, Clock, User } from "lucide-react";
import { useGetDisputeMessagesQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { format } from "date-fns";

interface DisputeMessagesDrawerProps {
  disputeId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DisputeMessagesDrawer({
  disputeId,
  isOpen,
  onOpenChange,
}: DisputeMessagesDrawerProps) {
  const [page, setPage] = React.useState(0);
  const { data: messagesResponse, isLoading, isFetching } = useGetDisputeMessagesQuery(
    { disputeId, page, size: 50, sort: ["createdAt,ASC"] },
    { skip: !isOpen }
  );

  const messages = messagesResponse?.data?.content || [];
  const totalPages = messagesResponse?.data?.totalPages || 0;

  const formatMessageTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "BUYER":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "SELLER":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "ADMIN":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "SYSTEM":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg flex flex-col h-full p-0">
        <div className="p-6 border-b">
          <SheetHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-50">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <SheetTitle>Dispute Conversation</SheetTitle>
                <SheetDescription>
                  Full chat history between the buyer and seller.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-1 p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-center space-y-2">
              <div className="p-4 rounded-full bg-slate-50">
                <MessageSquare className="h-10 w-10 text-slate-300" />
              </div>
              <p className="font-medium text-slate-900">No messages yet</p>
              <p className="text-sm text-slate-500 max-w-[200px]">
                There are no chat messages for this dispute.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.senderRole === "SYSTEM" ? "items-center" : "items-start"
                  }`}
                >
                  {message.senderRole === "SYSTEM" ? (
                    <div className="bg-slate-50 rounded-lg px-4 py-2 border border-slate-100 max-w-[90%] text-center">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        System Message
                      </p>
                      <p className="text-sm text-slate-700">{message.content}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-3 w-full group">
                      <Avatar className="h-8 w-8 mt-1 shrink-0">
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px]">
                          {message.senderName?.substring(0, 2).toUpperCase() || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {message.senderName}
                          </span>
                          <Badge variant="outline" className={`text-[10px] px-1.5 h-4 ${getRoleBadgeStyle(message.senderRole)}`}>
                            {message.senderRole}
                          </Badge>
                          <span className="text-[10px] text-slate-400">
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                        <div className="bg-white border rounded-2xl rounded-tl-none p-3 shadow-sm group-hover:bg-slate-50 transition-colors">
                          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                          {message.attachmentUrl && (
                            <div className="mt-2 pt-2 border-t border-slate-100">
                              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                                <img 
                                  src={message.attachmentUrl} 
                                  alt="Message attachment" 
                                  className="w-full h-auto max-h-60 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => {
                                    if (message.attachmentUrl) {
                                      window.open(message.attachmentUrl, '_blank');
                                    }
                                  }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 text-center">
                                Click image to view full size
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {totalPages > page + 1 && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={isFetching}
                  >
                    {isFetching ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      "Load More Messages"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-slate-50">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> All times are in your local timezone
            </span>
            <span>{messages.length} messages loaded</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
