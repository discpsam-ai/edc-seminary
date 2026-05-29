import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

type Instructor = {
  id: string;
  full_name: string | null;
  email: string | null;
  instructor_number: string | null;
};

type Course = {
  id: string;
  code: string | null;
  title: string | null;
  level: string | null;
  semester: string | null;
};

export default async function AssignInstructorCoursesPage() {
  const supabase = await createClient();

  const { data: activeSession } = await supabase
    .from("academic_sessions")
    .select(`
      id,
      session_name,
      is_active,
      session_semesters (
        id,
        semester_name,
        is_open
      )
    `)
    .eq("is_active", true)
    .maybeSingle();

  const openSemesters =
    activeSession?.session_semesters?.filter(
      (semester: OpenSemester) => semester.is_open
    ) || [];

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
        code,
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
    const semester = formData.get("semester") as string;

    if (!instructorId) throw new Error("Please select an instructor.");
    if (!courseId) throw new Error("Please select a course.");
    if (!academicSession) throw new Error("No active academic session found.");
    if (!semester) throw new Error("Please select a semester.");

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("code")
      .eq("id", courseId)
      .single();

    if (courseError || !course) throw new Error("Course not found.");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("instructor_course_assignments")
      .insert(
        {
          instructor_id: instructorId,
          course_id: courseId,
          course_code: course.code,
          academic_session: academicSession,
          semester,
          assignment_status: "active",
          assigned_by: user?.id,
          assigned_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      );

    if (error) throw new Error(error.message);

    revalidatePath("/admin/instructors/assign-courses");
  }

  async function assignAllCourses(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const instructorId = formData.get("bulk_instructor_id") as string;
    const academicSession = formData.get("bulk_academic_session") as string;
    const semester = formData.get("bulk_semester") as string;

    if (!instructorId) throw new Error("Please select an instructor.");
    if (!academicSession) throw new Error("No active academic session found.");
    if (!semester) throw new Error("Please select a semester.");

    const { data: allCourses, error: coursesError } = await supabase
      .from("courses")
      .select("id, code")
      .eq("semester", semester);

    if (coursesError) throw new Error(coursesError.message);

    if (!allCourses || allCourses.length === 0) {
      throw new Error("No courses found for this semester.");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const rows = allCourses.map((course: any) => ({
      instructor_id: instructorId,
      course_id: course.id,
      course_code: course.code,
      academic_session: academicSession,
      semester,
      assignment_status: "active",
      assigned_by: user?.id,
      assigned_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
  .from("instructor_course_assignments")
  .insert(rows);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/instructors/assign-courses");
  }

  return (
    <AdminShell
      title="Assign Instructor Courses"
      subtitle="Assign approved instructors to official EDC courses for each academic session and semester."
    >
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Assign Course
          </h2>

          <div className="mt-5 border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
            <p className="text-sm font-semibold text-[#0b1f3a]">
              Active Session: {activeSession?.session_name || "No Active Session"}
            </p>

            <div className="mt-2 space-y-1">
              {openSemesters.length > 0 ? (
                openSemesters.map((semester: OpenSemester) => (
                  <p key={semester.id} className="text-sm font-medium text-green-700">
                    {semester.semester_name} Open
                  </p>
                ))
              ) : (
                <p className="text-sm text-red-700">
                  No semester is currently open.
                </p>
              )}
            </div>
          </div>

          <form action={assignCourse} className="mt-8 grid gap-5">
            <input
              type="hidden"
              name="academic_session"
              value={activeSession?.session_name || ""}
            />

            <select
              name="instructor_id"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="">Select Instructor</option>

              {instructors?.map((instructor: Instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.full_name || "Unnamed Instructor"} —{" "}
                  {instructor.instructor_number || "No Instructor ID"} —{" "}
                  {instructor.email || "No Email"}
                </option>
              ))}
            </select>

            <select
              name="course_id"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="">Select Course</option>

              {courses?.map((course: Course) => (
                <option key={course.id} value={course.id}>
                  {course.code || "No Code"} — {course.title || "Untitled"} —{" "}
                  {course.level || "No Level"} — {course.semester || "No Semester"}
                </option>
              ))}
            </select>

            <select
              name="semester"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="">Select Semester</option>

              {openSemesters.map((semester: OpenSemester) => (
                <option key={semester.id} value={semester.semester_name}>
                  {semester.semester_name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="btn-gold"
              disabled={!activeSession || openSemesters.length === 0}
            >
              Assign Course
            </button>
          </form>

          <div className="mt-10 border-t border-[#c9a84c]/20 pt-8">
            <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
              Assign All Courses
            </h3>

            <p className="mt-3 leading-7 text-[#1c2b3a]/70">
              Use this when one instructor is available and should handle all courses for a selected semester.
            </p>

            <form action={assignAllCourses} className="mt-6 grid gap-5">
              <input
                type="hidden"
                name="bulk_academic_session"
                value={activeSession?.session_name || ""}
              />

              <select
                name="bulk_instructor_id"
                required
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="">Select Instructor</option>

                {instructors?.map((instructor: Instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.full_name || "Unnamed Instructor"} —{" "}
                    {instructor.instructor_number || "No Instructor ID"} —{" "}
                    {instructor.email || "No Email"}
                  </option>
                ))}
              </select>

              <select
                name="bulk_semester"
                required
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="">Select Semester</option>

                {openSemesters.map((semester: OpenSemester) => (
                  <option key={semester.id} value={semester.semester_name}>
                    {semester.semester_name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="btn-gold"
                disabled={!activeSession || openSemesters.length === 0}
              >
                Assign All Courses to Instructor
              </button>
            </form>
          </div>
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
                    {assignment.course_code || assignment.courses?.code}
                  </p>

                  <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    {assignment.courses?.title ||
                      assignment.course_code ||
                      "Untitled Course"}
                  </h3>

                  <p className="mt-3 text-[#1c2b3a]/70">
                    Instructor:{" "}
                    <strong>{assignment.profiles?.full_name || "Unnamed"}</strong>
                  </p>

                  <p className="mt-1 text-sm text-[#1c2b3a]/60">
                    Instructor ID:{" "}
                    {assignment.profiles?.instructor_number || "Not assigned"}
                  </p>

                  <p className="mt-1 text-sm text-[#1c2b3a]/60">
                    Session: {assignment.academic_session || "No Session"}
                  </p>

                  <p className="mt-1 text-sm text-[#1c2b3a]/60">
                    Semester: {assignment.semester || "No Semester"}
                  </p>

                  <span className="mt-4 inline-block border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {assignment.assignment_status || "active"}
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