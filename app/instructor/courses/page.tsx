import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function InstructorCoursesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("instructor_id", user.id)
    .order("course_code", { ascending: true });

  return (
    <InstructorShell
      title="Assigned Courses"
      subtitle="Manage assigned teaching courses, students, and instructional activities."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Instructor Dashboard
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Welcome, {profile?.full_name}
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Assigned Courses
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {courses?.length || 0}
            </h3>
          </div>
        </div>

        {error && (
          <p className="mt-8 text-red-600">
            {error.message}
          </p>
        )}

        {!courses || courses.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No course has been assigned to you yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {courses.map((course: any) => (
              <div
                key={course.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6"
              >
                <p className="section-label">
                  {course.course_code}
                </p>

                <h3 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                  {course.title}
                </h3>

                <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                  {course.description || "No course description available."}
                </p>

                <div className="mt-6 grid gap-3 text-sm text-[#1c2b3a]/60">
                  <p>
                    Level: <strong>{course.level}</strong>
                  </p>

                  <p>
                    Semester: <strong>{course.semester}</strong>
                  </p>

                  <p>
                    Units: <strong>{course.units || 0}</strong>
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={`/instructor/courses/${course.id}`}
                    className="btn-gold"
                  >
                    Manage Course
                  </a>

                  <a
                    href={`/instructor/results?course=${course.id}`}
                    className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
                  >
                    Upload Results
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </InstructorShell>
  );
}