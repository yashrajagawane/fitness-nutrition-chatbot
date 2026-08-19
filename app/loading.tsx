export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] text-zinc-100">
      <div className="flex items-center gap-3 text-sm font-bold text-zinc-400" role="status" aria-live="polite">
        <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
        Loading AI Fitness Coach...
      </div>
    </main>
  );
}
