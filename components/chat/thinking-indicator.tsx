"use client";

import { Card, CardContent } from "@/components/ui/card";

export function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <div className="flex-1">
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