import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

const courses = [
  {
    code: "EDC 101",
    title: "New Birth and Assurance of Salvation",
    level: "Level 1",
    cu: "1 CU",
    file: "/documents/courses/EDC-101.pdf",
    description:
      "A foundational study on salvation, regeneration, repentance, justification, adoption, assurance of salvation, and identity in Christ.",
  },
  {
    code: "EDC 102",
    title: "Doctrine of God: Nature of God",
    level: "Level 1",
    cu: "2 CU",
    file: "/documents/courses/EDC-102.pdf",
    description:
      "A doctrinal study on the nature, attributes, character, sovereignty, holiness, and revelation of God within Scripture.",
  },
  {
    code: "EDC 103",
    title: "Holiness and Sanctification",
    level: "Level 1",
    cu: "2 CU",
    file: "/documents/courses/EDC-103.pdf",
    description:
      "An examination of holiness, sanctification, consecration, purity, spiritual maturity, and victorious Christian living.",
  },
  {
    code: "EDC 104",
    title: "Introduction to Doctrine",
    level: "Level 1",
    cu: "2 CU",
    file: "/documents/courses/EDC-104.pdf",
    description:
      "An introduction to foundational Christian doctrines, biblical authority, theological clarity, and the role of doctrine in spiritual formation.",
  },
  {
    code: "EDC 105",
    title: "Discipleship Foundations",
    level: "Level 1",
    cu: "2 CU",
    file: "/documents/courses/EDC-105.pdf",
    description:
      "A study of the call to discipleship, obedience, mentorship, spiritual growth, covenant community, and the Great Commission.",
  },
  {
    code: "EDC 106",
    title: "Spiritual Disciplines",
    level: "Level 1",
    cu: "1 CU",
    file: "/documents/courses/EDC-106.pdf",
    description:
      "A practical and theological study of prayer, fasting, Scripture meditation, worship, silence, solitude, stewardship, and disciplined Christian living.",
  },
  {
    code: "EDC 107",
    title: "Theology of Prayer & Intercession",
    level: "Level 1",
    cu: "1 CU",
    file: "/documents/courses/EDC-107.pdf",
    description:
      "A study of prayer as communion with God, priestly ministry, intercession, burden-bearing, spiritual warfare, and revival.",
  },
  {
    code: "EDC 108",
    title: "Theology of the Inner Man",
    level: "Level 1",
    cu: "2 CU",
    file: "/documents/courses/EDC-108.pdf",
    description:
      "A theological study of the inward life, spirit, soul, conscience, renewed mind, motives, emotions, and spiritual maturity.",
  },
  {
    code: "EDC 109",
    title: "Ethics and Christian Character",
    level: "Level 1",
    cu: "2 CU",
    file: "/documents/courses/EDC-109.pdf",
    description:
      "A study of biblical ethics, integrity, humility, stewardship, speech, moral responsibility, relationships, and Christlike character.",
  },
  {
    code: "EDC 110",
    title: "Brokenness, Consecration & Spiritual Discipline",
    level: "Level 1",
    cu: "2 CU",
    file: "/documents/courses/EDC-110.pdf",
    description:
      "A study of brokenness, surrender, consecration, humility, self-denial, obedience, and the making of vessels fit for divine use.",
  },
  {
    code: "EDC 111",
    title: "Dealing with the Flesh, Ego & Ambition",
    level: "Level 1",
    cu: "1 CU",
    file: "/documents/courses/EDC-111.pdf",
    description:
      "A study of the flesh, pride, selfish ambition, ego, carnality, humility, crucified living, purity of motives, and walking in the Spirit.",
  },
  {
    code: "EDC 112",
    title: "Spiritual Authority, Submission & Accountability",
    level: "Level 1",
    cu: "2 CU",
    file: "/documents/courses/EDC-112.pdf",
    description:
      "A biblical study of authority, servanthood, submission, honor, correction, accountability, healthy leadership, and authority under Christ.",
  },
  {
    code: "EDC 113",
    title: "Discernment of Spirits",
    level: "Level 1",
    cu: "2 CU",
    file: "/documents/courses/EDC-113.pdf",
    description:
      "A doctrinal and practical study of discernment, testing spirits, false teachings, spiritual deception, prophetic discernment, and maturity.",
  },
  {
    code: "EDC 114",
    title: "Pentecostal Heritage",
    level: "Level 1",
    cu: "1 CU",
    file: "/documents/courses/EDC-114.pdf",
    description:
      "A survey of Pentecostal origins, revival movements, Spirit baptism, spiritual gifts, healing, missions, and contemporary Pentecostal theology.",
  },
];

export default function CoursesPage() {
  return (
    <>
      <Hero
        label="Course Catalog"
        title="Courses That Form the Inner Life"
        subtitle="A structured curriculum designed to establish believers in Scripture, spiritual formation, doctrine, ministry, leadership, and faithful Kingdom witness."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Level 1 Catalog"
            title="Foundations of Faith & Spiritual Formation"
            description="These courses establish new birth, holiness, identity, spiritual discipline, inward government, and foundational Christian formation."
          />

          <div className="mb-10 grid gap-4 md:grid-cols-3">
            <input
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              placeholder="Search courses..."
            />

            <select className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none">
              <option>Filter by Level</option>
              <option>Level 1</option>
            </select>

            <select className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none">
              <option>Filter by Semester</option>
              <option>Semester 1</option>
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.code}
                className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="section-label">{course.code}</span>

                  <span className="text-xs font-semibold text-[#c9a84c]">
                    {course.cu}
                  </span>
                </div>

                <h2 className="mt-5 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                  {course.title}
                </h2>

                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1c2b3a]/40">
                  {course.level} • Semester 1
                </p>

                <p className="mt-5 leading-8 text-[#1c2b3a]/70">
                  {course.description}
                </p>

                <a
                  href={course.file}
                  download
                  className="btn-gold mt-6 inline-block"
                >
                  Download Course
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}