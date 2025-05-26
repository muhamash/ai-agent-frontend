"use client";

import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <Avatar className="h-8 w-8 bg-primary">
        <AvatarFallback className="bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="mb-1 text-sm font-medium">AI Assistant</div>
        <Card className="border-none">
          <CardContent className="p-3">
            <div className="flex space-x-2 items-center">
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
              <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}