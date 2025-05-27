"use client";

import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";

export function ChatInterface() {
  const { currentChat, sendPrompt, isAiThinking } = useChat();
  const [promptInputValue, setPromptInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleSendPrompt = (prompt: string) => {
    sendPrompt(prompt);
    setPromptInputValue("");
  };

  // Scroll to bottom when messages change
  useEffect( () =>
  {
    if ( containerRef.current )
    {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [ currentChat?.messages.map( m => m.content ).join( "" ) ] );

  const examplePrompts = [
    "Write a blog post about the future of AI",
    "Explain quantum computing in simple terms",
    "Create a creative story about a time traveler",
    "Suggest 5 ways to improve my productivity"
  ];

  const EmptyState = () => (
    <div className="flex h-full flex-col items-center justify-center text-center p-4 max-w-md mx-auto">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Sparkles className="h-6 w-6 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Welcome to AI Assistant</h2>
      <p className="text-muted-foreground mb-8">
        Your personal AI writing assistant. Ask me anything, and I'll help you write blogs, 
        answer questions, and solve problems.
      </p>
      
      <div className="grid grid-cols-1 gap-2 w-full">
        <p className="text-sm font-medium text-muted-foreground mb-2">Try asking:</p>
        {examplePrompts.map((prompt, index) => (
          <Button 
            key={index} 
            variant="outline"
            className="justify-start h-auto py-3 px-4 text-left"
            onClick={() => handleSendPrompt(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col max-h-screen pt-16 md:pt-0">
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 md:py-6"
      >
        {currentChat && currentChat.messages.length > 0 ? (
          <MessageList messages={currentChat.messages} />
        ) : (
          <EmptyState />
        )}
      </div>
      
      <div className="border-t bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <MessageInput
            value={promptInputValue}
            onChange={setPromptInputValue}
            onSend={handleSendPrompt}
            isDisabled={isAiThinking}
          />
        </div>
      </div>
    </div>
  );
}