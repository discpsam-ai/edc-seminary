import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#071528] px-6 py-16 text-[#fdfaf4]">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-edc-serif text-3xl font-bold">ECCLESIA DC</h3>
          <p className="mt-4 text-sm leading-7 text-[#fdfaf4]/60">
            Deep in Scripture. Formed in Spirit. Faithful in Witness.
          </p>
        </div>

        <div>
          <h4 className="section-label">Institution</h4>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#fdfaf4]/60">
            <Link href="/about">About EDC</Link>
            <Link href="/founder">Founder</Link>
            <Link href="/vision-mission">Vision & Mission</Link>
            <Link href="/statement-of-faith">Statement of Faith</Link>
          </div>
        </div>

        <div>
          <h4 className="section-label">Academics</h4>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#fdfaf4]/60">
            <Link href="/academic-structure">Academic Structure</Link>
            <Link href="/programs">Programs & Levels</Link>
            <Link href="/courses">Course Catalog</Link>
            <Link href="/handbook">Handbook</Link>
          </div>
        </div>

        <div>
          <h4 className="section-label">Contact</h4>
          <p className="mt-4 text-sm leading-7 text-[#fdfaf4]/60">
            Ile-Ife, Osun State, Nigeria <br />
            discpsam1@gmail.com <br />
            +234 813 581 5526
          </p>
        </div>
      </div>
    </footer>
  );
}