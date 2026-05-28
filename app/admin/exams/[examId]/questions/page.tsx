import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    examId: string;
  }>;
};

export default async function AdminExamQuestionsPage({ params }: PageProps) {
  const { examId } = await params;

  const supabase = await createClient();

  const { data: exam } = await supabase
    .from("exams")
    .select("*")
    .eq("id", examId)
    .single();

  const { data: questions, error } = await supabase
    .from("exam_questions")
    .select("*")
    .eq("exam_id", examId)
    .order("created_at", { ascending: true });

  async function addQuestion(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const questionText = formData.get("question_text") as string;
    const questionType = formData.get("question_type") as string;
    const optionA = formData.get("option_a") as string;
    const optionB = formData.get("option_b") as string;
    const optionC = formData.get("option_c") as string;
    const optionD = formData.get("option_d") as string;
    const correctAnswer = formData.get("correct_answer") as string;
    const marks = Number(formData.get("marks"));

    const { error } = await supabase.from("exam_questions").insert({
      exam_id: examId,
      question_text: questionText,
      question_type: questionType,
      option_a: optionA || null,
      option_b: optionB || null,
      option_c: optionC || null,
      option_d: optionD || null,
      correct_answer: correctAnswer || null,
      marks,
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(`/admin/exams/${examId}/questions`);
  }

  return (
    <AdminShell
      title="Assessment Questions"
      subtitle="Add and manage questions for this assessment."
    >
      <section className="space-y-8">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-label">{exam?.course_code}</p>

              <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
                {exam?.title}
              </h2>

              <p className="mt-4 leading-8 text-[#1c2b3a]/70">
                {exam?.description || "No description provided."}
              </p>
            </div>

            <Link href="/admin/exams" className="btn-gold">
              Back
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h3 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Add Question
            </h3>

            <form action={addQuestion} className="mt-8 grid gap-5">
              <select
                name="question_type"
                required
                defaultValue="multiple_choice"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True / False</option>
                <option value="short_answer">Short Answer</option>
                <option value="theory">Theory</option>
              </select>

              <textarea
  name="question_text"
  required
  placeholder="Question text..."
  spellCheck={false}
  className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none transition"
/>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="option_a"
                  placeholder="Option A"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <input
                  name="option_b"
                  placeholder="Option B"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <input
                  name="option_c"
                  placeholder="Option C"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />

                <input
                  name="option_d"
                  placeholder="Option D"
                  className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
                />
              </div>

              <input
                name="correct_answer"
                placeholder="Correct Answer e.g. A, B, C, D, True, or text"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <input
                type="number"
                name="marks"
                required
                defaultValue={1}
                min="1"
                placeholder="Marks"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <button type="submit" className="btn-gold">
                Add Question
              </button>
            </form>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h3 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Question Records
            </h3>

            {error && <p className="mt-6 text-red-600">{error.message}</p>}

            {!questions || questions.length === 0 ? (
              <p className="mt-8 text-[#1c2b3a]/70">
                No question has been added yet.
              </p>
            ) : (
              <div className="mt-8 space-y-5">
                {questions.map((question: any, index: number) => (
                  <div
                    key={question.id}
                    className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="section-label">
                          Question {index + 1} •{" "}
                          {question.question_type?.replaceAll("_", " ")}
                        </p>

                        <h4 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                          {question.question_text}
                        </h4>
                      </div>

                      <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                        {question.marks} marks
                      </span>
                    </div>

                    {(question.option_a ||
                      question.option_b ||
                      question.option_c ||
                      question.option_d) && (
                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {question.option_a && (
                          <p className="border border-[#c9a84c]/20 bg-white p-3">
                            A. {question.option_a}
                          </p>
                        )}

                        {question.option_b && (
                          <p className="border border-[#c9a84c]/20 bg-white p-3">
                            B. {question.option_b}
                          </p>
                        )}

                        {question.option_c && (
                          <p className="border border-[#c9a84c]/20 bg-white p-3">
                            C. {question.option_c}
                          </p>
                        )}

                        {question.option_d && (
                          <p className="border border-[#c9a84c]/20 bg-white p-3">
                            D. {question.option_d}
                          </p>
                        )}
                      </div>
                    )}

                    {question.correct_answer && (
                      <p className="mt-4 text-sm font-semibold text-[#0b1f3a]">
                        Correct Answer: {question.correct_answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}