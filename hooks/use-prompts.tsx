"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Prompt } from "@/types/chat";

interface PromptsState {
  prompts: Prompt[];
  savePrompt: (text: string, title?: string) => void;
  deletePrompt: (id: string) => void;
  removePrompt: (text: string) => void;
  isPromptSaved: (text: string) => boolean;
}

export const usePrompts = create<PromptsState>()(
  persist(
    (set, get) => ({
      prompts: [],

      savePrompt: (text: string, title?: string) => {
        const trimmedText = text.trim();
        if (!trimmedText || get().isPromptSaved(trimmedText)) return;

        const newPrompt: Prompt = {
          id: uuidv4(),
          text: trimmedText,
          title: title?.trim() || undefined,
          timestamp: Date.now(),
        };

        set((state) => ({
          prompts: [newPrompt, ...state.prompts],
        }));
      },

      deletePrompt: (id: string) => {
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.id !== id),
        }));
      },

      removePrompt: (text: string) => {
        const trimmedText = text.trim();
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.text !== trimmedText),
        }));
      },

      isPromptSaved: (text: string) => {
        const trimmedText = text.trim();
        return get().prompts.some((prompt) => prompt.text === trimmedText);
      },
    }),
    {
      name: "ai-assistant-prompts",
    }
  )
);