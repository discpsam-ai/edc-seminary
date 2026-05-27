import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";

export default async function AdminAttendancePage() {
  const supabase = await createClient();

  const { data: attendance, error } = await supabase
    .from("attendance_records")
    .select(`
      *,
      profiles:student_id (
        full_name,
        student_number
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <AdminShell
      title="Attendance Oversight"
      subtitle="Monitor institutional attendance records, participation consistency, formation gatherings, and accountability structures."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Attendance Records
          </h2>

          <button className="btn-gold">
            Export Records
          </button>
        </div>

        {error && <p className="mb-6 text-red-600">{error.message}</p>}

        {!attendance || attendance.length === 0 ? (
          <p className="text-[#1c2b3a]/70">
            No attendance record has been created yet.
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
                    Student ID
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Course
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Session
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
                {attendance.map((record: any) => (
                  <tr
                    key={record.id}
                    className="border-b border-[#c9a84c]/10"
                  >
                    <td className="py-5 font-semibold text-[#0b1f3a]">
                      {record.profiles?.full_name || "Unnamed Student"}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {record.profiles?.student_number || "Not assigned"}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {record.course_code || "N/A"}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {record.session_title || record.session || "N/A"}
                    </td>

                    <td className="py-5">
                      <span className="border border-[#c9a84c]/30 bg-[#fdfaf4] px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                        {record.attendance_status || record.status || "present"}
                      </span>
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {record.attendance_date
                        ? new Date(record.attendance_date).toLocaleDateString()
                        : record.created_at
                          ? new Date(record.created_at).toLocaleDateString()
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