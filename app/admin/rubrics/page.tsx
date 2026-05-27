import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminRubricsPage() {
  const supabase = await createClient();

  const { data: rubrics, error } = await supabase
    .from("grading_rubrics")
    .select(`
      *,
      grading_rubric_items (*)
    `)
    .order("created_at", { ascending: false });

  async function createRubric(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const assessmentType = formData.get("assessment_type") as string;
    const totalMarks = Number(formData.get("total_marks"));

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("grading_rubrics").insert({
      title,
      description,
      assessment_type: assessmentType,
      total_marks: totalMarks,
      created_by: user?.id,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/rubrics");
  }

  async function addRubricItem(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const rubricId = formData.get("rubric_id") as string;
    const criterion = formData.get("criterion") as string;
    const description = formData.get("description") as string;
    const maxMarks = Number(formData.get("max_marks"));

    const { error } = await supabase.from("grading_rubric_items").insert({
      rubric_id: rubricId,
      criterion,
      description,
      max_marks: maxMarks,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/rubrics");
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Learning Management</p>

            <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              Grading Rubrics
            </h1>

            <p className="mt-3 max-w-3xl text-[#1c2b3a]/70">
              Create structured grading rubrics for assignments, theory exams,
              projects, prayer reports, and ministry formation assessments.
            </p>
          </div>

          <Link href="/admin/dashboard" className="btn-gold">
            Back to Admin
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Create Rubric
            </h2>

            <form action={createRubric} className="mt-8 grid gap-5">
              <input
                name="title"
                required
                placeholder="Rubric title"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <select
                name="assessment_type"
                required
                defaultValue="assignment"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="test">Test</option>
                <option value="exam">Examination</option>
                <option value="project">Project</option>
                <option value="prayer_report">Prayer Report</option>
                <option value="formation">Formation Assessment</option>
              </select>

              <input
                type="number"
                name="total_marks"
                required
                defaultValue={100}
                placeholder="Total marks"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <textarea
                name="description"
                placeholder="Rubric description..."
                className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <button type="submit" className="btn-gold">
                Create Rubric
              </button>
            </form>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Rubric Records
            </h2>

            {error && <p className="mt-6 text-red-600">{error.message}</p>}

            {!rubrics || rubrics.length === 0 ? (
              <p className="mt-8 text-[#1c2b3a]/70">
                No rubric has been created yet.
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

                    <form
                      action={addRubricItem}
                      className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_120px_auto]"
                    >
                      <input type="hidden" name="rubric_id" value={rubric.id} />

                      <input
                        name="criterion"
                        required
                        placeholder="Criterion"
                        className="border border-[#c9a84c]/30 bg-white p-4 outline-none"
                      />

                      <input
                        name="description"
                        placeholder="Description"
                        className="border border-[#c9a84c]/30 bg-white p-4 outline-none"
                      />

                      <input
                        type="number"
                        name="max_marks"
                        required
                        placeholder="Marks"
                        className="border border-[#c9a84c]/30 bg-white p-4 outline-none"
                      />

                      <button type="submit" className="btn-gold">
                        Add
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}