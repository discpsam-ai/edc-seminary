import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentFormationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: records, error } = await supabase
    .from("formation_records")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <PortalShell
      title="Formation Record"
      subtitle="View your spiritual formation progress, commissioning status, and leadership recommendations."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          My Formation Standing
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!records || records.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No formation record has been released for you yet.
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            {records.map((record: any) => (
              <div
                key={record.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="section-label">
                      {record.academic_session || "Formation Session"}
                    </p>

                    <h3 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                      Commissioning Status
                    </h3>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {record.commissioning_status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Prayer Consistency
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {record.prayer_consistency}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Attendance
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {record.attendance_score}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Discipleship
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {record.discipleship_participation}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Character
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {record.character_score}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Ministry Service
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {record.ministry_service}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Leadership Conduct
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                      {record.leadership_conduct}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Academic Standing
                    </p>
                    <p className="mt-2 font-semibold capitalize text-[#0b1f3a]">
                      {record.academic_standing || "Not stated"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Spiritual Standing
                    </p>
                    <p className="mt-2 font-semibold capitalize text-[#0b1f3a]">
                      {record.spiritual_standing || "Not stated"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border border-[#c9a84c]/20 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Formation Recommendation
                  </p>

                  <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                    {record.recommendation ||
                      "No recommendation has been given yet."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PortalShell>
  );
}