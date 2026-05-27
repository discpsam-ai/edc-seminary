import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    instructorId: string;
  }>;
};

export default async function AdminSingleInstructorPage({
  params,
}: PageProps) {
  const { instructorId } = await params;

  const supabase = await createClient();

  const { data: instructor } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      phone,
      role,
      instructor_number,
      instructor_bio,
      teaching_qualification,
      instructor_passport_url,
      passport_url
    `)
    .eq("id", instructorId)
    .single();

  if (!instructor) notFound();

  const { data: assignments } = await supabase
    .from("instructor_course_assignments")
    .select(`
      *,
      courses:course_id (
        title,
        level,
        semester,
        credit_units
      )
    `)
    .eq("instructor_id", instructorId)
    .order("assigned_at", { ascending: false });

  return (
    <AdminShell
      title="Instructor Profile"
      subtitle="View instructor identity, teaching record, passport, and assigned courses."
    >
      <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
  <div className="mx-auto flex h-[260px] max-w-[220px] items-center justify-center overflow-hidden border border-[#c9a84c]/20 bg-[#f7f3ec]/90 p-3">
    {instructor.instructor_passport_url || instructor.passport_url ? (
      <Image
        src={
          instructor.instructor_passport_url ||
          instructor.passport_url
        }
        alt="Instructor Passport"
        width={400}
        height={500}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="text-center text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/40">
        Passport
      </div>
    )}
  </div>

  <div className="mt-8 text-center">
    <h2 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
      {instructor.full_name || "Instructor"}
    </h2>

    <p className="mt-3 text-sm uppercase tracking-[0.15em] text-[#c9a84c]">
      EDC Instructor
    </p>
  </div>

  <div className="mt-8 space-y-4">
    {[
      ["Instructor ID", instructor.instructor_number || "Not assigned"],
      ["Email", instructor.email || "Not available"],
      ["Phone", instructor.phone || "Not available"],
      ["Role", instructor.role || "instructor"],
    ].map(([label, value]) => (
      <div
        key={label}
        className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-4"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1c2b3a]/45">
          {label}
        </p>

        <h3 className="mt-2 text-[#0b1f3a]">{value}</h3>
      </div>
    ))}
  </div>

  <div className="mt-8 flex flex-wrap gap-4">
    <Link
      href="/admin/instructors"
      className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
    >
      Back to Instructors
    </Link>

    <Link
      href={`/admin/instructors/${instructor.id}/id-card`}
      className="btn-gold"
    >
      Print ID Card
    </Link>
  </div>
</div>

        <div className="space-y-8">
          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Teaching Profile
            </h2>

            <div className="mt-8 grid gap-5">
              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Instructor Bio
                </p>

                <p className="mt-3 leading-8 text-[#1c2b3a]/70">
                  {instructor.instructor_bio || "No instructor bio has been added yet."}
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Teaching Qualification
                </p>

                <p className="mt-3 leading-8 text-[#1c2b3a]/70">
                  {instructor.teaching_qualification ||
                    "No teaching qualification has been added yet."}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Assigned Courses
            </h2>

            {!assignments || assignments.length === 0 ? (
              <p className="mt-8 text-[#1c2b3a]/70">
                No course has been assigned to this instructor yet.
              </p>
            ) : (
              <div className="mt-8 space-y-5">
                {assignments.map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                  >
                    <p className="section-label">{assignment.course_code}</p>

                    <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {assignment.courses?.title || assignment.course_code}
                    </h3>

                    <p className="mt-2 text-sm text-[#1c2b3a]/60">
                      {assignment.courses?.level} • {assignment.courses?.semester} •{" "}
                      {assignment.academic_session}
                    </p>

                    <span className="mt-4 inline-block border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                      {assignment.assignment_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}