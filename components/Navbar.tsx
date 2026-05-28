import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academic-structure" },
  { label: "Admissions", href: "/admissions" },
  { label: "Programs", href: "/programs" },
  { label: "Courses", href: "/courses" },
  { label: "Handbook", href: "/handbook" },
  { label: "Teachings", href: "/teachings" },
  { label: "Instructor Application", href: "/instructor/apply" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#c9a84c]/10 bg-[#071528]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="ECCLESIA Logo"
            width={58}
            height={58}
            priority
            className="h-14 w-auto"
          />

          <div className="flex flex-col">
            <span className="font-edc-serif text-2xl font-bold tracking-wide text-[#fdfaf4]">
              ECCLESIA
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c9a84c]">
              Discipleship & Commissioning
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[#fdfaf4]/70 transition hover:text-[#c9a84c]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/portal" className="btn-gold hidden xl:inline-flex">
          Portal
        </Link>
      </div>
    </header>
  );
}