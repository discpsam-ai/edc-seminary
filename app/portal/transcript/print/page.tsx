"use client";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { createClient } from "@/utils/supabase/client";

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

export default function PrintableTranscriptPage() {
  const supabase = createClient();

  const [profile, setProfile] =
    useState<any>(null);

  const [results, setResults] =
    useState<any[]>([]);

  const printRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profileData } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

      setProfile(profileData);

      const { data: resultsData } =
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

      setResults(resultsData || []);
    }

    loadData();
  }, []);

  let totalUnits = 0;

  let totalPoints = 0;

  const processedResults =
    results.map((result: any) => {
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

  const handlePrint =
    useReactToPrint({
      contentRef: printRef,
    });

  return (
    <div className="min-h-screen bg-[#f5f1e8] p-10">
      <div className="mb-8 flex justify-end">
        <button
          onClick={handlePrint}
          className="btn-gold"
        >
          Print Transcript
        </button>
      </div>

      <div
        ref={printRef}
        className="mx-auto max-w-6xl bg-white p-12"
      >
        <div className="border-b border-[#c9a84c]/20 pb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a84c]">
            Ecclesia Discipleship &
            Commissioning
          </p>

          <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            Official Academic Transcript
          </h1>

          <p className="mt-4 text-[#1c2b3a]/70">
            Institutional Academic Record
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student Name
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.full_name}
            </h2>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student ID
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.student_number}
            </h2>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Academic Level
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
              {profile?.level}
            </h2>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              CGPA
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#c9a84c]">
              {cgpa}
            </h2>
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

                    <td className="py-5 font-semibold text-[#0b1f3a]">
                      {
                        result.letter_grade
                      }
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
                      {result.units}
                    </td>

                    <td className="py-5 text-[#1c2b3a]/70">
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

        <div className="mt-16 flex items-end justify-between">
          <div>
            <div className="h-px w-48 bg-[#0b1f3a]" />

            <p className="mt-3 text-sm text-[#1c2b3a]/70">
              Registrar Signature
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-[#1c2b3a]/50">
              Generated on
            </p>

            <p className="mt-2 font-semibold text-[#0b1f3a]">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}