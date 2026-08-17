import type { ChatRequest } from "./types";

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_ITEMS = 10;
const MAX_HISTORY_MESSAGE_LENGTH = 4000;

export type ValidationResult =
  | { success: true; data: ChatRequest }
  | { success: false; error: string };

export const validateChatRequest = (value: unknown): ValidationResult => {
  if (typeof value !== "object" || value === null) {
    return { success: false, error: "Request body must be a JSON object." };
  }

  const body = value as Record<string, unknown>;
  if (typeof body.message !== "string" || !body.message.trim()) {
    return { success: false, error: "A valid message string is required." };
  }
  if (body.message.length > MAX_MESSAGE_LENGTH) {
    return { success: false, error: `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.` };
  }

  if (body.history !== undefined && !Array.isArray(body.history)) {
    return { success: false, error: "Conversation history must be an array." };
  }

  const history = (body.history ?? []) as unknown[];
  if (history.length > MAX_HISTORY_ITEMS) {
    return { success: false, error: `Conversation history cannot exceed ${MAX_HISTORY_ITEMS} messages.` };
  }

  for (const item of history) {
    if (typeof item !== "object" || item === null) {
      return { success: false, error: "Conversation history contains an invalid message." };
    }
    const message = item as Record<string, unknown>;
    if ((message.role !== "user" && message.role !== "assistant") || typeof message.content !== "string") {
      return { success: false, error: "Conversation history contains an invalid message." };
    }
    if (message.content.length > MAX_HISTORY_MESSAGE_LENGTH) {
      return { success: false, error: "Conversation history contains an oversized message." };
    }
  }

  return {
    success: true,
    data: {
      message: body.message.trim(),
      history: history as ChatRequest["history"],
    },
  };
};
