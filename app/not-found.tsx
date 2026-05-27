import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fdfaf4] p-8">
      <section className="w-full max-w-3xl border border-[#c9a84c]/20 bg-white/90 p-10 text-center">
        <p className="section-label">
          Page Not Found
        </p>

        <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
          404 — Page Not Found
        </h1>

        <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#1c2b3a]/70">
          The page you are trying to access does not exist or may
          have been moved within the Ecclesia Discipleship &
          Commissioning (EDC) platform.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-gold">
            Back Home
          </Link>

          <Link
            href="/login"
            className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}