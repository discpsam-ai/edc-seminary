"use client";
import { toast } from "sonner";
import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function InstructorSubmissionsPage() {
  const supabase = createClient();

  const [submissions, setSubmissions] =
    useState<any[]>([]);

  const [scores, setScores] = useState<{
    [key: string]: string;
  }>({});

  const [feedbacks, setFeedbacks] =
    useState<{
      [key: string]: string;
    }>({});

  async function loadSubmissions() {
    const { data } = await supabase
      .from("assignment_submissions")
      .select(`
        *,
        assignments:assignment_id (
          title,
          course_code
        ),
        students:student_id (
          full_name,
          student_number
        )
      `)
      .order("submitted_at", {
        ascending: false,
      });

    setSubmissions(data || []);
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function handleGrade(
    submissionId: string
  ) {
    await supabase
      .from("assignment_submissions")
      .update({
        score: Number(
          scores[submissionId] || 0
        ),

        feedback:
          feedbacks[submissionId] || "",
      })
      .eq("id", submissionId);

    toast.success(
  "Submission graded successfully"
);

    await loadSubmissions();
  }

  return (
    <InstructorShell
      title="Assignment Submissions"
      subtitle="Review student submissions, evaluate assignments, provide academic feedback, and monitor assessment workflow."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Academic Assessment
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Student Submissions
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Total Submissions
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {submissions.length}
            </h3>
          </div>
        </div>

        {submissions.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No submission uploaded yet.
          </p>
        ) : (
          <div className="mt-10 space-y-5">
            {submissions.map(
              (submission) => (
                <div
                  key={submission.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="section-label">
                        {
                          submission
                            .assignments
                            ?.course_code
                        }
                      </p>

                      <h3 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                        {
                          submission
                            .students
                            ?.full_name
                        }
                      </h3>

                      <p className="mt-3 text-[#1c2b3a]/70">
                        Student ID:{" "}
                        {
                          submission
                            .students
                            ?.student_number
                        }
                      </p>

                      <p className="mt-2 text-[#1c2b3a]/70">
                        Assignment:{" "}
                        {
                          submission
                            .assignments
                            ?.title
                        }
                      </p>

                      <p className="mt-2 text-sm text-[#1c2b3a]/45">
                        Submitted on{" "}
                        {new Date(
                          submission.submitted_at ||
                            submission.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <a
                      href={
                        submission.submission_url
                      }
                      target="_blank"
                      className="btn-gold"
                    >
                      Open Submission
                    </a>
                  </div>

                  <div className="mt-8 grid gap-5">
                    <input
                      type="number"
                      placeholder="Assignment Score"
                      value={
                        scores[
                          submission.id
                        ] ||
                        submission.score ||
                        ""
                      }
                      onChange={(e) =>
                        setScores({
                          ...scores,

                          [submission.id]:
                            e.target.value,
                        })
                      }
                      className="border border-[#c9a84c]/30 bg-white p-4 outline-none"
                    />

                    <textarea
                      placeholder="Instructor Feedback"
                      value={
                        feedbacks[
                          submission.id
                        ] ||
                        submission.feedback ||
                        ""
                      }
                      onChange={(e) =>
                        setFeedbacks({
                          ...feedbacks,

                          [submission.id]:
                            e.target.value,
                        })
                      }
                      className="min-h-40 border border-[#c9a84c]/30 bg-white p-4 outline-none"
                    />

                    <button
                      onClick={() =>
                        handleGrade(
                          submission.id
                        )
                      }
                      className="btn-gold"
                    >
                      Save Assessment
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </InstructorShell>
  );
}