import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

const teachings = [
  {
    title: "The Discipline of Hiddenness",
    category: "Spiritual Formation",
    excerpt:
      "True ministry is not born on platforms. It is forged in the secret place where the soul learns obedience before visibility.",
  },
  {
    title: "What It Means to Be Commissioned",
    category: "Commissioning",
    excerpt:
      "Commissioning is not merely graduation. It is recognition of formation, faithfulness, doctrinal stability, and readiness for Kingdom witness.",
  },
  {
    title: "Reading Scripture as Formation",
    category: "Scripture",
    excerpt:
      "There is a difference between reading the Bible for information and allowing the Word to read, correct, and form the inner man.",
  },
  {
    title: "The Apostolic Burden in Our Generation",
    category: "Apostolic",
    excerpt:
      "God is raising sons, not performers. The apostolic burden is a weight of love, truth, discipline, and faithful witness.",
  },
  {
    title: "Doctrine and Devotion Must Not Be Separated",
    category: "Doctrine",
    excerpt:
      "Sound doctrine must lead the believer into worship, holiness, obedience, discernment, and deeper conformity to Christ.",
  },
  {
    title: "Formation Before Platform",
    category: "Discipleship",
    excerpt:
      "A vessel must first be governed inwardly before he can safely carry public responsibility in the house of God.",
  },
];

export default function TeachingsPage() {
  return (
    <>
      <Hero
        label="Teachings & Writings"
        title="Words for the Formation Journey"
        subtitle="Biblical reflections, doctrinal teachings, spiritual formation writings, and apostolic instruction for believers seeking depth in Christ."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeader
            label="Teaching Ministry"
            title="Truth That Forms the Heart"
            description="This platform exists to help believers grow in scriptural understanding, spiritual maturity, doctrinal stability, discernment, prayer, holiness, and faithful Kingdom witness."
          />
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-4 md:grid-cols-3">
            <input
              className="border border-[#c9a84c]/30 bg-white p-4 outline-none"
              placeholder="Search teachings..."
            />

            <select className="border border-[#c9a84c]/30 bg-white p-4 outline-none">
              <option>All Categories</option>
              <option>Doctrine</option>
              <option>Spiritual Formation</option>
              <option>Discipleship</option>
              <option>Prayer</option>
              <option>Leadership</option>
              <option>Apostolic</option>
            </select>

            <select className="border border-[#c9a84c]/30 bg-white p-4 outline-none">
              <option>Sort by Newest</option>
              <option>Sort by Oldest</option>
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {teachings.map((teaching) => (
              <article
                key={teaching.title}
                className="border border-[#c9a84c]/20 bg-white p-8"
              >
                <p className="section-label">{teaching.category}</p>

                <h2 className="mt-4 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                  {teaching.title}
                </h2>

                <p className="mt-5 leading-8 text-[#1c2b3a]/70">
                  {teaching.excerpt}
                </p>

                <button className="btn-gold mt-6">
                  Read Teaching
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071528] px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#fdfaf4]">
            Truth must not merely be heard; it must be formed within.
          </h2>

          <p className="mt-6 leading-8 text-[#fdfaf4]/65">
            Every teaching, article, and reflection exists to strengthen
            believers toward maturity in Christ.
          </p>
        </div>
      </section>
    </>
  );
}