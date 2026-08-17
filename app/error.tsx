"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-zinc-100">
      <div className="max-w-md space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">AI Fitness Coach</p>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-sm leading-6 text-zinc-400">
          The coach could not load this screen. Try again, and if the problem continues, refresh the page.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
