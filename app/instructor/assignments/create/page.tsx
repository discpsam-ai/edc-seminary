
import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CreateAssignmentPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, code, title")
    .order("code", { ascending: true });

  async function createAssignment(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const courseCode = formData.get("course_code") as string;
    const dueDate = formData.get("due_date") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { error } = await supabase.from("assignments").insert({
      title,
      description,
      course_code: courseCode,
      due_date: dueDate,
      instructor_id: user.id,
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/instructor/assignments");
  }

  return (
    <InstructorShell
      title="Create Assignment"
      subtitle="Create coursework, formation exercises, and academic submissions for EDC students."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <form action={createAssignment} className="grid gap-5">
          <input
            name="title"
            required
            placeholder="Assignment title"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <select
            name="course_code"
            required
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          >
            <option value="">Select Course</option>
            {courses?.map((course: any) => (
              <option key={course.id} value={course.code}>
                {course.code} — {course.title}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            required
            placeholder="Assignment description / instruction"
            className="min-h-40 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <input
            type="datetime-local"
            name="due_date"
            required
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <button type="submit" className="btn-gold">
            Create Assignment
          </button>
        </form>
      </section>
    </InstructorShell>
  );
}