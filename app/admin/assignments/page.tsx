import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminAssignmentsPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, code, title, level, semester")
    .order("code", { ascending: true });

  const { data: rubrics } = await supabase
    .from("grading_rubrics")
    .select("id, title, assessment_type, total_marks")
    .order("created_at", { ascending: false });

  const { data: assignments, error } = await supabase
    .from("assignments")
    .select(`
      *,
      grading_rubrics:rubric_id (
        title,
        total_marks
      )
    `)
    .order("created_at", { ascending: false });

  async function createAssignment(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const courseCode = formData.get("course_code") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("due_date") as string;
    const rubricId = formData.get("rubric_id") as string;

    const { error } = await supabase.from("assignments").insert({
      course_code: courseCode,
      title,
      description,
      due_date: dueDate || null,
      rubric_id: rubricId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/assignments");
  }

  return (
    <AdminShell
      title="Assignment Management"
      subtitle="Create assignments, attach grading rubrics, monitor submissions, and manage academic accountability."
    >
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Create Assignment
          </h2>

          <form action={createAssignment} className="mt-8 grid gap-5">
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
              placeholder="Assignment Title"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <input
              type="datetime-local"
              name="due_date"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <textarea
              name="description"
              required
              placeholder="Assignment instructions..."
              className="min-h-40 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <button type="submit" className="btn-gold">
              Create Assignment
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Assignment Records
          </h2>

          {error && <p className="mt-6 text-red-600">{error.message}</p>}

          {!assignments || assignments.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No assignment has been created yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {assignments.map((assignment: any) => (
                <div
                  key={assignment.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                >
                  <p className="section-label">{assignment.course_code}</p>

                  <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    {assignment.title}
                  </h3>

                  <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                    {assignment.description}
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="border border-[#c9a84c]/20 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                        Due Date
                      </p>

                      <p className="mt-2 font-semibold text-[#0b1f3a]">
                        {assignment.due_date
                          ? new Date(assignment.due_date).toLocaleString()
                          : "Not set"}
                      </p>
                    </div>

                    <div className="border border-[#c9a84c]/20 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                        Rubric
                      </p>

                      <p className="mt-2 font-semibold text-[#0b1f3a]">
                        {assignment.grading_rubrics?.title || "No rubric"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      href={`/admin/assignments/${assignment.id}/submissions`}
                      className="btn-gold"
                    >
                      View Submissions
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}