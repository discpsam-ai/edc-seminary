import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminExamsPage() {
  const supabase = await createClient();

  const { data: exams, error } = await supabase
    .from("exams")
    .select(`
      *,
      grading_rubrics:rubric_id (
        title,
        total_marks
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <AdminShell
      title="Tests & Exams Management"
      subtitle="Manage institutional assessments, examination schedules, submissions, rubrics, and grading oversight."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Assessment Records
          </h2>

          <Link href="/admin/exams/create" className="btn-gold">
            Create Assessment
          </Link>
        </div>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!exams || exams.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No test or examination has been created yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/20 text-left">
                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Course
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Assessment
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Type
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Rubric
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Status
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {exams.map((exam: any) => (
                  <tr
                    key={exam.id}
                    className="border-b border-[#c9a84c]/10"
                  >
                    <td className="py-5 font-semibold text-[#0b1f3a]">
                      {exam.course_code}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {exam.title}
                    </td>

                    <td className="py-5 capitalize text-[#1c2b3a]/70">
                      {exam.exam_type}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {exam.grading_rubrics?.title || "No rubric"}
                    </td>

                    <td className="py-5">
                      <span className="border border-[#c9a84c]/30 bg-[#fdfaf4] px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                        {exam.status}
                      </span>
                    </td>

                    <td className="py-5">
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/admin/exams/${exam.id}/questions`}
                          className="btn-gold"
                        >
                          Questions
                        </Link>

                        <Link
                          href={`/admin/exams/${exam.id}/submissions`}
                          className="border border-[#c9a84c]/30 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a] transition hover:bg-[#f7f3ec]"
                        >
                          Submissions
                        </Link>
                      </div>
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