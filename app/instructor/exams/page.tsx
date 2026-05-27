"use client";

import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function InstructorExamsPage() {
  const supabase = createClient();

  const [courses, setCourses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] =
    useState("");

  const [duration, setDuration] =
    useState("30");

  const [courseId, setCourseId] =
    useState("");

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: courseData } =
      await supabase
        .from("courses")
        .select("*")
        .eq("instructor_id", user.id);

    setCourses(courseData || []);

    const { data: examData } =
      await supabase
        .from("exams")
        .select(`
          *,
          courses:course_id (
            title,
            course_code
          )
        `)
        .order("created_at", {
          ascending: false,
        });

    setExams(examData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createExam(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("exams")
      .insert({
        title,

        instructions,

        duration: Number(duration),

        course_id: courseId,

        created_by: user.id,
      });

    setTitle("");
    setInstructions("");
    setDuration("30");
    setCourseId("");

    await loadData();
  }

  return (
    <InstructorShell
      title="Examinations"
      subtitle="Create examinations, manage CBT assessments, and oversee academic evaluations."
    >
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Create Examination
          </h2>

          <form
            onSubmit={createExam}
            className="mt-8 grid gap-5"
          >
            <input
              type="text"
              required
              placeholder="Exam Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <select
              required
              value={courseId}
              onChange={(e) =>
                setCourseId(e.target.value)
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
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

            <textarea
              required
              placeholder="Exam Instructions"
              value={instructions}
              onChange={(e) =>
                setInstructions(
                  e.target.value
                )
              }
              className="min-h-40 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              type="number"
              required
              placeholder="Duration (Minutes)"
              value={duration}
              onChange={(e) =>
                setDuration(e.target.value)
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <button
              type="submit"
              className="btn-gold"
            >
              Publish Examination
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Published Examinations
          </h2>

          {exams.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No examination published yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                >
                  <p className="section-label">
                    {
                      exam.courses
                        ?.course_code
                    }
                  </p>

                  <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    {exam.title}
                  </h3>

                  <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                    {exam.instructions}
                  </p>

                  <p className="mt-5 text-sm text-[#1c2b3a]/50">
                    Duration:{" "}
                    {exam.duration} minutes
                  </p>

                  <a
                    href={`/instructor/exams/${exam.id}`}
                    className="btn-gold mt-6 inline-block"
                  >
                    Manage Questions
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </InstructorShell>
  );
}