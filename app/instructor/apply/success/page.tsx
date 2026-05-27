import Link from "next/link";

export default function InstructorApplicationSuccessPage() {
  return (
    <main className="min-h-screen bg-[#fdfaf4] px-6 py-20">
      <section className="mx-auto max-w-3xl border border-[#c9a84c]/20 bg-white/90 p-10 text-center">
        <p className="section-label">Application Submitted</p>

        <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
          Your Instructor Application Has Been Received
        </h1>

        <p className="mt-6 leading-8 text-[#1c2b3a]/70">
          Thank you for applying to serve as an EDC instructor. Your application
          will be reviewed by the academic leadership.
        </p>

        <Link href="/" className="btn-gold mt-8">
          Return Home
        </Link>
      </section>
    </main>
  );
}