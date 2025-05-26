"use client";

import { Message } from "@/types/chat";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface UserMessageProps {
  message: Message;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-8 w-8 bg-primary">
        <AvatarFallback className="bg-primary">
          <User className="h-4 w-4 text-primary-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="mb-1 text-sm font-medium">You</div>
        <Card className="border-none bg-muted/50">
          <CardContent className="p-3 text-sm">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}