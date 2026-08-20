"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "fitness-coach-pwa-install-dismissed";

const isIosInstallCandidate = () => {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;

  const isIosDevice = /iphone|ipad|ipod/i.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

  return isIosDevice && !isStandalone;
};

const shouldShowIosPrompt = () =>
  isIosInstallCandidate()
  && typeof window !== "undefined"
  && window.localStorage.getItem(DISMISS_KEY) !== "true";

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos] = useState(isIosInstallCandidate);
  const [visible, setVisible] = useState(shouldShowIosPrompt);

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

  if (!visible || (!installEvent && !isIos)) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) return;

    const pendingInstall = installEvent;
    await pendingInstall.prompt();
    const choice = await pendingInstall.userChoice;
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
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            {isIos ? "Tap Share, then Add to Home Screen." : "Open your coach faster from your phone home screen."}
          </p>
        </div>
        <button onClick={dismiss} className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white" aria-label="Dismiss install prompt">
          ×
        </button>
      </div>
      {installEvent && (
        <button onClick={install} className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700">
          Install app
        </button>
      )}
    </aside>
  );
}
