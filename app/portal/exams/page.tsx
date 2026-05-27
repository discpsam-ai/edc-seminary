"use client";

import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function PortalExamsPage() {
  const supabase = createClient();

  const [exams, setExams] = useState<any[]>([]);

  async function loadExams() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: registrations } =
      await supabase
        .from("course_registrations")
        .select("course_id")
        .eq("student_id", user.id);

    const courseIds =
      registrations?.map(
        (item: any) => item.course_id
      ) || [];

    const { data } = await supabase
      .from("exams")
      .select(`
        *,
        courses:course_id (
          title,
          course_code
        )
      `)
      .in("course_id", courseIds)
      .order("created_at", {
        ascending: false,
      });

    setExams(data || []);
  }

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <PortalShell
      title="Examinations"
      subtitle="Access institutional examinations, CBT assessments, and academic testing activities."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Academic Examination
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Available Exams
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Total Exams
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {exams.length}
            </h3>
          </div>
        </div>

        {exams.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No examination available yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
              >
                <p className="section-label">
                  {
                    exam.courses
                      ?.course_code
                  }
                </p>

                <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  {exam.title}
                </h3>

                <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                  {exam.instructions}
                </p>

                <div className="mt-5 grid gap-3 text-sm text-[#1c2b3a]/60">
                  <p>
                    Duration:{" "}
                    <strong>
                      {exam.duration} Minutes
                    </strong>
                  </p>
                </div>

                <a
                 href={`/portal/test/${exam.id}`}
                  className="btn-gold mt-6 inline-block"
                >
                  Start Examination
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </PortalShell>
  );
}