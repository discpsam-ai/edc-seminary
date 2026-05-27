import Image from "next/image";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

export default function FounderPage() {
  return (
    <>
      <Hero
        label="Founder"
        title="Discp. Samuel Ojo"
        subtitle="Founder of Awakening Ecclesia and Ecclesia Discipleship & Commissioning, burdened with the restoration of authentic Christianity and the raising of faithful witnesses."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-start">
          <div className="relative overflow-hidden border border-[#c9a84c]/20 bg-[#f7f3ec] p-4">
            <Image
              src="/images/founder.jpg"
              alt="Discp. Samuel Ojo"
              width={700}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-8 text-base leading-8 text-[#1c2b3a]/75">
            <SectionHeader
              align="left"
              label="Founder Profile"
              title="A Servant Burdened for Formation"
              description="Discp. Samuel Ojo is a servant of Jesus Christ with an apostolic burden toward spiritual formation, biblical grounding, discipleship, and the raising of sons unto God."
            />

            <p>
              In 2019, through profound spiritual dealings, revelations, and
              encounters with the Lord Jesus Christ, Discp. Samuel Ojo received
              a clear calling into ministry.
            </p>

            <p>
              Around 2022, the discipleship burden began to take structured
              expression through teaching, mentoring, spiritual formation, and
              doctrinal training. By 2025, this work matured into Ecclesia
              Discipleship & Commissioning.
            </p>

            <p>
              The burden behind the ministry is the restoration of authentic
              Christianity through the revelation of Christ, sound doctrine,
              holiness, prayer, discipleship, and apostolic formation.
            </p>

            <p>
              He holds a Bachelor of Science degree in Physics with
              specialization in Petrophysics from Obafemi Awolowo University,
              Ile-Ife, Osun State, Nigeria.
            </p>

            <div className="border-l-4 border-[#c9a84c] bg-[#f7f3ec] p-6">
              <p className="font-edc-serif text-2xl italic leading-relaxed text-[#0b1f3a]">
                “Christ must first be formed within a man before ministry can
                safely flow through him.”
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            label="Timeline"
            title="Formation of the Burden"
            description="The progressive unfolding of the apostolic and discipleship burden."
          />

          <div className="space-y-6">
            {[
              [
                "2019",
                "Received apostolic calling and burden into ministry through deep spiritual dealings and encounters with the Lord.",
              ],
              [
                "2022",
                "Structured discipleship teachings and formation gatherings began taking shape.",
              ],
              [
                "2025",
                "The discipleship burden matured into Ecclesia Discipleship & Commissioning.",
              ],
              [
                "Present",
                "EDC continues as the theological and formation arm of Awakening Ecclesia.",
              ],
            ].map(([year, text]) => (
              <div
                key={year}
                className="border-l-4 border-[#c9a84c] bg-white p-6"
              >
                <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                  {year}
                </h3>

                <p className="mt-3 leading-8 text-[#1c2b3a]/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}