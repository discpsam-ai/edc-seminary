import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const semesterMap: Record<
  number,
  string
> = {
  1: "Semester 1",
  2: "Semester 2",
  3: "Semester 3",
  4: "Semester 4",
  5: "Semester 5",
  6: "Semester 6",
  7: "Semester 7",
  8: "Semester 8",
};

export default async function BulkPromotionPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      student_number,
      semester_number,
      current_semester,
      admission_set,
      transcript_eligible,
      programme_completed
    `
    )
    .or("role.eq.student,roles.cs.{student}")
    .order("semester_number", {
      ascending: true,
    });

  async function bulkPromote(
    formData: FormData
  ) {
    "use server";

    const supabase = await createClient();

    const fromSemester = Number(
      formData.get("from_semester")
    );

    const toSemester =
      fromSemester + 1;

    if (fromSemester >= 8) {
      throw new Error(
        "Semester 8 students have already completed the programme."
      );
    }

    const {
      data: eligibleStudents,
      error,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq(
        "semester_number",
        fromSemester
      )
      .or(
        "role.eq.student,roles.cs.{student}"
      );

    if (error) {
      throw new Error(error.message);
    }

    for (const student of eligibleStudents ||
      []) {
      const transcriptEligible =
        toSemester >= 2;

      const programmeCompleted =
        toSemester >= 8;

      const {
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          semester_number:
            toSemester,

          current_semester:
            semesterMap[
              toSemester
            ],

          transcript_eligible:
            transcriptEligible,

          programme_completed:
            programmeCompleted,

          graduation_approved:
            programmeCompleted,
        })
        .eq("id", student.id);

      if (updateError) {
        throw new Error(
          updateError.message
        );
      }

      const {
        error: promotionError,
      } = await supabase
        .from("student_promotions")
        .insert({
          student_id: student.id,

          from_semester:
            semesterMap[
              fromSemester
            ],

          to_semester:
            semesterMap[
              toSemester
            ],

          from_session:
            student.admission_set,

          to_session:
            student.admission_set,

          promotion_status:
            "promoted",

          promoted_at:
            new Date().toISOString(),
        });

      if (promotionError) {
        throw new Error(
          promotionError.message
        );
      }

      await supabase.rpc(
        "auto_register_next_semester_courses",
        {
          student_id_input:
            student.id,
        }
      );
    }

    revalidatePath(
      "/admin/promotions/bulk"
    );

    revalidatePath(
      "/admin/promotions"
    );

    revalidatePath(
      "/portal/dashboard"
    );

    revalidatePath(
      "/portal/course-registration"
    );

    revalidatePath(
      "/portal/results"
    );

    revalidatePath(
      "/portal/transcript"
    );
  }

  return (
    <AdminShell
      title="Bulk Semester Promotion"
      subtitle="Promote entire semester groups into the next stage of institutional formation."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Semester Promotion Engine
        </h2>

        <form
          action={bulkPromote}
          className="mt-8 grid max-w-xl gap-5"
        >
          <select
            name="from_semester"
            required
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          >
            <option value="">
              Select Semester To Promote
            </option>

            <option value="1">
              Semester 1 → Semester 2
            </option>

            <option value="2">
              Semester 2 → Semester 3
            </option>

            <option value="3">
              Semester 3 → Semester 4
            </option>

            <option value="4">
              Semester 4 → Semester 5
            </option>

            <option value="5">
              Semester 5 → Semester 6
            </option>

            <option value="6">
              Semester 6 → Semester 7
            </option>

            <option value="7">
              Semester 7 → Semester 8
            </option>
          </select>

          <button
            type="submit"
            className="btn-gold"
          >
            Promote Semester
          </button>
        </form>

        <div className="mt-10">
          <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
            Current Student Distribution
          </h3>

          {!students ||
          students.length === 0 ? (
            <p className="mt-6 text-[#1c2b3a]/70">
              No students found.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {students.map(
                (student: any) => (
                  <div
                    key={student.id}
                    className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                  >
                    <p className="section-label">
                      {student.student_number ||
                        "No Student ID"}
                    </p>

                    <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {student.full_name}
                    </h3>

                    <p className="mt-2 text-sm text-[#1c2b3a]/60">
                      {student.email}
                    </p>

                    <div className="mt-5 grid gap-3 text-sm text-[#1c2b3a]/70">
                      <p>
                        Current Semester:{" "}
                        <strong>
                          {
                            student.current_semester
                          }
                        </strong>
                      </p>

                      <p>
                        Semester Number:{" "}
                        <strong>
                          {
                            student.semester_number
                          }
                        </strong>
                      </p>

                      <p>
                        Transcript Eligible:{" "}
                        <strong>
                          {student.transcript_eligible
                            ? "Yes"
                            : "No"}
                        </strong>
                      </p>

                      <p>
                        Programme Completed:{" "}
                        <strong>
                          {student.programme_completed
                            ? "Yes"
                            : "No"}
                        </strong>
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}