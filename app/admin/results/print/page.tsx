import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminPrintResultsPage() {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, student_number")
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  return (
    <AdminShell
      title="Print Result Slips"
      subtitle="Select a student and print official academic result slips."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Select Student
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!students || students.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">No student found.</p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {students.map((student: any) => (
              <div
                key={student.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
              >
                <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  {student.full_name || "Unnamed Student"}
                </h3>

                <p className="mt-2 text-sm text-[#1c2b3a]/60">
                  Student ID: {student.student_number || "Not assigned"}
                </p>

                <p className="mt-1 text-sm text-[#1c2b3a]/60">
                  {student.email}
                </p>

                <Link
                  href={`/admin/results/print/${student.id}`}
                  className="btn-gold mt-5 inline-block"
                >
                  Print Result Slip
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}