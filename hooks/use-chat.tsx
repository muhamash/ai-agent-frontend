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
      
        // Add user message to chat
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
      
          const currentChat = updatedChatHistory.find( ( chat ) => chat.id === chatId ) || null;
      
          return {
            chatHistory: updatedChatHistory,
            currentChat,
            isAiThinking: true,
          };
        } );
      
        // Prepare to add assistant message and stream content
        const assistantMessageId = uuidv4();
      
        // Add empty assistant message first
        set( ( state ) =>
        {
          const updatedChatHistory = state.chatHistory.map( ( chat ) =>
          {
            if ( chat.id === chatId )
            {
              return {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: assistantMessageId,
                    content: "",
                    role: "assistant",
                    timestamp: Date.now(),
                  },
                ],
                timestamp: Date.now(),
              };
            }
            return chat;
          } );
      
          const currentChat = updatedChatHistory.find( ( chat ) => chat.id === chatId ) || null;
      
          return {
            chatHistory: updatedChatHistory,
            currentChat,
          };
        } );
      
        try
        {
          // Call your streaming API endpoint
          const response = await fetch( "https://go-ai-agent-muhamash4111-ukwf1enb.leapcell.dev/ai-agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( {
              session_id: chatId,
              prompt: content,
              stream: true,
            } ),
          } );
      
          if ( !response.body )
          {
            throw new Error( "ReadableStream not supported in this environment" );
          }
      
          const reader = response.body.getReader();
          const decoder = new TextDecoder( "utf-8" );
          console.log( "Streaming AI response started for chatId:", chatId, reader, decoder );
          let done = false;
          let assistantContent = "";
      
          while ( !done )
          {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
      
            if ( value )
            {
              const chunk = decoder.decode( value, { stream: true } );
              assistantContent += chunk;
            
              // Optionally clean up trailing spaces/newlines for better UX
              const cleanedContent = assistantContent.trimEnd();
            
              set( ( state ) =>
              {
                const updatedChatHistory = state.chatHistory.map( ( chat ) =>
                {
                  if ( chat.id === chatId )
                  {
                    return {
                      ...chat,
                      messages: chat.messages.map( ( msg ) =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: cleanedContent, timestamp: Date.now() }
                          : msg
                      ),
                      timestamp: Date.now(),
                    };
                  }
                  return chat;
                } );
            
                const currentChat = updatedChatHistory.find( ( chat ) => chat.id === chatId ) || null;
            
                return {
                  chatHistory: updatedChatHistory,
                  currentChat,
                };
              } );
            }
            
          }
      
          // Streaming done, set AI thinking false
          set( { isAiThinking: false } );
        } catch ( error )
        {
          console.error( "Error streaming AI response:", error );
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