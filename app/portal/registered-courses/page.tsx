import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

export default async function RegisteredCoursesPage() {
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
      (semester: OpenSemester) => semester.is_open
    ) || [];

  const openSemesterNames = openSemesters.map(
    (semester: OpenSemester) => semester.semester_name
  );

  let registrationsQuery = supabase
    .from("course_registrations")
    .select(
      `
      *,
      courses:course_id (
        title,
        credit_units,
        level,
        semester
      )
    `
    )
    .eq("student_id", user.id);

  if (activeSession?.id) {
    registrationsQuery = registrationsQuery.eq(
      "academic_session_id",
      activeSession.id
    );
  }

  if (openSemesterNames.length > 0) {
    registrationsQuery = registrationsQuery.in(
      "semester",
      openSemesterNames
    );
  }

  const { data: registrations, error } = await registrationsQuery.order(
    "registered_at",
    { ascending: false }
  );

  return (
    <PortalShell
      title="Registered Courses"
      subtitle="View your official course registrations by semester and academic session."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          My Registered Courses
        </h2>

        <div className="mt-5 border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
          <p className="text-sm font-semibold text-[#0b1f3a]">
            Active Session:{" "}
            {activeSession?.session_name || "No Active Session"}
          </p>

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
              <p className="text-sm text-red-700">
                No semester is currently open.
              </p>
            )}
          </div>
        </div>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!registrations || registrations.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            You have not registered any course for the active session and open
            semester yet.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {registrations.map((registration: any) => (
              <div
                key={registration.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="section-label">
                      {registration.course_code || "Course"}
                    </p>

                    <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {registration.courses?.title ||
                        registration.course_code ||
                        "Untitled Course"}
                    </h3>

                    <p className="mt-2 text-sm text-[#1c2b3a]/60">
                      Credit Units:{" "}
                      {registration.courses?.credit_units || 1}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {registration.registration_status || "registered"}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Level
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {registration.level ||
                        registration.courses?.level ||
                        "Not Set"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Semester
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {registration.semester ||
                        registration.courses?.semester ||
                        "Not Set"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Academic Session
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {registration.academic_session ||
                        activeSession?.session_name ||
                        "Not Set"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Registration Date
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {registration.registered_at
                        ? new Date(
                            registration.registered_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PortalShell>
  );
}