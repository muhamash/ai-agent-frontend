
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/contexts/ChatContext';
import React, { useRef, useState } from 'react';

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isTyping } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      sendMessage(input.trim());
      setInput('');
      
      // Focus back on textarea after sending
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="" onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="min-h-24 resize-none pr-12 bg-card border-slate-700 rounded-xl glow"
          disabled={isTyping}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute bottom-3 right-3 gradient-bg"
          disabled={!input.trim() || isTyping}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-4 h-4"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
          <span className="sr-only">Send</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-center mt-10 text-xs text-muted-foreground">
        <p>
          {isTyping ? (
            <span className="flex items-center">
              AI is thinking
              <span className="inline-flex ml-1">
                <span className="dot-flashing"></span>
              </span>
            </span>
          ) : (
            "AI Assistant powered by github.com/muhamash"
          )}
        </p>
      </div>
    </form>
  );
};

export default ChatInput;
