import type { AppDataBundle, ChatSession, Message, ProgressEntry, SavedPlan, UserProfile } from "./types";

const PROFILE_KEY = "vitalis_profile";
const SESSIONS_KEY = "vitalis_sessions";
const SAVED_PLANS_KEY = "vitalis_saved_plans";
const PROGRESS_KEY = "vitalis_progress";

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

const parseSavedPlan = (value: unknown): SavedPlan | null => {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.title !== "string" || typeof value.content !== "string") {
    return null;
  }
  const createdAt = parseDate(value.createdAt);
  return createdAt ? { id: value.id, title: value.title, content: value.content, createdAt } : null;
};

const parseProgressEntry = (value: unknown): ProgressEntry | null => {
  const fields = ["id", "date", "weight", "workouts", "water", "sleep", "note"] as const;
  if (!isRecord(value) || fields.some((field) => typeof value[field] !== "string")) return null;
  return Object.fromEntries(fields.map((field) => [field, value[field]])) as unknown as ProgressEntry;
};

export const loadProfile = (): UserProfile | null => {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;

    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return null;

    const requiredFields = ["age", "height", "weight", "gender", "goal", "activity"] as const;
    if (requiredFields.some((field) => typeof value[field] !== "string")) return null;

    return {
      age: value.age as string,
      height: value.height as string,
      weight: value.weight as string,
      gender: value.gender as string,
      goal: value.goal as string,
      activity: value.activity as string,
      units: value.units === "imperial" ? "imperial" : "metric",
      experience: typeof value.experience === "string" ? value.experience : "beginner",
      equipment: typeof value.equipment === "string" ? value.equipment : "bodyweight and basic gym equipment",
      schedule: typeof value.schedule === "string" ? value.schedule : "3 days per week",
      dietaryPreferences: typeof value.dietaryPreferences === "string" ? value.dietaryPreferences : "none",
      injuries: typeof value.injuries === "string" ? value.injuries : "none",
    };
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

export const loadSavedPlans = (): SavedPlan[] => {
  try {
    const raw = window.localStorage.getItem(SAVED_PLANS_KEY);
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value)
      ? value.map(parseSavedPlan).filter((plan): plan is SavedPlan => plan !== null)
      : [];
  } catch {
    return [];
  }
};

export const saveSavedPlans = (plans: SavedPlan[]) => {
  window.localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(plans));
};

export const loadProgress = (): ProgressEntry[] => {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value)
      ? value.map(parseProgressEntry).filter((entry): entry is ProgressEntry => entry !== null)
      : [];
  } catch {
    return [];
  }
};

export const saveProgress = (entries: ProgressEntry[]) => {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(entries));
};

export const getDataBundle = (): AppDataBundle => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  profile: loadProfile(),
  sessions: loadSessions(),
  savedPlans: loadSavedPlans(),
  progress: loadProgress(),
});

export const exportData = (): string => JSON.stringify(getDataBundle(), null, 2);

export const importData = (raw: string): boolean => {
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== 1) return false;

    const profile = value.profile === null ? null : loadImportedProfile(value.profile);
    const sessions = Array.isArray(value.sessions)
      ? value.sessions.map(parseSession).filter((session): session is ChatSession => session !== null)
      : [];
    const savedPlans = Array.isArray(value.savedPlans)
      ? value.savedPlans.map(parseSavedPlan).filter((plan): plan is SavedPlan => plan !== null)
      : [];
    const progress = Array.isArray(value.progress)
      ? value.progress.map(parseProgressEntry).filter((entry): entry is ProgressEntry => entry !== null)
      : [];

    if (value.profile !== null && !profile) return false;
    if (!Array.isArray(value.sessions) || !Array.isArray(value.savedPlans) || !Array.isArray(value.progress)) return false;

    if (profile) saveProfile(profile);
    else window.localStorage.removeItem(PROFILE_KEY);
    saveSessions(sessions);
    saveSavedPlans(savedPlans);
    saveProgress(progress);
    return true;
  } catch {
    return false;
  }
};

const loadImportedProfile = (value: unknown): UserProfile | null => {
  if (!isRecord(value)) return null;
  const requiredFields = ["age", "height", "weight", "gender", "goal", "activity"] as const;
  if (requiredFields.some((field) => typeof value[field] !== "string")) return null;
  return {
    age: value.age as string,
    height: value.height as string,
    weight: value.weight as string,
    gender: value.gender as string,
    goal: value.goal as string,
    activity: value.activity as string,
    units: value.units === "imperial" ? "imperial" : "metric",
    experience: typeof value.experience === "string" ? value.experience : "beginner",
    equipment: typeof value.equipment === "string" ? value.equipment : "bodyweight and basic gym equipment",
    schedule: typeof value.schedule === "string" ? value.schedule : "3 days per week",
    dietaryPreferences: typeof value.dietaryPreferences === "string" ? value.dietaryPreferences : "none",
    injuries: typeof value.injuries === "string" ? value.injuries : "none",
  };
};

export const clearAllData = () => {
  [PROFILE_KEY, SESSIONS_KEY, SAVED_PLANS_KEY, PROGRESS_KEY].forEach((key) => window.localStorage.removeItem(key));
};
