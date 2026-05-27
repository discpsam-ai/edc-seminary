import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminIdCardsPage() {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, level, student_number, passport_url")
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Student Identity</p>

            <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              Student ID Cards
            </h1>

            <p className="mt-3 max-w-3xl text-[#1c2b3a]/70">
              View and print official EDC Seminary student identity cards.
            </p>
          </div>

          <Link href="/admin/dashboard" className="btn-gold">
            Back to Admin
          </Link>
        </div>

        {error && <p className="text-red-600">{error.message}</p>}

        {!students || students.length === 0 ? (
          <p className="text-[#1c2b3a]/70">No student profile found.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student: any) => (
              <div
                key={student.id}
                className="border border-[#c9a84c]/20 bg-white/90 p-5"
              >
                <h2 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  {student.full_name}
                </h2>

                <p className="mt-2 text-sm text-[#1c2b3a]/60">
                  Student ID: {student.student_number || "Not assigned"}
                </p>

                <p className="mt-1 text-sm text-[#1c2b3a]/60">
                  Level: {student.level || "Not assigned"}
                </p>

                <div className="mt-5">
                  <Link
                    href={`/admin/id-cards/${student.id}`}
                    className="btn-gold"
                  >
                    Open ID Card
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}