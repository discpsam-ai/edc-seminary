import PortalShell from "@/components/PortalShell";
import PrintButton from "@/components/PrintButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TranscriptPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `
      full_name,
      email,
      student_number,
      level,
      admission_set,
      current_semester,
      cohort_name
    `
    )
    .eq("id", user.id)
    .single();

  const { data: results, error } = await supabase
    .from("course_results")
    .select("*")
    .eq("student_id", user.id)
    .eq("publication_status", "published")
    .eq("result_visibility", true)
    .order("academic_session", {
      ascending: true,
    })
    .order("semester", {
      ascending: true,
    })
    .order("course_code", {
      ascending: true,
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

  const totalCredits = Number(
    cgpaRecord?.total_credit_units || 0
  );

  const totalQualityPoints = Number(
    cgpaRecord?.total_quality_points || 0
  );

  const classification =
    cgpaRecord?.classification || "No Result";

  return (
    <PortalShell
      title="Academic Transcript"
      subtitle="Official institutional academic transcript and cumulative performance record."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-10">
        <div className="mb-8 flex justify-end print:hidden">
          <PrintButton />
        </div>

        <div className="border-b border-[#c9a84c]/20 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="section-label">
                Ecclesia Discipleship & Commissioning
              </p>

              <h2 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
                Official Transcript
              </h2>

              <p className="mt-3 text-[#1c2b3a]/60">
                Official student academic record
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Academic Record
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#c9a84c]">
                CGPA: {cgpa}
              </h3>

              <p className="mt-2 text-sm font-semibold text-[#0b1f3a]">
                {classification}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student Name
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.full_name || "N/A"}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student ID
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.student_number || "N/A"}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Admission Set
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.admission_set || "N/A"}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Current Semester
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.current_semester || "N/A"}
            </h3>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="border border-[#c9a84c]/20 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
              Total Courses
            </p>

            <p className="mt-2 text-2xl font-bold text-[#0b1f3a]">
              {totalCourses}
            </p>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
              Credit Units
            </p>

            <p className="mt-2 text-2xl font-bold text-[#0b1f3a]">
              {totalCredits}
            </p>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
              Quality Points
            </p>

            <p className="mt-2 text-2xl font-bold text-[#0b1f3a]">
              {totalQualityPoints}
            </p>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
              Classification
            </p>

            <p className="mt-2 text-lg font-bold text-[#0b1f3a]">
              {classification}
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#0b1f3a] text-white">
                <th className="border border-[#c9a84c]/20 p-3">
                  Course
                </th>

                <th className="border border-[#c9a84c]/20 p-3">
                  Session
                </th>

                <th className="border border-[#c9a84c]/20 p-3">
                  Semester
                </th>

                <th className="border border-[#c9a84c]/20 p-3">
                  CA
                </th>

                <th className="border border-[#c9a84c]/20 p-3">
                  Exam
                </th>

                <th className="border border-[#c9a84c]/20 p-3">
                  Total
                </th>

                <th className="border border-[#c9a84c]/20 p-3">
                  Grade
                </th>

                <th className="border border-[#c9a84c]/20 p-3">
                  GP
                </th>

                <th className="border border-[#c9a84c]/20 p-3">
                  Units
                </th>

                <th className="border border-[#c9a84c]/20 p-3">
                  QP
                </th>

                <th className="border border-[#c9a84c]/20 p-3">
                  Remark
                </th>
              </tr>
            </thead>

            <tbody>
              {error ? (
                <tr>
                  <td
                    colSpan={11}
                    className="border border-[#c9a84c]/20 p-5 text-center text-red-600"
                  >
                    {error.message}
                  </td>
                </tr>
              ) : !results || results.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="border border-[#c9a84c]/20 p-5 text-center text-[#1c2b3a]/60"
                  >
                    No published result has been recorded yet.
                  </td>
                </tr>
              ) : (
                results.map((result: any) => (
                  <tr key={result.id}>
                    <td className="border border-[#c9a84c]/20 p-3 font-semibold">
                      {result.course_code || "N/A"}
                    </td>

                    <td className="border border-[#c9a84c]/20 p-3">
                      {result.academic_session || "N/A"}
                    </td>

                    <td className="border border-[#c9a84c]/20 p-3">
                      {result.semester || "N/A"}
                    </td>

                    <td className="border border-[#c9a84c]/20 p-3">
                      {result.assignment_score ?? "N/A"}
                    </td>

                    <td className="border border-[#c9a84c]/20 p-3">
                      {result.exam_score ?? "N/A"}
                    </td>

                    <td className="border border-[#c9a84c]/20 p-3 font-semibold">
                      {result.total_score ?? "N/A"}
                    </td>

                    <td className="border border-[#c9a84c]/20 p-3 font-bold">
                      {result.grade || "N/A"}
                    </td>

                    <td className="border border-[#c9a84c]/20 p-3">
                      {result.grade_point ?? "N/A"}
                    </td>

                    <td className="border border-[#c9a84c]/20 p-3">
                      {result.credit_units ?? "N/A"}
                    </td>

                    <td className="border border-[#c9a84c]/20 p-3">
                      {result.quality_points ?? "N/A"}
                    </td>

                    <td className="border border-[#c9a84c]/20 p-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${
                          result.remark === "Passed"
                            ? "border border-green-300 bg-green-50 text-green-700"
                            : "border border-red-300 bg-red-50 text-red-700"
                        }`}
                      >
                        {result.remark || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PortalShell>
  );
}