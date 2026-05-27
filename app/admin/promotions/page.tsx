"use client";
import { toast } from "sonner";
import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function PromotionsPage() {
  const supabase = createClient();

  const [students, setStudents] =
    useState<any[]>([]);

  async function loadStudents() {
    const { data } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        email,
        level,
        current_semester,
        student_number,
        cgpa,
        academic_status,
        graduation_status
      `)
      .contains("roles", ["student"])
      .order("full_name", {
        ascending: true,
      });

    setStudents(data || []);
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function promoteStudent(
    student: any
  ) {
    let promotedLevel =
      student.level || "100";

    let promotedSemester =
      student.current_semester ||
      "First Semester";

    let academicStatus =
      "active";

    let graduationStatus =
      "in-progress";

    if (
      Number(student.cgpa) < 1.5
    ) {
      academicStatus =
        "probation";
    }

    if (student.level === "100") {
      promotedLevel = "200";
    } else if (
      student.level === "200"
    ) {
      promotedLevel = "300";
    } else if (
      student.level === "300"
    ) {
      promotedLevel = "400";
    } else if (
      student.level === "400"
    ) {
      promotedLevel =
        "Completed Programme";

      graduationStatus =
        "eligible";
    }

    if (
      student.current_semester ===
      "First Semester"
    ) {
      promotedSemester =
        "Second Semester";
    } else {
      promotedSemester =
        "First Semester";
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        level: promotedLevel,

        current_semester:
          promotedSemester,

        academic_status:
          academicStatus,

        graduation_status:
          graduationStatus,
      })
      .eq("id", student.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
  `${student.full_name} promoted successfully`
);

    await loadStudents();
  }

  return (
    <AdminShell
      title="Academic Promotions"
      subtitle="Manage student progression, graduation eligibility, academic standing, and institutional advancement."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Academic Advancement
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Promotion Engine
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Total Students
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {students.length}
            </h3>
          </div>
        </div>

        {students.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No student available yet.
          </p>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/20 text-left">
                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Student
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Level
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Semester
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    CGPA
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Academic Status
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Graduation
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map(
                  (student: any) => (
                    <tr
                      key={student.id}
                      className="border-b border-[#c9a84c]/10"
                    >
                      <td className="py-5">
                        <p className="font-semibold text-[#0b1f3a]">
                          {
                            student.full_name
                          }
                        </p>

                        <p className="mt-1 text-sm text-[#1c2b3a]/60">
                          {
                            student.student_number
                          }
                        </p>
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {student.level ||
                          "Not Assigned"}
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {student.current_semester ||
                          "Not Assigned"}
                      </td>

                      <td className="py-5 font-semibold text-[#0b1f3a]">
                        {student.cgpa ||
                          "0.00"}
                      </td>

                      <td className="py-5">
                        <span className="border border-[#c9a84c]/20 bg-[#fdfaf4] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]">
                          {student.academic_status ||
                            "active"}
                        </span>
                      </td>

                      <td className="py-5">
                        <span className="border border-green-200 bg-green-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                          {student.graduation_status ||
                            "in-progress"}
                        </span>
                      </td>

                      <td className="py-5">
                        <button
                          onClick={() =>
                            promoteStudent(
                              student
                            )
                          }
                          className="btn-gold"
                        >
                          Promote
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}