import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";

export default async function InstructorRubricsPage() {
  const supabase = await createClient();

  const { data: rubrics, error } = await supabase
    .from("grading_rubrics")
    .select(`
      *,
      grading_rubric_items (*)
    `)
    .order("created_at", { ascending: false });

  return (
    <InstructorShell
      title="Grading Rubrics"
      subtitle="View structured grading rubrics for assignments, exams, projects, prayer reports, and formation assessments."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Rubric Records
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!rubrics || rubrics.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No grading rubric has been created yet.
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            {rubrics.map((rubric: any) => (
              <div
                key={rubric.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="section-label">
                      {rubric.assessment_type?.replaceAll("_", " ")}
                    </p>

                    <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {rubric.title}
                    </h3>

                    <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                      {rubric.description || "No description provided."}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {rubric.total_marks} Marks
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {rubric.grading_rubric_items?.length > 0 ? (
                    rubric.grading_rubric_items.map((item: any) => (
                      <div
                        key={item.id}
                        className="border border-[#c9a84c]/20 bg-white p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h4 className="font-semibold text-[#0b1f3a]">
                            {item.criterion}
                          </h4>

                          <span className="text-sm font-bold text-[#c9a84c]">
                            {item.max_marks} marks
                          </span>
                        </div>

                        {item.description && (
                          <p className="mt-2 text-sm leading-6 text-[#1c2b3a]/70">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#1c2b3a]/60">
                      No criteria added yet.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </InstructorShell>
  );
}