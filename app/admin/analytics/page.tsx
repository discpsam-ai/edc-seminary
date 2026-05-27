import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const { count: studentsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .or("role.eq.student,roles.cs.{student}");

  const { count: instructorsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .or("role.eq.instructor,roles.cs.{instructor}");

  const { count: coursesCount } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  const { count: approvedRegistrationsCount } = await supabase
    .from("course_registrations")
    .select("*", { count: "exact", head: true })
    .eq("approval_status", "approved");

  const { count: pendingRegistrationsCount } = await supabase
    .from("course_registrations")
    .select("*", { count: "exact", head: true })
    .eq("approval_status", "pending");

  const { count: assignmentsCount } = await supabase
    .from("assignments")
    .select("*", { count: "exact", head: true });

  const { count: examsCount } = await supabase
    .from("exams")
    .select("*", { count: "exact", head: true });

  const { count: lessonsCount } = await supabase
    .from("course_lessons")
    .select("*", { count: "exact", head: true });

  const { count: pendingInstructorApplicationsCount } = await supabase
    .from("instructor_applications")
    .select("*", { count: "exact", head: true })
    .eq("application_status", "pending");

  const { count: issuedCertificatesCount } = await supabase
    .from("certificate_records")
    .select("*", { count: "exact", head: true });

  const stats = [
    {
      label: "Students",
      value: studentsCount || 0,
      href: "/admin/students",
    },
    {
      label: "Instructors",
      value: instructorsCount || 0,
      href: "/admin/instructors",
    },
    {
      label: "Courses",
      value: coursesCount || 0,
      href: "/admin/courses",
    },
    {
      label: "Approved Registrations",
      value: approvedRegistrationsCount || 0,
      href: "/admin/course-registrations",
    },
    {
      label: "Pending Registrations",
      value: pendingRegistrationsCount || 0,
      href: "/admin/course-registrations",
    },
    {
      label: "Assignments",
      value: assignmentsCount || 0,
      href: "/admin/assignments",
    },
    {
      label: "Assessments",
      value: examsCount || 0,
      href: "/admin/exams",
    },
    {
      label: "Lessons",
      value: lessonsCount || 0,
      href: "/admin/learning",
    },
    {
      label: "Pending Instructor Applications",
      value: pendingInstructorApplicationsCount || 0,
      href: "/admin/instructors/applications",
    },
    {
      label: "Issued Certificates",
      value: issuedCertificatesCount || 0,
      href: "/admin/certificates",
    },
  ];

  return (
    <AdminShell
      title="Dashboard Analytics"
      subtitle="Monitor EDC academic activity, registrations, instructors, assessments, learning content, and certification progress."
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-[#c9a84c]/20 bg-white/90 p-6 transition hover:border-[#c9a84c]/50"
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
              {stat.label}
            </p>

            <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {stat.value}
            </h2>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Academic Flow
          </h2>

          <div className="mt-8 space-y-4">
            {[
              ["Course Registrations", approvedRegistrationsCount || 0],
              ["Assignments Created", assignmentsCount || 0],
              ["Assessments Created", examsCount || 0],
              ["Lessons Uploaded", lessonsCount || 0],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-4"
              >
                <span className="text-[#1c2b3a]/70">{label}</span>
                <strong className="text-[#0b1f3a]">{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Institutional Status
          </h2>

          <div className="mt-8 space-y-4">
            {[
              ["Approved Instructors", instructorsCount || 0],
              [
                "Pending Instructor Applications",
                pendingInstructorApplicationsCount || 0,
              ],
              ["Pending Course Registrations", pendingRegistrationsCount || 0],
              ["Issued Certificates", issuedCertificatesCount || 0],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-4"
              >
                <span className="text-[#1c2b3a]/70">{label}</span>
                <strong className="text-[#0b1f3a]">{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}