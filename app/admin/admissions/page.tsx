import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

export default async function InstructorDashboardPage() {
  const supabase = await createClient();

  const { data: activeSession } = await supabase
    .from("academic_sessions")
    .select(
      `
      *,
      session_semesters (
        id,
        semester_name,
        is_open
      )
    `
    )
    .eq("is_active", true)
    .single();

  const openSemesters =
    activeSession?.session_semesters?.filter(
      (semester: OpenSemester) => semester.is_open
    ) || [];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("instructor_id", user.id);

  const courseIds = courses?.map((course: any) => course.id) || [];

  const { data: registrations } = courseIds.length
    ? await supabase
        .from("course_registrations")
        .select("*")
        .in("course_id", courseIds)
    : { data: [] };

  const { data: results } = await supabase
    .from("student_results")
    .select("*")
    .eq("uploaded_by", user.id);

  const stats = [
    {
      title: "Assigned Courses",
      value: courses?.length || 0,
      description: "Courses assigned for teaching",
    },
    {
      title: "Enrolled Students",
      value: registrations?.length || 0,
      description: "Students enrolled in assigned courses",
    },
    {
      title: "Uploaded Results",
      value: results?.length || 0,
      description: "Published academic results",
    },
    {
      title: "Teaching Status",
      value: "Active",
      description: "Current instructional activity",
    },
  ];

  return (
    <InstructorShell
      title="Instructor Dashboard"
      subtitle="Manage teaching operations, academic activities, and student instructional engagement."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <p className="section-label">Instructor Profile</p>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Instructor Name
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.full_name}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Instructor ID
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.instructor_id || "Not Assigned"}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Teaching Qualification
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.teaching_qualification || "Instructor"}
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
            <p className="section-label">Teaching Analytics</p>

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
          Academic Operations
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <a
            href="/instructor/courses"
            className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5 transition hover:border-[#c9a84c]"
          >
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Teaching Courses
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              Manage Courses
            </h3>
          </a>

          <a
            href="/instructor/results"
            className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5 transition hover:border-[#c9a84c]"
          >
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Result Upload
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              Upload Results
            </h3>
          </a>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Academic Session
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {activeSession?.session_name || "No Active Session"}
            </h3>

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
                <p className="text-sm text-[#1c2b3a]/60">
                  No Semester Open
                </p>
              )}
            </div>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Instruction Status
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-green-700">
              Active
            </h3>
          </div>
        </div>
      </section>
    </InstructorShell>
  );
}