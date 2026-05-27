"use client";
import { toast } from "sonner";
import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function InstructorAttendancePage() {
  const supabase = createClient();

  const [courses, setCourses] =
    useState<any[]>([]);

  const [students, setStudents] =
    useState<any[]>([]);

  const [selectedCourse, setSelectedCourse] =
    useState("");

  async function loadCourses() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("instructor_id", user.id);

    setCourses(data || []);
  }

  async function loadStudents(
    courseId: string
  ) {
    const { data } = await supabase
      .from("course_registrations")
      .select(`
        *,
        students:student_id (
          id,
          full_name,
          student_number
        )
      `)
      .eq("course_id", courseId);

    setStudents(data || []);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function markAttendance(
    studentId: string,
    status: string
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("attendance_records")
      .insert({
        course_id: selectedCourse,

        student_id: studentId,

        instructor_id: user.id,

        attendance_date:
          new Date()
            .toISOString()
            .split("T")[0],

        status,
      });

    toast.success(
  `Attendance marked as ${status}`
);
  }

  return (
    <InstructorShell
      title="Attendance Management"
      subtitle="Track class attendance, participation, punctuality, and instructional presence records."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Academic Participation
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Attendance Register
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Registered Students
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {students.length}
            </h3>
          </div>
        </div>

        <div className="mt-8">
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(
                e.target.value
              );

              loadStudents(
                e.target.value
              );
            }}
            className="w-full border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          >
            <option value="">
              Select Course
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
              >
                {course.course_code} —{" "}
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {students.length > 0 && (
          <div className="mt-10 space-y-5">
            {students.map((student: any) => (
              <div
                key={
                  student.students?.id
                }
                className="flex flex-wrap items-center justify-between gap-4 border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
              >
                <div>
                  <p className="section-label">
                    {
                      student.students
                        ?.student_number
                    }
                  </p>

                  <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    {
                      student.students
                        ?.full_name
                    }
                  </h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      markAttendance(
                        student.students
                          ?.id,
                        "present"
                      )
                    }
                    className="btn-gold"
                  >
                    Present
                  </button>

                  <button
                    onClick={() =>
                      markAttendance(
                        student.students
                          ?.id,
                        "late"
                      )
                    }
                    className="border border-yellow-300 bg-yellow-50 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-yellow-700"
                  >
                    Late
                  </button>

                  <button
                    onClick={() =>
                      markAttendance(
                        student.students
                          ?.id,
                        "absent"
                      )
                    }
                    className="border border-red-300 bg-red-50 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-red-600"
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </InstructorShell>
  );
}