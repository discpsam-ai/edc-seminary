import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const { count: studentsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .or("role.eq.student,roles.cs.{student}");

  const { count: attendanceCount } = await supabase
    .from("attendance_records")
    .select("*", { count: "exact", head: true });

  const { count: prayerReportsCount } = await supabase
    .from("prayer_reports")
    .select("*", { count: "exact", head: true });

  const { count: resultsCount } = await supabase
    .from("course_results")
    .select("*", { count: "exact", head: true });

  const { count: commissioningCount } = await supabase
    .from("formation_records")
    .select("*", { count: "exact", head: true });

  const reports = [
    {
      title: "Student Attendance Report",
      category: "Attendance",
      count: attendanceCount || 0,
      href: "/admin/attendance",
      status: "Ready",
    },
    {
      title: "Prayer Consistency Analysis",
      category: "Formation",
      count: prayerReportsCount || 0,
      href: "/admin/prayer-reports",
      status: "Ready",
    },
    {
      title: "Semester Academic Performance",
      category: "Academic",
      count: resultsCount || 0,
      href: "/admin/results",
      status: "Ready",
    },
    {
      title: "Commissioning Review Report",
      category: "Commissioning",
      count: commissioningCount || 0,
      href: "/admin/commissioning",
      status: "Ready",
    },
    {
      title: "Student Population Report",
      category: "Students",
      count: studentsCount || 0,
      href: "/admin/students",
      status: "Ready",
    },
  ];

  return (
    <AdminShell
      title="Institutional Reports"
      subtitle="Generate, review, export, and monitor academic, attendance, formation, and institutional performance reports."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Report Center
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.title}
              className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="section-label">{report.category}</p>

                  <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    {report.title}
                  </h3>

                  <p className="mt-3 text-4xl font-semibold text-[#0b1f3a]">
                    {report.count}
                  </p>
                </div>

                <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                  {report.status}
                </span>
              </div>

              <div className="mt-6">
                <Link href={report.href} className="btn-gold">
                  View Report
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}