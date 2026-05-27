import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    examId: string;
  }>;
};

export default async function ExamSubmissionsPage({ params }: PageProps) {
  const { examId } = await params;

  const supabase = await createClient();

  const { data: exam } = await supabase
    .from("exams")
    .select("*")
    .eq("id", examId)
    .single();

  const { data: submissions, error } = await supabase
    .from("exam_submissions")
    .select(`
      *,
      profiles:student_id (
        full_name,
        email
      )
    `)
    .eq("exam_id", examId)
    .order("submitted_at", { ascending: false });

  async function saveManualGrade(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const submissionId = formData.get("submission_id") as string;
    const manualScore = Number(formData.get("manual_score") || 0);
    const autoScore = Number(formData.get("auto_score") || 0);
    const feedback = formData.get("feedback") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    await supabase
      .from("exam_submissions")
      .update({
        manual_score: manualScore,
        total_score: autoScore + manualScore,
        feedback,
        status: "graded",
        graded_at: new Date().toISOString(),
        graded_by: user.id,
      })
      .eq("id", submissionId);

    revalidatePath(`/instructor/exams/${examId}/submissions`);
  }

  return (
    <InstructorShell
      title="Assessment Submissions"
      subtitle="Review student assessment submissions, objective scores, theory answers, and manual grades."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <Link
          href="/instructor/exams"
          className="text-sm font-bold uppercase tracking-[0.15em] text-[#c9a84c]"
        >
          ← Back to Assessments
        </Link>

        {exam && (
          <div className="mt-6">
            <p className="section-label">{exam.course_code}</p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              {exam.title}
            </h2>

            <p className="mt-3 text-[#1c2b3a]/70">{exam.description}</p>
          </div>
        )}

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!submissions || submissions.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No student has submitted this assessment yet.
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            {submissions.map((submission: any) => (
              <div
                key={submission.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {submission.profiles?.full_name || "Unnamed Student"}
                    </h3>

                    <p className="mt-1 text-sm text-[#1c2b3a]/60">
                      {submission.profiles?.email}
                    </p>

                    <p className="mt-2 text-sm text-[#1c2b3a]/60">
                      Submitted:{" "}
                      {submission.submitted_at
                        ? new Date(submission.submitted_at).toLocaleString()
                        : "Not submitted"}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {submission.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Auto Score
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {submission.auto_score || 0}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Manual Score
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {submission.manual_score ?? "Pending"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Total Score
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {submission.total_score ?? submission.auto_score ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href={`/instructor/exams/${examId}/submissions/${submission.id}`}
                    className="btn-gold"
                  >
                    Review Answers
                  </Link>
                </div>

                <form action={saveManualGrade} className="mt-6 grid gap-4">
                  <input
                    type="hidden"
                    name="submission_id"
                    value={submission.id}
                  />

                  <input
                    type="hidden"
                    name="auto_score"
                    value={submission.auto_score || 0}
                  />

                  <input
                    type="number"
                    name="manual_score"
                    defaultValue={submission.manual_score ?? ""}
                    placeholder="Manual theory score"
                    className="border border-[#c9a84c]/30 bg-white p-4 outline-none"
                  />

                  <textarea
                    name="feedback"
                    defaultValue={submission.feedback ?? ""}
                    placeholder="Instructor feedback"
                    className="min-h-32 border border-[#c9a84c]/30 bg-white p-4 outline-none"
                  />

                  <button type="submit" className="btn-gold">
                    Save Manual Grade
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </InstructorShell>
  );
}