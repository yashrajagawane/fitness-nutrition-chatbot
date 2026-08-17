import type { ChatSession, Message, UserProfile } from "./types";

const PROFILE_KEY = "vitalis_profile";
const SESSIONS_KEY = "vitalis_sessions";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseDate = (value: unknown): Date | null => {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseMessage = (value: unknown): Message | null => {
  if (!isRecord(value) || (value.role !== "user" && value.role !== "assistant")) {
    return null;
  }

  const timestamp = parseDate(value.timestamp);
  if (typeof value.id !== "string" || typeof value.content !== "string" || !timestamp) {
    return null;
  }

  return { id: value.id, role: value.role, content: value.content, timestamp };
};

const parseSession = (value: unknown): ChatSession | null => {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.title !== "string") {
    return null;
  }

  const createdAt = parseDate(value.createdAt);
  const messages = Array.isArray(value.messages)
    ? value.messages.map(parseMessage).filter((message): message is Message => message !== null)
    : [];

  return createdAt ? { id: value.id, title: value.title, createdAt, messages } : null;
};

export const loadProfile = (): UserProfile | null => {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;

    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return null;

    const fields = ["age", "height", "weight", "gender", "goal", "activity"] as const;
    if (fields.some((field) => typeof value[field] !== "string")) return null;

    return Object.fromEntries(fields.map((field) => [field, value[field]])) as unknown as UserProfile;
  } catch {
    return null;
  }
};

export const loadSessions = (): ChatSession[] => {
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];

    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.map(parseSession).filter((session): session is ChatSession => session !== null)
      : [];
  } catch {
    return [];
  }
};

export const saveProfile = (profile: UserProfile) => {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const saveSessions = (sessions: ChatSession[]) => {
  window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};
