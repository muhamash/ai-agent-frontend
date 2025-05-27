"use client";

import { Chat, Message } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

// Call real AI API instead of simulating
const getAiResponse = async (
  sessionId: string,
  prompt: string
): Promise<string> => {
  console.log("Calling AI API for prompt:", prompt, "sessionId:", sessionId);

  const response = await fetch(
    "https://go-ai-agent-muhamash4111-ukwf1enb.leapcell.dev/ai-agent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        prompt,
        stream: false,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  console.log("AI API response:", data);
  // Extract assistant content from the API response structure
  const aiMessage =
    data.choices?.[0]?.message?.content ||
    "Sorry, no response from AI at the moment.";

  return aiMessage;
};

export const useChat = create<ChatState>()(
  persist(
    ( set, get ) => ( {
      chatHistory: [],
      currentChatId: null,
      isAiThinking: false,
      currentChat: null,

      startNewChat: () =>
      {
        const newChatId = uuidv4();
        const newChat: Chat = {
          id: newChatId,
          messages: [],
          timestamp: Date.now(),
        };

        set( ( state ) => ( {
          chatHistory: [ newChat, ...state.chatHistory ],
          currentChatId: newChatId,
          currentChat: newChat,
        } ) );

        return newChatId;
      },

      sendPrompt: async ( content: string ) =>
      {
        let chatId = get().currentChatId;

        // If no current chat, create a new one
        if ( !chatId )
        {
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
        set( ( state ) =>
        {
          const updatedChatHistory = state.chatHistory.map( ( chat ) =>
          {
            if ( chat.id === chatId )
            {
              return {
                ...chat,
                messages: [ ...chat.messages, userMessage ],
                timestamp: Date.now(),
              };
            }
            return chat;
          } );

          const currentChat = updatedChatHistory.find(
            ( chat ) => chat.id === chatId
          ) || null;

          return {
            chatHistory: updatedChatHistory,
            currentChat,
            isAiThinking: true,
          };
        } );

        try
        {
          // Get AI response from real API using currentChatId as session_id
          const aiResponseContent = await getAiResponse( chatId, content );

          // Create AI message
          const aiMessage: Message = {
            id: uuidv4(),
            content: aiResponseContent,
            role: "assistant",
            timestamp: Date.now(),
          };

          // Update state with AI message
          set( ( state ) =>
          {
            const updatedChatHistory = state.chatHistory.map( ( chat ) =>
            {
              if ( chat.id === chatId )
              {
                return {
                  ...chat,
                  messages: [ ...chat.messages, aiMessage ],
                  timestamp: Date.now(),
                };
              }
              return chat;
            } );

            const currentChat = updatedChatHistory.find(
              ( chat ) => chat.id === chatId
            ) || null;

            return {
              chatHistory: updatedChatHistory,
              currentChat,
              isAiThinking: false,
            };
          } );
        } catch ( error )
        {
          console.error( "Error getting AI response:", error );
          set( { isAiThinking: false } );
        }
      },

      selectChat: ( chatId: string ) =>
      {
        const selectedChat =
          get().chatHistory.find( ( chat ) => chat.id === chatId ) || null;
        set( {
          currentChatId: chatId,
          currentChat: selectedChat,
        } );
      },

      deleteChat: ( chatId: string ) =>
      {
        set( ( state ) =>
        {
          const updatedChatHistory = state.chatHistory.filter(
            ( chat ) => chat.id !== chatId
          );

          // If deleting the current chat, update currentChatId
          const updatedCurrentChatId =
            state.currentChatId === chatId
              ? updatedChatHistory.length > 0
                ? updatedChatHistory[ 0 ].id
                : null
              : state.currentChatId;

          const updatedCurrentChat = updatedCurrentChatId
            ? updatedChatHistory.find( ( chat ) => chat.id === updatedCurrentChatId ) ||
            null
            : null;

          return {
            chatHistory: updatedChatHistory,
            currentChatId: updatedCurrentChatId,
            currentChat: updatedCurrentChat,
          };
        } );
      },
    } ),
    {
      name: "ai-assistant-chat",
    }
  )
);