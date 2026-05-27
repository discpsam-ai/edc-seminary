import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminCommissioningPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, student_number, level")
    .or("role.eq.student,roles.cs.{student}")
    .order("full_name", { ascending: true });

  const { data: records, error } = await supabase
    .from("formation_records")
    .select(`
      *,
      profiles:student_id (
        full_name,
        student_number,
        level
      )
    `)
    .order("created_at", { ascending: false });

  async function createFormationRecord(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const studentId = formData.get("student_id") as string;
    const academicScore = Number(formData.get("academic_score"));
    const formationStatus = formData.get("formation_status") as string;
    const commissioningStatus = formData.get("commissioning_status") as string;
    const maturityNote = formData.get("maturity_note") as string;
    const ministryParticipation = formData.get("ministry_participation") as string;
    const reviewRemarks = formData.get("review_remarks") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("formation_records").upsert(
      {
        student_id: studentId,
        academic_score: academicScore,
        formation_status: formationStatus,
        commissioning_status: commissioningStatus,
        maturity_note: maturityNote,
        ministry_participation: ministryParticipation,
        review_remarks: reviewRemarks,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "student_id",
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/commissioning");
  }

  return (
    <AdminShell
      title="Commissioning Oversight"
      subtitle="Review student formation, academic completion, spiritual maturity, ministry participation, and commissioning readiness."
    >
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Review Candidate
          </h2>

          <form action={createFormationRecord} className="mt-8 grid gap-5">
            <select
              name="student_id"
              required
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="">Select Student</option>

              {students?.map((student: any) => (
                <option key={student.id} value={student.id}>
                  {student.full_name} — {student.student_number || "No ID"} —{" "}
                  {student.level || "No level"}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="academic_score"
              defaultValue={0}
              min="0"
              max="100"
              required
              placeholder="Academic Score / Percentage"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <select
              name="formation_status"
              required
              defaultValue="in formation"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="in formation">In Formation</option>
              <option value="strong">Strong</option>
              <option value="good">Good</option>
              <option value="needs attention">Needs Attention</option>
              <option value="deferred">Deferred</option>
            </select>

            <select
              name="commissioning_status"
              required
              defaultValue="pending"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="under review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="deferred">Deferred</option>
            </select>

            <textarea
              name="maturity_note"
              placeholder="Spiritual maturity note..."
              className="min-h-28 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <textarea
              name="ministry_participation"
              placeholder="Ministry participation..."
              className="min-h-28 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <textarea
              name="review_remarks"
              placeholder="Review remarks..."
              className="min-h-28 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <button type="submit" className="btn-gold">
              Save Review
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Commissioning Records
          </h2>

          {error && <p className="mt-6 text-red-600">{error.message}</p>}

          {!records || records.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No commissioning record has been created yet.
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
                        {record.profiles?.full_name || "Unnamed Student"}
                      </h3>

                      <p className="mt-1 text-sm text-[#1c2b3a]/60">
                        {record.profiles?.student_number || "No Student ID"} •{" "}
                        {record.profiles?.level || "No level"}
                      </p>
                    </div>

                    <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                      {record.commissioning_status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-[#1c2b3a]/60">Academic</p>
                      <p className="mt-1 font-semibold text-[#0b1f3a]">
                        {record.academic_score || 0}%
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#1c2b3a]/60">Formation</p>
                      <p className="mt-1 font-semibold capitalize text-[#0b1f3a]">
                        {record.formation_status}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#1c2b3a]/60">Reviewed</p>
                      <p className="mt-1 font-semibold text-[#0b1f3a]">
                        {record.reviewed_at
                          ? new Date(record.reviewed_at).toLocaleDateString()
                          : "Not reviewed"}
                      </p>
                    </div>
                  </div>

                  {record.review_remarks && (
                    <p className="mt-5 leading-7 text-[#1c2b3a]/70">
                      {record.review_remarks}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}