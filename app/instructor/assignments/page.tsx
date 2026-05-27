"use client";

import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function InstructorAssignmentsPage() {
  const supabase = createClient();

  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] =
    useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] =
    useState("");

  const [courseId, setCourseId] =
    useState("");

  const [deadline, setDeadline] =
    useState("");

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: coursesData } =
      await supabase
        .from("courses")
        .select("*")
        .eq("instructor_id", user.id);

    setCourses(coursesData || []);

    const { data: assignmentsData } =
      await supabase
        .from("assignments")
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

    setAssignments(assignmentsData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("assignments")
      .insert({
        title,

        instructions,

        course_id: courseId,

        deadline,

        created_by: user.id,
      });

    setTitle("");
    setInstructions("");
    setCourseId("");
    setDeadline("");

    await loadData();
  }

  return (
    <InstructorShell
      title="Assignments"
      subtitle="Create assignments, academic tasks, and instructional assessments."
    >
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Create Assignment
          </h2>

          <form
            onSubmit={handleCreate}
            className="mt-8 grid gap-5"
          >
            <input
              type="text"
              required
              placeholder="Assignment Title"
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
              placeholder="Assignment Instructions"
              value={instructions}
              onChange={(e) =>
                setInstructions(
                  e.target.value
                )
              }
              className="min-h-52 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              type="datetime-local"
              required
              value={deadline}
              onChange={(e) =>
                setDeadline(e.target.value)
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <button
              type="submit"
              className="btn-gold"
            >
              Publish Assignment
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Published Assignments
          </h2>

          {assignments.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No assignment published yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {assignments.map(
                (assignment) => (
                  <div
                    key={assignment.id}
                    className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                  >
                    <p className="section-label">
                      {
                        assignment.courses
                          ?.course_code
                      }
                    </p>

                    <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {assignment.title}
                    </h3>

                    <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                      {
                        assignment.instructions
                      }
                    </p>

                    <p className="mt-5 text-sm text-[#1c2b3a]/50">
                      Deadline:{" "}
                      {new Date(
                        assignment.deadline
                      ).toLocaleString()}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </InstructorShell>
  );
}