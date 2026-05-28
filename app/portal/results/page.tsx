import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ResultsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: results, error } = await supabase
    .from("course_results")
    .select(`
      *,
      courses:course_id (
        title,
        course_code
      )
    `)
    .eq("student_id", user.id)
    .eq("publication_status", "published")
    .eq("result_visibility", true)
    .order("academic_session", {
      ascending: false,
    })
    .order("semester", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  const { data: cgpaData } = await supabase.rpc(
    "compute_student_cgpa",
    {
      student_input: user.id,
    }
  );

  const cgpaRecord = cgpaData?.[0];

  const cgpa = Number(
    cgpaRecord?.cgpa || 0
  ).toFixed(2);

  const totalCourses =
    Number(cgpaRecord?.total_courses || 0);

  const distinctionCourses =
    results?.filter(
      (item: any) => item.grade === "A"
    ).length || 0;

  return (
    <PortalShell
      title="Academic Results"
      subtitle="Review officially released academic records, grades, GPA, and transcript-ready performance analytics."
    >
      <section className="grid gap-6 md:grid-cols-3">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            Academic Analytics
          </p>

          <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            {totalCourses}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Published Courses
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
            {distinctionCourses}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Distinction Courses
          </p>
        </div>
      </section>

      <section className="mt-10 border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Examination Office
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Published Academic Results
            </h2>
          </div>

          <span className="border border-green-300 bg-green-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-green-700">
            Officially Released
          </span>
        </div>

        {error && (
          <p className="mt-8 text-red-600">
            {error.message}
          </p>
        )}

        {!results || results.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No published academic result available yet.
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
                    Session
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Semester
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Assignment
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
                    GPA
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Remark
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
                        {result.course_code ||
                          result.courses?.course_code ||
                          "N/A"}
                      </p>

                      <p className="mt-1 text-sm text-[#1c2b3a]/60">
                        {result.courses?.title ||
                          "Untitled Course"}
                      </p>
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {result.academic_session ||
                        "N/A"}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {result.semester || "N/A"}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {result.assignment_score ??
                        "N/A"}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {result.exam_score ?? "N/A"}
                    </td>

                    <td className="py-5 font-semibold text-[#0b1f3a]">
                      {result.total_score ?? "N/A"}
                    </td>

                    <td className="py-5">
                      <span className="border border-[#c9a84c]/20 bg-[#fdfaf4] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]">
                        {result.grade || "N/A"}
                      </span>
                    </td>

                    <td className="py-5 font-semibold text-[#0b1f3a]">
                      {result.grade_point ?? "N/A"}
                    </td>

                    <td className="py-5">
                      <span
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                          result.remark === "Passed"
                            ? "border border-green-300 bg-green-50 text-green-700"
                            : "border border-red-300 bg-red-50 text-red-700"
                        }`}
                      >
                        {result.remark || "N/A"}
                      </span>
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