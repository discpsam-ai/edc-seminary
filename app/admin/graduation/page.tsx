import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

function getClassification(cgpa: number) {
  if (cgpa >= 4.5) return "First Class";
  if (cgpa >= 3.5) return "Second Class Upper (2:1)";
  if (cgpa >= 2.4) return "Second Class Lower (2:2)";
  if (cgpa >= 1.5) return "Third Class";
  if (cgpa >= 1.0) return "Pass";
  return "Fail";
}

export default async function AdminGraduationPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, email, level")
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  const { data: records, error } = await supabase
    .from("graduation_records")
    .select(`
      *,
      profiles:student_id (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  async function createGraduationRecord(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const studentId = formData.get("student_id") as string;
    const academicSession = formData.get("academic_session") as string;
    const remarks = formData.get("remarks") as string;

    const { data: results } = await supabase
      .from("course_results")
      .select("credit_units, quality_points, grade_point")
      .eq("student_id", studentId);

    const totalCreditUnits =
      results?.reduce(
        (sum: number, item: any) => sum + Number(item.credit_units || 0),
        0
      ) || 0;

    const totalQualityPoints =
      results?.reduce(
        (sum: number, item: any) => sum + Number(item.quality_points || 0),
        0
      ) || 0;

    const cgpa =
      totalCreditUnits > 0 ? totalQualityPoints / totalCreditUnits : 0;

    const classification = getClassification(cgpa);

    const { data: formation } = await supabase
      .from("formation_records")
      .select("commissioning_status")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const formationClearance =
      formation?.commissioning_status === "approved";

    const failedCourses =
      results?.filter(
        (item: any) => Number(item.grade_point || 0) === 0
      ).length || 0;

    const completedCourses = results?.length || 0;

    const academicClearance =
      cgpa >= 1.0 && failedCourses === 0 && completedCourses > 0;

    const commissioningClearance = formationClearance;

    const graduationStatus =
      academicClearance &&
      formationClearance &&
      commissioningClearance
        ? "eligible"
        : "pending";

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const summary = `Academic Summary:
CGPA: ${cgpa.toFixed(2)}
Classification: ${classification}
Completed Courses: ${completedCourses}
Failed Courses: ${failedCourses}
Total Credit Units: ${totalCreditUnits}`;

    const { error } = await supabase
      .from("graduation_records")
      .upsert(
        {
          student_id: studentId,
          academic_session: academicSession,
          cgpa,
          classification,
          academic_clearance: academicClearance,
          formation_clearance: formationClearance,
          commissioning_clearance: commissioningClearance,
          graduation_status: graduationStatus,
          eligibility_status:
            graduationStatus === "eligible"
              ? "eligible"
              : "pending",
          eligibility_checked_at: new Date().toISOString(),
          eligibility_summary: summary,
          approved_by: user?.id,
          approved_at:
            graduationStatus === "eligible"
              ? new Date().toISOString()
              : null,
          remarks: `${remarks || ""}

${summary}`,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "student_id,academic_session",
        }
      );

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/graduation");
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Graduation Clearance</p>

            <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              Graduation & Certificate Eligibility
            </h1>

            <p className="mt-3 max-w-3xl text-[#1c2b3a]/70">
              Review academic standing, formation clearance, commissioning
              approval, and certificate eligibility.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/graduation/eligibility"
              className="btn-gold"
            >
              Graduation Eligibility Engine
            </Link>

            <Link
              href="/admin/dashboard"
              className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-[#c9a84c]/20 bg-white p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Generate Clearance
            </h2>

            <form action={createGraduationRecord} className="mt-8 grid gap-5">
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

              <input
                name="academic_session"
                required
                placeholder="Academic Session e.g. 2026/2027"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              />

              <textarea
                name="remarks"
                placeholder="Graduation remarks..."
                className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              />

              <button type="submit" className="btn-gold">
                Compute Graduation Clearance
              </button>
            </form>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Clearance Records
            </h2>

            {error && <p className="mt-6 text-red-600">{error.message}</p>}

            {!records || records.length === 0 ? (
              <p className="mt-8 text-[#1c2b3a]/70">
                No graduation clearance record has been created yet.
              </p>
            ) : (
              <div className="mt-8 space-y-5">
                {records.map((record: any) => (
                  <div
                    key={record.id}
                    className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                          {record.profiles?.full_name}
                        </h3>

                        <p className="mt-1 text-sm text-[#1c2b3a]/60">
                          {record.profiles?.email}
                        </p>
                      </div>

                      <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                        {record.graduation_status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-[#1c2b3a]/60">CGPA</p>

                        <p className="mt-1 font-semibold text-[#0b1f3a]">
                          {Number(record.cgpa || 0).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-[#1c2b3a]/60">
                          Classification
                        </p>

                        <p className="mt-1 font-semibold text-[#0b1f3a]">
                          {record.classification}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-[#1c2b3a]/60">
                          Certificate
                        </p>

                        <p className="mt-1 font-semibold text-[#0b1f3a]">
                          {record.certificate_issued
                            ? "Issued"
                            : "Not Issued"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <p>
                        Academic:{" "}
                        <strong>
                          {record.academic_clearance
                            ? "Cleared"
                            : "Pending"}
                        </strong>
                      </p>

                      <p>
                        Formation:{" "}
                        <strong>
                          {record.formation_clearance
                            ? "Cleared"
                            : "Pending"}
                        </strong>
                      </p>

                      <p>
                        Commissioning:{" "}
                        <strong>
                          {record.commissioning_clearance
                            ? "Cleared"
                            : "Pending"}
                        </strong>
                      </p>
                    </div>

                    {record.remarks && (
                      <div className="mt-5 border border-[#c9a84c]/20 bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                          Graduation / Academic Summary
                        </p>

                        <p className="mt-3 whitespace-pre-line leading-7 text-[#1c2b3a]/70">
                          {record.remarks}
                        </p>
                      </div>
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