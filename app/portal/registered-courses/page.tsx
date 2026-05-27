import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RegisteredCoursesPage() {
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
        title,
        credit_units
      )
    `)
    .eq("student_id", user.id)
    .order("registered_at", { ascending: false });

  return (
    <PortalShell
      title="Registered Courses"
      subtitle="View your official course registrations by semester and academic session."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          My Registered Courses
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!registrations || registrations.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            You have not registered any course yet.
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
                    <p className="section-label">{registration.course_code}</p>

                    <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {registration.courses?.title || registration.course_code}
                    </h3>

                    <p className="mt-2 text-sm text-[#1c2b3a]/60">
                      Credit Units: {registration.courses?.credit_units || 1}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {registration.registration_status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Level
                    </p>
                    <p className="mt-2 font-semibold">
                      {registration.level}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Semester
                    </p>
                    <p className="mt-2 font-semibold">
                      {registration.semester}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Academic Session
                    </p>
                    <p className="mt-2 font-semibold">
                      {registration.academic_session}
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