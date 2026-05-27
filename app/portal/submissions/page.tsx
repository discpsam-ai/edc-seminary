import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentSubmissionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: submissions, error } =
    await supabase
      .from("assignment_submissions")
      .select(`
        *,
        assignments:assignment_id (
          title,
          course_code
        )
      `)
      .eq("student_id", user.id)
      .order("submitted_at", {
        ascending: false,
      });

  return (
    <PortalShell
      title="My Submissions"
      subtitle="Track submitted assignments, grading records, scores, and instructor feedback."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Academic Assessment
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Submitted Assignments
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Total Submissions
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {submissions?.length || 0}
            </h3>
          </div>
        </div>

        {error && (
          <p className="mt-8 text-red-600">
            {error.message}
          </p>
        )}

        {!submissions ||
        submissions.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No assignment submission yet.
          </p>
        ) : (
          <div className="mt-10 space-y-5">
            {submissions.map(
              (submission: any) => (
                <div
                  key={submission.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="section-label">
                        {
                          submission
                            .assignments
                            ?.course_code
                        }
                      </p>

                      <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                        {
                          submission
                            .assignments
                            ?.title
                        }
                      </h3>
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

                  <div className="mt-8 grid gap-5 md:grid-cols-3">
                    <div className="border border-[#c9a84c]/10 bg-white p-5">
                      <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                        Assignment Score
                      </p>

                      <h3 className="mt-3 text-4xl font-semibold text-[#0b1f3a]">
                        {submission.score ??
                          "Pending"}
                      </h3>
                    </div>

                    <div className="border border-[#c9a84c]/10 bg-white p-5">
                      <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                        Status
                      </p>

                      <h3 className="mt-3 text-2xl font-semibold text-[#c9a84c]">
                        {submission.score !==
                        null
                          ? "Graded"
                          : "Pending"}
                      </h3>
                    </div>

                    <div className="border border-[#c9a84c]/10 bg-white p-5">
                      <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                        Submission Date
                      </p>

                      <h3 className="mt-3 text-xl font-semibold text-[#0b1f3a]">
                        {new Date(
                          submission.submitted_at ||
                            submission.created_at
                        ).toLocaleString()}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 border border-[#c9a84c]/10 bg-white p-5">
                    <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Instructor Feedback
                    </p>

                    <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                      {submission.feedback ||
                        "No instructor feedback yet."}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </PortalShell>
  );
}