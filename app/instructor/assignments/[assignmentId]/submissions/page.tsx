import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    assignmentId: string;
  }>;
};

export default async function InstructorAssignmentSubmissionsPage({
  params,
}: PageProps) {
  const { assignmentId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: assignment } = await supabase
    .from("assignments")
    .select(`
      *,
      grading_rubrics:rubric_id (
        title,
        total_marks,
        grading_rubric_items (*)
      )
    `)
    .eq("id", assignmentId)
    .single();

  const { data: assignedCourse } = await supabase
    .from("instructor_course_assignments")
    .select("id")
    .eq("instructor_id", user.id)
    .eq("course_code", assignment?.course_code)
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
            You cannot review submissions for an assignment outside your
            assigned courses.
          </p>

          <Link href="/instructor/assignments" className="btn-gold mt-6">
            Back to Assignments
          </Link>
        </section>
      </InstructorShell>
    );
  }

  const { data: submissions, error } = await supabase
    .from("assignment_submissions")
    .select(`
      *,
      profiles:student_id (
        full_name,
        student_number,
        email
      )
    `)
    .eq("assignment_id", assignmentId)
    .order("submitted_at", { ascending: false });

  async function gradeSubmission(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const submissionId = formData.get("submission_id") as string;
    const score = Number(formData.get("score"));
    const feedback = formData.get("feedback") as string;

    const { data: submission } = await supabase
      .from("assignment_submissions")
      .select(`
        assignment_id,
        assignments:assignment_id (
          course_code
        )
      `)
      .eq("id", submissionId)
      .single();

    const courseCode = (submission?.assignments as any)?.course_code;

    const { data: assignedCourse } = await supabase
      .from("instructor_course_assignments")
      .select("id")
      .eq("instructor_id", user.id)
      .eq("course_code", courseCode)
      .eq("assignment_status", "active")
      .maybeSingle();

    if (!assignedCourse) {
      throw new Error(
        "You cannot grade an assignment outside your assigned courses."
      );
    }

    const { error } = await supabase
      .from("assignment_submissions")
      .update({
        score,
        feedback,
        status: "graded",
        graded_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(`/instructor/assignments/${assignmentId}/submissions`);
  }

  return (
    <InstructorShell
      title="Assignment Submissions"
      subtitle="Review submissions, apply grading rubrics, and give feedback to students."
    >
      <section className="space-y-8">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-label">{assignment?.course_code}</p>

              <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
                {assignment?.title}
              </h2>

              <p className="mt-4 leading-8 text-[#1c2b3a]/70">
                {assignment?.description}
              </p>
            </div>

            <Link href="/instructor/assignments" className="btn-gold">
              Back
            </Link>
          </div>
        </div>

        {assignment?.grading_rubrics && (
          <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-8">
            <p className="section-label">Attached Rubric</p>

            <h3 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
              {assignment.grading_rubrics.title}
            </h3>

            <p className="mt-2 text-sm font-semibold text-[#c9a84c]">
              Total Marks: {assignment.grading_rubrics.total_marks}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {assignment.grading_rubrics.grading_rubric_items?.map(
                (item: any) => (
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
                )
              )}
            </div>
          </div>
        )}

        {error && <p className="text-red-600">{error.message}</p>}

        {!submissions || submissions.length === 0 ? (
          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <p className="text-[#1c2b3a]/70">
              No student has submitted this assignment yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission: any) => (
              <div
                key={submission.id}
                className="border border-[#c9a84c]/20 bg-white/90 p-8"
              >
                <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                  {submission.profiles?.full_name || "Unnamed Student"}
                </h3>

                <p className="mt-2 text-sm text-[#1c2b3a]/60">
                  Student ID:{" "}
                  {submission.profiles?.student_number || "Not assigned"}
                </p>

                <div className="mt-6 border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Submission Text
                  </p>

                  <p className="mt-3 whitespace-pre-wrap leading-8 text-[#1c2b3a]/70">
                    {submission.submission_text || "No written response."}
                  </p>
                </div>

                {submission.file_url && (
                  <a
                    href={submission.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold mt-5"
                  >
                    Open Submitted File
                  </a>
                )}

                <form action={gradeSubmission} className="mt-8 grid gap-5">
                  <input
                    type="hidden"
                    name="submission_id"
                    value={submission.id}
                  />

                  <input
                    type="number"
                    name="score"
                    min="0"
                    max={assignment?.grading_rubrics?.total_marks || 100}
                    defaultValue={submission.score || ""}
                    required
                    placeholder="Score"
                    className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                  />

                  <textarea
                    name="feedback"
                    defaultValue={submission.feedback || ""}
                    placeholder="Instructor feedback..."
                    className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                  />

                  <button type="submit" className="btn-gold">
                    Save Grade
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