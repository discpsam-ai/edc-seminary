
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

const handbookSections = [
  "Welcome Statement",
  "Founder’s / President’s Welcome Address",
  "About the Founder",
  "Vision Statement",
  "Mission Statement",
  "Statement of Faith",
  "Academic Structure",
  "Credit Unit Structure",
  "Progression Structure",
  "Admission & Enrollment Requirements",
  "Academic Policies",
  "Structured Learning Levels",
  "Course Contents / Descriptions",
  "Spiritual Formation Expectations",
  "Student Code of Conduct",
  "Ministerial Formation & Commissioning",
  "Certificates, Transcript & Completion Structure",
  "Final Charge",
];

export default function HandbookPage() {
  return (
    <>
      <Hero
        label="EDC Handbook"
        title="Handbook of Spiritual Formation, Theology & Ministerial Commissioning"
        subtitle="The official guide for the structure, culture, doctrine, discipline, academic formation, and commissioning vision of Ecclesia Discipleship & Commissioning."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeader
            label="Digital Handbook"
            title="A Spiritual and Institutional Guide"
            description="The EDC Handbook serves as the official institutional guide for students, instructors, ministers, and participants within the EDC formation system."
          />

          <p className="leading-8 text-[#1c2b3a]/70">
            This handbook exists to provide spiritual direction, institutional
            clarity, academic structure, doctrinal alignment, formation
            expectations, and guidance concerning the culture and operations of
            the institution.
          </p>

        <a
  href="/documents/EDC-Handbook.pdf"
  download
  className="btn-gold mt-10 inline-block"
>
  Download Handbook
</a>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Table of Contents"
            title="Handbook Sections"
            description="Each section of the handbook helps students understand the spiritual, academic, and institutional expectations of EDC."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {handbookSections.map((section, index) => (
              <div
                key={section}
                className="border border-[#c9a84c]/20 bg-white p-6"
              >
                <p className="section-label">Section {index + 1}</p>

                <h2 className="mt-4 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  {section}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071528] px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#fdfaf4]">
            Here, disciples are not merely taught; they are transformed.
          </h2>

          <p className="mt-6 leading-8 text-[#fdfaf4]/65">
            The handbook is not only an administrative guide. It is a formation
            document that preserves the burden, doctrine, discipline, and
            spiritual culture of EDC.
          </p>
        </div>
      </section>
    </>
  );
}