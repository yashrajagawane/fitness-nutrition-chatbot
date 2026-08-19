"use client";

import { useEffect, useState } from "react";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    if (!showReconnected) return;

    const timeout = window.setTimeout(() => setShowReconnected(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [showReconnected]);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-3 top-3 z-[80] rounded-xl border px-4 py-3 text-center text-xs font-semibold shadow-2xl backdrop-blur-md sm:hidden ${
        isOnline
          ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-200"
          : "border-amber-500/30 bg-amber-950/90 text-amber-100"
      }`}
    >
      {isOnline
        ? "Back online. You can use AI coaching and account features again."
        : "You are offline. AI coaching and account features need an internet connection."}
    </div>
  );
}
