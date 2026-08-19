import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-zinc-100">
      <div className="max-w-md space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">AI Fitness Coach</p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-sm leading-6 text-zinc-400">That route does not exist. Return to your coaching workspace to continue.</p>
        <Link href="/" className="inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700">
          Back to coach
        </Link>
      </div>
    </main>
  );
}
