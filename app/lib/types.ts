export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface UserProfile {
  age: string;
  height: string;
  weight: string;
  gender: string;
  goal: string;
  activity: string;
  units: "metric" | "imperial";
  experience: string;
  equipment: string;
  schedule: string;
  dietaryPreferences: string;
  injuries: string;
}

export interface ChatHistoryMessage {
  role: MessageRole;
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatHistoryMessage[];
}
