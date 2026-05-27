import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function InstructorMyCoursesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: assignments, error } = await supabase
    .from("instructor_course_assignments")
    .select(`
      *,
      courses:course_id (
        title,
        level,
        semester,
        credit_units,
        description
      )
    `)
    .eq("instructor_id", user.id)
    .eq("assignment_status", "active")
    .order("assigned_at", { ascending: false });

  return (
    <InstructorShell
      title="My Assigned Courses"
      subtitle="View courses officially assigned to you for teaching and formation responsibility."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Assigned Courses
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!assignments || assignments.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No course has been assigned to you yet.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {assignments.map((assignment: any) => (
              <div
                key={assignment.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
              >
                <p className="section-label">{assignment.course_code}</p>

                <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  {assignment.courses?.title || assignment.course_code}
                </h3>

                <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                  {assignment.courses?.description ||
                    "No course description available."}
                </p>

                <div className="mt-5 grid gap-3 text-sm text-[#1c2b3a]/60">
                  <p>
                    Level: <strong>{assignment.courses?.level}</strong>
                  </p>

                  <p>
                    Semester: <strong>{assignment.courses?.semester}</strong>
                  </p>

                  <p>
                    Credit Units:{" "}
                    <strong>{assignment.courses?.credit_units || 1}</strong>
                  </p>

                  <p>
                    Academic Session:{" "}
                    <strong>{assignment.academic_session}</strong>
                  </p>
                </div>

                <span className="mt-5 inline-block border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                  {assignment.assignment_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </InstructorShell>
  );
}