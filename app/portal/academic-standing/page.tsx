import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

export default async function AcademicStandingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: results, error } =
    await supabase
      .from("student_results")
      .select(`
        *,
        courses:course_id (
          course_code,
          title
        )
      `)
      .eq("student_id", user.id)
      .order("created_at", {
        ascending: false,
      });

  let totalUnits = 0;

  let totalPoints = 0;

  const processedResults =
    results?.map((result: any) => {
      const gradeData =
        calculateGrade(
          result.total_score || 0
        );

      const units =
        result.units || 2;

      const points =
        gradeData.point * units;

      totalUnits += units;

      totalPoints += points;

      return {
        ...result,

        letter_grade:
          gradeData.letter,

        grade_point:
          gradeData.point,

        quality_points: points,
      };
    }) || [];

  const gpa =
    totalUnits > 0
      ? (
          totalPoints /
          totalUnits
        ).toFixed(2)
      : "0.00";

  const cgpa = gpa;

  let standing =
    "Excellent Standing";

  if (Number(cgpa) < 1.5) {
    standing =
      "Withdrawal Risk";
  } else if (
    Number(cgpa) < 2.5
  ) {
    standing =
      "Probation";
  } else if (
    Number(cgpa) < 3.5
  ) {
    standing =
      "Good Standing";
  }

  return (
    <PortalShell
      title="Academic Standing"
      subtitle="Monitor GPA, CGPA, academic performance, transcript progression, and institutional academic status."
    >
      <section className="grid gap-6 md:grid-cols-3">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            GPA
          </p>

          <h2 className="mt-4 font-edc-serif text-6xl font-semibold text-[#0b1f3a]">
            {gpa}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Current Grade Point Average
          </p>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            CGPA
          </p>

          <h2 className="mt-4 font-edc-serif text-6xl font-semibold text-[#c9a84c]">
            {cgpa}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Cumulative Grade Point
            Average
          </p>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <p className="section-label">
            Academic Standing
          </p>

          <h2 className="mt-4 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
            {standing}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Institutional academic
            performance evaluation
          </p>
        </div>
      </section>

      <section className="mt-10 border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Academic Performance
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              GPA Breakdown
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Courses Processed
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {processedResults.length}
            </h3>
          </div>
        </div>

        {error && (
          <p className="mt-8 text-red-600">
            {error.message}
          </p>
        )}

        {!processedResults ||
        processedResults.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No academic result available
            yet.
          </p>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/20 text-left">
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
                    Units
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Grade Point
                  </th>

                  <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                    Quality Points
                  </th>
                </tr>
              </thead>

              <tbody>
                {processedResults.map(
                  (result: any) => (
                    <tr
                      key={result.id}
                      className="border-b border-[#c9a84c]/10"
                    >
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

                      <td className="py-5 text-[#1c2b3a]/70">
                        {result.units}
                      </td>

                      <td className="py-5 text-[#1c2b3a]/70">
                        {
                          result.grade_point
                        }
                      </td>

                      <td className="py-5 font-semibold text-[#0b1f3a]">
                        {
                          result.quality_points
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PortalShell>
  );
}