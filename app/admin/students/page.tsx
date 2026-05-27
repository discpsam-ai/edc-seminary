import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const { data: students, error } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        email,
        student_number,
        level,
        current_semester,
        role,
        created_at
      `)
      .or(
        "role.eq.student,roles.cs.{student}"
      )
      .order("full_name", {
        ascending: true,
      });

  return (
    <AdminShell
      title="Student Management"
      subtitle="Manage student records, institutional identity, attendance, academic participation, and formation progress."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Institutional Administration
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Student Records
            </h2>
          </div>

          <Link
            href="/admin/admissions"
            className="btn-gold"
          >
            Add / Admit Student
          </Link>
        </div>

        {error && (
          <p className="mb-6 text-red-600">
            {error.message}
          </p>
        )}

        {!students ||
        students.length === 0 ? (
          <p className="text-[#1c2b3a]/70">
            No student record found yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/20 text-left">
                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Student
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Student ID
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Email
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Level
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Semester
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Status
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Joined
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map(
                  (student: any) => (
                    <tr
                      key={student.id}
                      className="border-b border-[#c9a84c]/10"
                    >
                      <td className="py-5 font-semibold text-[#0b1f3a]">
                        {student.full_name ||
                          "Unnamed Student"}
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {student.student_number ||
                          "Not assigned"}
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {student.email ||
                          "No email"}
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {student.level ||
                          "Not set"}
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {student.current_semester ||
                          "Not set"}
                      </td>

                      <td className="py-5">
                        <span className="border border-[#c9a84c]/30 bg-[#fdfaf4] px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                          {student.role ||
                            "student"}
                        </span>
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {student.created_at
                          ? new Date(
                              student.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="py-5">
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={`/admin/students/${student.id}`}
                            className="btn-gold"
                          >
                            View
                          </Link>

                          <Link
                            href={`/admin/results/print/${student.id}`}
                            className="border border-[#c9a84c]/30 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a] transition hover:bg-[#f7f3ec]"
                          >
                            Result
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}