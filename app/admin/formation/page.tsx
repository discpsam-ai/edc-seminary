import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function FormationPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, email, level")
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  const { data: records, error } = await supabase
    .from("formation_records")
    .select(`
      *,
      profiles:student_id (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  async function saveFormationRecord(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const studentId = formData.get("student_id") as string;

    const prayerConsistency = Number(
      formData.get("prayer_consistency")
    );

    const attendanceScore = Number(
      formData.get("attendance_score")
    );

    const discipleshipParticipation = Number(
      formData.get("discipleship_participation")
    );

    const characterScore = Number(
      formData.get("character_score")
    );

    const ministryService = Number(
      formData.get("ministry_service")
    );

    const leadershipConduct = Number(
      formData.get("leadership_conduct")
    );

    const academicStanding = formData.get(
      "academic_standing"
    ) as string;

    const spiritualStanding = formData.get(
      "spiritual_standing"
    ) as string;

    const commissioningStatus = formData.get(
      "commissioning_status"
    ) as string;

    const recommendation = formData.get(
      "recommendation"
    ) as string;

    const academicSession = formData.get(
      "academic_session"
    ) as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("formation_records")
      .upsert(
        {
          student_id: studentId,
          prayer_consistency: prayerConsistency,
          attendance_score: attendanceScore,
          discipleship_participation:
            discipleshipParticipation,
          character_score: characterScore,
          ministry_service: ministryService,
          leadership_conduct: leadershipConduct,
          academic_standing: academicStanding,
          spiritual_standing: spiritualStanding,
          commissioning_status: commissioningStatus,
          recommendation: recommendation,
          academic_session: academicSession,
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

    revalidatePath("/admin/formation");
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="section-label">
            Spiritual Formation Oversight
          </p>

          <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            Formation & Commissioning
          </h1>

          <p className="mt-3 max-w-3xl text-[#1c2b3a]/70">
            Evaluate spiritual formation, discipleship,
            ministry conduct, and commissioning readiness
            for EDC students.
          </p>
        </div>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-[#c9a84c]/20 bg-white p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Formation Evaluation
            </h2>

            <form
              action={saveFormationRecord}
              className="mt-8 grid gap-5"
            >
              <select
                name="student_id"
                required
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              >
                <option value="">
                  Select Student
                </option>

                {students?.map((student: any) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.full_name} —{" "}
                    {student.email}
                  </option>
                ))}
              </select>

              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  type="number"
                  name="prayer_consistency"
                  placeholder="Prayer Consistency"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
                />

                <input
                  type="number"
                  name="attendance_score"
                  placeholder="Attendance Score"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  type="number"
                  name="discipleship_participation"
                  placeholder="Discipleship Participation"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
                />

                <input
                  type="number"
                  name="character_score"
                  placeholder="Character Score"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  type="number"
                  name="ministry_service"
                  placeholder="Ministry Service"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
                />

                <input
                  type="number"
                  name="leadership_conduct"
                  placeholder="Leadership Conduct"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
                />
              </div>

              <select
                name="academic_standing"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              >
                <option value="">
                  Academic Standing
                </option>

                <option value="excellent">
                  Excellent
                </option>

                <option value="good">
                  Good
                </option>

                <option value="fair">
                  Fair
                </option>

                <option value="poor">
                  Poor
                </option>
              </select>

              <select
                name="spiritual_standing"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              >
                <option value="">
                  Spiritual Standing
                </option>

                <option value="sound">
                  Sound
                </option>

                <option value="growing">
                  Growing
                </option>

                <option value="unstable">
                  Unstable
                </option>
              </select>

              <select
                name="commissioning_status"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              >
                <option value="pending">
                  Pending
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="under_review">
                  Under Review
                </option>

                <option value="not_approved">
                  Not Approved
                </option>
              </select>

              <input
                name="academic_session"
                placeholder="Academic Session"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              />

              <textarea
                name="recommendation"
                placeholder="Formation recommendation..."
                className="min-h-40 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              />

              <button
                type="submit"
                className="btn-gold"
              >
                Save Formation Record
              </button>
            </form>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Formation Records
            </h2>

            {error && (
              <p className="mt-6 text-red-600">
                {error.message}
              </p>
            )}

            {!records || records.length === 0 ? (
              <p className="mt-8 text-[#1c2b3a]/70">
                No formation record has been created yet.
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
                        {record.commissioning_status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <p>
                        Prayer:{" "}
                        <strong>
                          {record.prayer_consistency}
                        </strong>
                      </p>

                      <p>
                        Attendance:{" "}
                        <strong>
                          {record.attendance_score}
                        </strong>
                      </p>

                      <p>
                        Discipleship:{" "}
                        <strong>
                          {
                            record.discipleship_participation
                          }
                        </strong>
                      </p>

                      <p>
                        Character:{" "}
                        <strong>
                          {record.character_score}
                        </strong>
                      </p>

                      <p>
                        Ministry Service:{" "}
                        <strong>
                          {record.ministry_service}
                        </strong>
                      </p>

                      <p>
                        Leadership Conduct:{" "}
                        <strong>
                          {record.leadership_conduct}
                        </strong>
                      </p>
                    </div>

                    <div className="mt-5 border border-[#c9a84c]/20 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                        Recommendation
                      </p>

                      <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                        {record.recommendation ||
                          "No recommendation yet."}
                      </p>
                    </div>
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