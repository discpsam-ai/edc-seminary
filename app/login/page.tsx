import Link from "next/link";

export default function LoginSelectorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ec] px-6 py-16">
      <section className="w-full max-w-6xl">
        <div className="text-center">
          <p className="section-label">
            Ecclesia Discipleship & Commissioning
          </p>

          <h1 className="mt-4 font-edc-serif text-6xl font-semibold text-[#0b1f3a]">
            Portal Access
          </h1>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-[#1c2b3a]/70">
            Access the EDC institutional system through your assigned academic
            or administrative portal.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          <Link
            href="/student/login"
            className="border border-[#c9a84c]/20 bg-white p-10 transition hover:border-[#c9a84c]"
          >
            <p className="section-label">
              Student Access
            </p>

            <h2 className="mt-4 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Student Portal
            </h2>

            <p className="mt-5 leading-7 text-[#1c2b3a]/70">
              Access course registration, results, transcript, and academic
              records using your student ID.
            </p>
          </Link>

          <Link
            href="/instructor/login"
            className="border border-[#c9a84c]/20 bg-white p-10 transition hover:border-[#c9a84c]"
          >
            <p className="section-label">
              Instructor Access
            </p>

            <h2 className="mt-4 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Instructor Portal
            </h2>

            <p className="mt-5 leading-7 text-[#1c2b3a]/70">
              Manage teaching assignments, enrolled students, and result
              uploads using your instructor ID.
            </p>
          </Link>

          <Link
            href="/admin/login"
            className="border border-[#c9a84c]/20 bg-white p-10 transition hover:border-[#c9a84c]"
          >
            <p className="section-label">
              Administrative Access
            </p>

            <h2 className="mt-4 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Admin Portal
            </h2>

            <p className="mt-5 leading-7 text-[#1c2b3a]/70">
              Manage institutional operations, admissions, academic systems,
              and platform administration.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}