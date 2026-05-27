"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="border border-[#c9a84c]/30 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a] transition hover:bg-[#fdfaf4]"
    >
      ← Back
    </button>
  );
}