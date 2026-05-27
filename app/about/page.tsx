import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Hero
        label="About EDC"
        title="A Formation Ground for Rooted Believers"
        subtitle="Ecclesia Discipleship & Commissioning is the theological, spiritual formation, and ministerial training arm of Awakening Ecclesia."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            label="What EDC Is"
            title="More Than a School"
            description="EDC exists to train believers through deep biblical teaching, spiritual discipline, doctrinal grounding, discipleship, and apostolic formation."
          />

          <div className="space-y-8 text-base leading-8 text-[#1c2b3a]/75">
            <p>
              Ecclesia Discipleship & Commissioning is not merely an academic
              institution designed to transfer information. It is a formation
              environment where believers are taught, examined, shaped,
              corrected, strengthened, and prepared for faithful Christian
              living and ministry.
            </p>

            <p>
              The burden of EDC goes beyond producing knowledgeable students.
              The aim is to raise believers whose lives reveal Christ inwardly
              and outwardly: believers who are stable in doctrine, disciplined
              in spirit, sound in judgment, humble in service, and faithful in
              witness.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          {[
            {
              title: "Why EDC Exists",
              text: "EDC emerged from a burden concerning modern Christianity, where visibility has often replaced formation, gifting has outrun character, and ministry activity has become louder than inner transformation.",
            },
            {
              title: "Formation Philosophy",
              text: "At EDC, doctrine must shape character, Scripture must produce transformation, prayer must govern ministry, and Christ must be formed within the believer.",
            },
            {
              title: "Scripture and Spirit",
              text: "EDC rejects the false division between deep theology and genuine spirituality. Scripture and the Spirit are held together faithfully.",
            },
            {
              title: "Formation Before Platform",
              text: "We believe believers must be rooted before released, governed before entrusted, disciplined before elevated, and formed before commissioned.",
            },
          ].map((item) => (
            <div key={item.title} className="border border-[#c9a84c]/20 bg-white p-8">
              <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                {item.title}
              </h3>
              <p className="mt-5 leading-8 text-[#1c2b3a]/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0b1f3a] px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#fdfaf4]">
            Here, disciples are not merely informed; they are transformed.
          </h2>
          <p className="mt-6 leading-8 text-[#fdfaf4]/65">
            EDC is not merely inviting students into courses, but into formation.
          </p>
          <Link href="/admissions" className="btn-gold mt-10">
            Apply Now
          </Link>
        </div>
      </section>
    </>
  );
}