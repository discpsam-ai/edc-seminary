import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

type Intake = {
  id: string;
  name: string | null;
  academic_session: string | null;
  admission_year: string | null;
  cohort_code: string | null;
  entry_level: string | null;
  entry_semester: string | null;
  registration_status: string | null;
  description: string | null;
};

export default async function AdminIntakesPage() {
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

  const { data: intakes, error } = await supabase
    .from("intake_batches")
    .select("*")
    .order("created_at", { ascending: false });

  async function createIntake(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const name = formData.get("name") as string;
    const academicSession = formData.get("academic_session") as string;
    const admissionYear = formData.get("admission_year") as string;
    const cohortCode = formData.get("cohort_code") as string;
    const entryLevel = formData.get("entry_level") as string;
    const entrySemester = formData.get("entry_semester") as string;
    const registrationStatus = formData.get("registration_status") as string;
    const description = formData.get("description") as string;

    if (!academicSession) {
      throw new Error("No active academic session found.");
    }

    if (!entrySemester) {
      throw new Error("Please select an entry semester.");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("intake_batches").insert({
      name,
      academic_session: academicSession,
      admission_year: admissionYear,
      cohort_code: cohortCode,
      entry_level: entryLevel,
      entry_semester: entrySemester,
      registration_status: registrationStatus,
      description,
      created_by: user?.id,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/intakes");
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Admissions Intake</p>

            <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              Intake Batches
            </h1>

            <p className="mt-3 max-w-3xl text-[#1c2b3a]/70">
              Create and manage registration batches for each semester intake.
            </p>
          </div>

          <Link href="/admin/dashboard" className="btn-gold">
            Back to Admin
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Create Intake
            </h2>

            <div className="mt-5 border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
              <p className="text-sm font-semibold text-[#0b1f3a]">
                Active Session:{" "}
                {activeSession?.session_name || "No Active Session"}
              </p>

              <div className="mt-2 space-y-1">
                {openSemesters.length > 0 ? (
                  openSemesters.map((semester: OpenSemester) => (
                    <p
                      key={semester.id}
                      className="text-sm font-medium text-green-700"
                    >
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

            <form action={createIntake} className="mt-8 grid gap-5">
              <input
                type="hidden"
                name="academic_session"
                value={activeSession?.session_name || ""}
              />

              <input
                name="name"
                required
                placeholder="Intake Name e.g. 2025/2026 Semester 1 Intake"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <input
                name="admission_year"
                required
                placeholder="Admission Year e.g. 2025"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <input
                name="cohort_code"
                required
                placeholder="Cohort Code e.g. C1 or C2"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <select
                name="entry_level"
                required
                defaultValue="Level 1"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="Level 1">Level 1</option>
                <option value="Level 2">Level 2</option>
                <option value="Level 3">Level 3</option>
                <option value="Level 4">Level 4</option>
              </select>

              <select
                name="entry_semester"
                required
                defaultValue=""
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="">Select Entry Semester</option>

                {openSemesters.map((semester: OpenSemester) => (
                  <option key={semester.id} value={semester.semester_name}>
                    {semester.semester_name}
                  </option>
                ))}
              </select>

              <select
                name="registration_status"
                required
                defaultValue="open"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="paused">Paused</option>
              </select>

              <textarea
                name="description"
                placeholder="Short intake description..."
                spellCheck={false}
                className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none transition"
              />

              <button
                type="submit"
                className="btn-gold"
                disabled={!activeSession || openSemesters.length === 0}
              >
                Create Intake
              </button>
            </form>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Intake Records
            </h2>

            {error && <p className="mt-6 text-red-600">{error.message}</p>}

            {!intakes || intakes.length === 0 ? (
              <p className="mt-8 text-[#1c2b3a]/70">
                No intake batch has been created yet.
              </p>
            ) : (
              <div className="mt-8 space-y-5">
                {intakes.map((intake: Intake) => (
                  <div
                    key={intake.id}
                    className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                          {intake.name || "Unnamed Intake"}
                        </h3>

                        <p className="mt-2 text-sm text-[#1c2b3a]/60">
                          {intake.academic_session || "No Session"} •{" "}
                          {intake.admission_year || "No Year"} •{" "}
                          {intake.cohort_code || "No Cohort"} •{" "}
                          {intake.entry_level || "No Level"} •{" "}
                          {intake.entry_semester || "No Semester"}
                        </p>
                      </div>

                      <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                        {intake.registration_status || "unknown"}
                      </span>
                    </div>

                    {intake.description && (
                      <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                        {intake.description}
                      </p>
                    )}
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