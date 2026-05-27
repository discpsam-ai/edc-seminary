import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

export default function AwakeningEcclesiaPage() {
  return (
    <>
      <Hero
        label="Parent Ministry"
        title="About Awakening Ecclesia Global"
        subtitle="A non-denominational and interdenominational apostolic ministry committed to awakening believers into authentic Christianity, spiritual formation, and faithful Kingdom witness."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl space-y-8 text-base leading-8 text-[#1c2b3a]/75">
          <SectionHeader
            label="Who We Are"
            title="Awakening Believers Into Christ"
            description="Awakening Ecclesia exists to awaken believers from shallow Christianity into deeper realities of Christ, spiritual maturity, inward transformation, and faithful Kingdom living."
          />

          <p>
            Awakening Ecclesia is an apostolic ministry burdened with the
            restoration of authentic Christianity through the teaching of truth,
            spiritual formation, discipleship, prayer, holiness, and the
            revelation of Jesus Christ.
          </p>

          <p>
            The ministry was formerly known as Ekklesia Christian Network
            before transitioning into Awakening Ecclesia as the apostolic burden
            became clearer and broader in direction.
          </p>

          <p>
            Ecclesia Discipleship & Commissioning functions as the theological,
            spiritual formation, and ministerial training arm of Awakening
            Ecclesia.
          </p>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            "Raising sons for God",
            "Restoring authentic Christianity",
            "Preparing faithful witnesses",
          ].map((item) => (
            <div key={item} className="border border-[#c9a84c]/20 bg-white p-8 text-center">
              <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                {item}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}