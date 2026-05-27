"use client";

import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ExamSessionPage() {
  const supabase = createClient();

  const params = useParams();

  const examId = params.examId as string;

  const [exam, setExam] = useState<any>(null);

  const [questions, setQuestions] =
    useState<any[]>([]);

  const [answers, setAnswers] = useState<{
    [key: string]: string;
  }>({});

  const [submitted, setSubmitted] =
    useState(false);

  const [timeLeft, setTimeLeft] =
    useState(0);

  async function loadExam() {
    const { data: examData } =
      await supabase
        .from("exams")
        .select("*")
        .eq("id", examId)
        .single();

    setExam(examData);

    const { data: questionData } =
      await supabase
        .from("exam_questions")
        .select("*")
        .eq("exam_id", examId);

    setQuestions(questionData || []);
  }

  useEffect(() => {
    loadExam();
  }, []);

  useEffect(() => {
    if (!exam) return;

    setTimeLeft(exam.duration * 60);
  }, [exam]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted)
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          submitExam();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  async function submitExam() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    let score = 0;

    questions.forEach((question) => {
      if (
        answers[question.id] ===
        question.correct_option
      ) {
        score += 1;
      }
    });

    await supabase
      .from("exam_submissions")
      .insert({
        exam_id: examId,

        student_id: user.id,

        score,
      });

    setSubmitted(true);
  }

  if (!exam) {
    return (
      <PortalShell
        title="Loading"
        subtitle="Preparing examination..."
      >
        <p>Loading examination...</p>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      title={exam.title}
      subtitle="Complete your CBT examination carefully before submission."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5">
          <p className="section-label">
            Examination Instructions
          </p>

          <p className="mt-4 leading-7 text-[#1c2b3a]/70">
            {exam.instructions}
          </p>

          <p className="mt-5 text-sm text-[#1c2b3a]/50">
            Duration: {exam.duration} Minutes
          </p>

          <div className="mt-5 border border-red-300 bg-red-50 px-5 py-4">
            <p className="text-sm uppercase tracking-[0.15em] text-red-600">
              Remaining Time
            </p>

            <h3 className="mt-2 text-4xl font-bold text-red-700">
              {Math.floor(timeLeft / 60)}
              :
              {(timeLeft % 60)
                .toString()
                .padStart(2, "0")}
            </h3>
          </div>
        </div>

        {submitted ? (
          <div className="mt-10 border border-green-300 bg-green-50 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-green-700">
              Examination Submitted
            </h2>

            <p className="mt-4 text-green-700">
              Your CBT examination has been submitted successfully.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {questions.map(
              (question, index) => (
                <div
                  key={question.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                >
                  <h3 className="text-xl font-semibold text-[#0b1f3a]">
                    {index + 1}.{" "}
                    {question.question}
                  </h3>

                  <div className="mt-6 grid gap-3">
                    {[
                      {
                        key: "A",
                        value:
                          question.option_a,
                      },

                      {
                        key: "B",
                        value:
                          question.option_b,
                      },

                      {
                        key: "C",
                        value:
                          question.option_c,
                      },

                      {
                        key: "D",
                        value:
                          question.option_d,
                      },
                    ].map((option) => (
                      <label
                        key={option.key}
                        className="flex items-center gap-3 border border-[#c9a84c]/10 bg-white p-4"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.key}
                          checked={
                            answers[
                              question.id
                            ] === option.key
                          }
                          onChange={() =>
                            setAnswers({
                              ...answers,

                              [question.id]:
                                option.key,
                            })
                          }
                        />

                        <span>
                          {option.key}.{" "}
                          {option.value}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            )}

            {questions.length > 0 && (
              <button
                onClick={submitExam}
                className="btn-gold"
              >
                Submit Examination
              </button>
            )}
          </div>
        )}
      </section>
    </PortalShell>
  );
}