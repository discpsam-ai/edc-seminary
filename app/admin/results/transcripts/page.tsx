import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminTranscriptsPage() {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      student_number,
      level,
      current_semester
    `)
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  return (
    <AdminShell
      title="Transcript Engine"
      subtitle="Generate and review official student academic transcripts."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Student Transcript Records
        </h2>

        {error && (
          <p className="mt-6 text-red-600">{error.message}</p>
        )}

        {!students || students.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No student record found.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {students.map((student: any) => (
              <div
                key={student.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-6"
              >
                <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                  {student.full_name || "Unnamed Student"}
                </h3>

                <p className="mt-3 text-[#1c2b3a]/60">
                  Student ID:{" "}
                  {student.student_number || "N/A"}
                </p>

                <p className="mt-1 text-[#1c2b3a]/60">
                  {student.email}
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Level
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {student.level || "N/A"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Semester
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {student.current_semester || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/admin/results/print/${student.id}`}
                    className="btn-gold"
                  >
                    Open Transcript
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}