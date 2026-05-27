import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";

export default async function PublishedResultsPage() {
  const supabase = await createClient();

  const { data: results, error } = await supabase
    .from("course_results")
    .select(`
      *,
      profiles:student_id (
        full_name,
        student_number
      )
    `)
    .order("published_at", { ascending: false });

  return (
    <AdminShell
      title="Published Results"
      subtitle="Review all officially published academic records and released grades."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Released Academic Results
        </h2>

        {error && (
          <p className="mt-6 text-red-600">{error.message}</p>
        )}

        {!results || results.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No published result available yet.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {results.map((result: any) => (
              <div
                key={result.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="section-label">
                      {result.course_code}
                    </p>

                    <h3 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                      {result.profiles?.full_name || "Unnamed Student"}
                    </h3>

                    <p className="mt-2 text-[#1c2b3a]/60">
                      Student ID:{" "}
                      {result.profiles?.student_number || "N/A"}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {result.grade}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-5">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Session
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {result.academic_session}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Semester
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {result.semester}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Total Score
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {Number(result.total_score || 0).toFixed(1)}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      GPA Point
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {result.grade_point}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Published
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {result.published_at
                        ? new Date(
                            result.published_at
                          ).toLocaleDateString()
                        : "Released"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}