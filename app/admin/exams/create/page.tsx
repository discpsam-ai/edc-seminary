import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CreateAdminExamPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, code, title, level, semester")
    .order("code", { ascending: true });

  const { data: rubrics } = await supabase
    .from("grading_rubrics")
    .select("id, title, assessment_type, total_marks")
    .order("created_at", { ascending: false });

  async function createExam(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const courseCode = formData.get("course_code") as string;
    const rubricId = formData.get("rubric_id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const examType = formData.get("exam_type") as string;
    const durationMinutes = Number(formData.get("duration_minutes"));
    const totalMarks = Number(formData.get("total_marks"));
    const startAt = formData.get("start_at") as string;
    const endAt = formData.get("end_at") as string;
    const status = formData.get("status") as string;

    const { error } = await supabase.from("exams").insert({
      course_code: courseCode,
      rubric_id: rubricId || null,
      title,
      description,
      exam_type: examType,
      duration_minutes: durationMinutes,
      total_marks: totalMarks,
      start_at: startAt || null,
      end_at: endAt || null,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/exams");
  }

  return (
    <AdminShell
      title="Create Assessment"
      subtitle="Create quizzes, tests, examinations, attach rubrics, and define assessment timing."
    >
      <section className="mx-auto max-w-4xl border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          New Assessment
        </h2>

        <form action={createExam} className="mt-8 grid gap-5">
          <select
            name="course_code"
            required
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          >
            <option value="">Select Course</option>

            {courses?.map((course: any) => (
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

          <input
            name="title"
            required
            placeholder="Assessment Title"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <select
            name="exam_type"
            required
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          >
            <option value="">Assessment Type</option>
            <option value="quiz">Quiz</option>
            <option value="test">Test</option>
            <option value="exam">Examination</option>
            <option value="theory">Theory Assessment</option>
          </select>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="number"
              name="duration_minutes"
              required
              placeholder="Duration in minutes"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <input
              type="number"
              name="total_marks"
              required
              placeholder="Total Marks"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="datetime-local"
              name="start_at"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <input
              type="datetime-local"
              name="end_at"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />
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

          <textarea
            name="description"
            placeholder="Assessment instructions..."
            className="min-h-40 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <button type="submit" className="btn-gold">
            Create Assessment
          </button>
        </form>
      </section>
    </AdminShell>
  );
}