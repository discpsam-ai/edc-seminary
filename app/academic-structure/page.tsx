import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

const levels = [
  {
    level: "Level 1",
    title: "Foundations of Faith & Spiritual Formation",
    outcome:
      "A grounded believer with spiritual stability, disciplined devotion, governed desires, and a formed inner life.",
  },
  {
    level: "Level 2",
    title: "Introduction to the Bible & Redemptive Story",
    outcome:
      "A disciple who understands Scripture as one unified redemptive revelation.",
  },
  {
    level: "Level 3",
    title: "New Testament & Apostolic Doctrine",
    outcome:
      "A believer established in apostolic doctrine, Christ-centered theology, and Spirit-empowered living.",
  },
  {
    level: "Level 4",
    title: "Ministry Formation & Practical Commissioning",
    outcome:
      "A servant prepared for practical ministry engagement and faithful Kingdom service.",
  },
  {
    level: "Level 5",
    title: "Leadership, History & Ecclesial Identity",
    outcome:
      "A leader grounded in history, doctrine, culture, and ethical responsibility.",
  },
  {
    level: "Level 6",
    title: "Exegetical & Theological Depth",
    outcome:
      "A mature teacher who can rightly divide the Word and trace doctrine across Scripture.",
  },
  {
    level: "Level 7",
    title: "Languages, Hermeneutics & Apologetics",
    outcome:
      "A skilled interpreter and defender of the faith for scholarly and public engagement.",
  },
  {
    level: "Level 8",
    title: "Research, Synthesis & Commissioning",
    outcome:
      "A commissioned labourer who is spiritually formed, biblically deep, doctrinally sound, and mission-ready.",
  },
];

export default function AcademicStructurePage() {
  return (
    <>
      <Hero
        label="Academic Structure"
        title="A Progressive Pathway of Formation"
        subtitle="EDC combines theological depth, spiritual formation, biblical literacy, ministerial preparation, and apostolic discipleship."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeader
            label="Program Structure"
            title="4 Sessions. 8 Semesters. 8 Levels."
            description="Each level carries a distinct theological and spiritual emphasis intended to shape the believer progressively."
          />

          <p className="leading-8 text-[#1c2b3a]/70">
            The academic structure of EDC is intentionally designed not merely
            for academic progression, but for spiritual and ministerial
            formation. Students are built carefully from foundational Christian
            life into biblical theology, doctrine, leadership, exegesis,
            apologetics, research, and commissioning readiness.
          </p>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          {levels.map((item) => (
            <div
              key={item.level}
              className="border border-[#c9a84c]/20 bg-white p-8"
            >
              <p className="section-label">{item.level}</p>

              <h2 className="mt-4 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                {item.title}
              </h2>

              <p className="mt-5 leading-8 text-[#1c2b3a]/70">
                {item.outcome}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#071528] px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeader
            label="Progression"
            title="Knowledge and Formation Together"
            description="Progression within EDC is both academic and spiritual. Students advance through assignments, attendance, examinations, prayer consistency, accountability, ministry participation, and evidence of spiritual maturity."
            light
          />
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Assessment"
            title="How Students Are Evaluated"
            description="EDC evaluates students through both academic and spiritual formation indicators."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {[
              "Assignments and written work",
              "Tests and semester examinations",
              "Attendance and participation",
              "Prayer reports and spiritual discipline",
              "Ministry practicum and service",
              "Character and accountability review",
            ].map((item) => (
              <div
                key={item}
                className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-6 text-center"
              >
                <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}