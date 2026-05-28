import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type Student = {
  id: string;
  full_name: string | null;
  email: string | null;
  student_number: string | null;
  admission_set: string | null;
  current_semester: string | null;
  cohort_name: string | null;
  student_status: string | null;
};

export default async function AdminPromotionsPage() {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      student_number,
      admission_set,
      current_semester,
      cohort_name,
      student_status
    `
    )
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  const { data: promotions } = await supabase
    .from("student_promotions")
    .select(
      `
      *,
      profiles:student_id (
        full_name,
        email,
        student_number
      )
    `
    )
    .order("promoted_at", { ascending: false });

  async function promoteStudent(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const studentId = formData.get("student_id") as string;
    const toSession = formData.get("to_session") as string;
    const toSemester = formData.get("to_semester") as string;
    const toCohort = formData.get("to_cohort") as string;

    if (!studentId) {
      throw new Error("Please select a student.");
    }

    if (!toSession) {
      throw new Error("Please enter the destination session.");
    }

    if (!toSemester) {
      throw new Error("Please select the destination semester.");
    }

    const { data: student, error: studentError } = await supabase
      .from("profiles")
      .select("admission_set, current_semester, cohort_name")
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      throw new Error("Student not found.");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: promotionError } = await supabase
      .from("student_promotions")
      .insert({
        student_id: studentId,
        from_session: student.admission_set,
        to_session: toSession,
        from_semester: student.current_semester,
        to_semester: toSemester,
        from_cohort: student.cohort_name,
        to_cohort: toCohort || student.cohort_name,
        promotion_status: "promoted",
        promoted_by: user?.id,
        promoted_at: new Date().toISOString(),
      });

    if (promotionError) {
      throw new Error(promotionError.message);
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        admission_set: toSession,
        current_semester: toSemester,
        cohort_name: toCohort || student.cohort_name,
        student_status: "active",
      })
      .eq("id", studentId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    revalidatePath("/admin/promotions");
  }

  async function bulkPromoteStudents(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const fromSession = formData.get("from_session") as string;
    const fromSemester = formData.get("from_semester") as string;
    const toSession = formData.get("bulk_to_session") as string;
    const toSemester = formData.get("bulk_to_semester") as string;
    const toCohort = formData.get("bulk_to_cohort") as string;

    if (!fromSession) {
      throw new Error("Please enter the current session.");
    }

    if (!fromSemester) {
      throw new Error("Please select the current semester.");
    }

    if (!toSession) {
      throw new Error("Please enter the destination session.");
    }

    if (!toSemester) {
      throw new Error("Please select the destination semester.");
    }

    const { error } = await supabase.rpc("bulk_promote_students", {
      from_session_input: fromSession,
      from_semester_input: fromSemester,
      to_session_input: toSession,
      to_semester_input: toSemester,
      to_cohort_input: toCohort || null,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/promotions");
  }

  return (
    <AdminShell
      title="Student Promotions"
      subtitle="Promote students from one semester or cohort into the next academic stage."
    >
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-8">
          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Promote One Student
            </h2>

            <form action={promoteStudent} className="mt-8 grid gap-5">
              <select
                name="student_id"
                required
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="">Select Student</option>

                {students?.map((student: Student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name || "Unnamed Student"} —{" "}
                    {student.student_number || "No Student ID"} —{" "}
                    {student.admission_set || "No Session"} —{" "}
                    {student.current_semester || "No Semester"} —{" "}
                    {student.cohort_name || "No Cohort"}
                  </option>
                ))}
              </select>

              <input
                name="to_session"
                required
                placeholder="Promote To Session e.g. 2025/2026"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <select
                name="to_semester"
                required
                defaultValue=""
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="">Promote To Semester</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>

              <input
                name="to_cohort"
                placeholder="Promote To Cohort e.g. C1 or C2"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <button type="submit" className="btn-gold">
                Promote Student
              </button>
            </form>

            {error && <p className="mt-6 text-red-600">{error.message}</p>}
          </div>

          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Bulk Promote Students
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#1c2b3a]/70">
              Use this to move an entire semester group forward, for example
              from 2025/2026 Semester 1 into 2025/2026 Semester 2.
            </p>

            <form action={bulkPromoteStudents} className="mt-8 grid gap-5">
              <input
                name="from_session"
                required
                placeholder="From Session e.g. 2025/2026"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <select
                name="from_semester"
                required
                defaultValue=""
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="">From Semester</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>

              <input
                name="bulk_to_session"
                required
                placeholder="To Session e.g. 2025/2026"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <select
                name="bulk_to_semester"
                required
                defaultValue=""
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="">To Semester</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>

              <input
                name="bulk_to_cohort"
                placeholder="To Cohort e.g. C1 or C2"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <button type="submit" className="btn-gold">
                Bulk Promote Students
              </button>
            </form>
          </div>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Promotion History
          </h2>

          {!promotions || promotions.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No student promotion has been recorded yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {promotions.map((promotion: any) => (
                <div
                  key={promotion.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                >
                  <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    {promotion.profiles?.full_name || "Unnamed Student"}
                  </h3>

                  <p className="mt-1 text-sm text-[#1c2b3a]/60">
                    {promotion.profiles?.student_number || "No Student ID"} —{" "}
                    {promotion.profiles?.email || "No Email"}
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="border border-[#c9a84c]/20 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                        From
                      </p>

                      <p className="mt-2 text-[#0b1f3a]">
                        {promotion.from_session || "No Session"} —{" "}
                        {promotion.from_semester || "No Semester"} —{" "}
                        {promotion.from_cohort || "No Cohort"}
                      </p>
                    </div>

                    <div className="border border-[#c9a84c]/20 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                        To
                      </p>

                      <p className="mt-2 text-[#0b1f3a]">
                        {promotion.to_session || "No Session"} —{" "}
                        {promotion.to_semester || "No Semester"} —{" "}
                        {promotion.to_cohort || "No Cohort"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-[#1c2b3a]/60">
                    Promoted:{" "}
                    {promotion.promoted_at
                      ? new Date(promotion.promoted_at).toLocaleString()
                      : "N/A"}
                  </p>

                  <span className="mt-4 inline-block border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {promotion.promotion_status || "promoted"}
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