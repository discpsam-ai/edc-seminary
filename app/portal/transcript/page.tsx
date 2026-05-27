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

export default async function TranscriptPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

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
        ascending: true,
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

      const qualityPoints =
        gradeData.point * units;

      totalUnits += units;

      totalPoints += qualityPoints;

      return {
        ...result,

        letter_grade:
          gradeData.letter,

        grade_point:
          gradeData.point,

        quality_points:
          qualityPoints,
      };
    }) || [];

  const cgpa =
    totalUnits > 0
      ? (
          totalPoints /
          totalUnits
        ).toFixed(2)
      : "0.00";

  return (
    <PortalShell
      title="Academic Transcript"
      subtitle="Official institutional academic transcript and cumulative performance record."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-10">
        <div className="border-b border-[#c9a84c]/20 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="section-label">
                Ecclesia Discipleship &
                Commissioning
              </p>

              <h2 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
                Official Transcript
              </h2>
            </div>

            <div className="text-right">
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Academic Record
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#c9a84c]">
                CGPA: {cgpa}
              </h3>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student Name
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.full_name}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student ID
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.student_number}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Academic Level
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.level ||
                "Not Assigned"}
            </h3>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Academic Status
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-green-700">
              Active
            </h3>
          </div>
        </div>

        <div className="mt-12 overflow-x-auto">
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
              </tr>
            </thead>

            <tbody>
              {processedResults.map(
                (result: any) => (
                  <tr
                    key={result.id}
                    className="border-b border-[#c9a84c]/10"
                  >
                    <td className="py-5 font-semibold text-[#0b1f3a]">
                      {
                        result.courses
                          ?.course_code
                      }
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {
                        result.courses
                          ?.title
                      }
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

        {error && (
          <p className="mt-8 text-red-600">
            {error.message}
          </p>
        )}
      </section>
    </PortalShell>
  );
}