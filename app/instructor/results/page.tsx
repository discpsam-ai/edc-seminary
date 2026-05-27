import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

function getGrade(total: number) {
  if (total >= 70) return { grade: "A", point: 5 };
  if (total >= 60) return { grade: "B", point: 4 };
  if (total >= 50) return { grade: "C", point: 3 };
  if (total >= 45) return { grade: "D", point: 2 };
  if (total >= 40) return { grade: "E", point: 1 };
  return { grade: "F", point: 0 };
}

export default async function InstructorResultsPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, email, level")
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  const { data: courses } = await supabase
    .from("courses")
    .select("code, title, credit_units, level, semester")
    .order("code", { ascending: true });

  const { data: results, error } = await supabase
    .from("course_results")
    .select(`
      *,
      profiles:student_id (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  async function saveResult(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const studentId = formData.get("student_id") as string;
    const courseCode = formData.get("course_code") as string;
    const assignmentScore = Number(formData.get("assignment_score"));
    const examScore = Number(formData.get("exam_score"));
    const semester = formData.get("semester") as string;
    const level = formData.get("level") as string;
    const academicSession = formData.get("academic_session") as string;

    const { data: course } = await supabase
      .from("courses")
      .select("credit_units")
      .eq("code", courseCode)
      .single();

    const creditUnits = Number(course?.credit_units || 1);
    const totalScore = assignmentScore + examScore;
    const gradeData = getGrade(totalScore);
    const qualityPoints = gradeData.point * creditUnits;

    const { error } = await supabase.from("course_results").upsert(
      {
        student_id: studentId,
        course_code: courseCode,
        assignment_score: assignmentScore,
        exam_score: examScore,
        total_score: totalScore,
        grade: gradeData.grade,
        grade_point: gradeData.point,
        credit_units: creditUnits,
        quality_points: qualityPoints,
        semester,
        level,
        academic_session: academicSession,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "student_id,course_code,academic_session",
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/instructor/results");
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

          <form action={saveResult} className="mt-8 grid gap-5">
            <select
              name="student_id"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="">Select Student</option>
              {students?.map((student: any) => (
                <option key={student.id} value={student.id}>
                  {student.full_name} — {student.email}
                </option>
              ))}
            </select>

            <select
              name="course_code"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="">Select Course</option>
              {courses?.map((course: any) => (
                <option key={course.code} value={course.code}>
                  {course.code} — {course.title}
                </option>
              ))}
            </select>

            <div className="grid gap-5 sm:grid-cols-2">
              <input
                type="number"
                name="assignment_score"
                min="0"
                max="100"
                required
                placeholder="Assignment / CA Score"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              />

              <input
                type="number"
                name="exam_score"
                min="0"
                max="100"
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

              <input
                name="semester"
                placeholder="Semester e.g. Semester 1"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              />
            </div>

            <input
              name="academic_session"
              required
              placeholder="Academic Session e.g. 2026/2027"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <button type="submit" className="btn-gold">
              Save / Compute Result
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Course Results
          </h2>

          {error && <p className="mt-6 text-red-600">{error.message}</p>}

          {!results || results.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No course result has been recorded yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {results.map((result: any) => (
                <div
                  key={result.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="section-label">{result.course_code}</p>

                      <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                        {result.profiles?.full_name || "Unnamed Student"}
                      </h3>

                      <p className="mt-1 text-sm text-[#1c2b3a]/60">
                        {result.profiles?.email}
                      </p>
                    </div>

                    <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                      {result.grade}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-sm text-[#1c2b3a]/60">Assignment</p>
                      <p className="mt-1 font-semibold text-[#0b1f3a]">
                        {result.assignment_score}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#1c2b3a]/60">Exam</p>
                      <p className="mt-1 font-semibold text-[#0b1f3a]">
                        {result.exam_score}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#1c2b3a]/60">Total</p>
                      <p className="mt-1 font-semibold text-[#0b1f3a]">
                        {result.total_score}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#1c2b3a]/60">GP</p>
                      <p className="mt-1 font-semibold text-[#0b1f3a]">
                        {result.grade_point}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-[#1c2b3a]/60">
                    {result.academic_session} • {result.level} •{" "}
                    {result.semester}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </InstructorShell>
  );
}