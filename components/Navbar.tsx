"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academic-structure" },
  { label: "Admissions", href: "/admissions" },
  { label: "Programs", href: "/programs" },
  { label: "Courses", href: "/courses" },
  { label: "Handbook", href: "/handbook" },
  { label: "Teachings", href: "/teachings" },
  {
    label: "Instructor Application",
    href: "/instructor/apply",
  },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#c9a84c]/10 bg-[#071528]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-6 px-6 xl:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
        >
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

        <nav className="hidden flex-1 items-center justify-center gap-3 2xl:gap-5 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em] text-[#fdfaf4]/70 transition hover:text-[#c9a84c]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 xl:flex">
          <Link
            href="/portal"
            className="btn-gold"
          >
            Portal
          </Link>
        </div>

        <button
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="text-3xl text-[#c9a84c] xl:hidden"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#c9a84c]/10 bg-[#071528] xl:hidden">
          <nav className="flex flex-col px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setMenuOpen(false)
                }
                className="py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#fdfaf4]/80"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/portal"
              onClick={() =>
                setMenuOpen(false)
              }
              className="mt-3 rounded bg-[#c9a84c] px-4 py-3 text-center font-bold text-[#071528]"
            >
              Portal
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}