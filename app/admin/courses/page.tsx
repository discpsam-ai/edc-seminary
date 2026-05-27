import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(`
      id,
      code,
      title,
      level,
      semester,
      credit_units,
      status
    `)
    .order("code", { ascending: true });

  const { data: assignments } = await supabase
    .from("instructor_course_assignments")
    .select(`
      course_code,
      profiles:instructor_id (
        full_name,
        instructor_number
      )
    `)
    .eq("assignment_status", "active");

  const { data: registrations } = await supabase
    .from("course_registrations")
    .select("course_code")
    .eq("approval_status", "approved");

  function getInstructorNames(courseCode: string) {
    const matched =
      assignments?.filter((item: any) => item.course_code === courseCode) || [];

    if (matched.length === 0) return "Not assigned";

    return matched
      .map((item: any) => item.profiles?.full_name || "Unnamed Instructor")
      .join(", ");
  }

  function getStudentCount(courseCode: string) {
    return (
      registrations?.filter((item: any) => item.course_code === courseCode)
        .length || 0
    );
  }

  return (
    <AdminShell
      title="Course Management"
      subtitle="Manage institutional courses, teaching assignments, academic structure, downloadable materials, and formation curriculum."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Course Records
          </h2>

          <Link href="/admin/courses/create" className="btn-gold">
            Add Course
          </Link>
        </div>

        {error && <p className="mb-6 text-red-600">{error.message}</p>}

        {!courses || courses.length === 0 ? (
          <p className="text-[#1c2b3a]/70">
            No course has been created yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/20 text-left">
                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Course Code
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Course Title
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Instructor
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Students
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Level
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Semester
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Status
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course: any) => (
                  <tr
                    key={course.id}
                    className="border-b border-[#c9a84c]/10"
                  >
                    <td className="py-5 font-semibold text-[#0b1f3a]">
                      {course.code}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {course.title}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {getInstructorNames(course.code)}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {getStudentCount(course.code)}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {course.level || "N/A"}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {course.semester || "N/A"}
                    </td>

                    <td className="py-5">
                      <span className="border border-[#c9a84c]/30 bg-[#fdfaf4] px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                        {course.status || "active"}
                      </span>
                    </td>

                    <td className="py-5">
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="btn-gold"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/courses/${course.id}/edit`}
                          className="border border-[#c9a84c]/30 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a] transition hover:bg-[#f7f3ec]"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}