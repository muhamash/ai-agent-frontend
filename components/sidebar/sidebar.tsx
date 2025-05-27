"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChat } from "@/hooks/use-chat";
import { Lightbulb, MessageSquare, PlusCircle } from "lucide-react";
import { useState } from "react";
import { ChatHistory } from "./chat-history";
import { PromptLibrary } from "./prompt-library";
import Link from "next/link";

interface SidebarProps {
  onCloseSidebar?: () => void;
}

export function Sidebar({ onCloseSidebar }: SidebarProps) {
  const [activeTab, setActiveTab] = useState("chats");
  const { startNewChat } = useChat();

  const handleNewChat = () => {
    startNewChat();
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  return (
    <aside className="flex h-full w-full flex-col bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <Link href={'/'} className="text-xl font-bold">Back to Home</Link>
      </div>

      <Button 
        onClick={handleNewChat} 
        className="mb-4 flex items-center gap-2"
      >
        <PlusCircle size={16} />
        New Chat
      </Button>

      <Tabs
        defaultValue="chats"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 p-2 overflow-y-scroll scrollbar-none"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Chats</span>
          </TabsTrigger>
          <TabsTrigger value="prompts" className="flex items-center gap-2">
            <Lightbulb size={16} />
            <span>Prompts</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chats" className="flex-1 pt-4">
          <ChatHistory onSelectChat={onCloseSidebar} />
        </TabsContent>
        <TabsContent value="prompts" className="flex-1 pt-4">
          <PromptLibrary onSelectPrompt={onCloseSidebar} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}