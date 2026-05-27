"use client";
import { toast } from "sonner";
import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/client";

export default function AutoComputePage() {
  const supabase = createClient();

  async function computeResults() {
    const { data: students } =
      await supabase
        .from("profiles")
        .select("*")
        .contains("roles", ["student"]);

    const { data: courses } =
      await supabase
        .from("courses")
        .select("*");

    if (!students || !courses) return;

    for (const student of students) {
      for (const course of courses) {
        const {
          data: assignmentSubmissions,
        } = await supabase
          .from("assignment_submissions")
          .select("score")
          .eq("student_id", student.id);

        const assignmentScore =
          assignmentSubmissions?.reduce(
            (sum, item) =>
              sum + (item.score || 0),
            0
          ) || 0;

        const {
          data: examSubmissions,
        } = await supabase
          .from("exam_submissions")
          .select("score")
          .eq("student_id", student.id);

        const examScore =
          examSubmissions?.reduce(
            (sum, item) =>
              sum + (item.score || 0),
            0
          ) || 0;

        const {
          data: attendance,
        } = await supabase
          .from("attendance_records")
          .select("*")
          .eq("student_id", student.id)
          .eq("status", "present");

        const attendanceScore =
          attendance?.length || 0;

        const totalScore =
          assignmentScore +
          examScore +
          attendanceScore;

        let grade = "F";
        let gpa = 0;

        if (totalScore >= 70) {
          grade = "A";
          gpa = 5;
        } else if (totalScore >= 60) {
          grade = "B";
          gpa = 4;
        } else if (totalScore >= 50) {
          grade = "C";
          gpa = 3;
        } else if (totalScore >= 45) {
          grade = "D";
          gpa = 2;
        } else if (totalScore >= 40) {
          grade = "E";
          gpa = 1;
        }

        await supabase
          .from("computed_results")
          .upsert({
            student_id: student.id,

            course_id: course.id,

            assignment_score:
              assignmentScore,

            exam_score: examScore,

            attendance_score:
              attendanceScore,

            total_score: totalScore,

            grade,

            gpa,
          });
      }
    }

    toast.success(
  "Academic results computed successfully"
);
  }

  return (
    <AdminShell
      title="Auto Result Computation"
      subtitle="Compute institutional academic results automatically from assessment systems."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-10">
        <div className="max-w-3xl">
          <p className="section-label">
            Academic Engine
          </p>

          <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            Automatic Result Computation
          </h2>

          <p className="mt-6 leading-8 text-[#1c2b3a]/70">
            Compute assignment scores,
            examination scores,
            attendance records,
            grades, GPA values, and
            transcript-ready academic
            results automatically across
            the EDC academic system.
          </p>

          <button
            onClick={computeResults}
            className="btn-gold mt-10"
          >
            Compute Academic Results
          </button>
        </div>
      </section>
    </AdminShell>
  );
}