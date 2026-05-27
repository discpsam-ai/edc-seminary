import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

const values = [
  "Scriptural Authority",
  "Christ-Centered Formation",
  "Holiness and Consecration",
  "Spiritual Formation",
  "Sound Doctrine",
  "Faithful Witness",
  "Discipleship and Accountability",
  "Kingdom Service",
];

export default function VisionMissionPage() {
  return (
    <>
      <Hero
        label="Vision & Mission"
        title="The Burden and Direction of EDC"
        subtitle="The institutional pursuit of Ecclesia Discipleship & Commissioning."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Vision
            </h2>
            <p className="mt-6 leading-8 text-[#1c2b3a]/70">
              To raise a generation of spiritually formed, Scripture-rooted,
              and Christ-governed believers who embody the life of Christ,
              uphold sound doctrine, walk in holiness and discernment, and
              faithfully advance the Kingdom of God across nations and
              generations.
            </p>
          </div>

          <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Mission
            </h2>
            <p className="mt-6 leading-8 text-[#1c2b3a]/70">
              EDC exists to train, form, and commission believers through deep
              biblical teaching, spiritual formation, doctrinal grounding,
              prayer, consecration, and apostolic discipleship.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#071528] px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            label="Institutional Motto"
            title="Deep in Scripture. Formed in Spirit. Faithful in Witness."
            description="This motto expresses the foundational burden and direction of EDC: biblical depth, spiritual formation, and faithful Kingdom witness."
            light
          />

          <p className="mt-8 font-edc-serif text-3xl italic leading-relaxed text-[#c9a84c]">
            “Living Truth. Revealing Christ. Advancing the Kingdom.”
          </p>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Core Values"
            title="What Governs the Institution"
            description="EDC is shaped by convictions that preserve truth, formation, maturity, and faithful service."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value}
                className="border border-[#c9a84c]/20 bg-white p-6 text-center"
              >
                <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  {value}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}