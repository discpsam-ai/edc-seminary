import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

const portalLinks = [
  {
    label: "Dashboard",
    href: "/portal/dashboard",
  },

  {
    label: "Announcements",
    href: "/portal/announcements",
  },

  {
    label: "Course Registration",
    href: "/portal/course-registration",
  },

  {
    label: "My Courses",
    href: "/portal/courses",
  },

  {
    label: "Course Materials",
    href: "/portal/materials",
  },

  {
    label: "Assignments",
    href: "/portal/assignments",
  },

  {
    label: "My Submissions",
    href: "/portal/submissions",
  },

  {
    label: "Attendance",
    href: "/portal/attendance",
  },

  {
    label: "Results",
    href: "/portal/results",
  },

  {
    label: "Transcript",
    href: "/portal/transcript",
  },

  {
    label: "Tests & Exams",
    href: "/portal/exams",
  },

  {
    label: "Prayer Reports",
    href: "/portal/prayer-reports",
  },

  {
    label: "Formation",
    href: "/portal/formation",
  },

  {
    label: "Commissioning",
    href: "/portal/commissioning",
  },

  {
    label: "Graduation",
    href: "/portal/graduation",
  },

  {
    label: "Certificates",
    href: "/portal/certificates",
  },

  {
    label: "Academic Standing",
    href: "/portal/academic-standing",
  },

  {
    label: "Promotions",
    href: "/portal/promotions",
  },

  {
    label: "Student ID Card",
    href: "/portal/id-card",
  },

  {
    label: "Learning Hub",
    href: "/portal/learning",
  },

  {
    label: "Profile",
    href: "/portal/profile",
  },
];

export default function PortalSidebar() {
  return (
    <aside className="w-full border-r border-[#c9a84c]/20 bg-[#071528] px-5 py-8 text-[#fdfaf4] lg:min-h-screen lg:w-72">
      <div className="mb-10">
        <h2 className="font-edc-serif text-3xl font-bold">
          EDC Portal
        </h2>

        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
          Student Formation
        </p>
      </div>

      <nav className="grid grid-cols-2 gap-3 lg:flex lg:flex-col">
        {portalLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border border-[#c9a84c]/10 px-4 py-3 text-center text-sm font-semibold text-[#fdfaf4]/70 transition hover:border-[#c9a84c]/40 hover:bg-white/5 hover:text-[#c9a84c] lg:text-left"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-10 space-y-4 border-t border-[#c9a84c]/20 pt-6">
        <Link
          href="/"
          className="block text-sm font-semibold text-[#fdfaf4]/60 hover:text-[#c9a84c]"
        >
          ← Back to Website
        </Link>

        <LogoutButton />
      </div>
    </aside>
  );
}