import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ResultsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: results, error } =
    await supabase
      .from("computed_results")
      .select(`
        *,
        courses:course_id (
          title,
          course_code
        )
      `)
      .eq("student_id", user.id)
      .order("created_at", {
        ascending: false,
      });

  const totalGPA =
    results?.reduce(
      (sum: number, item: any) =>
        sum + (item.gpa || 0),
      0
    ) || 0;

  const cgpa =
    results && results.length > 0
      ? (
          totalGPA / results.length
        ).toFixed(2)
      : "0.00";

  return (
    <PortalShell
      title="Academic Results"
      subtitle="Review computed academic records, grades, GPA, and transcript-ready performance analytics."
    >
      <section className="grid gap-6 md:grid-cols-3">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            Academic Analytics
          </p>

          <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            {results?.length || 0}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Total Courses
          </p>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            Academic Analytics
          </p>

          <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            {cgpa}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Current CGPA
          </p>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            Academic Analytics
          </p>

          <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            {results?.filter(
              (item: any) =>
                item.grade === "A"
            ).length || 0}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Distinction Courses
          </p>
        </div>
      </section>

      <section className="mt-10 border border-[#c9a84c]/20 bg-white p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Computed Academic Results
        </h2>

        {error && (
          <p className="mt-8 text-red-600">
            {error.message}
          </p>
        )}

        {!results ||
        results.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No academic result available yet.
          </p>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/20 text-left">
                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Course
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Assignment
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Exam
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Attendance
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Total
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Grade
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    GPA
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.map((result: any) => (
                  <tr
                    key={result.id}
                    className="border-b border-[#c9a84c]/10"
                  >
                    <td className="py-5">
                      <p className="font-semibold text-[#0b1f3a]">
                        {
                          result.courses
                            ?.course_code
                        }
                      </p>

                      <p className="mt-1 text-sm text-[#1c2b3a]/60">
                        {
                          result.courses
                            ?.title
                        }
                      </p>
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {
                        result.assignment_score
                      }
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {result.exam_score}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {
                        result.attendance_score
                      }
                    </td>

                    <td className="py-5 font-semibold text-[#0b1f3a]">
                      {result.total_score}
                    </td>

                    <td className="py-5">
                      <span className="border border-[#c9a84c]/20 bg-[#fdfaf4] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]">
                        {result.grade}
                      </span>
                    </td>

                    <td className="py-5 font-semibold text-[#0b1f3a]">
                      {result.gpa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PortalShell>
  );
}