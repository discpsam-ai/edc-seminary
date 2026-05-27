import Link from "next/link";

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Admissions", href: "/admin/admissions" },
  { label: "Students", href: "/admin/students" },
  { label: "Instructors", href: "/admin/instructors" },
  { label: "Courses", href: "/admin/courses" },
  { label: "Assignments", href: "/admin/assignments" },
  { label: "Tests & Exams", href: "/admin/exams" },
  { label: "Attendance", href: "/admin/attendance" },
  { label: "Prayer Reports", href: "/admin/prayer-reports" },
  { label: "Commissioning", href: "/admin/commissioning" },
  { label: "Handbook", href: "/admin/handbook" },
  { label: "Announcements", href: "/admin/announcements" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Graduation", href: "/admin/graduation" },
  { label: "Transcripts", href: "/admin/transcripts" },
  { label: "Certificates", href: "/admin/certificates" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Generate Student ID", href: "/admin/students/generate-id" },
  { label: "Promotions", href: "/admin/promotions" },
  { label: "ID Cards", href: "/admin/id-cards" },
  { label: "Intakes", href: "/admin/intakes" },
  { label: "Course Registrations", href: "/admin/course-registrations" },
  { label: "Results", href: "/admin/results" },
  { label: "Rubrics", href: "/admin/rubrics" },
  { label: "Learning Hub", href: "/admin/learning" },
  { label: "Instructor Applications", href: "/admin/instructors/applications" },
  { label: "Assign Instructor Courses", href: "/admin/instructors/assign-courses" },
  { label: "Instructors", href: "/admin/instructors" },
  { label: "Course Registrations", href: "/admin/course-registrations" },
  { label: "Results", href: "/admin/results" },
  { label: "Analytics", href: "/admin/analytics" },
];

export default function AdminSidebar() {
  return (
    <aside className="min-h-screen border-r border-[#c9a84c]/20 bg-[#071528] px-5 py-8 text-[#fdfaf4]">
      <div className="mb-10">
        <h2 className="font-edc-serif text-3xl font-bold">Admin</h2>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
          Institutional Oversight
        </p>
      </div>

      <nav className="flex flex-col gap-3">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border border-[#c9a84c]/10 px-4 py-3 text-sm font-semibold text-[#fdfaf4]/70 transition hover:border-[#c9a84c]/40 hover:bg-white/5 hover:text-[#c9a84c]"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-10 border-t border-[#c9a84c]/20 pt-6">
        <Link
          href="/"
          className="text-sm font-semibold text-[#fdfaf4]/60 hover:text-[#c9a84c]"
        >
          ← Back to Website
        </Link>
      </div>
    </aside>
  );
}