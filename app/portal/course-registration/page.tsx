import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

export default async function CourseRegistrationPage() {
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
      (semester: OpenSemester) =>
        semester.is_open
    ) || [];

  const openSemesterNames =
    openSemesters.map(
      (semester: OpenSemester) =>
        semester.semester_name
    );

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const studentSemesterNumber =
    profile?.semester_number || 1;

  const studentSemester =
    profile?.current_semester ||
    "Semester 1";

  const currentAcademicSession =
    activeSession?.session_name ||
    "2025/2026";

  const {
    data: curriculumCourses,
    error: curriculumError,
  } = await supabase
    .from("semester_curriculum")
    .select(
      `
      *,
      courses:course_id (
        *
      )
    `
    )
    .eq(
      "semester_number",
      studentSemesterNumber
    )
    .eq(
      "semester_name",
      studentSemester
    );

  if (curriculumError) {
    throw new Error(
      curriculumError.message
    );
  }

  const courses =
    curriculumCourses
      ?.map(
        (item: any) => item.courses
      )
      .filter(Boolean) || [];

  const { data: registrations } =
    await supabase
      .from("course_registrations")
      .select("*")
      .eq("student_id", user.id)
      .order("created_at", {
        ascending: false,
      });

  const registeredCourseIds =
    registrations?.map(
      (item: any) => item.course_id
    ) || [];

  async function registerCourse(
    formData: FormData
  ) {
    "use server";

    const supabase = await createClient();

    const courseId =
      formData.get("course_id") as string;

    const studentId =
      formData.get("student_id") as string;

    const courseCode =
      formData.get("course_code") as string;

    const semester =
      formData.get("semester") as string;

    const academicSession =
      formData.get(
        "academic_session"
      ) as string;

    const { data: existing } =
      await supabase
        .from("course_registrations")
        .select("id")
        .eq(
          "student_id",
          studentId
        )
        .eq(
          "course_code",
          courseCode
        )
        .eq(
          "academic_session",
          academicSession
        )
        .eq(
          "semester",
          semester
        )
        .maybeSingle();

    if (existing) {
      revalidatePath(
        "/portal/course-registration"
      );

      redirect(
        "/portal/course-registration"
      );
    }

    const { error } =
      await supabase
        .from(
          "course_registrations"
        )
        .insert({
          student_id: studentId,

          course_id: courseId,

          course_code: courseCode,

          level:
            profile?.level ||
            "Level 1",

          semester,

          academic_session:
            academicSession,

          registration_status:
            "registered",
        });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(
      "/portal/course-registration"
    );

    revalidatePath(
      "/portal/dashboard"
    );

    revalidatePath(
      "/portal/courses"
    );

    revalidatePath(
      "/portal/results"
    );

    redirect(
      "/portal/course-registration"
    );
  }

  async function dropCourse(
    formData: FormData
  ) {
    "use server";

    const supabase = await createClient();

    const registrationId =
      formData.get(
        "registration_id"
      ) as string;

    await supabase
      .from("course_registrations")
      .delete()
      .eq("id", registrationId);

    revalidatePath(
      "/portal/course-registration"
    );

    revalidatePath(
      "/portal/dashboard"
    );

    revalidatePath(
      "/portal/courses"
    );
  }

  return (
    <PortalShell
      title="Course Registration"
      subtitle="Register semester courses, manage enrollment, and maintain academic participation."
    >
      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="section-label">
                Academic Registration
              </p>

              <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
                Available Courses
              </h2>
            </div>

            <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Current Semester
              </p>

              <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
                {studentSemester}
              </h3>

              <p className="mt-2 text-sm text-[#1c2b3a]/60">
                {currentAcademicSession}
              </p>
            </div>
          </div>

          <div className="mt-6 border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
            <p className="text-sm font-semibold text-[#0b1f3a]">
              Active Session:{" "}
              {activeSession?.session_name ||
                "No Active Session"}
            </p>

            <div className="mt-2 space-y-1">
              {openSemesters.length >
              0 ? (
                openSemesters.map(
                  (
                    semester: OpenSemester
                  ) => (
                    <p
                      key={semester.id}
                      className="text-sm font-medium text-green-700"
                    >
                      {
                        semester.semester_name
                      }{" "}
                      Open
                    </p>
                  )
                )
              ) : (
                <p className="text-sm text-red-700">
                  No semester is
                  currently open.
                </p>
              )}
            </div>
          </div>

          {!courses ||
          courses.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No course available
              for your semester
              currently.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {courses.map(
                (course: any) => {
                  const alreadyRegistered =
                    registeredCourseIds.includes(
                      course.id
                    );

                  return (
                    <div
                      key={course.id}
                      className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                    >
                      <p className="section-label">
                        {course.code}
                      </p>

                      <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                        {course.title}
                      </h3>

                      <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                        {course.description ||
                          "No course description available."}
                      </p>

                      <div className="mt-5 grid gap-3 text-sm text-[#1c2b3a]/60">
                        <p>
                          Semester:{" "}
                          <strong>
                            {
                              course.semester
                            }
                          </strong>
                        </p>

                        <p>
                          Credit Units:{" "}
                          <strong>
                            {course.credit_units ||
                              course.units ||
                              0}
                          </strong>
                        </p>
                      </div>

                      <div className="mt-6">
                        {alreadyRegistered ? (
                          <div className="border border-green-300 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                            Already
                            Registered
                          </div>
                        ) : (
                          <form
                            action={
                              registerCourse
                            }
                          >
                            <input
                              type="hidden"
                              name="student_id"
                              value={user.id}
                            />

                            <input
                              type="hidden"
                              name="course_id"
                              value={
                                course.id
                              }
                            />

                            <input
                              type="hidden"
                              name="course_code"
                              value={
                                course.code
                              }
                            />

                            <input
                              type="hidden"
                              name="semester"
                              value={
                                studentSemester
                              }
                            />

                            <input
                              type="hidden"
                              name="academic_session"
                              value={
                                currentAcademicSession
                              }
                            />

                            <button
                              type="submit"
                              className="btn-gold"
                            >
                              Register
                              Course
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Registered Courses
          </h2>

          {!registrations ||
          registrations.length ===
            0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No registered course
              yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {registrations.map(
                (
                  registration: any
                ) => (
                  <div
                    key={
                      registration.id
                    }
                    className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="section-label">
                          {
                            registration.course_code
                          }
                        </p>

                        <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                          Registered
                          Course
                        </h3>

                        <p className="mt-2 text-sm text-[#1c2b3a]/60">
                          {
                            registration.academic_session
                          }{" "}
                          —{" "}
                          {
                            registration.semester
                          }
                        </p>
                      </div>

                      <form
                        action={
                          dropCourse
                        }
                      >
                        <input
                          type="hidden"
                          name="registration_id"
                          value={
                            registration.id
                          }
                        />

                        <button
                          type="submit"
                          className="border border-red-300 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-red-600"
                        >
                          Drop Course
                        </button>
                      </form>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </PortalShell>
  );
}