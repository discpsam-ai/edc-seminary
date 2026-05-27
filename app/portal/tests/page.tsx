import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentTestsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: registeredCourses } = await supabase
    .from("course_registrations")
    .select("course_code")
    .eq("student_id", user.id)
    .eq("approval_status", "approved");

  const courseCodes =
    registeredCourses?.map((item: any) => item.course_code) || [];

  const { data: exams, error } =
    courseCodes.length > 0
      ? await supabase
          .from("exams")
          .select("*")
          .eq("status", "published")
          .in("course_code", courseCodes)
          .order("start_at", { ascending: true })
      : { data: [], error: null };

  return (
    <PortalShell
      title="Tests & Exams"
      subtitle="View and take available quizzes, tests, and examinations for your approved registered courses."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Available Assessments
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {courseCodes.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            You do not have any approved course registration yet. Your
            assessments will appear here after admin approves your registered
            courses.
          </p>
        ) : !exams || exams.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No assessment is currently available for your approved registered
            courses.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {exams.map((exam: any) => (
              <div
                key={exam.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="section-label">{exam.course_code}</p>

                    <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {exam.title}
                    </h3>

                    <p className="mt-2 text-[#1c2b3a]/70">
                      {exam.description}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c] capitalize">
                    {exam.exam_type}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-[#1c2b3a]/60">Duration</p>

                    <p className="mt-1 font-semibold text-[#0b1f3a]">
                      {exam.duration_minutes} mins
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#1c2b3a]/60">Total Marks</p>

                    <p className="mt-1 font-semibold text-[#0b1f3a]">
                      {exam.total_marks}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#1c2b3a]/60">Status</p>

                    <p className="mt-1 font-semibold capitalize text-[#0b1f3a]">
                      {exam.status}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href={`/portal/tests/${exam.id}`} className="btn-gold">
                    Open Assessment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PortalShell>
  );
}