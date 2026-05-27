import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";

export default async function GraduationClearancePage() {
  const supabase = await createClient();

  const { data: records, error } = await supabase
    .from("graduation_records")
    .select(`
      *,
      profiles:student_id (
        full_name,
        student_number,
        email
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <AdminShell
      title="Graduation Clearance"
      subtitle="Review graduation eligibility, certificate clearance, and completion approval."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Graduation Records
        </h2>

        {error && (
          <p className="mt-6 text-red-600">{error.message}</p>
        )}

        {!records || records.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No graduation clearance record available yet.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {records.map((record: any) => (
              <div
                key={record.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                      {record.profiles?.full_name || "Unnamed Student"}
                    </h3>

                    <p className="mt-2 text-[#1c2b3a]/60">
                      Student ID:{" "}
                      {record.profiles?.student_number || "N/A"}
                    </p>

                    <p className="mt-1 text-[#1c2b3a]/60">
                      {record.profiles?.email}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {record.graduation_status || "pending"}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      CGPA
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {Number(record.cgpa || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Classification
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {record.classification || "N/A"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Academic Clearance
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {record.academic_clearance
                        ? "Approved"
                        : "Pending"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Certificate
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {record.certificate_issued
                        ? "Issued"
                        : "Not Issued"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Formation Clearance
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {record.formation_clearance
                        ? "Approved"
                        : "Pending"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Commissioning
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {record.commissioning_clearance
                        ? "Approved"
                        : "Pending"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Academic Session
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {record.academic_session || "N/A"}
                    </p>
                  </div>
                </div>

                {record.remarks && (
                  <div className="mt-6 border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Remarks
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
      </section>
    </AdminShell>
  );
}