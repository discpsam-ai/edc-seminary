import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: activeSession } = await supabase
    .from("academic_sessions")
    .select(
      `
      *,
      session_semesters (
        id,
        semester_name,
        is_open
      )
    `
    )
    .eq("is_active", true)
    .single();

  const openSemesters =
    activeSession?.session_semesters?.filter(
      (semester: OpenSemester) => semester.is_open
    ) || [];

  const { count: studentsCount } = await supabase
    .from("profiles")
    .select("*", {
      count: "exact",
      head: true,
    })
    .contains("roles", ["student"]);

  const { count: instructorsCount } = await supabase
    .from("profiles")
    .select("*", {
      count: "exact",
      head: true,
    })
    .contains("roles", ["instructor"]);

  const { count: coursesCount } = await supabase
    .from("courses")
    .select("*", {
      count: "exact",
      head: true,
    });

  const { count: assignmentsCount } = await supabase
    .from("assignments")
    .select("*", {
      count: "exact",
      head: true,
    });

  const { count: examsCount } = await supabase
    .from("exams")
    .select("*", {
      count: "exact",
      head: true,
    });

  const { count: announcementsCount } = await supabase
    .from("announcements")
    .select("*", {
      count: "exact",
      head: true,
    });

  const stats = [
    {
      title: "Students",
      value: studentsCount || 0,
      description: "Registered seminary students",
    },
    {
      title: "Instructors",
      value: instructorsCount || 0,
      description: "Teaching and oversight personnel",
    },
    {
      title: "Courses",
      value: coursesCount || 0,
      description: "Institutional academic courses",
    },
    {
      title: "Assignments",
      value: assignmentsCount || 0,
      description: "Academic assignment records",
    },
    {
      title: "CBT Exams",
      value: examsCount || 0,
      description: "Published institutional examinations",
    },
    {
      title: "Announcements",
      value: announcementsCount || 0,
      description: "Published institutional notices",
    },
  ];

  return (
    <AdminShell
      title="Admin Dashboard"
      subtitle="Monitor institutional activities, seminary analytics, academic operations, and administrative oversight."
    >
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.title}
            className="border border-[#c9a84c]/20 bg-white p-8"
          >
            <p className="section-label">Institutional Analytics</p>

            <h2 className="mt-4 font-edc-serif text-6xl font-semibold text-[#0b1f3a]">
              {item.value}
            </h2>

            <h3 className="mt-4 text-2xl font-semibold text-[#0b1f3a]">
              {item.title}
            </h3>

            <p className="mt-4 leading-7 text-[#1c2b3a]/70">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-10 border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Seminary Administration</p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Institutional Overview
            </h2>
          </div>

          <a
            href="/admin/sessions"
            className="rounded-xl bg-[#0b1f3a] px-5 py-3 text-sm font-semibold text-white"
          >
            Manage Sessions
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Academic Session
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {activeSession?.session_name || "No Active Session"}
            </h3>

            <div className="mt-2 space-y-1">
              {openSemesters.length > 0 ? (
                openSemesters.map((semester: OpenSemester) => (
                  <p
                    key={semester.id}
                    className="text-sm font-medium text-green-700"
                  >
                    {semester.semester_name} Open
                  </p>
                ))
              ) : (
                <p className="text-sm text-[#1c2b3a]/60">
                  No Semester Open
                </p>
              )}
            </div>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Seminary Status
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-green-700">
              Active
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Academic System
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#c9a84c]">
              Operational
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              LMS Status
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              Running
            </h3>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}