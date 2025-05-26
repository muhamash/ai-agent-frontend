"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Star, StarOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { usePrompts } from "@/hooks/use-prompts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  isDisabled?: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  isDisabled = false,
}: MessageInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { savePrompt, isPromptSaved, removePrompt } = usePrompts();

  const handleSend = () => {
    if (value.trim() && !isDisabled) {
      onSend(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSavePrompt = () => {
    if (isPromptSaved(value)) {
      removePrompt(value);
    } else {
      setIsPromptDialogOpen(true);
    }
  };

  const handleSavePrompt = () => {
    if (value.trim()) {
      savePrompt(value.trim(), promptTitle.trim() || undefined);
      setIsPromptDialogOpen(false);
      setPromptTitle("");
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + "px";
    }
  }, [value]);

  // Auto-focus
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const isPromptStarred = isPromptSaved(value);

  return (
    <>
      <div
        className={cn(
          "flex items-end gap-2 rounded-lg glass-morphism p-2 transition-all",
          isFocused && "ring-2 ring-ring"
        )}
      >
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-10 border-0 p-2 focus-visible:ring-0 resize-none bg-transparent"
          disabled={isDisabled}
        />
        <div className="flex items-center gap-2 self-end p-1">
          {value.trim().length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={toggleSavePrompt}
              disabled={isDisabled}
            >
              {isPromptStarred ? (
                <StarOff className="h-5 w-5 text-yellow-500" />
              ) : (
                <Star className="h-5 w-5" />
              )}
              <span className="sr-only">
                {isPromptStarred ? "Remove from prompts" : "Save to prompts"}
              </span>
            </Button>
          )}
          <Button
            className="h-9 w-9 rounded-full p-0"
            onClick={handleSend}
            disabled={!value.trim() || isDisabled}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>

      <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Prompt</DialogTitle>
            <DialogDescription>
              Add a title to help you identify this prompt later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                value={promptTitle}
                onChange={(e) => setPromptTitle(e.target.value)}
                placeholder="Enter a title for your prompt"
              />
            </div>
            <div className="grid gap-2">
              <Label>Prompt</Label>
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">{value}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromptDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePrompt}>Save Prompt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}