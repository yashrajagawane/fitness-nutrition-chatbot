import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./config";

export const createSupabaseBrowserClient = () => {
  const { url, publishableKey } = getSupabaseEnv();
  if (!url || !publishableKey) return null;
  return createBrowserClient(url, publishableKey);
};
