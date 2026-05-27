import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";

function formatDuration(minutes: number) {
  if (!minutes) return "0 min";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;

  return `${mins}m`;
}

export default async function AdminPrayerReportsPage() {
  const supabase = await createClient();

  const { data: reports, error } = await supabase
    .from("prayer_reports")
    .select(`
      *,
      students:student_id (
        full_name,
        student_number
      ),
      instructors:instructor_id (
        full_name,
        instructor_number
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <AdminShell
      title="Prayer Reports Oversight"
      subtitle="Monitor institutional prayer consistency, fasting culture, devotional accountability, and spiritual formation participation."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Prayer Report Records
          </h2>

          <button className="btn-gold">Export Reports</button>
        </div>

        {error && <p className="mb-6 text-red-600">{error.message}</p>}

        {!reports || reports.length === 0 ? (
          <p className="text-[#1c2b3a]/70">
            No prayer report has been submitted yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/20 text-left">
                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Student
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Instructor
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Duration
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Fasting
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Consistency
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Status
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report: any) => (
                  <tr
                    key={report.id}
                    className="border-b border-[#c9a84c]/10"
                  >
                    <td className="py-5 font-semibold text-[#0b1f3a]">
                      {report.students?.full_name || "Unnamed Student"}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {report.instructors?.full_name || "Not assigned"}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {formatDuration(report.prayer_duration_minutes)}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70 capitalize">
                      {report.fasting_status || "not fasting"}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {report.consistency_score || 0}%
                    </td>

                    <td className="py-5">
                      <span className="border border-[#c9a84c]/30 bg-[#fdfaf4] px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                        {report.report_status || "submitted"}
                      </span>
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {report.report_date
                        ? new Date(report.report_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}