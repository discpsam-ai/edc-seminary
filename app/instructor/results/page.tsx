import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

export default async function InstructorResultsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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
      (semester: OpenSemester) =>
        semester.is_open
    ) || [];

  const openSemesterNames =
    openSemesters.map(
      (semester: OpenSemester) =>
        semester.semester_name
    );

  const { data: students } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      level,
      current_semester,
      student_number
    `
    )
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", {
      ascending: true,
    });

  let coursesQuery = supabase
    .from("instructor_course_assignments")
    .select(
      `
      *,
      courses:course_id (
        id,
        code,
        course_code,
        title,
        credit_units,
        level,
        semester
      )
    `
    )
    .eq("instructor_id", user?.id)
    .eq("assignment_status", "active");

  if (activeSession?.session_name) {
    coursesQuery = coursesQuery.eq(
      "academic_session",
      activeSession.session_name
    );
  }

  if (openSemesterNames.length > 0) {
    coursesQuery = coursesQuery.in(
      "semester",
      openSemesterNames
    );
  }

  const { data: assignedCourses } =
    await coursesQuery.order(
      "assigned_at",
      {
        ascending: false,
      }
    );

  let resultsQuery = supabase
    .from("course_results")
    .select(
      `
      *,
      profiles:student_id (
        full_name,
        email,
        student_number
      ),
      courses:course_id (
        title,
        course_code
      )
    `
    )
    .eq("instructor_id", user?.id);

  if (activeSession?.session_name) {
    resultsQuery = resultsQuery.eq(
      "academic_session",
      activeSession.session_name
    );
  }

  if (openSemesterNames.length > 0) {
    resultsQuery = resultsQuery.in(
      "semester",
      openSemesterNames
    );
  }

  const { data: results, error } =
    await resultsQuery.order(
      "submitted_at",
      {
        ascending: false,
      }
    );

  async function saveResult(
    formData: FormData
  ) {
    "use server";

    const supabase = await createClient();

    const studentId =
      formData.get("student_id") as string;

    const courseCode =
      formData.get("course_code") as string;

    const assignmentScore = Number(
      formData.get(
        "assignment_score"
      ) || 0
    );

    const examScore = Number(
      formData.get("exam_score") || 0
    );

    const semester =
      formData.get(
        "semester"
      ) as string;

    const level =
      formData.get("level") as string;

    const academicSession =
      formData.get(
        "academic_session"
      ) as string;

    if (!studentId) {
      throw new Error(
        "Please select a student."
      );
    }

    if (!courseCode) {
      throw new Error(
        "Please select a course."
      );
    }

    if (!academicSession) {
      throw new Error(
        "No active academic session found."
      );
    }

    if (!semester) {
      throw new Error(
        "Please select a semester."
      );
    }

    const {
      data: course,
      error: courseError,
    } = await supabase
      .from("courses")
      .select(
        `
        id,
        credit_units,
        code,
        course_code
      `
      )
      .or(
        `code.eq.${courseCode},course_code.eq.${courseCode}`
      )
      .single();

    if (courseError || !course) {
      throw new Error(
        "Course not found."
      );
    }

    const creditUnits = Number(
      course.credit_units || 1
    );

    const { error } = await supabase
      .from("course_results")
      .upsert(
        {
          student_id: studentId,

          course_id: course.id,

          course_code: courseCode,

          assignment_score:
            assignmentScore,

          exam_score: examScore,

          credit_units:
            creditUnits,

          semester,

          level,

          academic_session:
            academicSession,

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
      "/instructor/results"
    );
  }

  return (
    <InstructorShell
      title="Result Management"
      subtitle="Compute course scores, grades, grade points, and academic records for EDC students."
    >
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Compute Result
          </h2>

          <div className="mt-5 border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
            <p className="text-sm font-semibold text-[#0b1f3a]">
              Active Session:{" "}
              {activeSession?.session_name ||
                "No Active Session"}
            </p>

            <div className="mt-2 space-y-1">
              {openSemesters.length >
              0 ? (
                openSemesters.map(
                  (
                    semester: OpenSemester
                  ) => (
                    <p
                      key={semester.id}
                      className="text-sm font-medium text-green-700"
                    >
                      {
                        semester.semester_name
                      }{" "}
                      Open
                    </p>
                  )
                )
              ) : (
                <p className="text-sm text-red-700">
                  No semester is
                  currently open.
                </p>
              )}
            </div>
          </div>

          <form
            action={saveResult}
            className="mt-8 grid gap-5"
          >
            <input
              type="hidden"
              name="academic_session"
              value={
                activeSession?.session_name ||
                ""
              }
            />

            <select
              name="student_id"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="">
                Select Student
              </option>

              {students?.map(
                (student: any) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.full_name} —{" "}
                    {student.student_number ||
                      "No ID"}{" "}
                    — {student.email}
                    {student.current_semester
                      ? ` — ${student.current_semester}`
                      : ""}
                  </option>
                )
              )}
            </select>

            <select
              name="course_code"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="">
                Select Assigned Course
              </option>

              {assignedCourses?.map(
                (assignment: any) => (
                  <option
                    key={assignment.id}
                    value={
                      assignment.course_code ||
                      assignment.courses
                        ?.code ||
                      assignment.courses
                        ?.course_code ||
                      ""
                    }
                  >
                    {assignment.course_code ||
                      assignment.courses
                        ?.course_code ||
                      assignment.courses
                        ?.code}{" "}
                    —{" "}
                    {assignment.courses
                      ?.title ||
                      "Untitled Course"}{" "}
                    —{" "}
                    {
                      assignment.academic_session
                    }{" "}
                    —{" "}
                    {
                      assignment.semester
                    }
                  </option>
                )
              )}
            </select>

            <div className="grid gap-5 sm:grid-cols-2">
              <input
                type="number"
                name="assignment_score"
                min="0"
                max="40"
                required
                placeholder="Assignment / CA Score"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              />

              <input
                type="number"
                name="exam_score"
                min="0"
                max="60"
                required
                placeholder="Exam Score"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <input
                name="level"
                placeholder="Level e.g. Level 1"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              />

              <select
                name="semester"
                required
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              >
                <option value="">
                  Select Semester
                </option>

                {openSemesters.map(
                  (
                    semester: OpenSemester
                  ) => (
                    <option
                      key={semester.id}
                      value={
                        semester.semester_name
                      }
                    >
                      {
                        semester.semester_name
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              type="submit"
              className="btn-gold"
              disabled={
                !activeSession ||
                openSemesters.length ===
                  0
              }
            >
              Save / Compute Result
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Course Results
          </h2>

          {error && (
            <p className="mt-6 text-red-600">
              {error.message}
            </p>
          )}

          {!results ||
          results.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No course result has
              been recorded for the
              active session and
              open semester yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {results.map(
                (result: any) => (
                  <div
                    key={result.id}
                    className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="section-label">
                          {
                            result.course_code
                          }
                        </p>

                        <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                          {result.profiles
                            ?.full_name ||
                            "Unnamed Student"}
                        </h3>

                        <p className="mt-1 text-sm text-[#1c2b3a]/60">
                          {result.profiles
                            ?.student_number ||
                            "No Student ID"}{" "}
                          —{" "}
                          {result.profiles
                            ?.email ||
                            "No Email"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                          {result.grade ||
                            "N/A"}
                        </span>

                        <span
                          className={`border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                            result.publication_status ===
                            "published"
                              ? "border-green-300 bg-green-50 text-green-700"
                              : "border-yellow-300 bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {result.publication_status ||
                            "draft"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-sm text-[#1c2b3a]/60">
                          Assignment
                        </p>

                        <p className="mt-1 font-semibold text-[#0b1f3a]">
                          {result.assignment_score ??
                            0}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-[#1c2b3a]/60">
                          Exam
                        </p>

                        <p className="mt-1 font-semibold text-[#0b1f3a]">
                          {result.exam_score ??
                            0}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-[#1c2b3a]/60">
                          Total
                        </p>

                        <p className="mt-1 font-semibold text-[#0b1f3a]">
                          {result.total_score ??
                            0}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-[#1c2b3a]/60">
                          GP
                        </p>

                        <p className="mt-1 font-semibold text-[#0b1f3a]">
                          {result.grade_point ??
                            0}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <span
                        className={`border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                          result.remark ===
                          "Passed"
                            ? "border-green-300 bg-green-50 text-green-700"
                            : "border-red-300 bg-red-50 text-red-700"
                        }`}
                      >
                        {result.remark ||
                          "N/A"}
                      </span>

                      <span className="border border-[#c9a84c]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]">
                        {result.result_status ||
                          "draft"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-[#1c2b3a]/60">
                      {result.academic_session ||
                        "No Session"}{" "}
                      •{" "}
                      {result.level ||
                        "No Level"}{" "}
                      •{" "}
                      {result.semester ||
                        "No Semester"}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </InstructorShell>
  );
}