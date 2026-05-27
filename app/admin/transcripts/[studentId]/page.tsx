import AdminShell from "@/components/AdminShell";
import PrintButton from "@/components/PrintButton";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

function getClassification(cgpa: number) {
  if (cgpa >= 4.5) return "Distinction";
  if (cgpa >= 3.5) return "Upper Credit";
  if (cgpa >= 2.5) return "Lower Credit";
  if (cgpa >= 1.5) return "Pass";

  return "Probation";
}

export default async function AdminTranscriptPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      full_name,
      student_number,
      level,
      current_semester
    `)
    .eq("id", studentId)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: results } = await supabase
    .from("course_results")
    .select("*")
    .eq("student_id", studentId)
    .order("academic_session", { ascending: true })
    .order("semester", { ascending: true });

  const totalCredits =
    results?.reduce(
      (sum: number, item: any) =>
        sum + Number(item.credit_units || 0),
      0
    ) || 0;

  const totalQualityPoints =
    results?.reduce(
      (sum: number, item: any) =>
        sum + Number(item.quality_points || 0),
      0
    ) || 0;

  const cgpa =
    totalCredits > 0
      ? totalQualityPoints / totalCredits
      : 0;

  return (
    <AdminShell
      title="Academic Transcript"
      subtitle="Official institutional academic transcript."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-10">
        <div className="mb-8 flex justify-end">
          <PrintButton />
        </div>

        <div className="text-center">
          <p className="section-label">
            Ecclesia Discipleship & Commissioning
          </p>

          <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            Official Academic Transcript
          </h1>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student Name
            </p>

            <p className="mt-2 font-semibold text-[#0b1f3a]">
              {profile.full_name}
            </p>
          </div>

          <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student ID
            </p>

            <p className="mt-2 font-semibold text-[#0b1f3a]">
              {profile.student_number || "N/A"}
            </p>
          </div>

          <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Level
            </p>

            <p className="mt-2 font-semibold text-[#0b1f3a]">
              {profile.level || "N/A"}
            </p>
          </div>

          <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              CGPA
            </p>

            <p className="mt-2 font-semibold text-[#0b1f3a]">
              {cgpa.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-6 border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
            Classification
          </p>

          <p className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
            {getClassification(cgpa)}
          </p>
        </div>

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
                  Score
                </th>

                <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Grade
                </th>

                <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Units
                </th>

                <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  GPA Point
                </th>
              </tr>
            </thead>

            <tbody>
              {results?.map((result: any) => (
                <tr
                  key={result.id}
                  className="border-b border-[#c9a84c]/10"
                >
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
                    {Number(result.total_score || 0).toFixed(1)}
                  </td>

                  <td className="py-4 font-bold text-[#c9a84c]">
                    {result.grade}
                  </td>

                  <td className="py-4 text-[#1c2b3a]/70">
                    {result.credit_units}
                  </td>

                  <td className="py-4 text-[#1c2b3a]/70">
                    {result.grade_point}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}