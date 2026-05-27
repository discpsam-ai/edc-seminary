import InstructorShell from "@/components/InstructorShell";

const reports = [
  {
    student: "Boluwatife Raji",
    duration: "2 Hours",
    focus: "Consecration & Hunger",
    status: "Reviewed",
  },
  {
    student: "Irene Emmanuel",
    duration: "1 Hour 30 Minutes",
    focus: "Revival Intercession",
    status: "Pending",
  },
  {
    student: "Taiwo Esther",
    duration: "3 Hours",
    focus: "Waiting on God",
    status: "Approved",
  },
];

export default function InstructorPrayerReportsPage() {
  return (
    <InstructorShell
      title="Prayer Reports Oversight"
      subtitle="Review student prayer consistency, fasting participation, devotional reflections, and spiritual discipline records."
    >
      <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Submitted Prayer Reports
          </h2>

          <div className="mt-8 space-y-5">
            {reports.map((report) => (
              <div
                key={report.student}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {report.student}
                    </h3>

                    <p className="mt-3 text-[#1c2b3a]/70">
                      Prayer Duration: {report.duration}
                    </p>

                    <p className="mt-2 text-[#1c2b3a]/70">
                      Focus: {report.focus}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {report.status}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <button className="btn-gold">
                    Review Reflection
                  </button>

                  <button className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a] transition hover:bg-white">
                    Approve Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Formation Notes
          </h2>

          <form className="mt-8 grid gap-5">
            <select className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none">
              <option>Select Student</option>
              <option>Boluwatife Raji</option>
              <option>Irene Emmanuel</option>
              <option>Taiwo Esther</option>
            </select>

            <textarea
              placeholder="Write spiritual formation observations, mentorship notes, encouragement, or corrective guidance..."
              className="min-h-52 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <button type="submit" className="btn-gold">
              Save Notes
            </button>
          </form>
        </div>
      </section>
    </InstructorShell>
  );
}