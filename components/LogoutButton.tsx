"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();

  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="border border-red-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-red-600 transition hover:bg-red-50"
    >
      Logout
    </button>
  );
}