import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fdfaf4] p-8">
      <section className="w-full max-w-3xl border border-red-200 bg-white/90 p-10 text-center">
        <p className="section-label text-red-600">
          Access Restricted
        </p>

        <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
          Unauthorized Access
        </h1>

        <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#1c2b3a]/70">
          You do not have permission to access this section of the
          Ecclesia Discipleship & Commissioning (EDC) portal.
        </p>

        <div className="mt-8 inline-flex border border-red-500/20 bg-red-50 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-red-700">
          ACCESS DENIED
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-gold">
            Back Home
          </Link>

          <Link
            href="/login"
            className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
          >
            Login Again
          </Link>
        </div>
      </section>
    </main>
  );
}