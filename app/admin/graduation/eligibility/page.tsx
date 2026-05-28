import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

function getClassification(cgpa: number) {
  if (cgpa >= 4.5) return "Distinction";
  if (cgpa >= 3.5) return "Upper Credit";
  if (cgpa >= 2.5) return "Lower Credit";
  if (cgpa >= 1.5) return "Pass";
  return "Probation";
}

export default async function GraduationEligibilityPage() {
  const supabase = await createClient();

  const { data: activeSession } = await supabase
    .from("academic_sessions")
    .select(
      `
      id,
      session_name,
      is_active,
      session_semesters (
        id,
        semester_name,
        is_open
      )
    `
    )
    .eq("is_active", true)
    .maybeSingle();

  const openSemesters =
    activeSession?.session_semesters?.filter(
      (semester: OpenSemester) => semester.is_open
    ) || [];

  const { data: students, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      student_number,
      current_semester,
      cohort_name,
      admission_set
    `
    )
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  async function checkEligibility(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const studentId = formData.get("student_id") as string;

    const academicSession =
      (formData.get("academic_session") as string) || "";

    const semester =
      (formData.get("semester") as string) || "";

    let resultQuery = supabase
      .from("course_results")
      .select("*")
      .eq("student_id", studentId)
      .eq("publication_status", "published")
      .eq("result_visibility", true);

    if (academicSession) {
      resultQuery = resultQuery.eq(
        "academic_session",
        academicSession
      );
    }

    if (semester) {
      resultQuery = resultQuery.eq(
        "semester",
        semester
      );
    }

    const { data: results } = await resultQuery;

    const completedCourses =
      results?.length || 0;

    const failedCourses =
      results?.filter(
        (result: any) =>
          Number(result.grade_point || 0) === 0
      ).length || 0;

    const totalCredits =
      results?.reduce(
        (sum: number, result: any) =>
          sum +
          Number(result.credit_units || 0),
        0
      ) || 0;

    const totalQualityPoints =
      results?.reduce(
        (sum: number, result: any) =>
          sum +
          Number(result.quality_points || 0),
        0
      ) || 0;

    const cgpa =
      totalCredits > 0
        ? totalQualityPoints / totalCredits
        : 0;

    const classification =
      getClassification(cgpa);

    const eligible =
      completedCourses > 0 &&
      failedCourses === 0 &&
      cgpa >= 1.5;

    const eligibilityStatus = eligible
      ? "eligible"
      : "not_eligible";

    const summary = `Graduation Eligibility Summary:
Academic Session: ${
      academicSession || "All Sessions"
    }
Semester: ${
      semester || "All Semesters"
    }
CGPA: ${cgpa.toFixed(2)}
Classification: ${classification}
Completed Courses: ${completedCourses}
Failed Courses: ${failedCourses}
Total Credit Units: ${totalCredits}
Eligibility Status: ${eligibilityStatus}`;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("graduation_records")
      .upsert(
        {
          student_id: studentId,
          academic_session:
            academicSession || null,
          semester: semester || null,
          cgpa,
          classification,
          graduation_status: eligible
            ? "eligible"
            : "pending",
          eligibility_status:
            eligibilityStatus,
          eligibility_checked_at:
            new Date().toISOString(),
          eligibility_summary: summary,
          reviewed_by: user?.id,
          reviewed_at:
            new Date().toISOString(),
          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "student_id,academic_session,semester",
        }
      );

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(
      "/admin/graduation/eligibility"
    );
  }

  return (
    <AdminShell
      title="Graduation Eligibility"
      subtitle="Automatically check student eligibility for graduation using officially published academic records."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Check Student Eligibility
        </h2>

        <div className="mt-5 border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
          <p className="text-sm font-semibold text-[#0b1f3a]">
            Active Session:{" "}
            {activeSession?.session_name ||
              "No Active Session"}
          </p>

          <div className="mt-2 space-y-1">
            {openSemesters.length > 0 ? (
              openSemesters.map(
                (semester: OpenSemester) => (
                  <p
                    key={semester.id}
                    className="text-sm font-medium text-green-700"
                  >
                    {semester.semester_name} Open
                  </p>
                )
              )
            ) : (
              <p className="text-sm text-red-700">
                No semester is currently open.
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-6 text-red-600">
            {error.message}
          </p>
        )}

        {!students || students.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No student found.
          </p>
        ) : (
          <form
            action={checkEligibility}
            className="mt-8 grid gap-5"
          >
            <input
              type="hidden"
              name="academic_session"
              value={
                activeSession?.session_name || ""
              }
            />

            <select
              name="student_id"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="">
                Select Student
              </option>

              {students.map((student: any) => (
                <option
                  key={student.id}
                  value={student.id}
                >
                  {student.full_name} —{" "}
                  {student.student_number ||
                    "No Student ID"}{" "}
                  — {student.email}
                  {student.current_semester
                    ? ` — ${student.current_semester}`
                    : ""}
                  {student.cohort_name
                    ? ` — ${student.cohort_name}`
                    : ""}
                </option>
              ))}
            </select>

            <select
              name="semester"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="">
                All Open Semesters
              </option>

              {openSemesters.map(
                (semester: OpenSemester) => (
                  <option
                    key={semester.id}
                    value={
                      semester.semester_name
                    }
                  >
                    {semester.semester_name}
                  </option>
                )
              )}
            </select>

            <button
              type="submit"
              className="btn-gold"
              disabled={!activeSession}
            >
              Check Eligibility
            </button>
          </form>
        )}
      </section>
    </AdminShell>
  );
}