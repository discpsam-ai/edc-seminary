import Link from "next/link";

const instructorLinks = [
  {
    label: "Dashboard",
    href: "/instructor/dashboard",
  },

  {
    label: "Announcements",
    href: "/instructor/announcements",
  },

  {
    label: "Assigned Courses",
    href: "/instructor/courses",
  },

  {
    label: "My Courses",
    href: "/instructor/my-courses",
  },

  {
    label: "Course Materials",
    href: "/instructor/materials",
  },

  {
    label: "Assignments",
    href: "/instructor/assignments",
  },

  {
    label: "Submissions",
    href: "/instructor/submissions",
  },

  {
    label: "Tests & Exams",
    href: "/instructor/exams",
  },

  {
    label: "Results",
    href: "/instructor/results",
  },

  {
    label: "Attendance",
    href: "/instructor/attendance",
  },

  {
    label: "Students",
    href: "/instructor/students",
  },

  {
    label: "Prayer Reports",
    href: "/instructor/prayer-reports",
  },

  {
    label: "Rubrics",
    href: "/instructor/rubrics",
  },

  {
    label: "Learning Hub",
    href: "/instructor/learning",
  },

  {
    label: "Profile",
    href: "/instructor/profile",
  },

  {
    label: "ID Card",
    href: "/instructor/id-card",
  },
];

export default function InstructorSidebar() {
  return (
    <aside className="w-full border-r border-[#c9a84c]/20 bg-[#071528] px-5 py-8 text-[#fdfaf4] lg:min-h-screen lg:w-72">
      <div className="mb-10">
        <h2 className="font-edc-serif text-3xl font-bold">
          Instructor
        </h2>

        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
          Teaching & Oversight
        </p>
      </div>

      <nav className="grid grid-cols-2 gap-3 lg:flex lg:flex-col">
        {instructorLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border border-[#c9a84c]/10 px-4 py-3 text-center text-sm font-semibold text-[#fdfaf4]/70 transition hover:border-[#c9a84c]/40 hover:bg-white/5 hover:text-[#c9a84c] lg:text-left"
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