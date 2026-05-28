import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function InstructorResultUploadPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: assignments } = await supabase
    .from("instructor_course_assignments")
    .select(`
      *,
      courses:course_id (
        id,
        title,
        code,
        course_code,
        credit_units,
        semester
      )
    `)
    .eq("instructor_id", user.id)
    .eq("assignment_status", "active");

  const { data: students } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      student_number,
      current_semester,
      admission_set
    `)
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", {
      ascending: true,
    });

  async function uploadResult(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const studentId =
      formData.get("student_id") as string;

    const courseId =
      formData.get("course_id") as string;

    const courseCode =
      formData.get("course_code") as string;

    const academicSession =
      formData.get("academic_session") as string;

    const semester =
      formData.get("semester") as string;

    const creditUnits = Number(
      formData.get("credit_units") || 0
    );

    const assignmentScore = Number(
      formData.get("assignment_score") || 0
    );

    const examScore = Number(
      formData.get("exam_score") || 0
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("course_results")
      .upsert(
        {
          student_id: studentId,
          course_id: courseId,
          course_code: courseCode,
          academic_session: academicSession,
          semester,
          credit_units: creditUnits,
          assignment_score: assignmentScore,
          exam_score: examScore,
          instructor_id: user?.id,
          submitted_at:
            new Date().toISOString(),
          last_updated_at:
            new Date().toISOString(),
          result_status: "draft",
        },
        {
          onConflict:
            "student_id,course_id,academic_session,semester",
        }
      );

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(
      "/instructor/results/upload"
    );
  }

  return (
    <InstructorShell
      title="Upload Results"
      subtitle="Submit academic scores for institutional processing and publication workflow."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Result Upload Portal
        </h2>

        <form
          action={uploadResult}
          className="mt-8 grid gap-5"
        >
          <select
            name="student_id"
            required
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          >
            <option value="">
              Select Student
            </option>

            {students?.map((student: any) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.full_name} —{" "}
                {student.student_number ||
                  "No ID"}{" "}
                —{" "}
                {student.current_semester ||
                  "No Semester"}
              </option>
            ))}
          </select>

          <select
            name="course_id"
            required
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          >
            <option value="">
              Select Course
            </option>

            {assignments?.map(
              (assignment: any) => (
                <option
                  key={
                    assignment.courses?.id
                  }
                  value={
                    assignment.courses?.id
                  }
                >
                  {assignment.courses
                    ?.course_code ||
                    assignment.course_code}{" "}
                  —{" "}
                  {assignment.courses
                    ?.title || "Course"}
                </option>
              )
            )}
          </select>

          <input
            name="course_code"
            required
            placeholder="Course Code"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <input
            name="academic_session"
            required
            placeholder="Academic Session e.g. 2025/2026"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <select
            name="semester"
            required
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          >
            <option value="">
              Select Semester
            </option>

            <option value="Semester 1">
              Semester 1
            </option>

            <option value="Semester 2">
              Semester 2
            </option>

            <option value="Semester 3">
              Semester 3
            </option>

            <option value="Semester 4">
              Semester 4
            </option>
          </select>

          <input
            type="number"
            name="credit_units"
            required
            placeholder="Credit Units"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <input
            type="number"
            name="assignment_score"
            required
            placeholder="Assignment / CA Score"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <input
            type="number"
            name="exam_score"
            required
            placeholder="Exam Score"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <button
            type="submit"
            className="btn-gold"
          >
            Submit Result
          </button>
        </form>
      </section>
    </InstructorShell>
  );
}