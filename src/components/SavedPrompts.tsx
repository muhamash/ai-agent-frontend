
import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book } from 'lucide-react';

const SavedPrompts: React.FC = () => {
  const { savedPrompts, savePrompt, deletePrompt, sendMessage } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ title: '', content: '', category: 'general' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Get unique categories
  const categories = ['All', ...new Set(savedPrompts.map(prompt => prompt.category))];

  const handleSave = () => {
    if (newPrompt.title.trim() && newPrompt.content.trim()) {
      savePrompt(newPrompt.title, newPrompt.content, newPrompt.category || 'general');
      setNewPrompt({ title: '', content: '', category: 'general' });
      setShowAddForm(false);
    }
  };

  const handleUsePrompt = (content: string) => {
    sendMessage(content);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center gap-2">
          <Book className="w-4 h-4" />
          <span>Prompt Library</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl font-bold flex items-center gap-2">
            <Book className="w-5 h-5" />
            Prompt Library
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddForm(!showAddForm)}
              className="gradient-bg text-white hover:opacity-90"
            >
              {showAddForm ? 'Cancel' : 'Add New Prompt'}
            </Button>
          </div>
          
          {showAddForm && (
            <div className="space-y-3 p-3 rounded-md border border-slate-700 animate-fade-in bg-slate-900/50 backdrop-blur-sm">
              <Input 
                placeholder="Prompt title"
                value={newPrompt.title}
                onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
                className="border-slate-700"
              />
              <Textarea 
                placeholder="Prompt content"
                value={newPrompt.content}
                onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})}
                className="min-h-24 resize-none border-slate-700"
              />
              <Input 
                placeholder="Category (e.g., coding, writing, general)"
                value={newPrompt.category}
                onChange={(e) => setNewPrompt({...newPrompt, category: e.target.value})}
                className="border-slate-700"
              />
              <Button onClick={handleSave} className="w-full gradient-bg text-white hover:opacity-90">Save Prompt</Button>
            </div>
          )}
          
          <Tabs defaultValue="All">
            <TabsList className="w-full bg-slate-800">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="flex-1"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category} value={category} className="mt-4">
                <ScrollArea className="h-[300px]">
                  {savedPrompts.filter(prompt => category === 'All' || prompt.category === category).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                      <p>No prompts in this category</p>
                      <Button 
                        variant="link" 
                        onClick={() => setShowAddForm(true)}
                        className="mt-2"
                      >
                        Add your first prompt
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedPrompts
                        .filter(prompt => category === 'All' || prompt.category === category)
                        .map(prompt => (
                          <div 
                            key={prompt.id} 
                            className="p-3 rounded-md border border-slate-700 hover:border-slate-600 transition-colors bg-slate-900/50"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-medium text-sm">{prompt.title}</h4>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleUsePrompt(prompt.content)}
                                  className="hover:bg-slate-800"
                                >
                                  Use
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-7 w-7 hover:bg-slate-800 hover:text-red-400"
                                  onClick={() => deletePrompt(prompt.id)}
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
                                    className="h-4 w-4"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {prompt.content}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Add missing Textarea component
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  return (
    <textarea
      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
};

export default SavedPrompts;
