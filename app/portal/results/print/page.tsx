"use client";

import PortalShell from "@/components/PortalShell";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function PortalResultsPage() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "EDC Result Slip",
  });

  const results = [
    {
      course: "EDC 101",
      title: "New Birth and Assurance",
      ca: 28,
      exam: 62,
      total: 90,
      grade: "A",
      point: 5,
    },

    {
      course: "EDC 103",
      title: "Holiness & Sanctification",
      ca: 24,
      exam: 58,
      total: 82,
      grade: "A",
      point: 5,
    },
  ];

  return (
    <PortalShell
      title="Academic Results"
      subtitle="Review published semester academic performance and print official result slips."
    >
      <div className="mb-8 flex justify-end">
        <button
          onClick={handlePrint}
          className="btn-gold"
        >
          Print Result Slip
        </button>
      </div>

      <div
        ref={printRef}
        className="border border-[#c9a84c]/20 bg-white p-10"
      >
        <div className="border-b border-[#c9a84c]/20 pb-8 text-center">
          <h1 className="font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            Ecclesia Discipleship & Commissioning
          </h1>

          <p className="mt-4 text-[#1c2b3a]/70">
            Official Semester Result Slip
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student Name
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
              Discp. Samuel Ojo
            </h3>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Student ID
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
              EDC-2026-001
            </h3>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Semester
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
              Semester 1
            </h3>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#c9a84c]/20 text-left">
                <th className="pb-4">Course</th>
                <th className="pb-4">Title</th>
                <th className="pb-4">CA</th>
                <th className="pb-4">Exam</th>
                <th className="pb-4">Total</th>
                <th className="pb-4">Grade</th>
                <th className="pb-4">Point</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result) => (
                <tr
                  key={result.course}
                  className="border-b border-[#c9a84c]/10"
                >
                  <td className="py-5 font-semibold">
                    {result.course}
                  </td>

                  <td className="py-5">
                    {result.title}
                  </td>

                  <td className="py-5">
                    {result.ca}
                  </td>

                  <td className="py-5">
                    {result.exam}
                  </td>

                  <td className="py-5 font-semibold">
                    {result.total}
                  </td>

                  <td className="py-5">
                    {result.grade}
                  </td>

                  <td className="py-5">
                    {result.point}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 border-t border-[#c9a84c]/20 pt-8">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Total Units
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                6
              </h3>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                GPA
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#0b1f3a]">
                5.00
              </h3>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Academic Status
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-green-700">
                Excellent
              </h3>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}