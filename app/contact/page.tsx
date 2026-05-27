import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";

export default function ContactPage() {
  return (
    <>
      <Hero
        label="Contact"
        title="Get in Touch With EDC"
        subtitle="Reach out for admissions, inquiries, mentorship, partnership, student support, or ministry-related communication."
      />

      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              label="Contact Information"
              title="Reach the Institution"
              description="We are available to respond to questions regarding admissions, programs, courses, spiritual formation, partnerships, and institutional inquiries."
            />

            <div className="mt-10 space-y-8">
              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-6">
                <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  Email
                </h3>

                <p className="mt-3 text-[#1c2b3a]/70">
                  discpsam1@gmail.com
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-6">
                <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  Phone
                </h3>

                <p className="mt-3 text-[#1c2b3a]/70">
                  +234 813 581 5526
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-6">
                <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  Location
                </h3>

                <p className="mt-3 text-[#1c2b3a]/70">
                  Ile-Ife, Osun State, Nigeria
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-6">
                <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  Community Links
                </h3>

                <div className="mt-4 flex flex-wrap gap-4">
                  <a
                    href="https://wa.me/2348135815526"
                    target="_blank"
                    className="btn-gold"
                  >
                    WhatsApp
                  </a>

                  <a
                    href="https://t.me/Discp_Sam"
                    target="_blank"
                    className="btn-gold"
                  >
                    Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeader
              align="left"
              label="Send a Message"
              title="Institutional Inquiry Form"
              description="Send your questions, requests, testimonies, or inquiries directly through the contact form."
            />

            <form className="mt-10 grid gap-5 border border-[#c9a84c]/20 bg-[#fdfaf4] p-8">
              <input
                className="border border-[#c9a84c]/30 bg-white p-4 outline-none"
                placeholder="Full Name"
              />

              <input
                type="email"
                className="border border-[#c9a84c]/30 bg-white p-4 outline-none"
                placeholder="Email Address"
              />

              <input
                className="border border-[#c9a84c]/30 bg-white p-4 outline-none"
                placeholder="Phone Number"
              />

              <select className="border border-[#c9a84c]/30 bg-white p-4 outline-none">
                <option>Select Inquiry Type</option>
                <option>Admissions</option>
                <option>Student Support</option>
                <option>Partnership</option>
                <option>Prayer Request</option>
                <option>General Inquiry</option>
              </select>

              <textarea
                className="min-h-40 border border-[#c9a84c]/30 bg-white p-4 outline-none"
                placeholder="Write your message..."
              />

              <button type="submit" className="btn-gold">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#071528] px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#fdfaf4]">
            We are committed to helping believers grow into Christ.
          </h2>

          <p className="mt-6 leading-8 text-[#fdfaf4]/65">
            Whether through discipleship, theological formation, prayer,
            teaching, or spiritual guidance, EDC exists to serve the body of
            Christ faithfully.
          </p>
        </div>
      </section>
    </>
  );
}