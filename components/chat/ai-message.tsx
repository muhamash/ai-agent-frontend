"use client";

import { useState } from "react";
import { Message } from "@/types/chat";
import { Copy, Check, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface AiMessageProps {
  message: Message;
}

export function AiMessage({ message }: AiMessageProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast({
      description: "Copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-8 w-8 bg-primary">
        <AvatarFallback className="bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 group">
        <div className="mb-1 flex items-center justify-between">
          <div className="text-sm font-medium">AI Assistant</div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 opacity-0 transition-opacity",
              "group-hover:opacity-100",
              copied && "text-green-500"
            )}
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy message</span>
          </Button>
        </div>
        <Card className="border-none">
          <CardContent className="p-3 text-sm prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap markdown-content">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}