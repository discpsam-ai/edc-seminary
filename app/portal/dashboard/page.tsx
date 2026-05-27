import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PortalDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  const { data: registrations } =
    await supabase
      .from("course_registrations")
      .select(`
        *,
        courses:course_id (
          units
        )
      `)
      .eq("student_id", user.id);

  const { data: results } =
    await supabase
      .from("computed_results")
      .select(`
        *,
        courses:course_id (
          credit_units
        )
      `)
      .eq("student_id", user.id);

  const { data: announcements } =
    await supabase
      .from("announcements")
      .select("*")
      .or(
        "audience.eq.all,audience.eq.students"
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

  const totalUnits =
    registrations?.reduce(
      (sum: number, item: any) => {
        return (
          sum +
          (item.courses?.units || 0)
        );
      },
      0
    ) || 0;

  const totalGradePoints =
    results?.reduce(
      (sum: number, item: any) => {
        return (
          sum +
          ((item.gpa || 0) *
            (item.courses
              ?.credit_units || 0))
        );
      },
      0
    ) || 0;

  const resultUnits =
    results?.reduce(
      (sum: number, item: any) => {
        return (
          sum +
          (item.courses
            ?.credit_units || 0)
        );
      },
      0
    ) || 0;

  const cgpa =
    resultUnits > 0
      ? (
          totalGradePoints /
          resultUnits
        ).toFixed(2)
      : "0.00";

  const stats = [
    {
      title: "Registered Courses",

      value:
        registrations?.length || 0,

      description:
        "Current semester course registrations",
    },

    {
      title: "Total Units",

      value: totalUnits,

      description:
        "Accumulated registered academic units",
    },

    {
      title: "Published Results",

      value: results?.length || 0,

      description:
        "Uploaded and computed academic results",
    },

    {
      title: "CGPA",

      value: cgpa,

      description:
        "Current cumulative academic performance",
    },
  ];

  return (
    <PortalShell
      title="Student Dashboard"
      subtitle="Monitor academic progress, institutional activities, and spiritual formation records."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <p className="section-label">
          Student Profile
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student Name
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.full_name}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student ID
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.student_number ||
                "Not Assigned"}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Current Level
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.level ||
                "Level 1"}
            </h3>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="border border-[#c9a84c]/20 bg-white p-8"
          >
            <p className="section-label">
              Academic Analytics
            </p>

            <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
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
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Academic Status
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Academic Session
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              2026/2027
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Current Semester
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.current_semester ||
                "Semester 1"}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Enrollment Status
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-green-700">
              Active
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Formation Status
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#c9a84c]">
              Ongoing
            </h3>
          </div>
        </div>
      </section>

      <section className="mt-10 border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Institutional Communication
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Latest Announcements
            </h2>
          </div>

          <a
            href="/portal/announcements"
            className="btn-gold"
          >
            View All
          </a>
        </div>

        {!announcements ||
        announcements.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No announcement available.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {announcements.map(
              (announcement: any) => (
                <div
                  key={announcement.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {
                        announcement.title
                      }
                    </h3>

                    <span className="border border-[#c9a84c]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]">
                      {
                        announcement.audience
                      }
                    </span>
                  </div>

                  <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                    {
                      announcement.message
                    }
                  </p>

                  <p className="mt-5 text-sm text-[#1c2b3a]/45">
                    {new Date(
                      announcement.created_at
                    ).toLocaleString()}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </PortalShell>
  );
}