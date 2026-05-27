import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function InstructorLearningPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: assignedCourseRecords } = await supabase
    .from("instructor_course_assignments")
    .select(`
      course_id,
      course_code,
      courses:course_id (
        id,
        code,
        title
      )
    `)
    .eq("instructor_id", user.id)
    .eq("assignment_status", "active");

  const courses =
    assignedCourseRecords?.map((item: any) => item.courses).filter(Boolean) ||
    [];

  const assignedCourseCodes =
    assignedCourseRecords?.map((item: any) => item.course_code) || [];

  const { data: modules, error } =
    assignedCourseCodes.length > 0
      ? await supabase
          .from("course_modules")
          .select(`
            *,
            course_lessons (*)
          `)
          .in("course_code", assignedCourseCodes)
          .order("module_order", { ascending: true })
      : { data: [], error: null };

  async function createModule(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const courseId = formData.get("course_id") as string;
    const courseCode = formData.get("course_code") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const moduleOrder = Number(formData.get("module_order"));

    const { data: assignedCourse } = await supabase
      .from("instructor_course_assignments")
      .select("id")
      .eq("instructor_id", user.id)
      .eq("course_code", courseCode)
      .eq("assignment_status", "active")
      .maybeSingle();

    if (!assignedCourse) {
      throw new Error(
        "You cannot create a module for a course not assigned to you."
      );
    }

    const { error } = await supabase.from("course_modules").insert({
      course_id: courseId,
      course_code: courseCode,
      title,
      description,
      module_order: moduleOrder,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/instructor/learning");
  }

  async function createLesson(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const moduleId = formData.get("module_id") as string;
    const courseId = formData.get("course_id") as string;
    const courseCode = formData.get("course_code") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const lessonType = formData.get("lesson_type") as string;
    const videoUrl = formData.get("video_url") as string;
    const audioUrl = formData.get("audio_url") as string;
    const materialUrl = formData.get("material_url") as string;
    const liveSessionUrl = formData.get("live_session_url") as string;
    const lessonOrder = Number(formData.get("lesson_order"));

    const { data: assignedCourse } = await supabase
      .from("instructor_course_assignments")
      .select("id")
      .eq("instructor_id", user.id)
      .eq("course_code", courseCode)
      .eq("assignment_status", "active")
      .maybeSingle();

    if (!assignedCourse) {
      throw new Error(
        "You cannot create a lesson for a course not assigned to you."
      );
    }

    const { error } = await supabase.from("course_lessons").insert({
      module_id: moduleId,
      course_id: courseId,
      course_code: courseCode,
      title,
      description,
      lesson_type: lessonType,
      video_url: videoUrl || null,
      audio_url: audioUrl || null,
      material_url: materialUrl || null,
      live_session_url: liveSessionUrl || null,
      lesson_order: lessonOrder,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/instructor/learning");
  }

  return (
    <InstructorShell
      title="Learning Hub"
      subtitle="Create modules, lessons, video lectures, notes, audio teachings, and live session links only for courses assigned to you."
    >
      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-8">
          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Create Module
            </h2>

            {courses.length === 0 ? (
              <p className="mt-8 text-[#1c2b3a]/70">
                No course has been assigned to you yet. You cannot create
                modules until admin assigns you a course.
              </p>
            ) : (
              <form action={createModule} className="mt-8 grid gap-5">
                <select
                  name="course_id"
                  required
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                >
                  <option value="">Select Assigned Course</option>

                  {courses.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.code} — {course.title}
                    </option>
                  ))}
                </select>

                <input
                  name="course_code"
                  required
                  placeholder="Course Code"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <input
                  name="title"
                  required
                  placeholder="Module title"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <input
                  type="number"
                  name="module_order"
                  required
                  defaultValue={1}
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <textarea
                  name="description"
                  placeholder="Module description..."
                  className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <button type="submit" className="btn-gold">
                  Create Module
                </button>
              </form>
            )}
          </div>

          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Create Lesson
            </h2>

            {courses.length === 0 ? (
              <p className="mt-8 text-[#1c2b3a]/70">
                No course has been assigned to you yet.
              </p>
            ) : !modules || modules.length === 0 ? (
              <p className="mt-8 text-[#1c2b3a]/70">
                Create a module first before adding lessons.
              </p>
            ) : (
              <form action={createLesson} className="mt-8 grid gap-5">
                <select
                  name="module_id"
                  required
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                >
                  <option value="">Select Module</option>

                  {modules.map((module: any) => (
                    <option key={module.id} value={module.id}>
                      {module.course_code} — {module.title}
                    </option>
                  ))}
                </select>

                <select
                  name="course_id"
                  required
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                >
                  <option value="">Select Assigned Course</option>

                  {courses.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.code} — {course.title}
                    </option>
                  ))}
                </select>

                <input
                  name="course_code"
                  required
                  placeholder="Course Code"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <input
                  name="title"
                  required
                  placeholder="Lesson title"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <select
                  name="lesson_type"
                  required
                  defaultValue="video"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                >
                  <option value="video">Video Lesson</option>
                  <option value="audio">Audio Lesson</option>
                  <option value="document">Document / Notes</option>
                  <option value="live">Live Session</option>
                  <option value="mixed">Mixed Lesson</option>
                </select>

                <input
                  name="video_url"
                  placeholder="Video URL / YouTube link"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <input
                  name="audio_url"
                  placeholder="Audio URL"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <input
                  name="material_url"
                  placeholder="Material / Notes URL"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <input
                  name="live_session_url"
                  placeholder="Live Session URL"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <input
                  type="number"
                  name="lesson_order"
                  required
                  defaultValue={1}
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <textarea
                  name="description"
                  placeholder="Lesson description..."
                  className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <button type="submit" className="btn-gold">
                  Create Lesson
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Learning Structure
          </h2>

          {error && <p className="mt-6 text-red-600">{error.message}</p>}

          {!modules || modules.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No learning module has been created for your assigned courses yet.
            </p>
          ) : (
            <div className="mt-8 space-y-6">
              {modules.map((module: any) => (
                <div
                  key={module.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                >
                  <p className="section-label">{module.course_code}</p>

                  <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    Module {module.module_order}: {module.title}
                  </h3>

                  <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                    {module.description || "No module description."}
                  </p>

                  <div className="mt-6 space-y-4">
                    {module.course_lessons?.length > 0 ? (
                      module.course_lessons.map((lesson: any) => (
                        <div
                          key={lesson.id}
                          className="border border-[#c9a84c]/20 bg-white p-4"
                        >
                          <h4 className="font-semibold text-[#0b1f3a]">
                            Lesson {lesson.lesson_order}: {lesson.title}
                          </h4>

                          <p className="mt-1 text-sm capitalize text-[#1c2b3a]/60">
                            {lesson.lesson_type}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#1c2b3a]/60">
                        No lesson added yet.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </InstructorShell>
  );
}