import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentGraduationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: record, error } = await supabase
    .from("graduation_records")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <PortalShell
      title="Graduation Status"
      subtitle="Track your graduation eligibility, academic clearance, and certificate readiness."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Graduation Clearance
        </h2>

        {error && (
          <p className="mt-8 text-[#1c2b3a]/70">
            No graduation clearance has been processed yet.
          </p>
        )}

        {record && (
          <div className="mt-8 space-y-6">
            <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-6">
              <p className="section-label">Current Graduation Status</p>

              <h3 className="mt-3 font-edc-serif text-4xl font-semibold capitalize text-[#0b1f3a]">
                {record.graduation_status}
              </h3>

              <p className="mt-4 text-[#1c2b3a]/70">
                Academic Session:{" "}
                <strong>{record.academic_session}</strong>
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="border border-[#c9a84c]/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  CGPA
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0b1f3a]">
                  {Number(record.cgpa || 0).toFixed(2)}
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Classification
                </p>

                <p className="mt-2 text-lg font-semibold text-[#0b1f3a]">
                  {record.classification}
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Certificate
                </p>

                <p className="mt-2 text-lg font-semibold text-[#0b1f3a]">
                  {record.certificate_issued
                    ? "Issued"
                    : "Pending"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Academic Clearance
                </p>

                <p className="mt-3 text-xl font-semibold text-[#0b1f3a]">
                  {record.academic_clearance
                    ? "Cleared"
                    : "Pending"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Formation Clearance
                </p>

                <p className="mt-3 text-xl font-semibold text-[#0b1f3a]">
                  {record.formation_clearance
                    ? "Cleared"
                    : "Pending"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Commissioning Clearance
                </p>

                <p className="mt-3 text-xl font-semibold text-[#0b1f3a]">
                  {record.commissioning_clearance
                    ? "Cleared"
                    : "Pending"}
                </p>
              </div>
            </div>

            {record.remarks && (
              <div className="border border-[#c9a84c]/20 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Graduation Remarks
                </p>

                <p className="mt-4 leading-8 text-[#1c2b3a]/70">
                  {record.remarks}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </PortalShell>
  );
}