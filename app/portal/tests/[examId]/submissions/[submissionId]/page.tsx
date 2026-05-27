import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    examId: string;
    submissionId: string;
  }>;
};

export default async function ReviewExamAnswersPage({
  params,
}: PageProps) {
  const { examId, submissionId } = await params;

  const supabase = await createClient();

  const { data: exam } = await supabase
    .from("exams")
    .select("*")
    .eq("id", examId)
    .single();

  const { data: submission } = await supabase
    .from("exam_submissions")
    .select(`
      *,
      profiles:student_id (
        full_name,
        email
      )
    `)
    .eq("id", submissionId)
    .single();

  const { data: answers, error } = await supabase
    .from("exam_answers")
    .select(`
      *,
      exam_questions (
        question_text,
        question_type,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        marks,
        position
      )
    `)
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: true });

  return (
    <InstructorShell
      title="Review Answers"
      subtitle="Review objective answers, theory responses, and student performance."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <Link
          href={`/instructor/exams/${examId}/submissions`}
          className="text-sm font-bold uppercase tracking-[0.15em] text-[#c9a84c]"
        >
          ← Back to Submissions
        </Link>

        <div className="mt-6">
          <p className="section-label">{exam?.course_code}</p>

          <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            {exam?.title}
          </h2>

          <p className="mt-4 text-[#1c2b3a]/70">
            Student: {submission?.profiles?.full_name || "Unnamed Student"}
          </p>

          <p className="mt-1 text-sm text-[#1c2b3a]/50">
            {submission?.profiles?.email}
          </p>
        </div>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!answers || answers.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No answer was found for this submission.
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            {answers.map((answer: any) => {
              const question = answer.exam_questions;

              return (
                <div
                  key={answer.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="section-label">
                      Question {question?.position}
                    </p>

                    <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                      {question?.question_type}
                    </span>
                  </div>

                  <p className="mt-4 leading-8 text-[#0b1f3a]">
                    {question?.question_text}
                  </p>

                  {question?.question_type === "objective" && (
                    <div className="mt-5 grid gap-2 text-sm text-[#1c2b3a]/70">
                      <p>A. {question?.option_a}</p>
                      <p>B. {question?.option_b}</p>
                      <p>C. {question?.option_c}</p>
                      <p>D. {question?.option_d}</p>

                      <div className="mt-4 grid gap-2 border border-[#c9a84c]/20 bg-white p-4">
                        <p>
                          Student Answer:{" "}
                          <strong>
                            {answer?.selected_option || "No answer"}
                          </strong>
                        </p>

                        <p>
                          Correct Answer:{" "}
                          <strong>{question?.correct_option}</strong>
                        </p>

                        <p>
                          Score: <strong>{answer?.score}</strong> /{" "}
                          {question?.marks}
                        </p>

                        <p>
                          Status:{" "}
                          <strong>
                            {answer?.is_correct ? "Correct" : "Incorrect"}
                          </strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {question?.question_type === "theory" && (
                    <div className="mt-5 border border-[#c9a84c]/20 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                        Student Theory Answer
                      </p>

                      <p className="mt-3 whitespace-pre-wrap leading-8 text-[#1c2b3a]/70">
                        {answer?.answer_text || "No answer submitted."}
                      </p>

                      <p className="mt-4 text-sm font-semibold text-[#0b1f3a]">
                        Marks Available: {question?.marks}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </InstructorShell>
  );
}