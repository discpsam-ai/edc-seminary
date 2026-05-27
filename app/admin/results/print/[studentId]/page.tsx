import AdminShell from "@/components/AdminShell";
import PrintButton from "@/components/PrintButton";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";

function getClassification(cgpa: number) {
  if (cgpa >= 4.5) return "Distinction";
  if (cgpa >= 3.5) return "Upper Credit";
  if (cgpa >= 2.5) return "Lower Credit";
  if (cgpa >= 1.5) return "Pass";

  return "Probation";
}

export default async function AdminStudentResultSlipPage({
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
      current_semester,
      passport_url
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
      title="Printable Result Slip"
      subtitle="Official student academic result record."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-10">
        <div className="mb-8 flex justify-end">
          <PrintButton />
        </div>

        <div className="text-center">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="EDC Logo"
              width={90}
              height={90}
              className="h-20 w-auto"
            />
          </div>

          <p className="mt-5 section-label">
            Ecclesia Discipleship & Commissioning
          </p>

          <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            Official Result Slip
          </h1>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="grid gap-4 md:grid-cols-2">
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
                {profile.student_number || "Not assigned"}
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
                Semester
              </p>

              <p className="mt-2 font-semibold text-[#0b1f3a]">
                {profile.current_semester || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex h-40 w-32 items-center justify-center overflow-hidden border border-[#c9a84c]/30 bg-[#f7f3ec]">
            {profile.passport_url ? (
              <Image
                src={profile.passport_url}
                alt="Student Passport"
                width={300}
                height={400}
                className="h-full w-full object-cover"
              />
            ) : (
              <p className="text-center text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/40">
                Passport
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-[#c9a84c]/20 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              CGPA
            </p>

            <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
              {cgpa.toFixed(2)}
            </p>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Credit Units
            </p>

            <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
              {totalCredits}
            </p>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Classification
            </p>

            <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
              {getClassification(cgpa)}
            </p>
          </div>
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
                  Total
                </th>

                <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Grade
                </th>

                <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Units
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

                  <td className="py-4 font-semibold text-[#0b1f3a]">
                    {Number(result.total_score || 0).toFixed(1)}
                  </td>

                  <td className="py-4 font-bold text-[#c9a84c]">
                    {result.grade}
                  </td>

                  <td className="py-4 text-[#1c2b3a]/70">
                    {result.credit_units}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <div className="mt-12 border-t border-[#0b1f3a] pt-3 text-center text-sm">
              Academic Officer
            </div>
          </div>

          <div>
            <div className="mt-12 border-t border-[#0b1f3a] pt-3 text-center text-sm">
              Registrar
            </div>
          </div>
        </footer>
      </section>
    </AdminShell>
  );
}