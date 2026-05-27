import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InstructorCoursePage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("instructor_id", user.id)
    .single();

  if (!course) {
    return (
      <InstructorShell
        title="Course Not Found"
        subtitle="The requested course could not be found."
      >
        <p className="text-[#1c2b3a]/70">
          Course unavailable.
        </p>
      </InstructorShell>
    );
  }

  const { data: students } = await supabase
    .from("course_registrations")
    .select(`
      *,
      profiles:student_id (
        full_name,
        student_number,
        email,
        level
      )
    `)
    .eq("course_id", id)
    .order("created_at", { ascending: false });

  return (
    <InstructorShell
      title={course.title}
      subtitle="Manage enrolled students, academic participation, and instructional activities."
    >
      <section className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            {course.course_code}
          </p>

          <h2 className="mt-4 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Course Information
          </h2>

          <p className="mt-6 leading-8 text-[#1c2b3a]/70">
            {course.description || "No course description available."}
          </p>

          <div className="mt-8 grid gap-4">
            <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-4">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Level
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                {course.level}
              </h3>
            </div>

            <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-4">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Semester
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                {course.semester}
              </h3>
            </div>

            <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-4">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Units
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                {course.units || 0}
              </h3>
            </div>

            <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-4">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Enrolled Students
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                {students?.length || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Enrolled Students
            </h2>

            <a
              href={`/instructor/results?course=${course.id}`}
              className="btn-gold"
            >
              Upload Results
            </a>
          </div>

          {!students || students.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No student registered for this course yet.
            </p>
          ) : (
            <div className="mt-8 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#c9a84c]/20 text-left">
                    <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Student
                    </th>

                    <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Student ID
                    </th>

                    <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Level
                    </th>

                    <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student: any) => (
                    <tr
                      key={student.id}
                      className="border-b border-[#c9a84c]/10"
                    >
                      <td className="py-5">
                        <p className="font-semibold text-[#0b1f3a]">
                          {student.profiles?.full_name}
                        </p>

                        <p className="mt-1 text-sm text-[#1c2b3a]/60">
                          {student.profiles?.email}
                        </p>
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {student.profiles?.student_number}
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {student.profiles?.level}
                      </td>

                      <td className="py-5">
                        <span className="border border-green-300 bg-green-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                          Registered
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </InstructorShell>
  );
}