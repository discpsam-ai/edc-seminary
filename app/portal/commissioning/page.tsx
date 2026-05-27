import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentCommissioningPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: record, error } = await supabase
    .from("formation_records")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <PortalShell
      title="Commissioning"
      subtitle="Track your commissioning readiness, formation standing, and final clearance status."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Commissioning Clearance
        </h2>

        {error && (
          <p className="mt-6 text-[#1c2b3a]/70">
            No commissioning record has been released yet.
          </p>
        )}

        {record && (
          <div className="mt-8 space-y-6">
            <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-6">
              <p className="section-label">Current Status</p>

              <h3 className="mt-3 font-edc-serif text-4xl font-semibold capitalize text-[#0b1f3a]">
                {record.commissioning_status?.replace("_", " ")}
              </h3>

              <p className="mt-4 text-[#1c2b3a]/70">
                Academic Standing:{" "}
                <strong className="capitalize">
                  {record.academic_standing || "Not stated"}
                </strong>
              </p>

              <p className="mt-2 text-[#1c2b3a]/70">
                Spiritual Standing:{" "}
                <strong className="capitalize">
                  {record.spiritual_standing || "Not stated"}
                </strong>
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="border border-[#c9a84c]/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Prayer
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {record.prayer_consistency}
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Attendance
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {record.attendance_score}
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Discipleship
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {record.discipleship_participation}
                </p>
              </div>
            </div>

            <div className="border border-[#c9a84c]/20 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                Final Recommendation
              </p>

              <p className="mt-4 leading-8 text-[#1c2b3a]/70">
                {record.recommendation || "No recommendation has been given yet."}
              </p>
            </div>
          </div>
        )}
      </section>
    </PortalShell>
  );
}