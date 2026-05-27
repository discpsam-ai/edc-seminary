import CompleteLessonButton from "@/components/CompleteLessonButton";
import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentLearningPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: registrations } = await supabase
  .from("course_registrations")
  .select("course_code")
  .eq("student_id", user.id)
  .eq("approval_status", "approved");
  
  const registeredCourseCodes =
    registrations?.map((item: any) => item.course_code) || [];

  const { data: modules, error } =
    registeredCourseCodes.length > 0
      ? await supabase
          .from("course_modules")
          .select(`
            *,
            course_lessons (*)
          `)
          .in("course_code", registeredCourseCodes)
          .order("module_order", { ascending: true })
      : { data: [], error: null };

  const { data: progressRecords } = await supabase
    .from("lesson_progress")
    .select("lesson_id, progress_status")
    .eq("student_id", user.id);

  const progressMap = new Map(
    progressRecords?.map((progress: any) => [
      progress.lesson_id,
      progress.progress_status,
    ]) || []
  );

  return (
    <PortalShell
      title="Learning Hub"
      subtitle="Access course modules, video lessons, notes, audio teachings, live sessions, and learning progress."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          My Course Lessons
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {registeredCourseCodes.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            You have not registered any course yet. Please register courses
            before accessing the learning hub.
          </p>
        ) : !modules || modules.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No lesson has been uploaded for your registered courses yet.
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            {modules.map((module: any) => (
              <div
                key={module.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
              >
                <p className="section-label">{module.course_code}</p>

                <h3 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                  Module {module.module_order}: {module.title}
                </h3>

                <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                  {module.description || "No module description."}
                </p>

                <div className="mt-6 space-y-4">
                  {module.course_lessons?.length > 0 ? (
                    module.course_lessons
                      .sort(
                        (a: any, b: any) =>
                          Number(a.lesson_order || 0) -
                          Number(b.lesson_order || 0)
                      )
                      .map((lesson: any) => {
                        const progress =
                          progressMap.get(lesson.id) || "not_started";

                        return (
                          <div
                            key={lesson.id}
                            className="border border-[#c9a84c]/20 bg-white p-5"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                                  Lesson {lesson.lesson_order} •{" "}
                                  {lesson.lesson_type}
                                </p>

                                <h4 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                                  {lesson.title}
                                </h4>

                                <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                                  {lesson.description ||
                                    "No lesson description."}
                                </p>
                              </div>

                              <span className="border border-[#c9a84c]/30 bg-[#fdfaf4] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                                {progress.replaceAll("_", " ")}
                              </span>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                              {lesson.video_url && (
                                <Link
                                  href={lesson.video_url}
                                  target="_blank"
                                  className="btn-gold"
                                >
                                  Watch Video
                                </Link>
                              )}

                              {lesson.audio_url && (
                                <Link
                                  href={lesson.audio_url}
                                  target="_blank"
                                  className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
                                >
                                  Listen Audio
                                </Link>
                              )}

                              {lesson.material_url && (
                                <Link
                                  href={lesson.material_url}
                                  target="_blank"
                                  className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
                                >
                                  Open Notes
                                </Link>
                              )}

                              {lesson.live_session_url && (
                                <Link
                                  href={lesson.live_session_url}
                                  target="_blank"
                                  className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
                                >
                                  Join Live Session
                                </Link>
                              )}

                              {progress !== "completed" && (
                                <CompleteLessonButton lessonId={lesson.id} />
                              )}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-sm text-[#1c2b3a]/60">
                      No lesson has been added to this module yet.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PortalShell>
  );
}