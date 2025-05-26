export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: number;
}

export interface Chat {
  id: string;
  messages: Message[];
  timestamp: number;
}

export interface Prompt {
  id: string;
  text: string;
  title?: string;
  timestamp: number;
}