import Link from "next/link";

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fdfaf4] p-8">
      <section className="w-full max-w-3xl border border-[#c9a84c]/20 bg-white/90 p-10 text-center">
        <p className="section-label">
          System Maintenance
        </p>

        <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
          Platform Under Maintenance
        </h1>

        <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#1c2b3a]/70">
          Ecclesia Discipleship & Commissioning (EDC) platform is
          currently undergoing scheduled maintenance and upgrades.
          Please check back shortly.
        </p>

        <div className="mt-8 inline-flex border border-[#c9a84c]/20 bg-[#fdfaf4] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
          TEMPORARILY UNAVAILABLE
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-gold">
            Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}