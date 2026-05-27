import Link from "next/link";
import { getUserProfile } from "@/utils/auth/getUserProfile";

export default async function SelectRolePage() {
  const { profile, roles } = await getUserProfile();

  const roleLinks = [
    {
      role: "admin",
      title: "Admin Dashboard",
      text: "Institutional oversight, students, instructors, courses, reports, and settings.",
      href: "/admin/dashboard",
    },
    {
      role: "instructor",
      title: "Instructor Dashboard",
      text: "Teaching oversight, assignments, attendance, students, and prayer reports.",
      href: "/instructor/dashboard",
    },
    {
      role: "student",
      title: "Student Dashboard",
      text: "Courses, assignments, prayer reports, attendance, and commissioning progress.",
      href: "/portal/dashboard",
    },
  ];

  const availableRoles = roleLinks.filter((item) => roles.includes(item.role));

  return (
    <main className="min-h-screen bg-[#071528] px-6 py-24 text-[#fdfaf4]">
      <div className="mx-auto max-w-5xl">
        <p className="section-label">EDC Portal Access</p>

        <h1 className="mt-5 font-edc-serif text-5xl font-semibold">
          Welcome, {profile.full_name}
        </h1>

        <p className="mt-5 max-w-3xl leading-8 text-[#fdfaf4]/65">
          Your account has more than one access role. Choose the area you want
          to enter.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {availableRoles.map((item) => (
            <Link
              key={item.role}
              href={item.href}
              className="border border-[#c9a84c]/20 bg-white/5 p-8 transition hover:border-[#c9a84c]/60 hover:bg-white/10"
            >
              <h2 className="font-edc-serif text-3xl font-semibold">
                {item.title}
              </h2>

              <p className="mt-5 leading-8 text-[#fdfaf4]/65">{item.text}</p>

              <span className="mt-8 inline-block text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                Enter →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}