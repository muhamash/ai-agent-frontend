
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/contexts/ChatContext';
import { MessageSquare, Pencil } from 'lucide-react';
import React, { useState } from 'react';

const ConversationSidebar: React.FC = ({onClose}) => {
  const { 
    conversations, 
    currentConversationId, 
    newConversation, 
    selectConversation,
    deleteConversation,
    renameConversation
  } = useChat();
  const [hoveredConversationId, setHoveredConversationId] = useState<string | null>(null);
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  const handleRenameClick = (e: React.MouseEvent, conversation: { id: string; title: string }) => {
    e.stopPropagation();
    setEditingConversationId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleRenameSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim());
      setEditingConversationId(null);
    }
  };

  const handleRenameCancel = () => {
    setEditingConversationId(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Button 
          onClick={newConversation}
          className="w-full gradient-bg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <MessageSquare size={16} />
          <span>New Chat</span>
        </Button>
      </div>
      <button className='bg-rose-500 text-white px-3 py-1 w-[150px] rounded-md mx-auto' onClick={()=>onClose(false)}>close</button>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              className="relative"
              onMouseEnter={() => setHoveredConversationId(conversation.id)}
              onMouseLeave={() => setHoveredConversationId(null)}
            >
              {editingConversationId === conversation.id ? (
                <form 
                  onSubmit={(e) => handleRenameSubmit(e, conversation.id)}
                  className="flex gap-2 px-2 py-1 animate-fade-in"
                >
                  <Input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-8 bg-slate-800 border-slate-700 focus-visible:ring-slate-500"
                  />
                  <div className="flex gap-1">
                    <Button type="submit" size="sm" variant="ghost" className="h-8 px-2">
                      Save
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 px-2"
                      onClick={handleRenameCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant={conversation.id === currentConversationId ? "secondary" : "ghost"}
                  className={`w-full justify-start px-3 py-5 text-left h-auto ${
                    conversation.id === currentConversationId 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <div className="truncate flex-1">
                    {conversation.title || "New Conversation"}
                  </div>
                </Button>
              )}
              
              {hoveredConversationId === conversation.id && editingConversationId !== conversation.id && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => handleRenameClick(e, conversation)}
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="sr-only">Rename</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-4 h-4"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )}
            </div>
          ) )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationSidebar;
