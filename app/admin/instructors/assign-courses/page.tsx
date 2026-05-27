import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AssignInstructorCoursesPage() {
  const supabase = await createClient();

  const { data: instructors } = await supabase
    .from("profiles")
    .select("id, full_name, email, instructor_number")
    .or("role.eq.instructor,roles.cs.{instructor}")
    .order("full_name", { ascending: true });

  const { data: courses } = await supabase
    .from("courses")
    .select("id, code, title, level, semester")
    .order("code", { ascending: true });

  const { data: assignments, error } = await supabase
    .from("instructor_course_assignments")
    .select(`
      *,
      profiles:instructor_id (
        full_name,
        email,
        instructor_number
      ),
      courses:course_id (
        title,
        level,
        semester
      )
    `)
    .order("assigned_at", { ascending: false });

  async function assignCourse(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const instructorId = formData.get("instructor_id") as string;
    const courseId = formData.get("course_id") as string;
    const academicSession = formData.get("academic_session") as string;

    const { data: course } = await supabase
      .from("courses")
      .select("code")
      .eq("id", courseId)
      .single();

    if (!course) {
      throw new Error("Course not found.");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("instructor_course_assignments")
      .upsert(
        {
          instructor_id: instructorId,
          course_id: courseId,
          course_code: course.code,
          academic_session: academicSession,
          assignment_status: "active",
          assigned_by: user?.id,
          assigned_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "instructor_id,course_id,academic_session",
        }
      );

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/instructors/assign-courses");
  }

  return (
    <AdminShell
      title="Assign Instructor Courses"
      subtitle="Assign approved instructors to official EDC courses for each academic session."
    >
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Assign Course
          </h2>

          <form action={assignCourse} className="mt-8 grid gap-5">
            <select
              name="instructor_id"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="">Select Instructor</option>

              {instructors?.map((instructor: any) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.full_name} —{" "}
                  {instructor.instructor_number || "No Instructor ID"} —{" "}
                  {instructor.email}
                </option>
              ))}
            </select>

            <select
              name="course_id"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="">Select Course</option>

              {courses?.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.code} — {course.title} — {course.level} —{" "}
                  {course.semester}
                </option>
              ))}
            </select>

            <input
              name="academic_session"
              required
              placeholder="Academic Session e.g. 2026/2027"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <button type="submit" className="btn-gold">
              Assign Course
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Course Assignment Records
          </h2>

          {error && <p className="mt-6 text-red-600">{error.message}</p>}

          {!assignments || assignments.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No instructor course assignment has been created yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {assignments.map((assignment: any) => (
                <div
                  key={assignment.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                >
                  <p className="section-label">
                    {assignment.course_code}
                  </p>

                  <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    {assignment.courses?.title || assignment.course_code}
                  </h3>

                  <p className="mt-3 text-[#1c2b3a]/70">
                    Instructor:{" "}
                    <strong>
                      {assignment.profiles?.full_name || "Unnamed"}
                    </strong>
                  </p>

                  <p className="mt-1 text-sm text-[#1c2b3a]/60">
                    Instructor ID:{" "}
                    {assignment.profiles?.instructor_number || "Not assigned"}
                  </p>

                  <p className="mt-1 text-sm text-[#1c2b3a]/60">
                    Session: {assignment.academic_session}
                  </p>

                  <span className="mt-4 inline-block border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {assignment.assignment_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}