
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import SavedPrompts from './SavedPrompts';

const Header: React.FC = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <header className="border-b border-slate-700 p-4 z-50 bg-slate-900 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 mr-2"></div>
            <h1 className="text-xl font-bold gradient-text">AI Chat</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <SavedPrompts />
          
          <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">About</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="gradient-text text-xl font-bold">About AI Assistant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  AI Assistant is a powerful tool that helps you with web development, programming, 
                  and other tasks through natural language conversations.
                </p>
                <p>
                  Features:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Chat with AI for coding help and advice</li>
                  <li>Save and manage your favorite prompts</li>
                  <li>See live previews of your code</li>
                  <li>Track conversation history</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Created with React
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
