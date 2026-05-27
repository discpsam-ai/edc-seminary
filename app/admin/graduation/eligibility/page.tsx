import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

function getClassification(cgpa: number) {
  if (cgpa >= 4.5) return "Distinction";
  if (cgpa >= 3.5) return "Upper Credit";
  if (cgpa >= 2.5) return "Lower Credit";
  if (cgpa >= 1.5) return "Pass";
  return "Probation";
}

export default async function GraduationEligibilityPage() {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, student_number")
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  async function checkEligibility(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const studentId = formData.get("student_id") as string;
    const academicSession = formData.get("academic_session") as string;

    const { data: results } = await supabase
      .from("course_results")
      .select("*")
      .eq("student_id", studentId);

    const completedCourses = results?.length || 0;

    const failedCourses =
      results?.filter((result: any) => Number(result.grade_point || 0) === 0)
        .length || 0;

    const totalCredits =
      results?.reduce(
        (sum: number, result: any) => sum + Number(result.credit_units || 0),
        0
      ) || 0;

    const totalQualityPoints =
      results?.reduce(
        (sum: number, result: any) =>
          sum + Number(result.quality_points || 0),
        0
      ) || 0;

    const cgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

    const eligible =
      completedCourses > 0 && failedCourses === 0 && cgpa >= 1.5;

    const eligibilityStatus = eligible ? "eligible" : "not_eligible";

    const summary = `Graduation Eligibility Summary:
CGPA: ${cgpa.toFixed(2)}
Classification: ${getClassification(cgpa)}
Completed Courses: ${completedCourses}
Failed Courses: ${failedCourses}
Total Credit Units: ${totalCredits}
Eligibility Status: ${eligibilityStatus}`;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("graduation_records").upsert(
      {
        student_id: studentId,
        academic_session: academicSession,
        cgpa,
        classification: getClassification(cgpa),
        graduation_status: eligible ? "eligible" : "pending",
        eligibility_status: eligibilityStatus,
        eligibility_checked_at: new Date().toISOString(),
        eligibility_summary: summary,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "student_id,academic_session",
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/graduation/eligibility");
  }

  return (
    <AdminShell
      title="Graduation Eligibility"
      subtitle="Automatically check student eligibility for graduation using CGPA, failed courses, and completed course records."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Check Student Eligibility
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!students || students.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">No student found.</p>
        ) : (
          <form action={checkEligibility} className="mt-8 grid gap-5">
            <select
              name="student_id"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            >
              <option value="">Select Student</option>

              {students.map((student: any) => (
                <option key={student.id} value={student.id}>
                  {student.full_name} —{" "}
                  {student.student_number || "No Student ID"} — {student.email}
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
              Check Eligibility
            </button>
          </form>
        )}
      </section>
    </AdminShell>
  );
}