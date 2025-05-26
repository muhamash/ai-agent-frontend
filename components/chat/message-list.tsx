"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { UserMessage } from "./user-message";
import { AiMessage } from "./ai-message";
import { ThinkingIndicator } from "./thinking-indicator";
import { useChat } from "@/hooks/use-chat";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const { isAiThinking } = useChat();

  return (
    <div className={cn("space-y-6 max-w-3xl mx-auto")}>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? (
            <UserMessage message={message} />
          ) : (
            <AiMessage message={message} />
          )}
        </div>
      ))}
      
      {isAiThinking && <ThinkingIndicator />}
    </div>
  );
}