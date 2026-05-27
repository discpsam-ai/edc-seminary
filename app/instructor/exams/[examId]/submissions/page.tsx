import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    examId: string;
  }>;
};

export default async function InstructorExamSubmissionsPage({
  params,
}: PageProps) {
  const { examId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: exam } = await supabase
    .from("exams")
    .select(`
      *,
      grading_rubrics:rubric_id (
        title,
        total_marks,
        grading_rubric_items (*)
      )
    `)
    .eq("id", examId)
    .single();

  const { data: assignedCourse } = await supabase
    .from("instructor_course_assignments")
    .select("id")
    .eq("instructor_id", user.id)
    .eq("course_code", exam?.course_code)
    .eq("assignment_status", "active")
    .maybeSingle();

  if (!assignedCourse) {
    return (
      <InstructorShell
        title="Access Denied"
        subtitle="You are not assigned to this course."
      >
        <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <p className="text-[#1c2b3a]/70">
            You cannot review submissions for an assessment outside your
            assigned courses.
          </p>

          <Link href="/instructor/exams" className="btn-gold mt-6">
            Back to Exams
          </Link>
        </section>
      </InstructorShell>
    );
  }

  const { data: submissions, error } = await supabase
    .from("exam_submissions")
    .select(`
      *,
      profiles:student_id (
        full_name,
        student_number,
        email
      )
    `)
    .eq("exam_id", examId)
    .order("submitted_at", { ascending: false });

  return (
    <InstructorShell
      title="Assessment Submissions"
      subtitle="Review examination attempts, rubric expectations, and student performance."
    >
      <section className="space-y-8">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-label">{exam?.course_code}</p>

              <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
                {exam?.title}
              </h2>

              <p className="mt-4 leading-8 text-[#1c2b3a]/70">
                {exam?.description}
              </p>
            </div>

            <Link href="/instructor/exams" className="btn-gold">
              Back
            </Link>
          </div>
        </div>

        {exam?.grading_rubrics && (
          <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-8">
            <p className="section-label">Attached Rubric</p>

            <h3 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
              {exam.grading_rubrics.title}
            </h3>

            <p className="mt-2 text-sm font-semibold text-[#c9a84c]">
              Total Marks: {exam.grading_rubrics.total_marks}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {exam.grading_rubrics.grading_rubric_items?.map((item: any) => (
                <div
                  key={item.id}
                  className="border border-[#c9a84c]/20 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-[#0b1f3a]">
                      {item.criterion}
                    </h4>

                    <span className="text-sm font-bold text-[#c9a84c]">
                      {item.max_marks} marks
                    </span>
                  </div>

                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-[#1c2b3a]/70">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-600">{error.message}</p>}

        {!submissions || submissions.length === 0 ? (
          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <p className="text-[#1c2b3a]/70">No student submission yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission: any) => (
              <div
                key={submission.id}
                className="border border-[#c9a84c]/20 bg-white/90 p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                      {submission.profiles?.full_name}
                    </h3>

                    <p className="mt-2 text-sm text-[#1c2b3a]/60">
                      Student ID:{" "}
                      {submission.profiles?.student_number || "Not assigned"}
                    </p>

                    <p className="mt-1 text-sm text-[#1c2b3a]/50">
                      {submission.profiles?.email}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-[#fdfaf4] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {submission.status || "submitted"}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-[#1c2b3a]/60">
                      Submitted Score
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-[#0b1f3a]">
                      {submission.score ?? 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#1c2b3a]/60">Submitted At</p>

                    <p className="mt-1 font-semibold text-[#0b1f3a]">
                      {submission.submitted_at
                        ? new Date(submission.submitted_at).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#1c2b3a]/60">Attempt Status</p>

                    <p className="mt-1 font-semibold capitalize text-[#0b1f3a]">
                      {submission.status || "submitted"}
                    </p>
                  </div>
                </div>

                {submission.feedback && (
                  <div className="mt-6 border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Feedback
                    </p>

                    <p className="mt-3 whitespace-pre-wrap leading-8 text-[#1c2b3a]/70">
                      {submission.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </InstructorShell>
  );
}