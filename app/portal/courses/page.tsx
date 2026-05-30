import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PortalCoursesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: registrations, error } = await supabase
    .from("course_registrations")
    .select(`
      *,
      courses:course_id (
        id,
        code,
        title,
        description,
        credit_units,
        level,
        semester,
        material_url
      )
    `)
    .eq("student_id", user.id)
    .order("registered_at", { ascending: false });

  const totalUnits =
    registrations?.reduce((sum: number, item: any) => {
      return sum + (item.courses?.credit_units || 0);
    }, 0) || 0;

  return (
    <PortalShell
      title="My Courses"
      subtitle="Access registered courses, academic enrollment, and available learning materials."
    >
      <section className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Registration Summary
          </h2>

          <div className="mt-8 space-y-5">
            <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Total Courses
              </p>

              <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
                {registrations?.length || 0}
              </h3>
            </div>

            <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Total Units
              </p>

              <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
                {totalUnits}
              </h3>
            </div>

            <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Registration Status
              </p>

              <h3 className="mt-3 text-2xl font-semibold uppercase text-[#c9a84c]">
                Active
              </h3>
            </div>
          </div>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Registered Courses
            </h2>

            <a
              href="/portal/course-registration"
              className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
            >
              Course Registration
            </a>
          </div>

          {error && <p className="mt-6 text-red-600">{error.message}</p>}

          {!registrations || registrations.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              You have not registered any course yet.
            </p>
          ) : (
            <div className="mt-8 grid gap-5">
              {registrations.map((registration: any) => (
                <div
                  key={registration.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="section-label">
                        {registration.courses?.code ||
                          registration.course_code ||
                          "Course Code"}
                      </p>

                      <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                        {registration.courses?.title || "Registered Course"}
                      </h3>

                      <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                        {registration.courses?.description ||
                          "No course description available."}
                      </p>
                    </div>

                    <span className="border border-green-300 bg-green-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                      {registration.registration_status || "registered"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-[#1c2b3a]/60 md:grid-cols-2">
                    <p>
                      Level:{" "}
                      <strong>
                        {registration.courses?.level ||
                          registration.level ||
                          "Not assigned"}
                      </strong>
                    </p>

                    <p>
                      Semester:{" "}
                      <strong>
                        {registration.courses?.semester ||
                          registration.semester ||
                          "Not assigned"}
                      </strong>
                    </p>

                    <p>
                      Units:{" "}
                      <strong>{registration.courses?.credit_units || 0}</strong>
                    </p>

                    <p>
                      Session:{" "}
                      <strong>{registration.academic_session}</strong>
                    </p>
                  </div>

                  {registration.courses?.material_url ? (
                    <a
                      href={registration.courses.material_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold mt-6"
                    >
                      Open Course Material
                    </a>
                  ) : (
                    <p className="mt-6 text-sm text-[#1c2b3a]/50">
                      No course material uploaded yet.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PortalShell>
  );
}