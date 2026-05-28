import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function ResultPublicationPage() {
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
    .order("submitted_at", {
      ascending: false,
    });

  async function publishResult(
    formData: FormData
  ) {
    "use server";

    const supabase = await createClient();

    const resultId =
      formData.get("result_id") as string;

    const action =
      formData.get("action") as string;

    const publish =
      action === "publish";

    const { error } = await supabase
      .from("course_results")
      .update({
        publication_status: publish
          ? "published"
          : "draft",
        result_visibility: publish,
        published_at: publish
          ? new Date().toISOString()
          : null,
      })
      .eq("id", resultId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(
      "/admin/results/publication"
    );
  }

  return (
    <AdminShell
      title="Result Publication"
      subtitle="Manage institutional publication and visibility of academic examination records."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Examination Publication Office
        </h2>

        {error && (
          <p className="mt-6 text-red-600">
            {error.message}
          </p>
        )}

        {!results || results.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No examination record found.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {results.map((result: any) => (
              <div
                key={result.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="section-label">
                      {result.course_code}
                    </p>

                    <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {result.profiles
                        ?.full_name ||
                        "Unnamed Student"}
                    </h3>

                    <p className="mt-2 text-sm text-[#1c2b3a]/60">
                      {result.profiles
                        ?.student_number ||
                        "No Student ID"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                        result.publication_status ===
                        "published"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-yellow-300 bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {result.publication_status ||
                        "draft"}
                    </span>

                    <form action={publishResult}>
                      <input
                        type="hidden"
                        name="result_id"
                        value={result.id}
                      />

                      <input
                        type="hidden"
                        name="action"
                        value={
                          result.publication_status ===
                          "published"
                            ? "unpublish"
                            : "publish"
                        }
                      />

                      <button
                        type="submit"
                        className="btn-gold"
                      >
                        {result.publication_status ===
                        "published"
                          ? "Unpublish"
                          : "Publish"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-5">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Assignment
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {result.assignment_score ??
                        0}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Exam
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {result.exam_score ?? 0}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Total
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {result.total_score ?? 0}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Grade
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {result.grade || "N/A"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      GPA Point
                    </p>

                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {result.grade_point ??
                        0}
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