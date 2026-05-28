import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

export default async function PortalDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: activeSession } = await supabase
    .from("academic_sessions")
    .select(
      `
      id,
      session_name,
      admissions_open,
      registration_open,
      is_active,
      session_semesters (
        id,
        semester_name,
        is_open
      )
    `
    )
    .eq("is_active", true)
    .maybeSingle();

  const openSemesters =
    activeSession?.session_semesters?.filter(
      (semester: OpenSemester) =>
        semester.is_open
    ) || [];

  const openSemesterNames =
    openSemesters.map(
      (semester: OpenSemester) =>
        semester.semester_name
    );

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  let registrationsQuery = supabase
    .from("course_registrations")
    .select(
      `
      *,
      courses:course_id (
        credit_units,
        units
      )
    `
    )
    .eq("student_id", user.id);

  if (openSemesterNames.length > 0) {
    registrationsQuery =
      registrationsQuery.in(
        "semester",
        openSemesterNames
      );
  }

  const { data: registrations } =
    await registrationsQuery;

  let resultsQuery = supabase
    .from("course_results")
    .select("*")
    .eq("student_id", user.id)
    .eq(
      "publication_status",
      "published"
    )
    .eq("result_visibility", true);

  if (
    activeSession?.session_name
  ) {
    resultsQuery =
      resultsQuery.eq(
        "academic_session",
        activeSession.session_name
      );
  }

  if (openSemesterNames.length > 0) {
    resultsQuery = resultsQuery.in(
      "semester",
      openSemesterNames
    );
  }

  const { data: results } =
    await resultsQuery;

  const { data: cgpaData } =
    await supabase.rpc(
      "compute_student_cgpa",
      {
        student_input: user.id,
      }
    );

  const cgpaRecord =
    cgpaData?.[0];

  const cgpa = Number(
    cgpaRecord?.cgpa || 0
  ).toFixed(2);

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
          Number(
            item.courses
              ?.credit_units ||
              item.courses
                ?.units ||
              0
          )
        );
      },
      0
    ) || 0;

  const publishedResults =
    results?.length || 0;

  const stats = [
    {
      title: "Registered Courses",
      value:
        registrations?.length ||
        0,
      description:
        "Current semester course registrations",
    },
    {
      title: "Total Units",
      value: totalUnits,
      description:
        "Accumulated academic units",
    },
    {
      title: "Published Results",
      value: publishedResults,
      description:
        "Officially released results",
    },
    {
      title: "CGPA",
      value: cgpa,
      description:
        "Current cumulative performance",
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

        <div className="mt-5 grid gap-5 md:grid-cols-4">
          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student Name
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.full_name ||
                "Student"}
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
              Current Semester
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.current_semester ||
                "Semester 1"}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Cohort
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.cohort_name ||
                "C1"}
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
              {activeSession?.session_name ||
                "No Active Session"}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Open Semesters
            </p>

            <div className="mt-3 space-y-1">
              {openSemesters.length >
              0 ? (
                openSemesters.map(
                  (
                    semester: OpenSemester
                  ) => (
                    <p
                      key={
                        semester.id
                      }
                      className="text-sm font-medium text-green-700"
                    >
                      {
                        semester.semester_name
                      }{" "}
                      Open
                    </p>
                  )
                )
              ) : (
                <p className="text-sm text-[#1c2b3a]/60">
                  No Semester Open
                </p>
              )}
            </div>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Transcript Status
            </p>

            <h3 className="mt-3 text-xl font-semibold text-[#0b1f3a]">
              {profile?.transcript_eligible
                ? "Eligible"
                : "Not Eligible"}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Graduation Status
            </p>

            <h3 className="mt-3 text-xl font-semibold text-[#0b1f3a]">
              {profile?.programme_completed
                ? "Completed"
                : "In Progress"}
            </h3>
          </div>
        </div>
      </section>

      <section className="mt-10 border border-[#c9a84c]/20 bg-white p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Recent Announcements
        </h2>

        {!announcements ||
        announcements.length ===
          0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No announcements
            available.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {announcements.map(
              (
                announcement: any
              ) => (
                <div
                  key={
                    announcement.id
                  }
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                >
                  <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    {
                      announcement.title
                    }
                  </h3>

                  <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                    {
                      announcement.content
                    }
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