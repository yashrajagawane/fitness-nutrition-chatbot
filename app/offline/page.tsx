import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#050505] px-6 text-zinc-100">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#0c0c0e] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl shadow-lg shadow-emerald-500/20">
          💪
        </div>
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Your saved app shell is available, but AI coaching and account data need an internet connection.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700">
          Try again
        </Link>
      </section>
    </main>
  );
}
