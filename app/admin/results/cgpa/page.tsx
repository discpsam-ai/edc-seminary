import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";

function getClassification(cgpa: number) {
  if (cgpa >= 4.5) return "Distinction";
  if (cgpa >= 3.5) return "Upper Credit";
  if (cgpa >= 2.5) return "Lower Credit";
  if (cgpa >= 1.5) return "Pass";
  return "Probation";
}

export default async function AdminCGPAPage() {
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
    .order("academic_session", { ascending: false });

  const grouped =
    results?.reduce((acc: any, result: any) => {
      const key = result.student_id;

      if (!acc[key]) {
        acc[key] = {
          student: result.profiles,
          credit_units: 0,
          quality_points: 0,
          courses: 0,
        };
      }

      acc[key].credit_units += Number(result.credit_units || 0);
      acc[key].quality_points += Number(result.quality_points || 0);
      acc[key].courses += 1;

      return acc;
    }, {}) || {};

  const cgpaRecords = Object.values(grouped).map((record: any) => ({
    ...record,
    cgpa:
      record.credit_units > 0
        ? record.quality_points / record.credit_units
        : 0,
  }));

  return (
    <AdminShell
      title="CGPA Records"
      subtitle="Track cumulative academic performance across all courses and semesters."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Cumulative Performance
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {cgpaRecords.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No CGPA record available yet.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {cgpaRecords.map((record: any, index: number) => (
              <div
                key={index}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                      {record.student?.full_name || "Unnamed Student"}
                    </h3>

                    <p className="mt-2 text-[#1c2b3a]/60">
                      Student ID: {record.student?.student_number || "N/A"}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    CGPA {record.cgpa.toFixed(2)}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Courses
                    </p>
                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {record.courses}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Credit Units
                    </p>
                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {record.credit_units}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Quality Points
                    </p>
                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {record.quality_points.toFixed(2)}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                      Classification
                    </p>
                    <p className="mt-2 font-semibold text-[#0b1f3a]">
                      {getClassification(record.cgpa)}
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