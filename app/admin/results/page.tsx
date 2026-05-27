"use client";
import { toast } from "sonner";
import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

function calculateGrade(score: number) {
  if (score >= 70)
    return {
      letter: "A",
      point: 5,
    };

  if (score >= 60)
    return {
      letter: "B",
      point: 4,
    };

  if (score >= 50)
    return {
      letter: "C",
      point: 3,
    };

  if (score >= 45)
    return {
      letter: "D",
      point: 2,
    };

  if (score >= 40)
    return {
      letter: "E",
      point: 1,
    };

  return {
    letter: "F",
    point: 0,
  };
}

export default function AdminResultsPage() {
  const supabase = createClient();

  const [students, setStudents] =
    useState<any[]>([]);

  const [courses, setCourses] =
    useState<any[]>([]);

  const [results, setResults] =
    useState<any[]>([]);

  const [studentId, setStudentId] =
    useState("");

  const [courseId, setCourseId] =
    useState("");

  const [caScore, setCaScore] =
    useState("");

  const [examScore, setExamScore] =
    useState("");

  async function loadData() {
    const { data: studentsData } =
      await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          student_number
        `)
        .contains("roles", ["student"])
        .order("full_name");

    const { data: coursesData } =
      await supabase
        .from("courses")
        .select(`
          id,
          title,
          course_code
        `)
        .order("course_code");

    const { data: resultsData } =
      await supabase
        .from("student_results")
        .select(`
          *,
          students:student_id (
            full_name,
            student_number
          ),
          courses:course_id (
            title,
            course_code
          )
        `)
        .order("created_at", {
          ascending: false,
        });

    setStudents(studentsData || []);
    setCourses(coursesData || []);
    setResults(resultsData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function uploadResult(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const total =
      Number(caScore) +
      Number(examScore);

    const grade =
      calculateGrade(total);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const student =
      students.find(
        (s) => s.id === studentId
      );

    await supabase
      .from("student_results")
      .insert({
        student_id: studentId,

        course_id: courseId,

        ca_score: Number(caScore),

        exam_score:
          Number(examScore),

        total_score: total,

        letter_grade:
          grade.letter,

        grade_point:
          grade.point,

        uploaded_by: user?.id,

        level: "100",

        semester:
          "First Semester",

        academic_session:
          "2026/2027",

        units: 2,
      });

    if (student) {
      const studentResults =
        results.filter(
          (r) =>
            r.student_id ===
            studentId
        );

      const totalPoints =
        studentResults.reduce(
          (
            sum,
            result
          ) =>
            sum +
            Number(
              result.grade_point || 0
            ) *
              Number(
                result.units || 2
              ),
          grade.point * 2
        );

      const totalUnits =
        studentResults.reduce(
          (
            sum,
            result
          ) =>
            sum +
            Number(
              result.units || 2
            ),
          2
        );

      const cgpa =
        totalUnits > 0
          ? (
              totalPoints /
              totalUnits
            ).toFixed(2)
          : "0.00";

      await supabase
        .from("profiles")
        .update({
          cgpa,
        })
        .eq("id", studentId);
    }

   toast.success("Result uploaded successfully");

    setStudentId("");
    setCourseId("");
    setCaScore("");
    setExamScore("");

    loadData();
  }

  return (
    <AdminShell
      title="Academic Results"
      subtitle="Upload, manage, publish, and oversee institutional academic records and transcript data."
    >
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            Academic Upload
          </p>

          <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Upload Result
          </h2>

          <form
            onSubmit={uploadResult}
            className="mt-8 grid gap-5"
          >
            <select
              required
              value={studentId}
              onChange={(e) =>
                setStudentId(
                  e.target.value
                )
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="">
                Select Student
              </option>

              {students.map(
                (student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {
                      student.full_name
                    }{" "}
                    (
                    {
                      student.student_number
                    }
                    )
                  </option>
                )
              )}
            </select>

            <select
              required
              value={courseId}
              onChange={(e) =>
                setCourseId(
                  e.target.value
                )
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="">
                Select Course
              </option>

              {courses.map(
                (course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {
                      course.course_code
                    }{" "}
                    — {course.title}
                  </option>
                )
              )}
            </select>

            <input
              type="number"
              required
              placeholder="CA Score"
              value={caScore}
              onChange={(e) =>
                setCaScore(
                  e.target.value
                )
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              type="number"
              required
              placeholder="Exam Score"
              value={examScore}
              onChange={(e) =>
                setExamScore(
                  e.target.value
                )
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <button
              type="submit"
              className="btn-gold"
            >
              Upload Result
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="section-label">
                Institutional Records
              </p>

              <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
                Uploaded Results
              </h2>
            </div>

            <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Total Results
              </p>

              <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
                {results.length}
              </h3>
            </div>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/20 text-left">
                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Student
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Course
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Score
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Grade
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    GPA
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.map(
                  (result: any) => (
                    <tr
                      key={result.id}
                      className="border-b border-[#c9a84c]/10"
                    >
                      <td className="py-5">
                        <p className="font-semibold text-[#0b1f3a]">
                          {
                            result.students
                              ?.full_name
                          }
                        </p>

                        <p className="mt-1 text-sm text-[#1c2b3a]/60">
                          {
                            result.students
                              ?.student_number
                          }
                        </p>
                      </td>

                      <td className="py-5">
                        <p className="font-semibold text-[#0b1f3a]">
                          {
                            result.courses
                              ?.course_code
                          }
                        </p>

                        <p className="mt-1 text-sm text-[#1c2b3a]/60">
                          {
                            result.courses
                              ?.title
                          }
                        </p>
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {
                          result.total_score
                        }
                      </td>

                      <td className="py-5">
                        <span className="border border-[#c9a84c]/20 bg-[#fdfaf4] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]">
                          {
                            result.letter_grade
                          }
                        </span>
                      </td>

                      <td className="py-5 font-semibold text-[#0b1f3a]">
                        {
                          result.grade_point
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}