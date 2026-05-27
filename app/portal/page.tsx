import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";

const portalFeatures = [
  {
    title: "Student Dashboard",
    text: "Access courses, academic progress, attendance, prayer reports, assignments, and spiritual formation activities.",
  },
  {
    title: "Assignments & Exams",
    text: "Submit assignments, take tests, access semester examinations, and monitor academic performance.",
  },
  {
    title: "Prayer Reports",
    text: "Track daily prayer consistency, spiritual discipline reports, fasting records, and devotional participation.",
  },
  {
    title: "Attendance Tracking",
    text: "Monitor class attendance, formation meetings, spiritual gatherings, and participation records.",
  },
  {
    title: "Commissioning Progress",
    text: "View formation milestones, practical ministry development, and commissioning readiness.",
  },
  {
    title: "Course Downloads",
    text: "Access downloadable course materials, handbooks, theological resources, and institutional documents.",
  },
];

export default function PortalPage() {
  return (
    <>
      <Hero
  label="Student Portal"
  title="The EDC Formation Portal"
  subtitle="A centralized environment for theological learning, spiritual formation, assignments, assessments, prayer accountability, and commissioning development."
  primaryText="Portal Login"
  primaryHref="/login"
/>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeader
            label="Portal Overview"
            title="More Than an Academic Dashboard"
            description="The EDC portal is designed to support both academic progress and spiritual formation."
          />

          <p className="leading-8 text-[#1c2b3a]/70">
            Students are able to engage coursework, assessments, prayer
            accountability, attendance, ministry participation, and formation
            tracking within one structured environment.
          </p>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Portal Features"
            title="Formation Tools and Academic Systems"
            description="The EDC portal combines theological education with spiritual accountability and institutional structure."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="border border-[#c9a84c]/20 bg-white p-8"
              >
                <h2 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                  {feature.title}
                </h2>

                <p className="mt-5 leading-8 text-[#1c2b3a]/70">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071528] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            label="Portal Access"
            title="Login Areas"
            description="Different institutional access points for students, instructors, and administrators."
            light
          />

          <div className="grid gap-6 md:grid-cols-3">
            {[
  {
    title: "Student Access",
    text: "Courses, assignments, exams, prayer reports, attendance, transcripts, and formation tracking.",
    href: "/login",
  },
  {
    title: "Instructor Access",
    text: "Course upload, grading, attendance management, assessments, and student supervision.",
    href: "/login",
  },
  {
    title: "Administrative Access",
    text: "Student management, institutional reporting, announcements, records, and commissioning oversight.",
    href: "/login",
  },
].map((item) => (
              <div
                key={item.title}
                className="border border-[#c9a84c]/20 bg-white/5 p-8"
              >
                <h2 className="font-edc-serif text-3xl font-semibold text-[#fdfaf4]">
                  {item.title}
                </h2>

                <p className="mt-5 leading-8 text-[#fdfaf4]/65">
                  {item.text}
                </p>

                <Link href={item.href} className="btn-gold mt-6 inline-block">
                  Enter Portal
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}