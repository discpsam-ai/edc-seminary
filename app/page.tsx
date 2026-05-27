import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

const levels = [
  "Foundations of Faith & Spiritual Formation",
  "Introduction to the Bible & Redemptive Story",
  "New Testament & Apostolic Doctrine",
  "Ministry Formation & Practical Commissioning",
  "Leadership, History & Ecclesial Identity",
  "Exegetical & Theological Depth",
  "Advanced Biblical Languages, Hermeneutics & Apologetics",
  "Research, Synthesis & Commissioning",
];

const featuredCourses = [
  {
    title:
      "New Birth and Assurance of Salvation",

    description:
      "Establishes believers in salvation, identity in Christ, regeneration, assurance, sanctification, and the transforming work of grace.",
  },

  {
    title:
      "Holiness and Sanctification",

    description:
      "Examines consecration, purity, obedience, spiritual maturity, victorious living, and the work of the Holy Spirit in sanctification.",
  },

  {
    title:
      "Spiritual Disciplines",

    description:
      "Forms believers through prayer, fasting, worship, meditation, stewardship, silence, solitude, and disciplined devotion to God.",
  },

  {
    title:
      "Theology of the Inner Man",

    description:
      "Explores the inward life of the believer including the spirit, soul, conscience, motives, emotions, maturity, and inward transformation.",
  },

  {
    title:
      "Brokenness, Consecration & Spiritual Discipline",

    description:
      "Studies surrender, humility, refinement, obedience, endurance, and the making of vessels fit for divine use.",
  },

  {
    title:
      "Dealing with the Flesh, Ego & Ambition",

    description:
      "Addresses pride, carnality, selfish ambition, self-exaltation, purity of motives, crucified living, and walking in the Spirit.",
  },

  {
    title:
      "Discernment of Spirits",

    description:
      "Trains believers in biblical discernment, testing spirits, recognizing deception, prophetic balance, and spiritual maturity.",
  },

  {
    title:
      "Spiritual Authority, Submission & Accountability",

    description:
      "Examines servant leadership, honor, correction, accountability, healthy authority structures, and spiritual responsibility.",
  },

  {
    title:
      "Theology of Prayer & Intercession",

    description:
      "Studies prayer as communion with God, priestly ministry, spiritual warfare, revival prayer, and apostolic intercession.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        label="Training Arm of Awakening Ecclesia Global"
        title="Ecclesia Discipleship & Commissioning"
        subtitle="A theological formation and apostolic commissioning platform established to raise Scripture-rooted, Spirit-formed, and faithful witnesses for Christ."
        primaryText="Apply Now"
        primaryHref="/admissions"
        secondaryText="Read Handbook"
        secondaryHref="/handbook"
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-edc-serif text-3xl italic leading-relaxed text-[#0b1f3a] md:text-4xl">
            “EDC is more than a school; it is a divine forge where hearts are
            formed, minds renewed, and witnesses raised for Christ.”
          </p>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              align="left"
              label="About EDC"
              title="A Formation Ground for Rooted Believers"
              description="EDC exists to train, form, and commission believers through Scripture, doctrine, prayer, spiritual discipline, holiness, and apostolic discipleship."
            />

            <p className="leading-8 text-[#1c2b3a]/70">
              Here, disciples are not merely informed; they are transformed.
              Theology is not separated from devotion, and doctrine is not
              divorced from spiritual formation. We believe true ministry must
              emerge from a formed life governed inwardly by Christ.
            </p>

            <Link href="/about" className="btn-gold mt-8">
              Learn About EDC
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["8", "Semesters"],
              ["4", "Sessions"],
              ["80+", "Courses"],
              ["1", "Formation Journey"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="border border-[#c9a84c]/20 bg-white p-8 text-center"
              >
                <h3 className="font-edc-serif text-6xl font-semibold text-[#0b1f3a]">
                  {number}
                </h3>

                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071528] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Why EDC Exists"
            title="Formation Before Platform"
            description="EDC was established from the conviction that many believers are informed but not formed, active but not rooted, gifted but not governed inwardly by Christ."
            light
          />

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title:
                  "The Crisis of Shallow Christianity",

                description:
                  "Many believers pursue visibility, influence, and activity without deep spiritual formation, doctrinal grounding, or inward transformation.",
              },

              {
                title:
                  "The Need for Sound Doctrine",

                description:
                  "EDC emphasizes theological clarity, scriptural reverence, doctrinal stability, and Christ-centered truth within spiritual formation.",
              },

              {
                title:
                  "The Burden to Raise Witnesses",

                description:
                  "The goal is not merely to produce ministers, but spiritually mature disciples, faithful witnesses, and inwardly governed servants of Christ.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-[#c9a84c]/20 bg-white/5 p-8"
              >
                <h3 className="font-edc-serif text-2xl font-semibold text-[#fdfaf4]">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-[#fdfaf4]/65">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Programs"
            title="A Progressive Journey of Formation"
            description="The curriculum moves students from foundational spiritual formation into biblical theology, apostolic doctrine, ministry leadership, exegesis, apologetics, research, and commissioning."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {levels.map((level, index) => (
              <div
                key={level}
                className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">
                  Session {index + 1}
                </p>

                <h3 className="mt-4 font-edc-serif text-2xl font-semibold leading-tight text-[#0b1f3a]">
                  {level}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/programs" className="btn-gold">
              View Programs
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Featured Courses"
            title="Courses That Form the Inner Life"
            description="EDC courses are designed not merely to transfer theological information, but to cultivate inward formation, disciplined devotion, spiritual maturity, doctrinal grounding, and Christlike character."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <div
                key={course.title}
                className="border border-[#c9a84c]/20 bg-white p-7"
              >
                <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  {course.title}
                </h3>

                <p className="mt-4 leading-7 text-[#1c2b3a]/65">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1f3a] px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="section-label mb-4">
            Begin the Journey
          </p>

          <div className="gold-divider mx-auto mb-6" />

          <h2 className="font-edc-serif text-4xl font-semibold text-[#fdfaf4] md:text-5xl">
            Ready to Begin the Journey of Formation?
          </h2>

          <p className="mt-6 leading-8 text-[#fdfaf4]/65">
            If your desire is not merely to learn, but to be formed; not merely
            to complete courses, but to become a faithful witness of Christ,
            EDC invites you into the journey of spiritual formation, biblical
            grounding, and apostolic preparation.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/admissions"
              className="btn-gold"
            >
              Apply Now
            </Link>

            <Link
              href="/contact"
              className="btn-outline"
            >
              Contact EDC
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}