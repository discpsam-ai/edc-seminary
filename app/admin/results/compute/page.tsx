import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

function getGrade(total: number) {
  if (total >= 70) return { grade: "A", point: 5 };
  if (total >= 60) return { grade: "B", point: 4 };
  if (total >= 50) return { grade: "C", point: 3 };
  if (total >= 45) return { grade: "D", point: 2 };
  if (total >= 40) return { grade: "E", point: 1 };

  return { grade: "F", point: 0 };
}

export default async function ComputeResultsPage() {
  const supabase = await createClient();

  const { data: registrations } = await supabase
    .from("course_registrations")
    .select(`
      *,
      profiles:student_id (
        full_name,
        student_number
      ),
      courses:course_id (
        title,
        credit_units
      )
    `)
    .order("registered_at", { ascending: false });

  const { data: existingResults } = await supabase
    .from("course_results")
    .select(
      "student_id, course_code, academic_session, total_score, grade"
    );

  const resultMap = new Map(
    existingResults?.map((result: any) => [
      `${result.student_id}-${result.course_code}-${result.academic_session}`,
      result,
    ]) || []
  );

  async function computeResult(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const registrationId = formData.get("registration_id") as string;

    const assignmentScore = Number(
      formData.get("assignment_score")
    );

    const examScore = Number(formData.get("exam_score"));

    if (assignmentScore > 40 || examScore > 60) {
      throw new Error(
        "Assignment score must be 40 or below, and exam score must be 60 or below."
      );
    }

    const { data: registration } = await supabase
      .from("course_registrations")
      .select(`
        *,
        courses:course_id (
          credit_units
        )
      `)
      .eq("id", registrationId)
      .single();

    if (!registration) {
      throw new Error("Course registration not found.");
    }

    const totalScore = assignmentScore + examScore;

    const gradeData = getGrade(totalScore);

    const creditUnits = Number(
      registration.courses?.credit_units || 1
    );

    const qualityPoints =
      gradeData.point * creditUnits;

    const { error } = await supabase
      .from("course_results")
      .upsert(
        {
          student_id: registration.student_id,
          course_code: registration.course_code,
          semester: registration.semester,
          level: registration.level,
          assignment_score: assignmentScore,
          exam_score: examScore,
          total_score: totalScore,
          grade: gradeData.grade,
          grade_point: gradeData.point,
          credit_units: creditUnits,
          quality_points: qualityPoints,
          academic_session: registration.academic_session,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict:
            "student_id,course_code,academic_session",
        }
      );

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/results/compute");
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Academic Computation
            </p>

            <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              Compute Course Results
            </h1>

            <p className="mt-3 max-w-3xl text-[#1c2b3a]/70">
              Convert registered course assessment
              scores into final grades, grade points,
              and transcript-ready course results.
            </p>
          </div>

          <Link
            href="/admin/results"
            className="btn-gold"
          >
            Back to Results
          </Link>
        </div>

        {!registrations || registrations.length === 0 ? (
          <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <p className="text-[#1c2b3a]/70">
              No course registration found yet.
            </p>
          </section>
        ) : (
          <div className="space-y-5">
            {registrations.map((registration: any) => {
              const existingResult = resultMap.get(
                `${registration.student_id}-${registration.course_code}-${registration.academic_session}`
              );

              return (
                <section
                  key={registration.id}
                  className="border border-[#c9a84c]/20 bg-white/90 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="section-label">
                        {registration.course_code}
                      </p>

                      <h2 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                        {registration.courses?.title ||
                          registration.course_code}
                      </h2>

                      <p className="mt-2 text-[#1c2b3a]/60">
                        Student:{" "}
                        {registration.profiles?.full_name ||
                          "Unnamed"}
                      </p>

                      <p className="mt-1 text-sm text-[#1c2b3a]/50">
                        Student ID:{" "}
                        {registration.profiles
                          ?.student_number ||
                          "Not assigned"}
                      </p>

                      <p className="mt-1 text-sm text-[#1c2b3a]/50">
                        {registration.level} •{" "}
                        {registration.semester} •{" "}
                        {registration.academic_session}
                      </p>

                      {existingResult && (
                        <p className="mt-4 border-l-4 border-[#c9a84c] bg-[#fdfaf4]/90 p-4 text-sm text-[#1c2b3a]/70">
                          Result already computed:{" "}
                          {existingResult.total_score} —
                          Grade{" "}
                          {existingResult.grade}.
                          Submitting again will update
                          this result.
                        </p>
                      )}
                    </div>
                  </div>

                  <form
                    action={computeResult}
                    className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]"
                  >
                    <input
                      type="hidden"
                      name="registration_id"
                      value={registration.id}
                    />

                    <input
                      type="number"
                      name="assignment_score"
                      min="0"
                      max="40"
                      required
                      placeholder="Assignment / CA Score"
                      className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                    />

                    <input
                      type="number"
                      name="exam_score"
                      min="0"
                      max="60"
                      required
                      placeholder="Exam Score"
                      className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                    />

                    <button
                      type="submit"
                      className="btn-gold"
                    >
                      {existingResult
                        ? "Update Result"
                        : "Compute"}
                    </button>
                  </form>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}