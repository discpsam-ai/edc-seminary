import PortalShell from "@/components/PortalShell";

const reports = [
  {
    date: "May 20, 2026",
    duration: "2 Hours",
    focus: "Consecration & Spiritual Hunger",
    status: "Submitted",
  },
  {
    date: "May 19, 2026",
    duration: "1 Hour 30 Minutes",
    focus: "Intercession & Revival",
    status: "Submitted",
  },
  {
    date: "May 18, 2026",
    duration: "3 Hours",
    focus: "Waiting on God",
    status: "Reviewed",
  },
];

export default function PrayerReportsPage() {
  return (
    <PortalShell
      title="Prayer Reports"
      subtitle="Track prayer consistency, fasting participation, spiritual discipline, and devotional accountability."
    >
      <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Submit Prayer Report
          </h2>

          <form className="mt-8 grid gap-5">
            <input
              type="date"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              placeholder="Prayer Duration"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              placeholder="Prayer Focus"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <textarea
              placeholder="Brief reflection from your prayer time..."
              className="min-h-40 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <button type="submit" className="btn-gold">
              Submit Report
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Recent Reports
          </h2>

          <div className="mt-8 space-y-5">
            {reports.map((report) => (
              <div
                key={report.date}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#0b1f3a]">
                    {report.date}
                  </p>

                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {report.status}
                  </span>
                </div>

                <p className="mt-3 text-[#1c2b3a]/70">
                  Duration: {report.duration}
                </p>

                <p className="mt-2 text-[#1c2b3a]/70">
                  Focus: {report.focus}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PortalShell>
  );
}