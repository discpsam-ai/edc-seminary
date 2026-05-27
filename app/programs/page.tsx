import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

const programs = [
  {
    level: "Level 1",
    title: "Foundations of Faith & Spiritual Formation",
    focus:
      "Establishing new birth, holiness, identity, spiritual discipline, inward government, and foundational Christian formation.",
    courses: [
      "New Birth and Assurance of Salvation",
      "Oneness of God",
      "Holiness and Sanctification",
      "Spiritual Disciplines",
      "Discipleship Foundations",
      "Ethics and Christian Character",
      "Pentecostal Heritage",
      "Introduction to Doctrine",
      "Theology of the Inner Man",
      "Brokenness, Consecration & Spiritual Discipline",
      "Dealing with the Flesh, Ego & Ambition",
      "Spiritual Authority, Submission & Accountability",
      "Discernment of Spirits",
    ],
    outcome:
      "A grounded believer with spiritual stability, disciplined devotion, governed desires, and a formed inner life.",
  },
  {
    level: "Level 2",
    title: "Introduction to the Bible & Redemptive Story",
    focus:
      "Understanding the Bible as one unified revelation centered upon God’s redemptive plan in Christ.",
    courses: [
      "Overview of the Old and New Testaments",
      "Biblical Interpretation",
      "Pentateuch",
      "Historical Books",
      "Psalms and Wisdom Literature",
      "Prophets",
      "Synoptic Gospels",
      "Acts of the Apostles",
    ],
    outcome:
      "A disciple who understands Scripture as a coherent redemptive revelation rather than disconnected religious texts.",
  },
  {
    level: "Level 3",
    title: "New Testament & Apostolic Doctrine",
    focus:
      "Developing doctrinal depth and apostolic understanding through the study of New Testament writings.",
    courses: [
      "Pauline Epistles",
      "Romans",
      "General Epistles and Revelation",
      "Christology",
      "Pneumatology",
      "Ecclesiology",
      "Biblical Theology of the Kingdom",
      "Eschatology",
    ],
    outcome:
      "A believer established in doctrine, theological reasoning, and apostolic truth.",
  },
  {
    level: "Level 4",
    title: "Ministry Formation & Practical Commissioning",
    focus:
      "Preparing students for practical ministry, servant leadership, and faithful Kingdom responsibility.",
    courses: [
      "Preaching I",
      "Preaching II",
      "Principles of Ministry",
      "Church Administration",
      "Church Growth",
      "Evangelism and Missions",
      "Discipleship Practice",
      "Ministry Ethics",
      "Leadership Foundations",
    ],
    outcome:
      "A servant prepared for practical ministry engagement, leadership responsibility, and faithful Kingdom service.",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <Hero
        label="Programs & Levels"
        title="A Progressive Pathway of Formation"
        subtitle="The EDC curriculum guides believers from foundational spiritual formation into theological depth, ministry competence, leadership maturity, and commissioning readiness."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Programs"
            title="Structured for Depth and Formation"
            description="Each level builds intentionally upon the previous one so that students mature gradually and responsibly."
          />

          <div className="space-y-8">
            {programs.map((program) => (
              <div
                key={program.level}
                className="grid gap-8 border border-[#c9a84c]/20 bg-[#fdfaf4] p-8 lg:grid-cols-[1fr_1.5fr]"
              >
                <div>
                  <p className="section-label">{program.level}</p>

                  <h2 className="mt-4 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
                    {program.title}
                  </h2>

                  <p className="mt-6 leading-8 text-[#1c2b3a]/70">
                    {program.focus}
                  </p>

                  <p className="mt-6 border-l-4 border-[#c9a84c] bg-white p-5 leading-8 text-[#1c2b3a]/75">
                    <strong>Outcome:</strong> {program.outcome}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {program.courses.map((course) => (
                    <div
                      key={course}
                      className="border border-[#c9a84c]/10 bg-white p-4 text-sm font-medium leading-7 text-[#1c2b3a]/75"
                    >
                      {course}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}