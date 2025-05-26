"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Chat, Message } from "@/types/chat";

interface ChatState {
  chatHistory: Chat[];
  currentChatId: string | null;
  isAiThinking: boolean;
  currentChat: Chat | null;
  startNewChat: () => string;
  sendPrompt: (content: string) => void;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
}

// Simulating AI response with a delay
const getAiResponse = async (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate different types of responses based on prompt content
      if (prompt.toLowerCase().includes("blog")) {
        resolve(
          "# How to Write Effective Blog Posts\n\n## Introduction\nCreating engaging blog content requires understanding your audience and delivering value through your writing.\n\n## Key Elements of Successful Blogs\n1. **Compelling Headlines** - Attract readers with clear, interesting titles\n2. **Valuable Content** - Provide actionable insights or entertaining stories\n3. **Visual Elements** - Break up text with images and formatting\n4. **Consistent Voice** - Develop a recognizable writing style\n\n## Conclusion\nConsistency and quality will help you build an audience over time. Start with topics you're passionate about and expand from there."
        );
      } else if (prompt.toLowerCase().includes("code") || prompt.toLowerCase().includes("programming")) {
        resolve(
          "Here's a simple React component example:\n\n```jsx\nimport React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n\nexport default Counter;\n```\n\nThis component maintains a count state and increases it when the button is clicked."
        );
      } else {
        resolve(
          "I'd be happy to help with that! Your question touches on an interesting topic. Based on current understanding, there are several approaches we could take:\n\n1. First, consider the fundamental principles involved\n2. Next, look at practical applications\n3. Finally, think about how this applies to your specific situation\n\nWould you like me to elaborate on any of these points in particular?"
        );
      }
    }, 2000); // Simulate response time
  });
};

export const useChat = create<ChatState>()(
  persist(
    (set, get) => ({
      chatHistory: [],
      currentChatId: null,
      isAiThinking: false,
      currentChat: null,

      startNewChat: () => {
        const newChatId = uuidv4();
        const newChat: Chat = {
          id: newChatId,
          messages: [],
          timestamp: Date.now(),
        };

        set((state) => ({
          chatHistory: [newChat, ...state.chatHistory],
          currentChatId: newChatId,
          currentChat: newChat,
        }));

        return newChatId;
      },

      sendPrompt: async (content: string) => {
        let chatId = get().currentChatId;
        
        // If no current chat, create a new one
        if (!chatId) {
          chatId = get().startNewChat();
        }

        // Create user message
        const userMessage: Message = {
          id: uuidv4(),
          content,
          role: "user",
          timestamp: Date.now(),
        };

        // Update state with user message
        set((state) => {
          const updatedChatHistory = state.chatHistory.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, userMessage],
                timestamp: Date.now(),
              };
            }
            return chat;
          });

          const currentChat = updatedChatHistory.find((chat) => chat.id === chatId) || null;

          return {
            chatHistory: updatedChatHistory,
            currentChat,
            isAiThinking: true,
          };
        });

        try {
          // Get AI response
          const aiResponseContent = await getAiResponse(content);

          // Create AI message
          const aiMessage: Message = {
            id: uuidv4(),
            content: aiResponseContent,
            role: "assistant",
            timestamp: Date.now(),
          };

          // Update state with AI message
          set((state) => {
            const updatedChatHistory = state.chatHistory.map((chat) => {
              if (chat.id === chatId) {
                return {
                  ...chat,
                  messages: [...chat.messages, aiMessage],
                  timestamp: Date.now(),
                };
              }
              return chat;
            });

            const currentChat = updatedChatHistory.find((chat) => chat.id === chatId) || null;

            return {
              chatHistory: updatedChatHistory,
              currentChat,
              isAiThinking: false,
            };
          });
        } catch (error) {
          console.error("Error getting AI response:", error);
          set({ isAiThinking: false });
        }
      },

      selectChat: (chatId: string) => {
        const selectedChat = get().chatHistory.find((chat) => chat.id === chatId) || null;
        set({
          currentChatId: chatId,
          currentChat: selectedChat,
        });
      },

      deleteChat: (chatId: string) => {
        set((state) => {
          const updatedChatHistory = state.chatHistory.filter(
            (chat) => chat.id !== chatId
          );
          
          // If we're deleting the current chat, update the current chat ID
          const updatedCurrentChatId = 
            state.currentChatId === chatId
              ? updatedChatHistory.length > 0
                ? updatedChatHistory[0].id
                : null
              : state.currentChatId;
          
          const updatedCurrentChat = 
            updatedCurrentChatId
              ? updatedChatHistory.find((chat) => chat.id === updatedCurrentChatId) || null
              : null;

          return {
            chatHistory: updatedChatHistory,
            currentChatId: updatedCurrentChatId,
            currentChat: updatedCurrentChat,
          };
        });
      },
    }),
    {
      name: "ai-assistant-chat",
    }
  )
);