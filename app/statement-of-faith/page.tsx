import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

const beliefs = [
  {
    title: "The Holy Scriptures",
    text: "We believe the Holy Scriptures of the Old and New Testaments are the inspired, authoritative, and sufficient Word of God for doctrine, correction, instruction, spiritual formation, and Christian conduct.",
    refs: "2 Timothy 3:16–17 • 2 Peter 1:20–21",
  },
  {
    title: "The One True God",
    text: "We believe in one eternal and sovereign God, Creator of heaven and earth, revealed as Father, Son, and Holy Spirit, distinct in person yet one in essence, glory, and divine nature.",
    refs: "Deuteronomy 6:4 • Matthew 28:19",
  },
  {
    title: "The Lord Jesus Christ",
    text: "We believe Jesus Christ is the eternal Son of God, fully God and fully man, who died for the sins of humanity, rose bodily from the dead, ascended into heaven, and reigns as Lord and Savior.",
    refs: "John 1:1–14 • 1 Corinthians 15:3–4",
  },
  {
    title: "The Holy Spirit",
    text: "We believe in the person and ministry of the Holy Spirit, who regenerates, indwells, sanctifies, empowers, guides, and equips believers for holy living and faithful witness.",
    refs: "John 14:16–17 • Acts 1:8",
  },
  {
    title: "Salvation and New Birth",
    text: "We believe salvation is by grace through faith in Jesus Christ alone, and that the new birth brings forgiveness, reconciliation with God, and transformation into a new life in Christ.",
    refs: "Ephesians 2:8–9 • John 3:3–6",
  },
  {
    title: "The Church",
    text: "We believe the Church is the Body of Christ, called to worship, fellowship, discipleship, sound doctrine, prayer, holiness, and the proclamation of the Gospel to all nations.",
    refs: "Acts 2:42 • Matthew 28:18–20",
  },
  {
    title: "Holiness and Formation",
    text: "We believe believers are called to holiness, consecration, spiritual discipline, and continual growth into the likeness of Christ through the transforming work of the Holy Spirit.",
    refs: "Romans 12:1–2 • Hebrews 12:14",
  },
  {
    title: "Resurrection and Eternal Hope",
    text: "We believe in the return of the Lord Jesus Christ, the resurrection of the dead, final judgment, and the everlasting Kingdom of God.",
    refs: "1 Thessalonians 4:16–17 • Revelation 20:11–15",
  },
];

export default function StatementOfFaithPage() {
  return (
    <>
      <Hero
        label="Statement of Faith"
        title="Our Foundational Biblical Convictions"
        subtitle="The doctrinal foundation upon which EDC stands, teaches, forms, and commissions believers."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeader
            label="Biblical Foundation"
            title="Historic Christian Convictions"
            description="Ecclesia Discipleship & Commissioning affirms the historic Christian faith as revealed in the Holy Scriptures and centered upon the Lord Jesus Christ."
          />
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          {beliefs.map((belief) => (
            <div
              key={belief.title}
              className="border border-[#c9a84c]/20 bg-white p-8"
            >
              <h2 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                {belief.title}
              </h2>

              <p className="mt-5 leading-8 text-[#1c2b3a]/70">
                {belief.text}
              </p>

              <p className="mt-5 text-sm font-semibold text-[#c9a84c]">
                {belief.refs}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#071528] px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#fdfaf4]">
            Truth must not merely be studied. Truth must govern life.
          </h2>

          <p className="mt-6 leading-8 text-[#fdfaf4]/65">
            EDC exists to preserve biblical truth, deepen doctrinal stability,
            and form believers whose lives reflect the reality of Christ.
          </p>
        </div>
      </section>
    </>
  );
}