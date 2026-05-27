import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentAttendancePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: attendance, error } =
    await supabase
      .from("attendance_records")
      .select(`
        *,
        courses:course_id (
          title,
          course_code
        )
      `)
      .eq("student_id", user.id)
      .order("attendance_date", {
        ascending: false,
      });

  const presentCount =
    attendance?.filter(
      (item: any) =>
        item.status === "present"
    ).length || 0;

  const lateCount =
    attendance?.filter(
      (item: any) =>
        item.status === "late"
    ).length || 0;

  const absentCount =
    attendance?.filter(
      (item: any) =>
        item.status === "absent"
    ).length || 0;

  return (
    <PortalShell
      title="Attendance Records"
      subtitle="Track institutional attendance, punctuality, participation, and academic presence."
    >
      <section className="grid gap-6 md:grid-cols-3">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            Attendance Analytics
          </p>

          <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-green-700">
            {presentCount}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Present Records
          </p>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            Attendance Analytics
          </p>

          <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-yellow-600">
            {lateCount}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Late Records
          </p>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            Attendance Analytics
          </p>

          <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-red-600">
            {absentCount}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Absent Records
          </p>
        </div>
      </section>

      <section className="mt-10 border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Institutional Participation
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Attendance History
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Total Records
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {attendance?.length || 0}
            </h3>
          </div>
        </div>

        {error && (
          <p className="mt-8 text-red-600">
            {error.message}
          </p>
        )}

        {!attendance ||
        attendance.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No attendance record available yet.
          </p>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/20 text-left">
                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Course
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Date
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {attendance.map(
                  (record: any) => (
                    <tr
                      key={record.id}
                      className="border-b border-[#c9a84c]/10"
                    >
                      <td className="py-5">
                        <p className="font-semibold text-[#0b1f3a]">
                          {
                            record.courses
                              ?.course_code
                          }
                        </p>

                        <p className="mt-1 text-sm text-[#1c2b3a]/60">
                          {
                            record.courses
                              ?.title
                          }
                        </p>
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {new Date(
                          record.attendance_date
                        ).toLocaleDateString()}
                      </td>

                      <td className="py-5">
                        <span
                          className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                            record.status ===
                            "present"
                              ? "border border-green-300 bg-green-50 text-green-700"
                              : record.status ===
                                "late"
                              ? "border border-yellow-300 bg-yellow-50 text-yellow-700"
                              : "border border-red-300 bg-red-50 text-red-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PortalShell>
  );
}