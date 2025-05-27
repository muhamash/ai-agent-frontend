"use client";

import
  {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { formatDistanceToNow } from "date-fns";
import
  {
    ChevronRight,
    Clock,
    MessageSquare,
    Trash2,
  } from "lucide-react";
import { useState } from "react";

interface ChatHistoryProps {
  onSelectChat?: () => void;
}

export function ChatHistory({ onSelectChat }: ChatHistoryProps) {
  const { chatHistory, currentChatId, selectChat, deleteChat } = useChat();
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    if (onSelectChat) {
      onSelectChat();
    }
  };

  const handleDeleteChat = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete);
      setChatToDelete(null);
    }
  };

  if (chatHistory.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-4">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No chat history</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Start a new chat to see your history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chatHistory.map((chat) => {
        const isActive = chat.id === currentChatId;
        const firstMessage = chat.messages[0]?.content || "New Chat";
        const timeAgo = formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true });

        return (
          <div
            key={chat.id}
            className={`group flex items-start justify-between rounded-md p-3 transition-all duration-200 glass-morphism ${
              isActive
                ? "bg-accent/50 text-accent-foreground"
                : "hover:bg-accent/30"
            }`}
          >
            <button
              className="flex-1 flex items-start text-left"
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                  <div className="chat-title font-medium">
                    {firstMessage}
                    <div className="chat-title-full">{firstMessage}</div>
                  </div>
                </div>
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{timeAgo}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            
            <AlertDialog open={chatToDelete === chat.id} onOpenChange={(open) => !open && setChatToDelete(null)}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setChatToDelete(chat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete chat</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete chat</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this chat? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteChat}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      })}
    </div>
  );
}