import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message, SavedPrompt } from '../types/chat';

// Types
interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  savedPrompts: SavedPrompt[];
  isTyping: boolean;
}

type ChatAction =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'SELECT_CONVERSATION'; payload: string }
  | { type: 'DELETE_CONVERSATION'; payload: string }
  | { type: 'RENAME_CONVERSATION'; payload: { id: string; title: string } }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'SET_SAVED_PROMPTS'; payload: SavedPrompt[] }
  | { type: 'ADD_SAVED_PROMPT'; payload: SavedPrompt }
  | { type: 'DELETE_SAVED_PROMPT'; payload: string }
  | { type: 'SET_TYPING'; payload: boolean };

interface ChatContextType extends ChatState {
  sendMessage: (content: string) => void;
  newConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  savePrompt: (title: string, content: string, category: string) => void;
  deletePrompt: (id: string) => void;
  getCurrentConversation: () => Conversation | undefined;
}

// Initial state
const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  savedPrompts: [],
  isTyping: false,
};

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Reducer function
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload,
      };
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
        currentConversationId: action.payload.id,
      };
    case 'SELECT_CONVERSATION':
      return {
        ...state,
        currentConversationId: action.payload,
      };
    case 'DELETE_CONVERSATION': {
      const newConversations = state.conversations.filter(
        (conv) => conv.id !== action.payload
      );
      const newCurrentId = 
        state.currentConversationId === action.payload
          ? newConversations.length > 0 
            ? newConversations[0].id 
            : null
          : state.currentConversationId;
      
      return {
        ...state,
        conversations: newConversations,
        currentConversationId: newCurrentId,
      };
    }
    case 'RENAME_CONVERSATION': {
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === action.payload.id
            ? {
                ...conv,
                title: action.payload.title,
                updatedAt: new Date(),
              }
            : conv
        ),
      };
    }
    case 'ADD_MESSAGE': {
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === action.payload.conversationId
            ? {
                ...conv,
                messages: [...conv.messages, action.payload.message],
                updatedAt: new Date(),
              }
            : conv
        ),
      };
    }
    case 'SET_SAVED_PROMPTS':
      return {
        ...state,
        savedPrompts: action.payload,
      };
    case 'ADD_SAVED_PROMPT':
      return {
        ...state,
        savedPrompts: [...state.savedPrompts, action.payload],
      };
    case 'DELETE_SAVED_PROMPT':
      return {
        ...state,
        savedPrompts: state.savedPrompts.filter(
          (prompt) => prompt.id !== action.payload
        ),
      };
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    default:
      return state;
  }
}

// AI response function
const generateAIResponse = async (message: string): Promise<string> => {
  // In a real implementation, this would call an AI API
  // For now, we'll simulate a delay and return a canned response
  console.log( 'Generating AI response for:', message );
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const responses = [
    "I'm here to help with your web development questions. What would you like to know?",
    "That's an interesting question. Let me generate some code that might help.",
    "I understand what you're trying to accomplish. Let's break it down step by step.",
    "I can help you implement that feature. Here's how I would approach it:",
    "Great question! Here's what you need to know about that topic:",
    "I can see a few ways to solve this problem. Let's explore the options.",
    "Let me think about the best way to implement this...",
    "Based on best practices, I'd recommend the following approach:",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem('conversations');
      const savedPrompts = localStorage.getItem('savedPrompts');
      const currentConversationId = localStorage.getItem('currentConversationId');
      
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        // Convert string dates back to Date objects
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        dispatch({ type: 'SET_CONVERSATIONS', payload: conversationsWithDates });
      }
      
      if (savedPrompts) {
        const parsed = JSON.parse(savedPrompts);
        const promptsWithDates = parsed.map((prompt: any) => ({
          ...prompt,
          createdAt: new Date(prompt.createdAt)
        }));
        dispatch({ type: 'SET_SAVED_PROMPTS', payload: promptsWithDates });
      }
      
      if (currentConversationId) {
        dispatch({ type: 'SELECT_CONVERSATION', payload: currentConversationId });
      }
    } catch (error) {
      console.error('Error loading chat data', error);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('conversations', JSON.stringify(state.conversations));
      localStorage.setItem('savedPrompts', JSON.stringify(state.savedPrompts));
      if (state.currentConversationId) {
        localStorage.setItem('currentConversationId', state.currentConversationId);
      }
    } catch (error) {
      console.error('Error saving chat data', error);
    }
  }, [state.conversations, state.savedPrompts, state.currentConversationId]);

  // Create a new conversation
  const newConversation = () => {
    const conversation: Conversation = {
      id: uuidv4(),
      title: `New Chat ${state.conversations.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CONVERSATION', payload: conversation });
  };

  // Select a conversation
  const selectConversation = (id: string) => {
    dispatch({ type: 'SELECT_CONVERSATION', payload: id });
  };

  // Delete a conversation
  const deleteConversation = (id: string) => {
    dispatch({ type: 'DELETE_CONVERSATION', payload: id });
  };

  // Rename a conversation
  const renameConversation = (id: string, title: string) => {
    dispatch({ type: 'RENAME_CONVERSATION', payload: { id, title } });
  };

  // Get current conversation
  const getCurrentConversation = () => {
    return state.conversations.find(
      (conv) => conv.id === state.currentConversationId
    );
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!state.currentConversationId) {
      // Create a new conversation if none exists
      const newConvId = uuidv4();
      const newConv: Conversation = {
        id: newConvId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dispatch({ type: 'ADD_CONVERSATION', payload: newConv });
      
      // Add user message to the new conversation
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { conversationId: newConvId, message: userMessage },
      });
      
      // Generate AI response
      dispatch({ type: 'SET_TYPING', payload: true });
      try {
        const response = await generateAIResponse(content);
        const assistantMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { conversationId: newConvId, message: assistantMessage },
        });
      } catch (error) {
        console.error('Error generating AI response', error);
      } finally {
        dispatch({ type: 'SET_TYPING', payload: false });
      }
    } else {
      // Add user message to existing conversation
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { conversationId: state.currentConversationId, message: userMessage },
      });
      
      // Generate AI response
      dispatch({ type: 'SET_TYPING', payload: true });
      try {
        const response = await generateAIResponse(content);
        const assistantMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { conversationId: state.currentConversationId, message: assistantMessage },
        });
      } catch (error) {
        console.error('Error generating AI response', error);
      } finally {
        dispatch({ type: 'SET_TYPING', payload: false });
      }
    }
  };

  // Save prompt
  const savePrompt = (title: string, content: string, category: string) => {
    const newPrompt: SavedPrompt = {
      id: uuidv4(),
      title,
      content,
      category,
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_SAVED_PROMPT', payload: newPrompt });
  };

  // Delete prompt
  const deletePrompt = (id: string) => {
    dispatch({ type: 'DELETE_SAVED_PROMPT', payload: id });
  };

  // Create initial conversation if none exists
  useEffect(() => {
    if (state.conversations.length === 0) {
      newConversation();
    }
  }, [state.conversations.length]);

  const value = {
    ...state,
    sendMessage,
    newConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    savePrompt,
    deletePrompt,
    getCurrentConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Hook for using chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
