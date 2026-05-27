import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

function generateStudentNumber(
  admissionYear: string,
  cohortCode: string,
  serial: number
) {
  const year = admissionYear.slice(-2);
  const cleanCohort = cohortCode.toUpperCase();
  const paddedSerial = String(serial).padStart(3, "0");

  return `EDC/${year}/${cleanCohort}/${paddedSerial}`;
}

export default async function GenerateStudentIdPage() {
  const supabase = await createClient();

  const { data: students, error: studentsError } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, role, roles, level, current_semester, student_number"
    )
    .order("full_name", { ascending: true });

  const { data: intakes, error: intakesError } = await supabase
    .from("intake_batches")
    .select(
      "id, name, academic_session, admission_year, cohort_code, entry_level, entry_semester, registration_status"
    )
    .eq("registration_status", "open")
    .order("created_at", { ascending: false });

  async function generateId(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const studentId = formData.get("student_id") as string;
    const intakeBatchId = formData.get("intake_batch_id") as string;

    const { data: existingStudent } = await supabase
      .from("profiles")
      .select("student_number")
      .eq("id", studentId)
      .single();

    if (existingStudent?.student_number) {
      throw new Error("This student already has a Student ID.");
    }

    const { data: intake } = await supabase
      .from("intake_batches")
      .select("*")
      .eq("id", intakeBatchId)
      .single();

    if (!intake) {
      throw new Error("Selected intake batch not found.");
    }

    const year = String(intake.admission_year);
    const cohortCode = String(intake.cohort_code).toUpperCase();

    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("intake_batch_id", intakeBatchId)
      .not("student_number", "is", null);

    const serial = (count || 0) + 1;

    const studentNumber = generateStudentNumber(year, cohortCode, serial);

    const { error } = await supabase
      .from("profiles")
      .update({
        student_number: studentNumber,
        level: intake.entry_level,
        current_semester: intake.entry_semester,
        intake_batch_id: intakeBatchId,
      })
      .eq("id", studentId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/students/generate-id");
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Student Identity</p>

            <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              Generate Student ID
            </h1>

            <p className="mt-3 max-w-2xl text-[#1c2b3a]/70">
              Assign official EDC student numbers based on intake cohort,
              admission year, and student admission order.
            </p>
          </div>

          <Link href="/admin/students" className="btn-gold">
            Back to Students
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Assign ID
            </h2>

            {studentsError && (
              <p className="mt-6 text-red-600">{studentsError.message}</p>
            )}

            {intakesError && (
              <p className="mt-6 text-red-600">{intakesError.message}</p>
            )}

            <form action={generateId} className="mt-8 grid gap-5">
              <select
                name="student_id"
                required
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="">Select Student</option>

                {students?.map((student: any) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name || "Unnamed Student"} —{" "}
                    {student.email || "No email"}
                    {student.student_number
                      ? ` — ${student.student_number}`
                      : ""}
                  </option>
                ))}
              </select>

              <select
                name="intake_batch_id"
                required
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="">Select Intake Batch</option>

                {intakes?.map((intake: any) => (
                  <option key={intake.id} value={intake.id}>
                    {intake.name} — {intake.admission_year} —{" "}
                    {intake.cohort_code} — {intake.entry_semester}
                  </option>
                ))}
              </select>

              <button type="submit" className="btn-gold">
                Generate Student ID
              </button>
            </form>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Student ID Records
            </h2>

            {studentsError && (
              <p className="mt-6 text-red-600">{studentsError.message}</p>
            )}

            {!students || students.length === 0 ? (
              <p className="mt-8 text-[#1c2b3a]/70">
                No student profile found.
              </p>
            ) : (
              <div className="mt-8 space-y-4">
                {students.map((student: any) => (
                  <div
                    key={student.id}
                    className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                  >
                    <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {student.full_name || "Unnamed Student"}
                    </h3>

                    <p className="mt-1 text-sm text-[#1c2b3a]/60">
                      {student.email || "No email"}
                    </p>

                    <p className="mt-3 font-semibold text-[#0b1f3a]">
                      Student ID: {student.student_number || "Not assigned"}
                    </p>

                    <p className="mt-1 text-sm text-[#1c2b3a]/60">
                      Level: {student.level || "Not assigned"}
                    </p>

                    <p className="mt-1 text-sm text-[#1c2b3a]/60">
                      Current Semester:{" "}
                      {student.current_semester || "Not assigned"}
                    </p>

                    <p className="mt-1 text-xs text-[#1c2b3a]/45">
                      Role: {student.role || "Not set"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}