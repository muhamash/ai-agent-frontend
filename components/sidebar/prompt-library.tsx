"use client";

import { usePrompts } from "@/hooks/use-prompts";
import { useChat } from "@/hooks/use-chat";
import { Lightbulb, Star, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface PromptLibraryProps {
  onSelectPrompt?: () => void;
}

export function PromptLibrary({ onSelectPrompt }: PromptLibraryProps) {
  const { prompts, deletePrompt } = usePrompts();
  const { sendPrompt } = useChat();
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);

  const handleUsePrompt = (promptText: string) => {
    sendPrompt(promptText);
    if (onSelectPrompt) {
      onSelectPrompt();
    }
  };

  const handleDeletePrompt = () => {
    if (promptToDelete) {
      deletePrompt(promptToDelete);
      setPromptToDelete(null);
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-4">
        <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No saved prompts</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Star your favorite prompts to save them here for reuse.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {prompts.map((prompt) => {
        const timeAgo = formatDistanceToNow(new Date(prompt.timestamp), { addSuffix: true });

        return (
          <div
            key={prompt.id}
            className="group flex items-start justify-between rounded-md p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-yellow-500 flex-shrink-0" />
                <span className="font-medium truncate">{prompt.text.substring(0, 28)}</span>
              </div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                <span>{timeAgo}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 px-2 text-xs"
                onClick={() => handleUsePrompt(prompt.text)}
              >
                Use prompt
              </Button>
            </div>
            
            <AlertDialog open={promptToDelete === prompt.id} onOpenChange={(open) => !open && setPromptToDelete(null)}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  onClick={() => setPromptToDelete(prompt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete prompt</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete prompt</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this prompt? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePrompt}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      })}
    </div>
  );
}