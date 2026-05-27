import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminInstructorsPage() {
  const supabase = await createClient();

  const { data: instructors, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      phone,
      role,
      instructor_number,
      teaching_qualification,
      instructor_passport_url,
      passport_url
    `)
    .or("role.eq.instructor,roles.cs.{instructor}")
    .order("full_name", { ascending: true });

  return (
    <AdminShell
      title="Instructor Management"
      subtitle="Manage approved instructors, instructor IDs, teaching profiles, passports, and course assignments."
    >
      <section className="space-y-8">
        <div className="grid gap-5 md:grid-cols-3">
          <Link
            href="/admin/instructors/applications"
            className="border border-[#c9a84c]/20 bg-white/90 p-6 transition hover:border-[#c9a84c]/50"
          >
            <p className="section-label">Applications</p>
            <h2 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
              Review Applications
            </h2>
          </Link>

          <Link
            href="/admin/instructors/assign-courses"
            className="border border-[#c9a84c]/20 bg-white/90 p-6 transition hover:border-[#c9a84c]/50"
          >
            <p className="section-label">Courses</p>
            <h2 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
              Assign Courses
            </h2>
          </Link>

          <Link
            href="/admin/dashboard"
            className="border border-[#c9a84c]/20 bg-white/90 p-6 transition hover:border-[#c9a84c]/50"
          >
            <p className="section-label">Admin</p>
            <h2 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
              Back to Dashboard
            </h2>
          </Link>
        </div>

        <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Approved Instructors
          </h2>

          {error && <p className="mt-6 text-red-600">{error.message}</p>}

          {!instructors || instructors.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No approved instructor found yet.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {instructors.map((instructor: any) => (
                <div
                  key={instructor.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                >
                  <p className="section-label">
                    {instructor.instructor_number || "No Instructor ID"}
                  </p>

                  <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    {instructor.full_name || "Unnamed Instructor"}
                  </h3>

                  <p className="mt-2 text-sm text-[#1c2b3a]/60">
                    {instructor.email || "No email"}
                  </p>

                  <p className="mt-1 text-sm text-[#1c2b3a]/60">
                    {instructor.phone || "No phone"}
                  </p>

                  <div className="mt-5 border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Qualification
                    </p>

                    <p className="mt-2 leading-6 text-[#1c2b3a]/70">
                      {instructor.teaching_qualification || "Not provided"}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/admin/instructors/${instructor.id}`}
                      className="btn-gold"
                    >
                      View Profile
                    </Link>

                    <Link
                      href="/admin/instructors/assign-courses"
                      className="border border-[#c9a84c]/30 px-5 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
                    >
                      Assign Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </AdminShell>
  );
}