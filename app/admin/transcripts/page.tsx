import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

function getClassification(cgpa: number) {
  if (cgpa >= 4.5) return "First Class";
  if (cgpa >= 3.5) return "Second Class Upper (2:1)";
  if (cgpa >= 2.4) return "Second Class Lower (2:2)";
  if (cgpa >= 1.5) return "Third Class";
  if (cgpa >= 1.0) return "Pass";
  return "Fail";
}

export default async function AdminTranscriptsPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const { student } = await searchParams;
  const selectedStudentId = student;

  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, email, level")
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  const selectedStudent = students?.find(
    (student: any) => student.id === selectedStudentId
  );

  const { data: results, error } = selectedStudentId
    ? await supabase
        .from("course_results")
        .select("*")
        .eq("student_id", selectedStudentId)
        .order("academic_session", { ascending: true })
        .order("semester", { ascending: true })
        .order("course_code", { ascending: true })
    : { data: [], error: null };

  const totalCreditUnits =
    results?.reduce(
      (sum: number, item: any) => sum + Number(item.credit_units || 0),
      0
    ) || 0;

  const totalQualityPoints =
    results?.reduce(
      (sum: number, item: any) => sum + Number(item.quality_points || 0),
      0
    ) || 0;

  const cgpa =
    totalCreditUnits > 0 ? totalQualityPoints / totalCreditUnits : 0;

  const classification = getClassification(cgpa);

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Admin Records</p>

            <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              Student Transcripts
            </h1>

            <p className="mt-3 max-w-2xl text-[#1c2b3a]/70">
              View student academic records, CGPA, classification, and course result history.
            </p>
          </div>

          <Link href="/admin/dashboard" className="btn-gold">
            Back to Admin
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.45fr_1fr]">
          <aside className="border border-[#c9a84c]/20 bg-white p-6">
            <h2 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
              Students
            </h2>

            {!students || students.length === 0 ? (
              <p className="mt-6 text-[#1c2b3a]/70">
                No student profile found.
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                {students.map((student: any) => (
                  <Link
                    key={student.id}
                    href={`/admin/transcripts?student=${student.id}`}
                    className={`block border px-4 py-3 transition ${
                      selectedStudentId === student.id
                        ? "border-[#c9a84c] bg-[#fdfaf4] text-[#0b1f3a]"
                        : "border-[#c9a84c]/10 text-[#1c2b3a]/70 hover:border-[#c9a84c]/40"
                    }`}
                  >
                    <p className="font-semibold">{student.full_name}</p>
                    <p className="text-xs">{student.email}</p>
                  </Link>
                ))}
              </div>
            )}
          </aside>

          <section className="border border-[#c9a84c]/20 bg-white p-8">
            {!selectedStudentId ? (
              <p className="text-[#1c2b3a]/70">
                Select a student to view transcript.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p className="section-label">Academic Transcript</p>

                    <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
                      {selectedStudent?.full_name || "Student"}
                    </h2>

                    <p className="mt-2 text-[#1c2b3a]/60">
                      {selectedStudent?.email}
                    </p>

                    <p className="mt-1 text-[#1c2b3a]/60">
                      Level: {selectedStudent?.level || "Not assigned"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-5 text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      CGPA
                    </p>

                    <Link
                      href={`/admin/transcripts/${selectedStudentId}`}
                      className="btn-gold mt-4 inline-block"
                    >
                      Open Printable Transcript
                    </Link>

                    <p className="mt-2 text-4xl font-bold text-[#0b1f3a]">
                      {cgpa.toFixed(2)}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#c9a84c]">
                      {classification}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Total Credit Units
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {totalCreditUnits}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Total Quality Points
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {totalQualityPoints.toFixed(2)}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Classification
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[#0b1f3a]">
                      {classification}
                    </p>
                  </div>
                </div>

                {error && <p className="mt-6 text-red-600">{error.message}</p>}

                {!results || results.length === 0 ? (
                  <p className="mt-8 text-[#1c2b3a]/70">
                    No course result has been recorded for this student yet.
                  </p>
                ) : (
                  <div className="mt-8 overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#c9a84c]/20 bg-[#fdfaf4]">
                          <th className="p-4">Course</th>
                          <th className="p-4">Session</th>
                          <th className="p-4">Semester</th>
                          <th className="p-4">Credit Units</th>
                          <th className="p-4">Total</th>
                          <th className="p-4">Grade</th>
                          <th className="p-4">GP</th>
                          <th className="p-4">QP</th>
                        </tr>
                      </thead>

                      <tbody>
                        {results.map((result: any) => (
                          <tr
                            key={result.id}
                            className="border-b border-[#c9a84c]/10"
                          >
                            <td className="p-4 font-semibold text-[#0b1f3a]">
                              {result.course_code}
                            </td>
                            <td className="p-4 text-[#1c2b3a]/70">
                              {result.academic_session}
                            </td>
                            <td className="p-4 text-[#1c2b3a]/70">
                              {result.semester}
                            </td>
                            <td className="p-4 text-[#1c2b3a]/70">
                              {result.credit_units}
                            </td>
                            <td className="p-4 text-[#1c2b3a]/70">
                              {result.total_score}
                            </td>
                            <td className="p-4 font-semibold text-[#0b1f3a]">
                              {result.grade}
                            </td>
                            <td className="p-4 text-[#1c2b3a]/70">
                              {result.grade_point}
                            </td>
                            <td className="p-4 text-[#1c2b3a]/70">
                              {result.quality_points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}