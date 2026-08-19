"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "fitness-coach-pwa-install-dismissed";

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(min-width: 641px)").matches) return;
    if (window.localStorage.getItem(DISMISS_KEY) === "true") return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (!visible || !installEvent) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  };

  const install = async () => {
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    setVisible(false);
    if (choice.outcome === "dismissed") {
      window.localStorage.setItem(DISMISS_KEY, "true");
    }
  };

  return (
    <aside
      aria-label="Install AI Fitness Coach"
      className="fixed inset-x-3 bottom-3 z-[70] rounded-2xl border border-emerald-500/30 bg-[#111113]/95 p-4 shadow-2xl shadow-emerald-500/10 backdrop-blur-md sm:hidden"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-lg shadow-lg shadow-emerald-500/20">
          💪
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">Install AI Fitness Coach</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">Open your coach faster from your phone home screen.</p>
        </div>
        <button onClick={dismiss} className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white" aria-label="Dismiss install prompt">
          ×
        </button>
      </div>
      <button onClick={install} className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700">
        Install app
      </button>
    </aside>
  );
}
