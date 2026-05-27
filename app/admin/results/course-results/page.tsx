import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";

export default async function AdminCourseResultsPage() {
  const supabase = await createClient();

  const { data: results, error } = await supabase
    .from("course_results")
    .select(`
      *,
      profiles:student_id (
        full_name,
        student_number
      )
    `)
    .order("academic_session", { ascending: false })
    .order("semester", { ascending: false })
    .order("course_code", { ascending: true });

  return (
    <AdminShell
      title="Course Results"
      subtitle="Review computed course grades, GPA data, and academic performance."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Computed Results
        </h2>

        {error && (
          <p className="mt-6 text-red-600">{error.message}</p>
        )}

        {!results || results.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No computed result found yet.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto">
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
                    Course
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Session
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Semester
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    CA
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Exam
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Total
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Grade
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    GPA Point
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.map((result: any) => (
                  <tr
                    key={result.id}
                    className="border-b border-[#c9a84c]/10"
                  >
                    <td className="py-4 font-semibold text-[#0b1f3a]">
                      {result.profiles?.full_name || "Unnamed"}
                    </td>

                    <td className="py-4 text-[#1c2b3a]/70">
                      {result.profiles?.student_number || "N/A"}
                    </td>

                    <td className="py-4 font-semibold text-[#0b1f3a]">
                      {result.course_code}
                    </td>

                    <td className="py-4 text-[#1c2b3a]/70">
                      {result.academic_session}
                    </td>

                    <td className="py-4 text-[#1c2b3a]/70">
                      {result.semester}
                    </td>

                    <td className="py-4 text-[#1c2b3a]/70">
                      {Number(result.assignment_score || 0).toFixed(1)}
                    </td>

                    <td className="py-4 text-[#1c2b3a]/70">
                      {Number(result.exam_score || 0).toFixed(1)}
                    </td>

                    <td className="py-4 font-semibold text-[#0b1f3a]">
                      {Number(result.total_score || 0).toFixed(1)}
                    </td>

                    <td className="py-4 font-bold text-[#c9a84c]">
                      {result.grade}
                    </td>

                    <td className="py-4 text-[#1c2b3a]/70">
                      {result.grade_point}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}