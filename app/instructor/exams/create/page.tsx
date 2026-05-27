import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CreateExamPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: assignments, error: coursesError } = await supabase
    .from("instructor_course_assignments")
    .select(`
      course_id,
      course_code,
      courses:course_id (
        id,
        code,
        title,
        level,
        semester
      )
    `)
    .eq("instructor_id", user.id)
    .eq("assignment_status", "active");

  const assignedCourses =
    assignments?.map((item: any) => item.courses).filter(Boolean) || [];

  const { data: rubrics, error: rubricsError } = await supabase
    .from("grading_rubrics")
    .select("id, title, assessment_type, total_marks")
    .order("created_at", { ascending: false });

  async function createExam(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const courseCode = formData.get("course_code") as string;
    const rubricId = formData.get("rubric_id") as string;
    const examType = formData.get("exam_type") as string;
    const durationMinutes = Number(formData.get("duration_minutes"));
    const totalMarks = Number(formData.get("total_marks"));
    const startAt = formData.get("start_at") as string;
    const endAt = formData.get("end_at") as string;
    const status = formData.get("status") as string;

    const { data: assignedCourse } = await supabase
      .from("instructor_course_assignments")
      .select("id")
      .eq("instructor_id", user.id)
      .eq("course_code", courseCode)
      .eq("assignment_status", "active")
      .maybeSingle();

    if (!assignedCourse) {
      throw new Error(
        "You cannot create assessment for a course not assigned to you."
      );
    }

    const { data: exam, error } = await supabase
      .from("exams")
      .insert({
        title,
        description,
        course_code: courseCode,
        rubric_id: rubricId || null,
        exam_type: examType,
        duration_minutes: durationMinutes,
        total_marks: totalMarks,
        start_at: startAt || null,
        end_at: endAt || null,
        status,
        instructor_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/instructor/exams/${exam.id}/questions`);
  }

  return (
    <InstructorShell
      title="Create Assessment"
      subtitle="Create quizzes, tests, examinations, timed assessments, and attach grading rubrics."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        {coursesError && (
          <p className="mb-5 text-red-600">{coursesError.message}</p>
        )}

        {rubricsError && (
          <p className="mb-5 text-red-600">{rubricsError.message}</p>
        )}

        {assignedCourses.length === 0 ? (
          <p className="text-[#1c2b3a]/70">
            No course has been assigned to you yet. You cannot create an
            assessment until admin assigns you a course.
          </p>
        ) : (
          <form action={createExam} className="grid gap-5">
            <input
              name="title"
              required
              placeholder="Assessment title"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <select
              name="course_code"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="">Select Assigned Course</option>

              {assignedCourses.map((course: any) => (
                <option key={course.id} value={course.code}>
                  {course.code} — {course.title} — {course.level} —{" "}
                  {course.semester}
                </option>
              ))}
            </select>

            <select
              name="rubric_id"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="">Select Rubric</option>

              {rubrics?.map((rubric: any) => (
                <option key={rubric.id} value={rubric.id}>
                  {rubric.title} — {rubric.assessment_type} —{" "}
                  {rubric.total_marks} marks
                </option>
              ))}
            </select>

            <select
              name="exam_type"
              required
              defaultValue="test"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="quiz">Quiz</option>
              <option value="test">Test</option>
              <option value="exam">Examination</option>
              <option value="theory">Theory Assessment</option>
              <option value="mixed">Mixed Assessment</option>
            </select>

            <textarea
              name="description"
              placeholder="Assessment description / instruction"
              className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <input
                type="number"
                name="duration_minutes"
                required
                defaultValue={60}
                placeholder="Duration in minutes"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <input
                type="number"
                name="total_marks"
                required
                defaultValue={100}
                placeholder="Total marks"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0b1f3a]">
                  Start Date / Time
                </label>

                <input
                  type="datetime-local"
                  name="start_at"
                  required
                  className="w-full border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0b1f3a]">
                  End Date / Time
                </label>

                <input
                  type="datetime-local"
                  name="end_at"
                  required
                  className="w-full border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />
              </div>
            </div>

            <select
              name="status"
              required
              defaultValue="draft"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>

            <button type="submit" className="btn-gold">
              Create Assessment
            </button>
          </form>
        )}
      </section>
    </InstructorShell>
  );
}